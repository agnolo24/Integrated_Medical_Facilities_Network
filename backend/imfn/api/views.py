from django.shortcuts import render
from django.contrib.auth.hashers import make_password

from datetime import datetime

from .serializers import *
from .mongo import get_db

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from bson import ObjectId

# Create your views here.


@api_view(['POST'])
def patient_register(request):
    serializer = PatientRegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    data = serializer.validated_data
    db = get_db()

    login_col = db["login"]
    patient_col = db["patient"]
    
    if login_col.find_one({"email":data["email"]}):
        return Response(
            {"error":"Email already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    login_doc = {
        "email" : data["email"],
        "password" : make_password(data["password"]),
        "user_type" : "patient",
        "created_at" : datetime.utcnow()
    }
    
    login_id = None
    
    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id
        
        patient_doc = {
            "login_id" : login_id,
            "name" : data["name"],
            "gender" : data["gender"],
            "age" : data["age"],
            "dob" : datetime.combine(data["dob"], datetime.min.time()),
            "contact" : data["contact"],
            "created_at" : datetime.utcnow()
        }
        
        patient_result = patient_col.insert_one(patient_doc)
        
        return Response({
            "message" : "Patient registered",
            "login_id" : str(login_id),
            "patient_id" : str(patient_result.inserted_id)
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        if login_id is not None and ObjectId.is_valid(str(login_id)):
            login_col.delete_one({"_id":login_id})
        return Response(
            {"error":"Something went wrong"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        
        
@api_view(['POST'])
def hospital_registration(request):
    serializer = HospitalRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    data = serializer.validated_data
    db = get_db()
    
    login_col = db["login"]
    hospital_col = db["hospital"]
    
    if login_col.find_one({"email":data['email']}):
        return Response(
            {"error": "Email already exists"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    login_doc = {
        "email": data['email'],
        "password": make_password(data["password"]),
        "user_type": "hospital",
        "created_at" : datetime.utcnow()
    }
    
    login_id = None
    
    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id
        
        hospital_doc = {
            'login_id' :login_id,
            'hospitalName': data['hospitalName'],
            'registrationId': data['registrationId'],
            'hospitalAddress': data['hospitalAddress'],
            'contactNumber': data['contactNumber'],
            'created_at': datetime.utcnow()
        }
        
        hospital_result = hospital_col.insert_one(hospital_doc)
        
        return Response(
            {
                "message": "Hospital registered",
                "login_id": str(login_id),
                "hospital_id":str(hospital_result.inserted_id)
            }, status=status.HTTP_201_CREATED
        )
    except Exception as e:
        if login_id is not None and ObjectId.is_valid(str(login_id)):
            login_col.delete_one({"_id":login_id})
            
        return Response(
            {
                "error": "something went wrong"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )