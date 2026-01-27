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

        duty = duty_col.find_one({"_id": ObjectId(id)})

        if not duty:
            return Response(
                {"error": "Duty not found"}, status=status.HTTP_404_NOT_FOUND
            )

        duty["status"] = "accepted"
        duty_col.update_one({"_id": ObjectId(id)}, {"$set": duty})

    except:
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response({"Message": "Duty Accepted"}, status=status.HTTP_200_OK)
