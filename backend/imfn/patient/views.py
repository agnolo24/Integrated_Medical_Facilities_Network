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
from django.core.files.storage import FileSystemStorage
import os
import openrouteservice  # it is used for distance calculation(to find the closest hospital)
import base64
import json

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
            "documents": [],
        }

        # Handle file uploads
        files = request.FILES.getlist("documents")
        if files:
            fs = FileSystemStorage()
            file_paths = []
            for file in files:
                # Create a unique filename with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"appointments/{timestamp}_{file.name.replace(' ', '_')}"
                saved_filename = fs.save(filename, file)
                file_url = fs.url(saved_filename)
                file_paths.append(file_url)

            appointment_doc["documents"] = file_paths

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
                    "documents": apt.get("documents", []),
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


@api_view(["GET"])
def getNearestHospital(request):
    lat = request.query_params.get("lat")
    lon = request.query_params.get("lon")
    patient_login_id = request.query_params.get("patient_login_id")
    emergency_type = request.query_params.get("type", "General")

    if not lat or not lon:
        return Response(
            {"error": "Location data is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        p_lat = float(lat)
        p_lon = float(lon)
    except ValueError:
        return Response(
            {"error": "Invalid location format"}, status=status.HTTP_400_BAD_REQUEST
        )

    db = get_db()
    hospital_col = db["hospital"]
    # Search for verified hospitals
    hospitals = list(hospital_col.find({"status": "verified"}))

    if not hospitals:
        return Response(
            {"error": "No verified hospitals found"}, status=status.HTTP_404_NOT_FOUND
        )

    # OpenRouteService API Setup
    RAW_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImRhNGE3ZjFhNTE4ZDQwOWM4NTgzMWRiZTc1MDcyOWJlIiwiaCI6Im11cm11cjY0In0="
    try:
        # Decode the provided key (extracting the 'id' field which is the actual API key)
        decoded_key = json.loads(base64.b64decode(RAW_KEY).decode("utf-8")).get("id")
    except:
        decoded_key = RAW_KEY

    client = openrouteservice.Client(key=decoded_key)

    valid_hospitals = []
    locations = [[p_lon, p_lat]]  # ORS expects [longitude, latitude]

    for hosp in hospitals:
        h_lat = hosp.get("lat")
        h_lon = hosp.get("lon")
        if h_lat and h_lon:
            try:
                locations.append([float(h_lon), float(h_lat)])
                valid_hospitals.append(hosp)
            except (ValueError, TypeError):
                continue

    if not valid_hospitals:
        return Response(
            {"error": "No hospitals with valid coordinates found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        # Using ORS Matrix API to find distances and durations from patient to all hospitals
        # Profile 'driving-car', source: 0 (patient), destinations: 1 to N (hospitals)
        matrix = client.distance_matrix(
            locations=locations,
            profile="driving-car",
            metrics=["distance", "duration"],
            sources=[0],
            destinations=list(range(1, len(locations))),
        )

        # Distances are in meters, Durations in seconds
        distances = matrix["distances"][0]
        durations = matrix["durations"][0]

        # Find the hospital with the minimum travel distance (or duration)
        min_dist = min(distances)
        min_index = distances.index(min_dist)
        nearest_hospital = valid_hospitals[min_index]
        travel_time = durations[min_index]

        # Create emergency record in database
        emergency_col = db["emergencies"]
        emergency_doc = {
            "patient_login_id": (
                ObjectId(patient_login_id) if patient_login_id else None
            ),
            "patient_location": {"lat": p_lat, "lon": p_lon},
            "emergency_type": emergency_type,
            "hospital_login_id": nearest_hospital["login_id"],
            "status": "pending_hospital",
            "distance_m": min_dist,
            "duration_s": travel_time,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        result = emergency_col.insert_one(emergency_doc)

        return Response(
            {
                "message": "Nearest hospital identified using OpenRouteService Matrix API",
                "emergency_id": str(result.inserted_id),
                "nearest_hospital": {
                    "hospitalName": nearest_hospital.get("hospitalName"),
                    "hospitalAddress": nearest_hospital.get("hospitalAddress"),
                    "contactNumber": nearest_hospital.get("contactNumber"),
                    "distance_km": round(min_dist / 1000, 2),
                    "estimated_time_mins": round(travel_time / 60, 1),
                },
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"ORS Error: {e}")
        # Fallback to Haversine if API fails or other errors occur
        return Response(
            {"error": "Failed to calculate distances using ORS"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_patient_med_history(request):
    patient_login_id = request.query_params.get("patient_login_id")

    if not patient_login_id:
        return Response(
            {"error": "Patient LoginId missing"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        db = get_db()
        appointment_col = db["appointments"]
        doctor_col = db["doctors"]
        hospital_col = db["hospital"]

        patient_appointments = list(
            appointment_col.find({"patient_login_id": ObjectId(patient_login_id)}).sort(
                "appointment_date", -1
            )
        )

        history = []
        for apt in patient_appointments:
            data = {}
            data["appointment_id"] = str(apt["_id"])
            data["appointment_date"] = (
                apt["appointment_date"].strftime("%Y-%m-%d")
                if apt.get("appointment_date")
                else "N/A"
            )
            data["time_slot"] = apt.get("time_slot", "N/A")
            data["status"] = apt.get("status", "N/A")
            data["reason"] = apt.get("reason", "N/A")
            data["appointment_type"] = apt.get("appointment_type", "N/A")

            # hospital data
            hospital_data = hospital_col.find_one(
                {"login_id": apt.get("hospital_login_id")}
            )
            if hospital_data:
                data["hospital_name"] = hospital_data.get("hospitalName", "N/A")
                data["hospital_contact"] = hospital_data.get("contactNumber", "N/A")
                data["hospital_address"] = hospital_data.get("hospitalAddress", "N/A")
            else:
                data["hospital_name"] = "N/A"
                data["hospital_contact"] = "N/A"
                data["hospital_address"] = "N/A"

            # doctor data
            doctor_data = doctor_col.find_one({"_id": apt.get("doctor_id")})
            if doctor_data:
                data["doctor_name"] = doctor_data.get("name", "N/A")
                data["doctor_specialization"] = doctor_data.get("specialization", "N/A")
                data["doctor_contact"] = doctor_data.get("contactNumber", "N/A")
                data["doctor_email"] = doctor_data.get("email", "N/A")
            else:
                data["doctor_name"] = "N/A"
                data["doctor_specialization"] = "N/A"
                data["doctor_contact"] = "N/A"
                data["doctor_email"] = "N/A"

            # prescription data
            data["prescription"] = apt.get("prescription", None)

            # documents data
            data["documents"] = apt.get("documents", None)

            history.append(data)

        return Response(history, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error fetching medical history: {e}")
        return Response(
            {"error": "Failed to fetch medical history"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_portal_data(request):
    login_id = request.query_params.get("login_id")
    appointment_id = request.query_params.get("appointment_id")

    if not login_id or not appointment_id:
        return Response(
            {"error": "LoginId and Appointment Id missing"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        db = get_db()
        appointment_col = db["appointments"]

        appointment = appointment_col.find_one({"_id": ObjectId(appointment_id)})

        if not appointment:
            return Response(
                {"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if appointment.get("status") != "scheduled":
            return Response(
                {
                    "error": f"Appointment is {appointment.get('status')}. Portal only available for scheduled appointments."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if appointment.get("appointment_type") != "online":
            return Response(
                {"error": "This is an in-person appointment. No portal available."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Extract timing information
        time_slot = appointment.get("time_slot", "")  # Format: "10:30 AM - 11:00 AM"
        apt_date = appointment.get("appointment_date")

        try:
            # Parse start time from "10:30 AM - 11:00 AM"
            start_time_str = time_slot.split(" - ")[0]
            start_time_obj = datetime.strptime(start_time_str, "%I:%M %p").time()

            # Create a full scheduled datetime object
            scheduled_datetime = datetime.combine(apt_date.date(), start_time_obj)

            # Get current time
            current_datetime = datetime.now()

            # Verification: Allow joining 5 minutes before the scheduled time
            join_window_start = scheduled_datetime - timedelta(minutes=5)
            # You can also add a window end if needed, e.g., session lasts 1 hour
            join_window_end = scheduled_datetime + timedelta(hours=1)

            if current_datetime < join_window_start:
                wait_time = (join_window_start - current_datetime).total_seconds() / 60
                return Response(
                    {
                        "error": f"Portal is not yet active. Please join 5 minutes before the scheduled time ({start_time_str}).",
                        "wait_minutes": round(wait_time, 1),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if current_datetime > join_window_end:
                return Response(
                    {"error": "This appointment session has already ended."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # If all checks pass
            return Response(
                {
                    "message": "Access granted. Joining meeting portal...",
                    "room_id": str(appointment["_id"]),
                    # "portal_url": f"http://localhost:3000/meeting/{appointment['_id']}",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as te:
            print(f"Time parsing error: {te}")
            return Response(
                {"error": "Failed to parse appointment timing data."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        print(f"Error fetching portal data: {e}")
        return Response(
            {"error": "Failed to fetch appointment data"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_emergency_details(request):
    login_id = request.query_params.get("login_id")
    if not login_id:
        return Response(
            {"error": "LoginId missing"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        db = get_db()
        emergency_col = db["emergencies"]
        hospital_col = db["hospital"]
        ambulance_col = db["ambulance"]

        # Get most recent emergency
        emergency_details = (
            emergency_col.find({"patient_login_id": ObjectId(login_id)})
            .sort("created_at", -1)
            .limit(1)
        )
        emergency_details = list(emergency_details)

        if not emergency_details:
            return Response({}, status=status.HTTP_200_OK)

        emer = emergency_details[0]

        # Serialize IDs
        emer["_id"] = str(emer["_id"])
        emer["patient_login_id"] = str(emer["patient_login_id"])
        emer["hospital_login_id"] = str(emer["hospital_login_id"])

        # Enrich Hospital Info
        hosp = hospital_col.find_one({"login_id": ObjectId(emer["hospital_login_id"])})
        if hosp:
            emer["hospital_details"] = {
                "name": hosp.get("hospitalName"),
                "address": hosp.get("hospitalAddress"),
                "contact": hosp.get("contactNumber"),
            }

        # Enrich Ambulance Info
        amb_id = emer.get("ambulance_login_id")
        if amb_id:
            emer["ambulance_login_id"] = str(amb_id)
            amb_col = db["ambulance"]
            amb = amb_col.find_one({"login_id": ObjectId(amb_id)})
            if amb:
                emer["ambulance_details"] = {
                    "name": amb.get("name"),
                    "vehicle_no": amb.get("vehicleNumber"),
                    "contact": amb.get("contactNumber"),
                }
        else:
            emer["ambulance_login_id"] = "N/A"

        return Response(emer, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching emergency details: {e}")
        return Response(
            {"error": "Failed to fetch emergency details"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
