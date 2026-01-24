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
            


        appointments = list(appointment_col.find(query).sort("appointment_date", -1))
        appointment_list = []
        for apt in appointments:
            print("looping")
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
        print("data : ",appointment_list)
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