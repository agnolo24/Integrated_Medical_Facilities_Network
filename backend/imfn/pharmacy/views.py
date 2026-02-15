from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password

from api.mongo import get_db

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from datetime import datetime, timedelta
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
            "medicine_id": ObjectId(),
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

        medicine_obj['medicine_id'] = str(medicine_obj['medicine_id'])
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
        for med in medicines:
            med['medicine_id'] = str(med['medicine_id'])
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
            {"login_id": ObjectId(pharmacy_login_id), "medicines.medicine_id": ObjectId(medicine_id)},
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
            {"$pull": {"medicines": {"medicine_id": ObjectId(medicine_id)}}}
        )

        if result.modified_count > 0:
            return Response({"message": "Medicine deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Medicine not found or already deleted"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_completed_appointments(request):
    pharmacy_login_id = request.query_params.get("pharmacy_login_id")
    if not pharmacy_login_id:
        return Response({"error": "Pharmacy Login ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    pharmacy_col = db['pharmacy']
    appointment_col = db['appointments']
    hospital_col = db['hospital']
    bill_col = db['bills']

    try:
        pharmacy = pharmacy_col.find_one({"login_id": ObjectId(pharmacy_login_id)})
        if not pharmacy:
            return Response({"error": "Pharmacy record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        hospital_id = pharmacy.get('hospital_id')
        if not hospital_id:
            return Response({"error": "No hospital associated with this pharmacy"}, status=status.HTTP_404_NOT_FOUND)

        # Get today's date at midnight
        today = datetime.combine(datetime.today(), datetime.min.time())
        tomorrow = today + timedelta(days=1)

        hospital = hospital_col.find_one({"_id": ObjectId(hospital_id) if isinstance(hospital_id, str) else hospital_id})
        if not hospital:
            return Response({"error": "Hospital record not found"}, status=status.HTTP_404_NOT_FOUND)
            
        hospital_login_id = hospital.get('login_id')
        if not hospital_login_id:
            return Response({"error": "Hospital login ID not found"}, status=status.HTTP_404_NOT_FOUND)

        query = {
            "hospital_login_id": ObjectId(hospital_login_id) if isinstance(hospital_login_id, (str, ObjectId)) else hospital_login_id,
            "status": "completed",
            "appointment_date": {"$gte": today, "$lt": tomorrow}
        }

        appointments_cursor = appointment_col.find(query).sort("appointment_date", -1)
        appointments_list = []
        
        for apt in appointments_cursor:
            bill = bill_col.find_one({"appointment_id": apt["_id"]})
            if bill:
                if not bill.get("pharmacy_medicine"):
                    appointments_list.append({
                        "appointment_id": str(apt["_id"]),
                        "patient_name": apt.get("patient_name", "N/A"),
                        "doctor_name": apt.get("doctor_name", "N/A"),                    "appointment_date": apt.get("appointment_date").strftime("%Y-%m-%d") if apt.get("appointment_date") else "N/A",
                        "time_slot": apt.get("time_slot", "N/A"),
                        "prescription": apt.get("prescription", "N/A"),
                    })
        return Response({"appointments": appointments_list}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_prescription(request):
    appointment_id = request.query_params.get("appointment_id")
    if not appointment_id:
        return Response({"error": "Appointment ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    appointment_col = db['appointments']

    try:
        if not ObjectId.is_valid(appointment_id):
            return Response({"error": "Invalid Appointment ID format"}, status=status.HTTP_400_BAD_REQUEST)

        appointment = appointment_col.find_one({"_id": ObjectId(appointment_id)})
        if not appointment:
            return Response({"error": "Appointment record not found"}, status=status.HTTP_404_NOT_FOUND)

        prescription = appointment.get("prescription", "N/A")
        return Response({"prescription": prescription}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def update_medicine_stock(request):
    pharmacy_login_id = request.data.get('pharmacy_login_id')
    Medicine_Stock = request.data.get('Medicine_Stock')

    if not pharmacy_login_id or Medicine_Stock is None:
        return Response({"error": "Required fields are missing"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    pharmacy_col = db['pharmacy']
    
    try:
        if not ObjectId.is_valid(pharmacy_login_id):
            return Response({"error": "Invalid Pharmacy Login ID format"}, status=status.HTTP_400_BAD_REQUEST)

        updated_count = 0
        for medicine in Medicine_Stock:
            medicine_id = medicine.get('medicine_id')
            stock = medicine.get('stock')
            
            if medicine_id is not None and stock is not None:
                result = pharmacy_col.update_one(
                    {"login_id": ObjectId(pharmacy_login_id), "medicines.medicine_id": ObjectId(medicine_id)},
                    {"$set": {
                        "medicines.$.stock": stock,
                    }}
                )
                if result.modified_count > 0:
                    updated_count += 1

        return Response({
            "message": f"Medicine stock update process completed. {updated_count} records updated.",
            "total_sent": len(Medicine_Stock)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error in update_medicine_stock: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({},status=status.HTTP_200_OK)

@api_view(['POST'])
def add_medicine_to_bill(request):
    appointment_id = request.data.get('appointment_Id')
    Medicine_Details = request.data.get('Medicine_Details')

    db = get_db()
    bill_coll = db['bills']

    medicine_list = []

    if Medicine_Details:
        for medicine in Medicine_Details:
                med = {
                    "medicine_name" : medicine['medicine_name'],
                    "quantity" : medicine['quantity'],
                    "price_per_unit" : medicine['price'],
                    "price" : int(medicine['price']) * int(medicine['quantity']),
                }
                medicine_list.append(med)
    else:
        return Response({},status=status.HTTP_404_NOT_FOUND)
    
    # Enforce server-side date and time
    billing_date = datetime.now().strftime("%Y-%m-%d")
    billing_time = datetime.now().strftime("%H:%M:%S")

    pharmacy_medicine = {
        'pharmacy_medicine' : {
            'medicine_deatils': medicine_list,
            'status' : 'unpaid',
            'billing_date': billing_date,
            'billing_time': billing_time,
            },
        'status' : 'unpaid',
        }
    try:
        result = bill_coll.update_one({'appointment_id' : ObjectId(appointment_id)},{'$set' : pharmacy_medicine})
        if result.modified_count > 0:
            return Response({"message": "Medicine successfully added to bill"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Medicine is not added to bill"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(f"Error in add_medicine_to_bill: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "Medicine added to bill successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_billing_history(request):
    pharmacy_login_id = request.query_params.get("pharmacy_login_id")
    if not pharmacy_login_id:
        return Response({"error": "Pharmacy Login ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    pharmacy_col = db['pharmacy']
    bill_col = db['bills']
    appointment_col = db['appointments']
    patient_col = db['patient']

    try:
        pharmacy = pharmacy_col.find_one({"login_id": ObjectId(pharmacy_login_id)})
        if not pharmacy:
            return Response({"error": "Pharmacy record not found"}, status=status.HTTP_404_NOT_FOUND)
        
        hospital_id = pharmacy.get('hospital_id')
        if not hospital_id:
            return Response({"error": "No hospital associated with this pharmacy"}, status=status.HTTP_404_NOT_FOUND)

        # Query bills that have pharmacy_medicine for this hospital
        query = {
            "hospital_id": ObjectId(hospital_id),
            "pharmacy_medicine": {"$exists": True}
        }

        # Sort by billing date and time descending
        bills_cursor = bill_col.find(query).sort([
            ("pharmacy_medicine.billing_date", -1), 
            ("pharmacy_medicine.billing_time", -1)
        ])
        
        history = []
        for bill in bills_cursor:
            apt_id = bill.get('appointment_id')
            appointment = appointment_col.find_one({"_id": ObjectId(apt_id)})
            
            if appointment:
                patient = patient_col.find_one({"_id": ObjectId(appointment.get('patient_id'))})
                
                pharm_data = bill.get('pharmacy_medicine', {})
                med_details = pharm_data.get('medicine_deatils', [])
                total_amount = sum(med.get('price', 0) for med in med_details)
                
                history.append({
                    "bill_id": str(bill['_id']),
                    "patient_name": patient.get('name', 'N/A') if patient else 'N/A',
                    "doctor_name": appointment.get('doctor_name', 'N/A'),
                    "billing_date": pharm_data.get('billing_date', 'N/A'),
                    "billing_time": pharm_data.get('billing_time', 'N/A'),
                    "total_amount": total_amount,
                    "status": pharm_data.get('status', 'N/A')
                })
        
        return Response({"history": history}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_bill_history_details(request):
    bill_id = request.query_params.get("bill_id")
    if not bill_id:
        return Response({"error": "Bill ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    db = get_db()
    bill_col = db['bills']
    appointment_col = db['appointments']
    patient_col = db['patient']

    try:
        if not ObjectId.is_valid(bill_id):
            return Response({"error": "Invalid Bill ID format"}, status=status.HTTP_400_BAD_REQUEST)

        bill = bill_col.find_one({"_id": ObjectId(bill_id)})
        if not bill:
            return Response({"error": "Bill not found"}, status=status.HTTP_404_NOT_FOUND)

        appointment = appointment_col.find_one({"_id": ObjectId(bill.get('appointment_id'))})
        if not appointment:
            return Response({"error": "Associated appointment not found"}, status=status.HTTP_404_NOT_FOUND)

        patient = patient_col.find_one({"_id": ObjectId(appointment.get('patient_id'))})

        pharm_data = bill.get('pharmacy_medicine', {})
        med_details = pharm_data.get('medicine_deatils', [])
        
        data = {
            "bill_id": str(bill['_id']),
            "patient_name": patient.get('name', 'N/A') if patient else 'N/A',
            "patient_contact": patient.get('contact', 'N/A') if patient else 'N/A',
            "doctor_name": appointment.get('doctor_name', 'N/A'),
            "prescription": appointment.get('prescription', "No prescription available"),
            "medicines": med_details,
            "billing_date": pharm_data.get('billing_date', 'N/A'),
            "billing_time": pharm_data.get('billing_time', 'N/A'),
            "status": pharm_data.get('status', 'unpaid'),
            "total_amount": sum(med.get('price', 0) for med in med_details)
        }

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)