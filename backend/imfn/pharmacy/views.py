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
            'pharmacy_id': str(pharmacy_data['_id']),
            'email' : pharmacy_login.get('email', 'N/A'),
            'hospital_name' : hospital.get('hospitalName', 'N/A'),
            'hospital_address' : hospital.get('hospitalAddress', 'N/A'),
            'hospital_contact_number' : hospital.get('contactNumber', 'N/A'),
        }
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def add_medicine(request):
    pharmacy_login_id = request.data.get('pharmacy_login_id')
    name = request.data.get('name')
    description = request.data.get('description', '')
    price = request.data.get('price')
    stock = request.data.get('stock')
    expiry_date = request.data.get('expiry_date')

    if not all([pharmacy_login_id, name, price, stock, expiry_date]):
        return Response({"error": "Required fields are missing"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    pharmacy_col = db['pharmacy']

    try:
        medicine_obj = {
            "medicine_id": str(ObjectId()),
            "name": name,
            "description": description,
            "price": price,
            "stock": stock,
            "expiry_date": expiry_date,
            "created_at": datetime.utcnow()
        }

        result = pharmacy_col.update_one(
            {"login_id": ObjectId(pharmacy_login_id)},
            {"$push": {"medicines": medicine_obj}}
        )

        if result.modified_count > 0:
            return Response({"message": "Medicine added successfully", "medicine": medicine_obj}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Pharmacy not found or medicine not added"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def view_medicines(request):
    pharmacy_login_id = request.query_params.get("pharmacy_login_id")
    if not pharmacy_login_id:
        return Response({"error": "Pharmacy Login ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    pharmacy_col = db['pharmacy']

    try:
        pharmacy = pharmacy_col.find_one({"login_id" : ObjectId(pharmacy_login_id)})
        if not pharmacy:
            return Response({"error": "Pharmacy record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        medicines = pharmacy.get("medicines", [])
        return Response({"medicines": medicines}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def edit_medicine(request):
    pharmacy_login_id = request.data.get('pharmacy_login_id')
    medicine_id = request.data.get('medicine_id')
    name = request.data.get('name')
    description = request.data.get('description', '')
    price = request.data.get('price')
    stock = request.data.get('stock')
    expiry_date = request.data.get('expiry_date')

    if not all([pharmacy_login_id, medicine_id, name, price, stock, expiry_date]):
        return Response({"error": "Required fields are missing"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    pharmacy_col = db['pharmacy']

    try:
        result = pharmacy_col.update_one(
            {"login_id": ObjectId(pharmacy_login_id), "medicines.medicine_id": medicine_id},
            {"$set": {
                "medicines.$.name": name,
                "medicines.$.description": description,
                "medicines.$.price": price,
                "medicines.$.stock": stock,
                "medicines.$.expiry_date": expiry_date,
                "medicines.$.updated_at": datetime.utcnow()
            }}
        )

        if result.modified_count > 0:
            return Response({"message": "Medicine updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Medicine not found or no changes made"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def delete_medicine(request):
    pharmacy_login_id = request.data.get('pharmacy_login_id')
    medicine_id = request.data.get('medicine_id')

    if not pharmacy_login_id or not medicine_id:
        return Response({"error": "Pharmacy Login ID and Medicine ID are required"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    pharmacy_col = db['pharmacy']

    try:
        result = pharmacy_col.update_one(
            {"login_id": ObjectId(pharmacy_login_id)},
            {"$pull": {"medicines": {"medicine_id": medicine_id}}}
        )

        if result.modified_count > 0:
            return Response({"message": "Medicine deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Medicine not found or already deleted"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)