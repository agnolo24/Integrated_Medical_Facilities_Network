from django.shortcuts import render
from api.mongo import get_db
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId

# Create your views here.


@api_view(["GET"])
def get_hospitals(request):
    """
    Fetch all hospitals. Can optionally filter by status using query param 'status'.
    """
    status_filter = request.query_params.get("status")

    db = get_db()
    hospital_col = db["hospital"]
    login_col = db["login"]

    query = {}
    if status_filter:
        query["status"] = status_filter

    hospitals_cursor = hospital_col.find(query)
    hospitals = list(hospitals_cursor)

    for hosp in hospitals:
        hosp["_id"] = str(hosp["_id"])
        hosp["login_id"] = str(hosp["login_id"])

        # Get email from login collection
        login_data = login_col.find_one({"_id": ObjectId(hosp["login_id"])})
        if login_data:
            hosp["email"] = login_data.get("email", "")

    return Response(hospitals, status=status.HTTP_200_OK)


@api_view(["POST"])
def verify_hospital(request):
    """
    Verify a hospital by its ID (hospital's _id or login_id? Using hospital's _id for precision)
    """
    hospital_id = request.data.get("hospital_id")

    if not hospital_id:
        return Response(
            {"error": "Missing hospital_id"}, status=status.HTTP_400_BAD_REQUEST
        )

    db = get_db()
    hospital_col = db["hospital"]

    try:
        result = hospital_col.update_one(
            {"_id": ObjectId(hospital_id)}, {"$set": {"status": "verified"}}
        )

        if result.modified_count > 0:
            return Response(
                {"message": "Hospital verified successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Hospital already verified or not found"},
                status=status.HTTP_200_OK,
            )

    except Exception as e:
        print(f"Error verifying hospital: {e}")
        return Response(
            {"error": "Internal Server Error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_hospital_details(request):
    """
    Get full details of a hospital including doctors and ambulances.
    Expects 'hospital_login_id' as query param (since doctors/ambulances are linked via login_id).
    """
    hospital_login_id = request.query_params.get("hospital_login_id")

    if not hospital_login_id:
        return Response(
            {"error": "Missing hospital_login_id"}, status=status.HTTP_400_BAD_REQUEST
        )

    db = get_db()
    hospital_col = db["hospital"]
    doctor_col = db["doctors"]
    ambulance_col = db["ambulance"]
    login_col = db["login"]

    try:
        # 1. Get Hospital Info
        hospital = hospital_col.find_one({"login_id": ObjectId(hospital_login_id)})
        if not hospital:
            return Response(
                {"error": "Hospital not found"}, status=status.HTTP_404_NOT_FOUND
            )

        hospital["_id"] = str(hospital["_id"])
        hospital["login_id"] = str(hospital["login_id"])

        login_data = login_col.find_one({"_id": ObjectId(hospital["login_id"])})
        if login_data:
            hospital["email"] = login_data.get("email", "")

        # 2. Get Doctors
        doctors = list(
            doctor_col.find({"hospital_login_id": ObjectId(hospital_login_id)})
        )
        for doc in doctors:
            doc["_id"] = str(doc["_id"])
            doc["login_id"] = str(doc["login_id"])
            doc["hospital_login_id"] = str(doc["hospital_login_id"])
            # doc['dob'] = doc['dob'].isoformat() if doc.get('dob') else '' # Date serialization handled?

        # 3. Get Ambulances
        ambulances = list(
            ambulance_col.find({"hospital_login_id": ObjectId(hospital_login_id)})
        )
        for amb in ambulances:
            amb["_id"] = str(amb["_id"])
            amb["login_id"] = str(amb["login_id"])
            amb["hospital_login_id"] = str(amb["hospital_login_id"])

        return Response(
            {"hospital": hospital, "doctors": doctors, "ambulances": ambulances},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Error fetching hospital full details: {e}")
        return Response(
            {"error": "Internal Server Error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
