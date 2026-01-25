from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password

from api.mongo import get_db

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import *

from datetime import datetime

from bson import ObjectId

# Create your views here.


@api_view(["POST"])
def doctor_registration(request):
    serializer = DoctorRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    db = get_db()

    login_col = db["login"]
    doctor_col = db["doctors"]

    if login_col.find_one({"email": data["email"]}):
        return Response(
            {"error": "Email already exist"}, status=status.HTTP_400_BAD_REQUEST
        )

    login_doc = {
        "email": data["email"],
        "password": make_password(data["contactNumber"]),
        "user_type": "doctor",
        "created_at": datetime.utcnow(),
    }

    login_id = None

    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id

        doctor_doc = {
            "login_id": login_id,
            "hospital_login_id": ObjectId(data["hospital_login_id"]),
            "name": data["name"],
            "gender": data["gender"],
            "specialization": data["specialization"],
            "dob": datetime.combine(data["dob"], datetime.min.time()),
            "qualification": data["qualification"],
            "experience": data["experience"],
            "contactNumber": data["contactNumber"],
            "email": data["email"],
            "created_at": datetime.utcnow(),
        }

        doctor_result = doctor_col.insert_one(doctor_doc)

        return Response(
            {
                "message": "Doctor Registered",
                "login_id": str(login_id),
                "doctor_id": str(doctor_result.inserted_id),
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        print(e)
        if login_id is not None and ObjectId.is_valid(str(login_id)):
            login_col.delete_one({"_id": login_id})
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def view_doctors(request):

    # * the 'request.query_params' is used to read the data in the GET request but for the POST request we can use the 'request.data'
    hospital_login_id = request.query_params.get("hospitalLoginId")

    db = get_db()
    doctor_col = db["doctors"]

    doctors_cursor = doctor_col.find({"hospital_login_id": ObjectId(hospital_login_id)})
    """
        when we use "doctor_col.find({"hospital_login_id": hospital_login_id})" is doesn't return a native python data type or data structure,
        it return something called the "cursor object" which is a part of the mongodb so we need to change it to the json format for that first we convert 
        it into the list just like given bellow and we place the list as the value of a dictionary data type when we return the Response.
    """
    doctor_list = list(doctors_cursor)

    """
        Yhe '_id' and 'login_id' are objectId, the mongoDB ObjectId is not JSON serializable → must be converted to string.
    """
    for doc in doctor_list:
        doc["_id"] = str(doc["_id"])
        doc["login_id"] = str(doc["login_id"])
        doc["hospital_login_id"] = str(doc["hospital_login_id"])

    return Response({"doctors": doctor_list}, status=status.HTTP_200_OK)


@api_view(["PUT"])
def edit_doctor(request):
    serializer = EditDoctorSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    doc_col = db["doctors"]

    doctor_doc = {
        "name": data["name"],
        "gender": data["gender"],
        "specialization": data["specialization"],
        "qualification": data["qualification"],
        "experience": data["experience"],
        "contactNumber": data["contactNumber"],
    }

    try:
        result = doc_col.update_one(
            {
                "_id": ObjectId(request.data.get("doctorId"))
            },  # * This is the condition used to filter out the doctor, the doctorId is string and we use ObjectId to convert it into the mongodb object.
            {
                "$set": doctor_doc
            },  # * '$set' tell's mongodb to update the only fields we given, without '$set' mongodb will overwrite the entire collection.
        )

        if result.matched_count > 0:
            return Response(
                {"message": "Profile Updated Successfully"}, status=status.HTTP_200_OK
            )

    except Exception as e:
        print(e)
        return Response({"error": "Doctor Not Fount"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
def delete_doctor(request):
    db = get_db()

    doctor_id = request.data.get("doctorId")
    hospital_login_id = request.data.get("hospital_login_id")

    if not doctor_id:
        return Response(
            {"error": "Doctor ID Missing"}, status=status.HTTP_400_BAD_REQUEST
        )

    if not hospital_login_id:
        return Response(
            {"error": "Hospital Login ID Missing"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        doctor_col = db["doctors"]
        login_col = db["login"]

        doctor = doctor_col.find_one(
            {
                "_id": ObjectId(doctor_id),
                "hospital_login_id": ObjectId(hospital_login_id),
            }
        )

        if not doctor:
            return Response(
                {"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND
            )

        doctor_login_id = doctor.get("login_id")

        if not doctor_login_id:
            return Response(
                {"error": "Doctor Login ID Not Fount"}, status=status.HTTP_404_NOT_FOUND
            )

        reg_result = doctor_col.delete_one({"_id": ObjectId(doctor_id)})
        log_result = login_col.delete_one({"_id": doctor_login_id})

        if reg_result.deleted_count > 0 and log_result.deleted_count > 0:
            return Response(
                {"message": "Doctor deleted successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Failed to delete doctor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        print(f"Error deleting doctor: {e}")
        return Response(
            {"error": "Invalid Doctor ID"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def register_ambulance(request):
    serializer = AmbulanceRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    ambulance_col = db["ambulance"]
    login_col = db["login"]

    if login_col.find_one({"email": data["email"]}):
        return Response(
            {"error": "Email already exist..! Use another Email."},
            status=status.HTTP_409_CONFLICT,
        )

    login_doc = {
        "email": data["email"],
        "password": make_password(data["contactNumber"]),
        "user_type": "ambulance",
        "created_at": datetime.utcnow(),
    }
    login_id = None

    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id

        ambulance_doc = {
            "login_id": login_id,
            "hospital_login_id": ObjectId(data["hospital_login_id"]),
            "name": data["name"],
            "ambulanceType": data["ambulanceType"],
            "vehicleNumber": data["vehicleNumber"],
            "category": data["category"],
            "contactNumber": data["contactNumber"],
            "created_at": datetime.utcnow(),
            "available": 1,
        }

        ambulance_col.insert_one(ambulance_doc)

        return Response(
            {"message": "Ambulance Registered"}, status=status.HTTP_201_CREATED
        )
    except Exception as e:
        print(e)

        if login_id is not None and ObjectId.is_valid(str(login_id)):
            login_col.delete_one({"_id": login_id})

            return Response(
                {"error": "internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["GET"])
def view_ambulance(request):
    hospital_login_id = request.query_params.get("hospital_login_id")

    db = get_db()
    ambulance_col = db["ambulance"]
    login_col = db["login"]

    if ObjectId.is_valid(hospital_login_id):
        ambulances = list(
            ambulance_col.find({"hospital_login_id": ObjectId(hospital_login_id)})
        )

        for amb in ambulances:
            login = login_col.find_one({"_id": amb["login_id"]})
            amb["email"] = login["email"]

            amb["_id"] = str(amb["_id"])
            amb["login_id"] = str(amb["login_id"])
            amb["hospital_login_id"] = str(amb["hospital_login_id"])

        return Response({"ambulances": ambulances}, status=status.HTTP_200_OK)

    return Response({"error": "Invalid Login ID"}, status=status.HTTP_200_OK)


@api_view(["PUT"])
def edit_ambulance(request):
    serializer = AmbulanceUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    ambulance_col = db["ambulance"]

    try:
        ambulance_col.update_one(
            {"_id": ObjectId(request.data["ambulance_id"])},
            {
                "$set": {
                    "name": data["name"],
                    "ambulanceType": data["ambulanceType"],
                    "vehicleNumber": data["vehicleNumber"],
                    "category": data["category"],
                    "contactNumber": data["contactNumber"],
                }
            },
        )

        return Response({"message": "Ambulance Updated"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["DELETE"])
def delete_ambulance(request):
    serializer = AmbulanceDeleteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    ambulance_col = db["ambulance"]
    login_col = db["login"]

    ambulance = ambulance_col.find_one({"_id": ObjectId(data["ambulanceId"])})

    if not ambulance:
        return Response(
            {"error": "Ambulance not found"}, status=status.HTTP_404_NOT_FOUND
        )

    login_id = ambulance["login_id"]

    try:
        ambulance_col.delete_one({"_id": ObjectId(data["ambulanceId"])})
        login_col.delete_one({"_id": ObjectId(login_id)})

        return Response({"message": "Ambulance Deleted"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def getHospitalData(request):
    login_id = request.query_params.get("login_id")
    db = get_db()
    hospital_col = db["hospital"]
    login_col = db["login"]

    try:
        hospital = hospital_col.find_one({"login_id": ObjectId(login_id)})
        if not hospital:
            return Response(
                {"error": "Hospital not found"}, status=status.HTTP_404_NOT_FOUND
            )

        login_data = login_col.find_one({"_id": ObjectId(login_id)})

        hospital["email"] = login_data["email"]
        hospital["_id"] = str(hospital["_id"])
        hospital["login_id"] = str(hospital["login_id"])

        return Response(hospital, status=status.HTTP_200_OK)

    except Exception as e:
        print(e)
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["PUT"])
def editHospital(request):
    serializer = EditHospitalSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    hospital_col = db["hospital"]

    hospital_doc = {
        "hospitalName": data["hospitalName"],
        "registrationId": data["registrationId"],
        "hospitalAddress": data["hospitalAddress"],
        "contactNumber": data["contactNumber"],
    }

    try:
        result = hospital_col.update_one(
            {"_id": ObjectId(data["hospitalId"])}, {"$set": hospital_doc}
        )

        if result.matched_count > 0:
            return Response(
                {"message": "Profile Updated Successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Hospital Not Found."}, status=status.HTTP_404_NOT_FOUND
            )

    except Exception as e:
        print(e)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def change_hospital_password(request):
    login_id = request.data.get("login_id")
    new_password = request.data.get("new_password")

    if not login_id or not new_password:
        return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    login_col = db["login"]

    try:
        hashed_password = make_password(new_password)
        login_col.update_one(
            {"_id": ObjectId(login_id)}, {"$set": {"password": hashed_password}}
        )
        return Response(
            {"message": "Password changed successfully"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"error": "Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def create_schedule(request):
    serializer = CreateScheduleSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    doctor_col = db["doctors"]
    schedule_col = db["doctor_schedules"]

    doctor_id = data["doctorId"]
    hospital_login_id = data["hospital_login_id"]
    schedules = data["schedules"]

    try:
        # Verify the doctor exists and belongs to the hospital
        doctor = doctor_col.find_one(
            {
                "_id": ObjectId(doctor_id),
                "hospital_login_id": ObjectId(hospital_login_id),
            }
        )

        if not doctor:
            return Response(
                {"error": "Doctor not found or does not belong to this hospital"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check if schedule already exists for this doctor
        existing_schedule = schedule_col.find_one({"doctor_id": ObjectId(doctor_id)})

        schedule_doc = {
            "doctor_id": ObjectId(doctor_id),
            "hospital_login_id": ObjectId(hospital_login_id),
            "schedules": schedules,
            "updated_at": datetime.utcnow(),
        }

        if existing_schedule:
            # Update existing schedule
            schedule_col.update_one(
                {"doctor_id": ObjectId(doctor_id)}, {"$set": schedule_doc}
            )
            message = "Schedule updated successfully"
        else:
            # Create new schedule
            schedule_doc["created_at"] = datetime.utcnow()
            schedule_col.insert_one(schedule_doc)
            message = "Schedule created successfully"

        return Response({"message": message}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error creating/updating schedule: {e}")
        return Response(
            {"error": "Failed to save schedule. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_schedule(request):
    doctor_id = request.query_params.get("doctorId")

    if not doctor_id:
        return Response(
            {"error": "Doctor ID is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    db = get_db()
    schedule_col = db["doctor_schedules"]

    try:
        if not ObjectId.is_valid(doctor_id):
            return Response(
                {"error": "Invalid Doctor ID"}, status=status.HTTP_400_BAD_REQUEST
            )

        schedule = schedule_col.find_one({"doctor_id": ObjectId(doctor_id)})

        if not schedule:
            # Return empty schedules if none exist
            return Response(
                {
                    "schedules": {
                        "sunday": [],
                        "monday": [],
                        "tuesday": [],
                        "wednesday": [],
                        "thursday": [],
                        "friday": [],
                        "saturday": [],
                    }
                },
                status=status.HTTP_200_OK,
            )

        # Convert ObjectId fields to string for JSON serialization
        schedule["_id"] = str(schedule["_id"])
        schedule["doctor_id"] = str(schedule["doctor_id"])
        schedule["hospital_login_id"] = str(schedule["hospital_login_id"])

        return Response(
            {
                "schedules": schedule["schedules"],
                "schedule_id": schedule["_id"],
                "updated_at": schedule.get("updated_at"),
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Error fetching schedule: {e}")
        return Response(
            {"error": "Failed to fetch schedule"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def assign_duty_ambulance(request):
    serializer = AmbulanceDutySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    ambulance_duty_col = db["ambulance_duty"]
    ambulance_col = db["ambulance"]

    try:
        # Find the ambulance record to get its login_id
        ambulance = ambulance_col.find_one({"_id": ObjectId(data["ambulance_id"])})
        if not ambulance:
            return Response(
                {"error": "Ambulance not found"}, status=status.HTTP_404_NOT_FOUND
            )

        login_id = ambulance.get("login_id")

        query = {
            "from_address": data["from_address"],
            "to_address": data["to_address"],
            "risk_level": data["risk_level"],
            "ambulance_login_id": ObjectId(login_id),
            "created_at": datetime.utcnow(),
            "status": "pending",
        }

        ambulance_duty_col.insert_one(query)

        doc = {"available": 0}

        ambulance_col.update_one({"_id": ObjectId(data["ambulance_id"])}, {"$set": doc})
        return Response(
            {"message": "Ambulance duty assigned successfully"},
            status=status.HTTP_200_OK,
        )
    except:
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
