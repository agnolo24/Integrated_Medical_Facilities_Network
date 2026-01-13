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


@api_view(['POST'])
def doctor_registration(request):
    serializer = DoctorRegistrationSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    
    data = serializer.validated_data
    db = get_db()
    
    login_col = db["login"]
    doctor_col = db["doctors"]
    
    if login_col.find_one({"email": data["email"]}):
        return Response(
            {"error": "Email already exist"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    login_doc = {
        "email": data["email"],
        "password": data["contactNumber"],
        "user_type": "doctor",
        "created_at":datetime.utcnow()
    }
    
    login_id = None
    
    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id
        
        doctor_doc = {
            'login_id':login_id,
            'hospital_login_id': data['hospital_login_id'],
            'name': data['name'],
            'gender': data['gender'],
            'specialization': data['specialization'],
            'dob': datetime.combine(data["dob"], datetime.min.time()),
            'qualification': data['qualification'],
            'experience': data['experience'],
            'contactNumber': data['contactNumber'],
            'email': data['email'],
            'created_at': datetime.utcnow()
        }
    
        doctor_result = doctor_col.insert_one(doctor_doc)
        
        return Response(
            {
                "message": "Doctor Registered",
                "login_id": str(login_id),
                "doctor_id": str(doctor_result.inserted_id)   
            }, status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        print(e)
        if login_id is not None and ObjectId.is_valid(str(login_id)):
            login_col.delete_one({"_id":login_id})
        return Response(
            {"error":"Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )