from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password

from api.mongo import get_db

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import *

from datetime import datetime, timedelta
import re

from bson import ObjectId

# Create your views here.


@api_view(["GET"])
def getPatientData(request):
    login_id = request.query_params.get("login_id")
    # print("login_id : ", login_id)

    db = get_db()

    patient_col = db["patient"]
    login_col = db["login"]

    qry = {"login_id": ObjectId(login_id)}

    patient_cur = patient_col.find_one(qry)
    if not patient_cur:
        return Response(
            {"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND
        )

    # Get email from login collection
    login_data = login_col.find_one({"_id": ObjectId(login_id)})
    if login_data:
        patient_cur["email"] = login_data.get("email", "")

    patient_cur["_id"] = str(patient_cur["_id"])
    patient_cur["login_id"] = str(patient_cur["login_id"])

    # print(patient_cur)

    return Response(patient_cur, status=status.HTTP_200_OK)


@api_view(["PUT"])
def editPatient(request):
    serializer = EditPatientSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    patient_col = db["patient"]

    update_fields = {}
    if "name" in data:
        update_fields["name"] = data["name"]
    if "gender" in data:
        update_fields["gender"] = data["gender"]
    if "age" in data:
        update_fields["age"] = data["age"]
    if "contact" in data:
        update_fields["contact"] = data["contact"]
    if "dob" in data:
        update_fields["dob"] = datetime.combine(data["dob"], datetime.min.time())

    try:
        result = patient_col.update_one(
            {"_id": ObjectId(request.data.get("patientId"))}, {"$set": update_fields}
        )

        if result.matched_count > 0:
            return Response(
                {"message": "Profile Updated Successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Patient Not Found or No Changes Made"},
                status=status.HTTP_404_NOT_FOUND,
            )

    except Exception as e:
        print(e)
        return Response(
            {"error": "An Error Occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def change_password(request):
    login_id = request.data.get("login_id")
    new_password = request.data.get("new_password")

    if not login_id or not new_password:
        return Response(
            {"error": "Missing login_id or new_password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    db = get_db()
    login_col = db["login"]

    try:
        login_col.update_one(
            {"_id": ObjectId(login_id)},
            {"$set": {"password": make_password(new_password)}},
        )
        return Response(
            {"message": "Password changed successfully"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"error": "Failed to change password"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ==================== SEARCH FUNCTIONALITY ====================


@api_view(["GET"])
def search(request):
    """
    Search for doctors and hospitals by name.
    Returns suggestions as the user types.

    Query params:
    - q: Search query (required)
    - type: 'all', 'doctor', or 'hospital' (optional, default: 'all')
    """
    query = request.query_params.get("q", "").strip()
    search_type = request.query_params.get("type", "all")

    if not query or len(query) < 1:
        return Response({"results": []}, status=status.HTTP_200_OK)

    db = get_db()
    results = []

    # Create case-insensitive regex pattern
    pattern = re.compile(f".*{re.escape(query)}.*", re.IGNORECASE)

    try:
        # Search doctors
        if search_type in ["all", "doctor"]:
            doctor_col = db["doctors"]
            hospital_col = db["hospital"]

            doctors = list(
                doctor_col.find(
                    {
                        "$or": [
                            {"name": {"$regex": pattern}},
                            {"specialization": {"$regex": pattern}},
                        ]
                    }
                ).limit(10)
            )

            for doc in doctors:
                # Get hospital name for context
                hospital = hospital_col.find_one(
                    {"login_id": doc.get("hospital_login_id")}
                )
                hospital_name = (
                    hospital.get("hospitalName", "Unknown Hospital")
                    if hospital
                    else "Unknown Hospital"
                )

                results.append(
                    {
                        "type": "doctor",
                        "_id": str(doc["_id"]),
                        "name": doc.get("name", ""),
                        "specialization": doc.get("specialization", ""),
                        "hospital_name": hospital_name,
                        "hospital_login_id": str(doc.get("hospital_login_id", "")),
                        "qualification": doc.get("qualification", ""),
                        "experience": doc.get("experience", 0),
                    }
                )

        # Search hospitals
        if search_type in ["all", "hospital"]:
            hospital_col = db["hospital"]

            hospitals = list(
                hospital_col.find(
                    {
                        "$or": [
                            {"hospitalName": {"$regex": pattern}},
                            {"hospitalAddress": {"$regex": pattern}},
                        ]
                    }
                ).limit(10)
            )

            for hosp in hospitals:
                results.append(
                    {
                        "type": "hospital",
                        "_id": str(hosp["_id"]),
                        "login_id": str(hosp.get("login_id", "")),
                        "name": hosp.get("hospitalName", ""),
                        "address": hosp.get("hospitalAddress", ""),
                        "contact": hosp.get("contactNumber", ""),
                    }
                )

        return Response({"results": results}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Search error: {e}")
        return Response(
            {"error": "Search failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def get_hospital_doctors(request):
    """
    Get all doctors for a specific hospital.

    Query params:
    - hospital_login_id: Hospital's login ID (required)
    """
    hospital_login_id = request.query_params.get("hospital_login_id")

    if not hospital_login_id:
        return Response(
            {"error": "Hospital login ID is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    db = get_db()
    doctor_col = db["doctors"]
    hospital_col = db["hospital"]
    schedule_col = db["doctor_schedules"]

    try:
        # Get hospital info
        hospital = hospital_col.find_one({"login_id": ObjectId(hospital_login_id)})
        if not hospital:
            return Response(
                {"error": "Hospital not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Get all doctors for this hospital
        doctors = list(
            doctor_col.find({"hospital_login_id": ObjectId(hospital_login_id)})
        )

        # Get departments (unique specializations)
        departments = list(
            set(
                doc.get("specialization", "")
                for doc in doctors
                if doc.get("specialization")
            )
        )

        # Format doctor data
        doctor_list = []
        for doc in doctors:
            # Check if doctor has schedule
            schedule = schedule_col.find_one({"doctor_id": doc["_id"]})
            has_schedule = schedule is not None and any(
                len(slots) > 0 for slots in schedule.get("schedules", {}).values()
            )

            doctor_list.append(
                {
                    "_id": str(doc["_id"]),
                    "name": doc.get("name", ""),
                    "specialization": doc.get("specialization", ""),
                    "qualification": doc.get("qualification", ""),
                    "experience": doc.get("experience", 0),
                    "has_schedule": has_schedule,
                }
            )

        return Response(
            {
                "hospital": {
                    "_id": str(hospital["_id"]),
                    "name": hospital.get("hospitalName", ""),
                    "address": hospital.get("hospitalAddress", ""),
                    "contact": hospital.get("contactNumber", ""),
                },
                "departments": sorted(departments),
                "doctors": doctor_list,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Error getting hospital doctors: {e}")
        return Response(
            {"error": "Failed to get hospital doctors"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_doctor_details(request):
    """
    Get detailed information about a doctor including their schedule.

    Query params:
    - doctor_id: Doctor's ID (required)
    """
    doctor_id = request.query_params.get("doctor_id")

    if not doctor_id:
        return Response(
            {"error": "Doctor ID is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    db = get_db()
    doctor_col = db["doctors"]
    hospital_col = db["hospital"]
    schedule_col = db["doctor_schedules"]

    try:
        doctor = doctor_col.find_one({"_id": ObjectId(doctor_id)})
        if not doctor:
            return Response(
                {"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Get hospital info
        hospital = hospital_col.find_one({"login_id": doctor.get("hospital_login_id")})

        # Get schedule
        schedule = schedule_col.find_one({"doctor_id": ObjectId(doctor_id)})
        schedules = (
            schedule.get("schedules", {})
            if schedule
            else {
                "sunday": [],
                "monday": [],
                "tuesday": [],
                "wednesday": [],
                "thursday": [],
                "friday": [],
                "saturday": [],
            }
        )

        return Response(
            {
                "doctor": {
                    "_id": str(doctor["_id"]),
                    "name": doctor.get("name", ""),
                    "gender": doctor.get("gender", ""),
                    "specialization": doctor.get("specialization", ""),
                    "qualification": doctor.get("qualification", ""),
                    "experience": doctor.get("experience", 0),
                    "hospital_login_id": str(doctor.get("hospital_login_id", "")),
                },
                "hospital": {
                    "name": hospital.get("hospitalName", "") if hospital else "",
                    "address": hospital.get("hospitalAddress", "") if hospital else "",
                    "contact": hospital.get("contactNumber", "") if hospital else "",
                },
                "schedules": schedules,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Error getting doctor details: {e}")
        return Response(
            {"error": "Failed to get doctor details"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_available_slots(request):
    """
    Get available appointment slots for a doctor on a specific date.

    Query params:
    - doctor_id: Doctor's ID (required)
    - date: Date in YYYY-MM-DD format (required)
    """
    doctor_id = request.query_params.get("doctor_id")
    date_str = request.query_params.get("date")

    if not doctor_id or not date_str:
        return Response(
            {"error": "Doctor ID and date are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    db = get_db()
    schedule_col = db["doctor_schedules"]
    appointment_col = db["appointments"]

    try:
        # Parse the date
        appointment_date = datetime.strptime(date_str, "%Y-%m-%d")
        day_name = appointment_date.strftime("%A").lower()

        # Get doctor's schedule
        schedule = schedule_col.find_one({"doctor_id": ObjectId(doctor_id)})
        if not schedule:
            return Response(
                {"available_slots": [], "message": "No schedule found for this doctor"},
                status=status.HTTP_200_OK,
            )

        # Get slots for the specific day
        day_slots = schedule.get("schedules", {}).get(day_name, [])

        if not day_slots:
            return Response(
                {
                    "available_slots": [],
                    "message": f"Doctor is not available on {day_name.capitalize()}",
                },
                status=status.HTTP_200_OK,
            )

        # Get already booked slots for this date
        booked_appointments = list(
            appointment_col.find(
                {
                    "doctor_id": ObjectId(doctor_id),
                    "appointment_date": appointment_date,
                    "status": {"$nin": ["cancelled"]},
                }
            )
        )

        booked_slots = [apt.get("time_slot") for apt in booked_appointments]

        # Filter out booked slots
        available_slots = [slot for slot in day_slots if slot not in booked_slots]

        return Response(
            {
                "date": date_str,
                "day": day_name.capitalize(),
                "available_slots": available_slots,
                "total_slots": len(day_slots),
                "booked_slots": len(booked_slots),
            },
            status=status.HTTP_200_OK,
        )

    except ValueError:
        return Response(
            {"error": "Invalid date format. Use YYYY-MM-DD"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        print(f"Error getting available slots: {e}")
        return Response(
            {"error": "Failed to get available slots"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ==================== APPOINTMENT BOOKING ====================


@api_view(["POST"])
def book_appointment(request):
    """
    Book an appointment with a doctor.
    """
    serializer = BookAppointmentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    appointment_col = db["appointments"]
    doctor_col = db["doctors"]
    patient_col = db["patient"]

    try:
        # Verify doctor exists
        doctor = doctor_col.find_one({"_id": ObjectId(data["doctor_id"])})
        if not doctor:
            return Response(
                {"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Verify patient exists
        patient = patient_col.find_one({"login_id": ObjectId(data["patient_login_id"])})
        if not patient:
            return Response(
                {"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Check if slot is still available
        appointment_date = datetime.combine(
            data["appointment_date"], datetime.min.time()
        )
        existing = appointment_col.find_one(
            {
                "doctor_id": ObjectId(data["doctor_id"]),
                "appointment_date": appointment_date,
                "time_slot": data["time_slot"],
                "status": {"$nin": ["cancelled"]},
            }
        )

        if existing:
            return Response(
                {
                    "error": "This slot is no longer available. Please choose another slot."
                },
                status=status.HTTP_409_CONFLICT,
            )

        # Create appointment
        appointment_doc = {
            "patient_login_id": ObjectId(data["patient_login_id"]),
            "patient_id": patient["_id"],
            "patient_name": patient.get("name", ""),
            "doctor_id": ObjectId(data["doctor_id"]),
            "doctor_name": doctor.get("name", ""),
            "hospital_login_id": ObjectId(data["hospital_login_id"]),
            "appointment_date": appointment_date,
            "time_slot": data["time_slot"],
            "appointment_type": data["appointment_type"],
            "reason": data.get("reason", ""),
            "status": "scheduled",
            "created_at": datetime.utcnow(),
        }

        result = appointment_col.insert_one(appointment_doc)

        return Response(
            {
                "message": "Appointment booked successfully",
                "appointment_id": str(result.inserted_id),
                "details": {
                    "doctor_name": doctor.get("name"),
                    "date": data["appointment_date"].strftime("%Y-%m-%d"),
                    "time_slot": data["time_slot"],
                    "type": data["appointment_type"],
                },
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        print(f"Error booking appointment: {e}")
        return Response(
            {"error": "Failed to book appointment. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_appointments(request):
    """
    Get all appointments for a patient.

    Query params:
    - patient_login_id: Patient's login ID (required)
    - status: Filter by status ('scheduled', 'completed', 'cancelled') (optional)
    - time_filter: 'upcoming', 'past', or 'all' (optional, default: 'all')
    """
    patient_login_id = request.query_params.get("patient_login_id")
    status_filter = request.query_params.get("status")
    time_filter = request.query_params.get("time_filter", "all")

    if not patient_login_id:
        return Response(
            {"error": "Patient login ID is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    db = get_db()
    appointment_col = db["appointments"]
    hospital_col = db["hospital"]

    try:
        # Build query
        query = {"patient_login_id": ObjectId(patient_login_id)}

        if status_filter:
            query["status"] = status_filter

        today = datetime.combine(datetime.today(), datetime.min.time())

        if time_filter == "upcoming":
            query["appointment_date"] = {"$gte": today}
            query["status"] = {"$ne": "cancelled"}
        elif time_filter == "past":
            query["appointment_date"] = {"$lt": today}

        # Fetch appointments
        appointments = list(appointment_col.find(query).sort("appointment_date", -1))

        # Format appointments
        appointment_list = []
        for apt in appointments:
            # Get hospital name
            hospital = hospital_col.find_one({"login_id": apt.get("hospital_login_id")})
            hospital_name = (
                hospital.get("hospitalName", "Unknown") if hospital else "Unknown"
            )

            appointment_list.append(
                {
                    "_id": str(apt["_id"]),
                    "doctor_name": apt.get("doctor_name", ""),
                    "doctor_id": str(apt.get("doctor_id", "")),
                    "hospital_name": hospital_name,
                    "appointment_date": (
                        apt.get("appointment_date").strftime("%Y-%m-%d")
                        if apt.get("appointment_date")
                        else ""
                    ),
                    "time_slot": apt.get("time_slot", ""),
                    "appointment_type": apt.get("appointment_type", ""),
                    "status": apt.get("status", ""),
                    "reason": apt.get("reason", ""),
                    "created_at": (
                        apt.get("created_at").strftime("%Y-%m-%d %H:%M")
                        if apt.get("created_at")
                        else ""
                    ),
                }
            )

        return Response(
            {"appointments": appointment_list, "total": len(appointment_list)},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Error getting appointments: {e}")
        return Response(
            {"error": "Failed to get appointments"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def cancel_appointment(request):
    """
    Cancel an appointment.
    """
    serializer = CancelAppointmentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    db = get_db()
    appointment_col = db["appointments"]

    try:
        # Verify the appointment belongs to this patient
        appointment = appointment_col.find_one(
            {
                "_id": ObjectId(data["appointment_id"]),
                "patient_login_id": ObjectId(data["patient_login_id"]),
            }
        )

        if not appointment:
            return Response(
                {"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if appointment.get("status") == "cancelled":
            return Response(
                {"error": "Appointment is already cancelled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update status to cancelled
        appointment_col.update_one(
            {"_id": ObjectId(data["appointment_id"])},
            {"$set": {"status": "cancelled", "cancelled_at": datetime.utcnow()}},
        )

        return Response(
            {"message": "Appointment cancelled successfully"}, status=status.HTTP_200_OK
        )

    except Exception as e:
        print(f"Error cancelling appointment: {e}")
        return Response(
            {"error": "Failed to cancel appointment"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
