from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password

from datetime import datetime
import random

from .serializers import *
from .mongo import get_db

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from bson import ObjectId

# Create your views here.


@api_view(["POST"])
def patient_register(request):
    serializer = PatientRegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    db = get_db()

    login_col = db["login"]
    patient_col = db["patient"]

    if login_col.find_one({"email": data["email"]}):
        return Response(
            {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    login_doc = {
        "email": data["email"],
        "password": make_password(data["password"]),
        "user_type": "patient",
        "created_at": datetime.utcnow(),
    }

    login_id = None

    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id

        history_code = random.randint(100000, 999999)

        patient_doc = {
            "login_id": login_id,
            "name": data["name"],
            "gender": data["gender"],
            "age": data["age"],
            "dob": datetime.combine(data["dob"], datetime.min.time()),
            "contact": data["contact"],
            "history_code": history_code,
            "created_at": datetime.utcnow(),
        }

        patient_result = patient_col.insert_one(patient_doc)

        return Response(
            {
                "message": "Patient registered",
                "login_id": str(login_id),
                "patient_id": str(patient_result.inserted_id),
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


@api_view(["POST"])
def hospital_registration(request):
    serializer = HospitalRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    db = get_db()

    login_col = db["login"]
    hospital_col = db["hospital"]

    if login_col.find_one({"email": data["email"]}):
        return Response(
            {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    login_doc = {
        "email": data["email"],
        "password": make_password(data["password"]),
        "user_type": "hospital",
        "created_at": datetime.utcnow(),
    }

    login_id = None

    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id

        hospital_doc = {
            "login_id": login_id,
            "hospitalName": data["hospitalName"],
            "registrationId": data["registrationId"],
            "hospitalAddress": data["hospitalAddress"],
            "contactNumber": data["contactNumber"],
            "lat": data["lat"],
            "lon": data["lon"],
            "status": "pending",
            "created_at": datetime.utcnow(),
        }

        hospital_result = hospital_col.insert_one(hospital_doc)

        return Response(
            {
                "message": "Hospital registered",
                "login_id": str(login_id),
                "hospital_id": str(hospital_result.inserted_id),
            },
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        if login_id is not None and ObjectId.is_valid(str(login_id)):
            login_col.delete_one({"_id": login_id})

        return Response(
            {"error": "something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def login_function(request):
    email = request.data.get("email")
    password = request.data.get("password")

    db = get_db()
    login_col = db["login"]

    user = login_col.find_one({"email": email})
    if not user:
        return Response({"error": "Email Not Fount"}, status=status.HTTP_404_NOT_FOUND)

    if not check_password(password, user["password"]):
        return Response(
            {"error": "Wrong Password"}, status=status.HTTP_401_UNAUTHORIZED
        )

    if user["user_type"] == "hospital":
        hospital_col = db["hospital"]
        hospital = hospital_col.find_one({"login_id": user["_id"]})
        if hospital and hospital.get("status") != "verified":
            return Response(
                {"error": "Hospital Not Verified. Please wait for Admin approval."},
                status=status.HTTP_403_FORBIDDEN,
            )

    return Response(
        {
            "message": "Login Successful",
            "login_id": str(user["_id"]),
            "user": user["user_type"],
        }
    )


@api_view(["POST"])
def register_admin(request):
    """
    Temporary view to register an admin user.
    """
    email = "admin@gmail.com"
    password = "admin@123"

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    db = get_db()
    login_col = db["login"]

    if login_col.find_one({"email": email}):
        return Response(
            {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    login_doc = {
        "email": email,
        "password": make_password(password),
        "user_type": "admin",
        "created_at": datetime.utcnow(),
    }

    try:
        login_result = login_col.insert_one(login_doc)
        return Response(
            {"message": "Admin registered", "login_id": str(login_result.inserted_id)},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        print(e)
        return Response(
            {"error": "Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["POST"])
def change_password(request):
    print("change pass")
    serializer = ChangePasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    db = get_db()
    login_col = db["login"]
    print(data)
    print("login id : ",data["loginId"])
    try:
        user = login_col.find_one({"_id": ObjectId(data["loginId"])})
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not check_password(data["currentPassword"], user["password"]):
            return Response(
                {"error": "Current Password is Wrong."}, status=status.HTTP_401_UNAUTHORIZED
            )

        user["password"] = make_password(data["newPassword"])
        login_col.update_one({"_id": user["_id"]}, {"$set": user})

        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
