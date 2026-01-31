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


@api_view(["GET"])
def getAmbulanceData(request):
    am_id = request.query_params.get("am_id")

    db = get_db()
    amb_col = db["ambulance"]

    amb = amb_col.find_one({"login_id": ObjectId(am_id)})
    if not amb:
        print("no data")
    else:
        amb["_id"] = str(amb["_id"])
        amb["login_id"] = str(amb["login_id"])
        amb["hospital_login_id"] = str(amb["hospital_login_id"])

    log_coll = db["login"]

    ambulance_login = log_coll.find_one({"_id": ObjectId(am_id)})
    email = ambulance_login["email"]
    amb["email"] = email

    return Response(amb, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_duty(request):
    login_id = request.query_params.get("ambulanceId")
    if not login_id:
        return Response(
            {"error": "Login Id not fount"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        db = get_db()
        duty_col = db["ambulance_duty"]
        ambulance_col = db["ambulance"]

        # Find the ambulance record to get its internal _id
        ambulance = ambulance_col.find_one({"login_id": ObjectId(login_id)})

        # Search for duties matching either the login_id or the ambulance document _id
        # This handles cases where the duty was assigned using the wrong ID.
        search_query = {
            "$or": [
                {"ambulance_login_id": ObjectId(login_id)},
            ],
            "status": {"$in": ["pending", "accepted"]},
        }

        if ambulance:
            search_query["$or"].append({"ambulance_login_id": ambulance["_id"]})

        data = list(duty_col.find(search_query))

        if len(data) == 0:
            return Response(
                {"Message": "No Duty Fount"}, status=status.HTTP_404_NOT_FOUND
            )

        for item in data:
            item["_id"] = str(item["_id"])
            item["ambulance_login_id"] = str(item["ambulance_login_id"])

        return Response(data, status=status.HTTP_200_OK)

    except:
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["PUT"])
def accept_duty(request):
    id = request.data.get("dutyId")

    try:
        db = get_db()
        duty_col = db["ambulance_duty"]
        ambulance_col = db["ambulance"]

        duty = duty_col.find_one({"_id": ObjectId(id)})

        if not duty:
            return Response(
                {"error": "Duty not found"}, status=status.HTTP_404_NOT_FOUND
            )

        duty["status"] = "accepted"
        duty_col.update_one({"_id": ObjectId(id)}, {"$set": duty})

        ambulance = ambulance_col.find_one(
            {"login_id": ObjectId(duty["ambulance_login_id"])}
        )
        ambulance["available"] = 2
        ambulance_col.update_one(
            {"login_id": ObjectId(duty["ambulance_login_id"])}, {"$set": ambulance}
        )

    except:
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response({"Message": "Duty Accepted"}, status=status.HTTP_200_OK)


@api_view(["PUT"])
def complete_duty(request):
    id = request.data.get("dutyId")
    print(id)

    try:
        db = get_db()
        duty_col = db["ambulance_duty"]
        ambulance_col = db["ambulance"]

        duty = duty_col.find_one({"_id": ObjectId(id)})

        if not duty:
            return Response(
                {"error": "Duty not found"}, status=status.HTTP_404_NOT_FOUND
            )

        duty["status"] = "completed"
        duty_col.update_one({"_id": ObjectId(id)}, {"$set": duty})

        ambulance = ambulance_col.find_one(
            {"login_id": ObjectId(duty["ambulance_login_id"])}
        )
        ambulance["available"] = 1
        ambulance_col.update_one(
            {"login_id": ObjectId(duty["ambulance_login_id"])}, {"$set": ambulance}
        )

    except:
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response({"Message": "Duty Completed"}, status=status.HTTP_200_OK)


@api_view(["GET"])
def get_available_emergencies(request):
    """
    Ambulance sees approved emergencies from their hospital.
    """
    ambulance_login_id = request.query_params.get("ambulance_login_id")
    db = get_db()
    ambulance_col = db["ambulance"]
    emergency_col = db["emergencies"]
    patient_col = db["patient"]

    try:
        amb = ambulance_col.find_one({"login_id": ObjectId(ambulance_login_id)})
        if not amb or amb.get("available") in [0, 2]:
            return Response(
                {"emergencies": [], "message": "Ambulance not available"}, status=200
            )

        hospital_id = amb.get("hospital_login_id")
        emergencies = list(
            emergency_col.find(
                {
                    "hospital_login_id": ObjectId(hospital_id),
                    "status": "hospital_approved",
                }
            ).sort("created_at", -1)
        )

        for q in emergencies:
            q["_id"] = str(q["_id"])
            q["hospital_login_id"] = str(q["hospital_login_id"])
            if q.get("patient_login_id"):
                q["patient_login_id"] = str(q["patient_login_id"])
                patient = patient_col.find_one(
                    {"login_id": ObjectId(q["patient_login_id"])}
                )
                if patient:
                    q["patient_name"] = patient.get("name", "Guest")
                    q["patient_contact"] = patient.get("contact", "N/A")

        return Response({"emergencies": emergencies}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def accept_emergency_duty(request):
    """
    Ambulance accepts an emergency call.
    """
    emergency_id = request.data.get("emergency_id")
    ambulance_login_id = request.data.get("ambulance_login_id")

    db = get_db()
    emergency_col = db["emergencies"]
    ambulance_col = db["ambulance"]
    duty_col = db["ambulance_duty"]

    try:
        # Atomic update
        result = emergency_col.update_one(
            {"_id": ObjectId(emergency_id), "status": "hospital_approved"},
            {
                "$set": {
                    "status": "ambulance_assigned",
                    "ambulance_login_id": ObjectId(ambulance_login_id),
                    "updated_at": datetime.utcnow(),
                }
            },
        )

        if result.modified_count == 0:
            return Response({"error": "Already accepted or unavailable"}, status=409)

        ambulance_col.update_one(
            {"login_id": ObjectId(ambulance_login_id)}, {"$set": {"available": 2}}
        )

        # Create duty record
        emerge = emergency_col.find_one({"_id": ObjectId(emergency_id)})
        duty_doc = {
            "emergency_id": ObjectId(emergency_id),
            "ambulance_login_id": ObjectId(ambulance_login_id),
            "from_address": f"Lat: {emerge['patient_location']['lat']}, Lon: {emerge['patient_location']['lon']}",
            "to_address": "Hospital",
            "status": "accepted",
            "risk_level": "Emergency",
            "patient_location": emerge["patient_location"],
            "created_at": datetime.utcnow(),
        }
        duty_col.insert_one(duty_doc)

        return Response({"message": "Emergency duty accepted"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
