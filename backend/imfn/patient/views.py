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
