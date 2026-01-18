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
def getAmbulanceData(request):
    am_id=request.query_params.get('am_id')
    print(am_id)

    db =get_db()
    amb_col=db['ambulance']

    amb=amb_col.find_one({"login_id":ObjectId(am_id)})
    if not amb:
        print("no data")
    else:
        amb['_id'] = str(amb['_id'])
        amb['login_id'] = str(amb['login_id'])
        amb['hospital_login_id'] = str(amb['hospital_login_id'])
        print(amb)


    
    return Response(amb,status=status.HTTP_200_OK)