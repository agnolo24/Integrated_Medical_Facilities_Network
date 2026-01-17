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
        "password": make_password(data["contactNumber"]),
        "user_type": "doctor",
        "created_at":datetime.utcnow()
    }
    
    login_id = None
        
    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id
        
        doctor_doc = {
            'login_id':login_id,
            'hospital_login_id': ObjectId(data['hospital_login_id']),
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
    
    doctors_cursor = doctor_col.find({"hospital_login_id": ObjectId(hospital_login_id)}) 
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
        doc['hospital_login_id'] = str(doc['hospital_login_id'])
    
    return Response(
        {"doctors": doctor_list},
        status=status.HTTP_200_OK
    )
    
    
@api_view(['PUT'])
def edit_doctor(request):
    serializer = EditDoctorSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    
    db = get_db()
    doc_col = db['doctors']
        
    doctor_doc = {
        'name': data['name'],
        'gender': data['gender'],
        'specialization': data['specialization'],
        'qualification': data['qualification'],
        'experience': data['experience'],
        'contactNumber': data['contactNumber']
    }
    
    try:
        result = doc_col.update_one(
            {"_id":ObjectId(request.data.get('doctorId'))}, #* This is the condition used to filter out the doctor, the doctorId is string and we use ObjectId to convert it into the mongodb object.
            {'$set': doctor_doc} #* '$set' tell's mongodb to update the only fields we given, without '$set' mongodb will overwrite the entire collection.
        )
        
        if result.matched_count> 0:
            return Response(
                {"message": "Profile Updated Successfully"},
                status=status.HTTP_200_OK
            )
        
    except Exception as e:
        print(e)
        return Response(
            {'error': 'Doctor Not Fount'},
            status=status.HTTP_404_NOT_FOUND
        )
        
        
@api_view(['DELETE'])
def delete_doctor(request):
    db = get_db()
    
    doctor_id = request.data.get('doctorId')
    hospital_login_id = request.data.get('hospital_login_id')
    
    if not doctor_id:
        return Response(
            {"error": "Doctor ID Missing"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not hospital_login_id:
        return Response(
            {"error": "Hospital Login ID Missing"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    try:
        doctor_col = db['doctors']
        login_col = db['login']
        
        doctor = doctor_col.find_one({
            "_id": ObjectId(doctor_id),
            "hospital_login_id": ObjectId(hospital_login_id)
        })
        
        
        if not doctor:
            return Response(
                {"error": "Doctor not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        doctor_login_id = doctor.get('login_id')
        
        if not doctor_login_id:
            return Response(
                {"error": "Doctor Login ID Not Fount"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        reg_result = doctor_col.delete_one({"_id": ObjectId(doctor_id)})
        log_result = login_col.delete_one({"_id": doctor_login_id})
        
        if reg_result.deleted_count > 0 and log_result.deleted_count > 0:
            return Response(
                {"message": "Doctor deleted successfully"},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Failed to delete doctor"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    except Exception as e:
        print(f"Error deleting doctor: {e}")
        return Response(
            {"error": "Invalid Doctor ID"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
        
@api_view(['POST'])
def register_ambulance(request):
    serializer = AmbulanceRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    
    db = get_db()
    ambulance_col = db['ambulance']
    login_col = db['login']
    
    if login_col.find_one({"email": data['email']}):
        return Response(
            {"error": "Email already exist..! Use another Email."},
            status=status.HTTP_409_CONFLICT
        )
    
    login_doc = {
        "email": data['email'],
        "password": make_password(data['contactNumber']),
        "user_type": "ambulance",
        "created_at":datetime.utcnow()
    }    
    login_id = None    
    
    try:
        login_result = login_col.insert_one(login_doc)
        login_id = login_result.inserted_id
        
        ambulance_doc = {
            'login_id': login_id,
            'hospital_login_id': ObjectId(data['hospital_login_id']),
            'name': data['name'],
            'ambulanceType': data['ambulanceType'],
            'vehicleNumber': data['vehicleNumber'],
            'category': data['category'],
            'contactNumber': data['contactNumber'],
            'created_at': datetime.utcnow()
        }
        
        ambulance_col.insert_one(ambulance_doc)
        
        return Response(
            {"message": "Ambulance Registered"},
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        print(e)
        
        if login_id is not None and ObjectId.is_valid(str(login_id)):
            login_col.delete_one({"_id": login_id})
            
            return Response(
                {"error": "internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

@api_view(['GET'])
def view_ambulance(request):
    hospital_login_id = request.query_params.get('hospital_login_id')
    
    db = get_db()
    ambulance_col = db['ambulance']
    login_col = db['login']
    
    if ObjectId.is_valid(hospital_login_id):
        ambulances = list(ambulance_col.find({'hospital_login_id': ObjectId(hospital_login_id)}))
        
        for amb in ambulances:
            login = login_col.find_one({'_id': amb['login_id']})
            amb['email'] = login['email']
            
            amb['_id'] = str(amb['_id'])
            amb['login_id'] = str(amb['login_id'])
            amb['hospital_login_id'] = str(amb['hospital_login_id'])
            
        
        return Response(
            {"ambulances": ambulances},
            status=status.HTTP_200_OK
        )
        
    return Response(
        {"error": "Invalid Login ID" },
        status=status.HTTP_200_OK
    )
    
    
@api_view(['PUT'])
def edit_ambulance(request):
    serializer = AmbulanceUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    
    db = get_db()
    ambulance_col = db['ambulance']  
    
    try:
        ambulance_col.update_one(
            {'_id': ObjectId(request.data['ambulance_id'])},
            {'$set': {
                'name': data['name'],
                'ambulanceType': data['ambulanceType'],
                'vehicleNumber': data['vehicleNumber'],
                'category': data['category'],
                'contactNumber': data['contactNumber']
            }}
        )
        
        return Response(
            {"message": "Ambulance Updated"},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"error": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )