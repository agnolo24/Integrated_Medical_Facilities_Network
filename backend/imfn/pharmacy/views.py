from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password

from api.mongo import get_db

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime
from bson import ObjectId

# Create your views here.

@api_view(["GET"])
def get_pharmacy_data(request):
    login_id = request.query_params.get("login_id")
    if not login_id:
        return Response({"error": "Login ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    db = get_db()
    login_col = db['login']
    pharmacy_col = db['pharmacy']
    hospital_col = db['hospital']
      
    try:
        # Validate login_id as ObjectId
        if not ObjectId.is_valid(login_id):
            return Response({"error": "Invalid Login ID format"}, status=status.HTTP_400_BAD_REQUEST)
            
        pharmacy_data = pharmacy_col.find_one({"login_id" : ObjectId(login_id)})
        if not pharmacy_data:
            return Response({"error" : "Pharmacy record not found"}, status=status.HTTP_404_NOT_FOUND)

        pharmacy_login = login_col.find_one({"_id" : ObjectId(login_id)})
        if not pharmacy_login:
            return Response({"error": "Login records not found"}, status=status.HTTP_404_NOT_FOUND)
 
        hospital_id = pharmacy_data.get('hospital_id')
        if not hospital_id:
             return Response({"error": "No hospital associated with this pharmacy"}, status=status.HTTP_404_NOT_FOUND)

        hospital = hospital_col.find_one({"_id" : ObjectId(hospital_id) if isinstance(hospital_id, str) else hospital_id})
        
        if not hospital:
            return Response({"error": "Associated hospital not found"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'email' : pharmacy_login.get('email', 'N/A'),
            'hospital_name' : hospital.get('hospitalName', 'N/A'),
            'hospital_address' : hospital.get('hospitalAddress', 'N/A'),
            'hospital_contact_number' : hospital.get('contactNumber', 'N/A'),
        }
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)