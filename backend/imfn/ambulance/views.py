from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password

from api.mongo import get_db

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import *

from datetime import datetime

import json
import base64
import openrouteservice
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
                {"Message": "No Duty Found"}, status=status.HTTP_404_NOT_FOUND
            )

        for item in data:
            item["_id"] = str(item["_id"])
            item["ambulance_login_id"] = str(item["ambulance_login_id"])

            # If duty is linked to an emergency, fetch patient details
            if "emergency_id" in item:
                item["emergency_id"] = str(item["emergency_id"])
                emergency = emergency_col.find_one(
                    {"_id": ObjectId(item["emergency_id"])}
                )
                if emergency:
                    item["patient_location"] = emergency.get("patient_location")
                    if emergency.get("patient_login_id"):
                        patient = patient_col.find_one(
                            {"login_id": ObjectId(emergency["patient_login_id"])}
                        )
                        if patient:
                            item["patient_name"] = patient.get("name", "N/A")
                            item["patient_contact"] = patient.get("contact", "N/A")
                    else:
                        # Guest patient
                        item["patient_name"] = "Guest Patient"
                        item["patient_contact"] = emergency.get(
                            "patient_contact", "N/A"
                        )

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
    ambulance_login_id = request.query_params.get("ambulanceId")
    db = get_db()
    ambulance_col = db["ambulance"]
    emergency_col = db["emergencies"]
    patient_col = db["patient"]

    try:
        # amb = ambulance_col.find_one({"login_id": ObjectId(ambulance_login_id)})
        # if not amb or amb.get("available") in [0, 2]:
        #     return Response(
        #         {"emergencies": [], "message": "Ambulance not available"}, status=200
        #     )

        # hospital_id = amb.get("hospital_login_id")
        amb = ambulance_col.find_one({"login_id": ObjectId(ambulance_login_id)})
        hospital_id = amb.get("hospital_login_id") if amb else None

        # Show emergencies that are approved by the hospital and belong to this ambulance's hospital
        # OR emergencies already assigned to this ambulance
        query = {
            "status": {"$ne": "finished"},
            "$or": [
                {"hospital_login_id": hospital_id, "status": "hospital_approved"},
                {"ambulance_login_id": ObjectId(ambulance_login_id)},
            ],
        }

        emergencies = list(emergency_col.find(query).sort("created_at", -1))

        for q in emergencies:
            q["_id"] = str(q["_id"])
            q["patient_login_id"] = str(q.get("patient_login_id", ""))
            q["hospital_login_id"] = str(q.get("hospital_login_id", ""))
            q["ambulance_login_id"] = str(q.get("ambulance_login_id", ""))

            if q.get("patient_login_id"):
                patient = patient_col.find_one(
                    {"login_id": ObjectId(q["patient_login_id"])}
                )
                if patient:
                    q["patient_name"] = patient.get("name", "Guest")
                    q["patient_contact"] = patient.get("contact", "N/A")
            else:
                q["patient_name"] = "Guest Patient"
                q["patient_contact"] = q.get("patient_contact", "N/A")

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
            {"_id": ObjectId(emergency_id), "status": "ambulance_assigned"},
            {
                "$set": {
                    "status": "ambulance_accepted",
                }
            },
        )

        if result.modified_count == 0:
            return Response({"error": "Already accepted or unavailable"}, status=409)

        ambulance_col.update_one(
            {"login_id": ObjectId(ambulance_login_id)}, {"$set": {"available": 2}}
        )
        
        return Response({"message": "Emergency duty accepted"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def emergency_finished(request):
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
            {"_id": ObjectId(emergency_id), "status": "ambulance_accepted"},
            {
                "$set": {
                    "status": "finished",
                }
            },
        )

        if result.modified_count == 0:
            return Response({"error": "Could not mark duty as finished."}, status=409)

        ambulance_col.update_one(
            {"login_id": ObjectId(ambulance_login_id)}, {"$set": {"available": 1}}
        )
        
        return Response({"message": "Emergency duty finished"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
