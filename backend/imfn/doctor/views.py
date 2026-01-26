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

@api_view(['GET'])
def getDoctorData(request):
    dr_id = request.query_params.get('dr_id')
    print("id : ",dr_id)

    db = get_db()

    docter_coll = db['doctors']

    qry = {
        "login_id" : ObjectId(dr_id)
    }
    
    doctor_cur = docter_coll.find_one(qry)
    if not doctor_cur:
        print("no data retreved")

    else:
        doctor_cur['_id'] = str(doctor_cur['_id'])
        doctor_cur['login_id'] = str(doctor_cur['login_id'])
        doctor_cur['hospital_login_id'] = str(doctor_cur['hospital_login_id'])
        print(doctor_cur)


    return Response(doctor_cur,status=status.HTTP_200_OK)

@api_view(['GET'])
def get_patient_appointment(request):
    login_id = request.query_params.get("login_id")
    filterStatus = request.query_params.get("time_filter")
    db = get_db()
    appointment_col = db['appointments']
    doctor_col = db['doctors']

    doctor = doctor_col.find_one({'login_id' : ObjectId(login_id)})
    if not doctor:
        return Response({"error": "Can not find the doctor!"},status=status.HTTP_404_NOT_FOUND)
    dr_id = doctor['_id']
    try :
        query = {
            "doctor_id" : dr_id
        }

        if filterStatus == 'scheduled':
            query['status'] = 'scheduled'
        elif filterStatus == 'cancelled':
            query['status'] = 'cancelled'
            


        appointments = list(appointment_col.find(query).sort([("appointment_date", -1), ("time_slot", -1)]))
        appointment_list = []
        for apt in appointments:
            appointment_list.append(
                {
                    "_id": str(apt["_id"]),
                    "doctor_name": apt.get("doctor_name", ""),
                    "patientName": apt.get("patient_name", ""),
                    "doctor_id": str(apt.get("doctor_id", "")),
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

    return Response({},status=status.HTTP_200_OK)

@api_view(['GET'])
def get_patient_appointment_details(request):
    login_id = request.query_params.get("login_id")
    apt_id = request.query_params.get("apt_id")
    
    db = get_db()
    appointment_col = db['appointments']
    patient_col = db['patient']
    
    try:
        appointment = appointment_col.find_one({"_id": ObjectId(apt_id)})
        if not appointment:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        patient = patient_col.find_one({"_id": ObjectId(appointment["patient_id"])})
        if not patient:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
        
        appointment["_id"] = str(appointment["_id"])
        appointment["patient_login_id"] = str(appointment["patient_login_id"])
        appointment["patient_id"] = str(appointment["patient_id"])
        appointment["doctor_id"] = str(appointment["doctor_id"])
        appointment["hospital_login_id"] = str(appointment["hospital_login_id"])
        appointment["patient_name"] = patient.get("name", "")
        appointment["patient_contact"] = patient.get("contact", "")
        appointment["patient_age"] = patient.get("age", "")
        appointment["patient_gender"] = patient.get("gender", "")
        appointment["patient_address"] = patient.get("address", "")

        return Response(appointment,status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error getting appointment details: {e}")
        return Response(
            {"error": "Failed to get appointment details"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(['POST'])
def check_history_code(request):
    apt_id = request.data.get("apt_id")
    history_code = request.data.get("history_code")

    print("apt_id : ",apt_id)
    print("history_code : ",history_code)

    db = get_db()
    appointment_col = db['appointments']
    patient_col = db['patient']
    try:
        appointment = appointment_col.find_one({"_id": ObjectId(apt_id)})
        if not appointment:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        
        patient_id = appointment["patient_id"]
        patient = patient_col.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
            
        stored_code = str(patient.get('history_code', ''))
        input_code = str(history_code)
        
        if stored_code == input_code:
            print("login")
            return Response({"msg" : "success"},status=status.HTTP_200_OK)
        else:
            print("not login")
            return Response({"error": "Invalid history code"},status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error getting patient details: {e}")
        return Response(
            {"error": "Failed to get patient details"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(['POST'])
def add_prescription_by_doctor(request):
    serializer = AddPrescriptionSerializer(data =request.data)
    serializer.is_valid(raise_exception = True)
    data = serializer.data

    prescription = {
        "prescription" : data['prescription']
    }

    db = get_db()
    appointment_col = db['appointments']

    query = {"_id" : ObjectId(data['appointment_id']),}
    
    apt = appointment_col.find_one(query)
    if not apt:
        return Response({"error": "Internal server error"}, status = status.HTTP_404_NOT_FOUND)

    try :
        appointment = appointment_col.update_one(query,{"$set" : prescription })
        print(appointment.did_upsert)
        return Response(
            {
            "message": "Prescription added successfully"
            }, status=status.HTTP_200_OK)
    except:
        return Response(
            {
            "error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_prescription_data(request):
    _id = request.query_params.get('_id')

    print("_id : ", _id)
    
    db = get_db()
    appointment_coll = db['appointments']
    try:
        apt = appointment_coll.find_one({"_id" : ObjectId(_id)})

        if not apt:
            return Response(
                {
                "error": "Can not find appointment"}, status=status.HTTP_404_NOT_FOUND
            )
        
        prescription = apt['prescription']
        print(prescription)
        return Response({"prescription" : prescription}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}")
        return Response(
            {
            "error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return Response({},status=status.HTTP_200_OK)

