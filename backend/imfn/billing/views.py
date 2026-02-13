from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from api.mongo import get_db
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId

@api_view(["GET"])
def get_billing_data(request):
    login_id = request.query_params.get("login_id")
    if not login_id:
        return Response({"error": "Login ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    db = get_db()
    login_col = db['login']
    billing_col = db['billing']
    hospital_col = db['hospital']
      
    try:
        if not ObjectId.is_valid(login_id):
            return Response({"error": "Invalid Login ID format"}, status=status.HTTP_400_BAD_REQUEST)
            
        billing_data = billing_col.find_one({"login_id" : ObjectId(login_id)})
        if not billing_data:
            return Response({"error" : "Billing record not found"}, status=status.HTTP_404_NOT_FOUND)

        billing_login = login_col.find_one({"_id" : ObjectId(login_id)})
        if not billing_login:
            return Response({"error": "Login records not found"}, status=status.HTTP_404_NOT_FOUND)
 
        hospital_id = billing_data.get('hospital_id')
        if not hospital_id:
             return Response({"error": "No hospital associated with this billing department"}, status=status.HTTP_404_NOT_FOUND)

        hospital = hospital_col.find_one({"_id" : ObjectId(hospital_id) if isinstance(hospital_id, str) else hospital_id})
        
        if not hospital:
            return Response({"error": "Associated hospital not found"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'billing_id': str(billing_data['_id']),
            'email' : billing_login.get('email', 'N/A'),
            'hospital_name' : hospital.get('hospitalName', 'N/A'),
            'hospital_address' : hospital.get('hospitalAddress', 'N/A'),
            'hospital_contact_number' : hospital.get('contactNumber', 'N/A'),
        }
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_all_invoices(request):
    login_id = request.query_params.get("login_id")
    if not login_id:
        return Response({"error": "Login ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    db = get_db()
    billing_col = db['billing']
    bill_col = db['bills']
    appointment_col = db['appointments']
    patient_col = db['patient']
    
    try:
        if not ObjectId.is_valid(login_id):
            return Response({"error": "Invalid Login ID format"}, status=status.HTTP_400_BAD_REQUEST)
            
        billing_data = billing_col.find_one({"login_id": ObjectId(login_id)})
        if not billing_data:
            return Response({"error": "Billing record not found"}, status=status.HTTP_404_NOT_FOUND)
            
        hospital_id = billing_data.get('hospital_id')
        
        # Find all bills for this hospital
        bills_cursor = bill_col.find({"hospital_id": ObjectId(hospital_id)})
        invoices = []
        
        for bill in bills_cursor:
            apt_id = bill.get('appointment_id')
            appointment = appointment_col.find_one({"_id": ObjectId(apt_id)})
            
            if appointment:
                patient = patient_col.find_one({"_id": ObjectId(appointment.get('patient_id'))})
                
                # Calculate total amount
                total_amount = 0  # Default fee removed
                
                # Pharmacy items
                pharmacy_data = bill.get('pharmacy_medicine', {})
                medicine_details = pharmacy_data.get('medicine_deatils', [])
                for med in medicine_details:
                    total_amount += med.get('price', 0)
                
                # Other charges
                other_charges_data = bill.get('other_charges', {})
                charge_details = other_charges_data.get('charge_details', [])
                for charge in charge_details:
                    total_amount += charge.get('price', 0)
                
                invoices.append({
                    "id": str(bill['_id']),
                    "appointment_id": str(apt_id),
                    "patient_name": patient.get('name', 'N/A') if patient else 'N/A',
                    "doctor_name": appointment.get('doctor_name', 'N/A'),
                    "date": appointment.get('appointment_date').strftime("%Y-%m-%d") if appointment.get('appointment_date') else 'N/A',
                    "total_amount": total_amount,
                    "status": bill.get('status', 'unpaid'),
                })
        
        return Response({"invoices": invoices}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_invoice_details(request):
    invoice_id = request.query_params.get("invoice_id")
    if not invoice_id:
        return Response({"error": "Invoice ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
    db = get_db()
    bill_col = db['bills']
    appointment_col = db['appointments']
    patient_col = db['patient']
    
    try:
        if not ObjectId.is_valid(invoice_id):
            return Response({"error": "Invalid Invoice ID format"}, status=status.HTTP_400_BAD_REQUEST)
            
        bill = bill_col.find_one({"_id": ObjectId(invoice_id)})
        if not bill:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
            
        appointment = appointment_col.find_one({"_id": ObjectId(bill.get('appointment_id'))})
        patient = patient_col.find_one({"_id": ObjectId(appointment.get('patient_id'))}) if appointment else None
        
        items = [] # Consultation fee removed
        
        # Add pharmacy items
        pharmacy_data = bill.get('pharmacy_medicine', {})
        medicine_details = pharmacy_data.get('medicine_deatils', [])
        for med in medicine_details:
            items.append({
                "name": med.get('medicine_name', 'Medicine'),
                "quantity": med.get('quantity', 1),
                "price": med.get('price', 0),
                "type": "pharmacy"
            })
            
        # Add other charges
        other_charges_data = bill.get('other_charges', {})
        charge_details = other_charges_data.get('charge_details', [])
        for charge in charge_details:
            items.append({
                "name": charge.get('name', 'Charge'),
                "quantity": 1,
                "price": charge.get('price', 0),
                "type": "other"
            })
            
        total_amount = sum(item['price'] for item in items)
        
        data = {
            "invoice_id": str(bill['_id']),
            "patient_name": patient.get('name', 'N/A') if patient else 'N/A',
            "patient_contact": patient.get('contact', 'N/A') if patient else 'N/A',
            "doctor_name": appointment.get('doctor_name', 'N/A') if appointment else 'N/A',
            "date": appointment.get('appointment_date').strftime("%Y-%m-%d") if appointment and appointment.get('appointment_date') else 'N/A',
            "status": bill.get('status', 'unpaid'),
            "items": items,
            "total_amount": total_amount
        }
        
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def add_other_charges(request):
    invoice_id = request.data.get("invoice_id")
    charge_details = request.data.get("charge_details") # Expected as array of {name, price}
    
    if not invoice_id or charge_details is None:
        return Response({"error": "Invoice ID and charge details are required"}, status=status.HTTP_400_BAD_REQUEST)
        
    db = get_db()
    bill_col = db['bills']
    
    try:
        if not ObjectId.is_valid(invoice_id):
            return Response({"error": "Invalid Invoice ID format"}, status=status.HTTP_400_BAD_REQUEST)
            
        other_charges = {
            "charge_details": charge_details,
            "status": "unpaid"
        }
        
        result = bill_col.update_one(
            {"_id": ObjectId(invoice_id)},
            {
                "$set": {
                    "other_charges": other_charges,
                    "status": "unpaid" # Reset main status to unpaid when charges are added
                }
            }
        )
        
        if result.matched_count > 0:
            return Response({"message": "Charges added successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def update_invoice_status(request):
    invoice_id = request.data.get("invoice_id")
    new_status = request.data.get("status")
    
    if not invoice_id or not new_status:
        return Response({"error": "Invoice ID and status are required"}, status=status.HTTP_400_BAD_REQUEST)
        
    db = get_db()
    bill_col = db['bills']
    
    try:
        if not ObjectId.is_valid(invoice_id):
            return Response({"error": "Invalid Invoice ID format"}, status=status.HTTP_400_BAD_REQUEST)
            
        bill = bill_col.find_one({"_id": ObjectId(invoice_id)})
        if not bill:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

        update_data = {"status": new_status}
        if 'pharmacy_medicine' in bill:
            update_data["pharmacy_medicine.status"] = new_status
        if 'other_charges' in bill:
            update_data["other_charges.status"] = new_status

        result = bill_col.update_one(
            {"_id": ObjectId(invoice_id)},
            {"$set": update_data}
        )
        
        if result.matched_count > 0:
            return Response({"message": "Invoice status updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
