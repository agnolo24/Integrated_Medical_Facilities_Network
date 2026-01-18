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
    return Response({},status=status.HTTP_200_OK)