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


