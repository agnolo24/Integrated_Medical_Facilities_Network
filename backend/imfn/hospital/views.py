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
        
        
@api_view(['GET'])
def view_doctors(request):
    
    #* the 'request.query_params' is used to read the data in the GET request but for the POST request we can use the 'request.data'
    hospital_login_id = request.query_params.get("hospitalLoginId")
    
    db = get_db()
    doctor_col = db['doctors']
    
    doctors_cursor = doctor_col.find({"hospital_login_id": hospital_login_id}) 
    '''
        when we use "doctor_col.find({"hospital_login_id": hospital_login_id})" is doesn't return a native python data type or data structure,
        it return something called the "cursor object" which is a part of the mongodb so we need to change it to the json format for that first we convert 
        it into the list just like given bellow and we place the list as the value of a dictionary data type when we return the Response.
    '''
    doctor_list = list(doctors_cursor)
    
    '''
        Yhe '_id' and 'login_id' are objectId, the mongoDB ObjectId is not JSON serializable → must be converted to string.
    '''
    for doc in doctor_list:
        doc['_id'] = str(doc['_id'])
        doc['login_id'] = str(doc['login_id'])
    
    return Response(
        {"doctors": doctor_list},
        status=status.HTTP_200_OK
    )