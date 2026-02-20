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


@api_view(["GET"])
def view_doctor_history(request):
    """
    View doctor history.
    """
    doctor_id = request.query_params.get("doctorId")
    if not doctor_id:
        return Response(
            {"error": "Missing doctor_id"}, status=status.HTTP_400_BAD_REQUEST
        )
    db = get_db()
    appointment_col = db["appointments"]
    try:
        appointments = list(appointment_col.find({"doctor_id": ObjectId(doctor_id)}))
        for appointment in appointments:
            appointment["_id"] = str(appointment["_id"])
            appointment["patient_login_id"] = str(appointment["patient_login_id"])
            appointment["patient_id"] = str(appointment["patient_id"])
            appointment["doctor_id"] = str(appointment["doctor_id"])
            appointment["hospital_login_id"] = str(appointment["hospital_login_id"])
        return Response(appointments, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching doctor history: {e}")
        return Response(
            {"error": "Internal Server Error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_all_reports(request):
    db = get_db()
    report_col = db["reports"]
    hospital_col = db["hospital"]
    patient_col = db["patient"]

    try:
        reports = list(report_col.find().sort("created_at", -1))
        for report in reports:
            report["_id"] = str(report["_id"])
            report["patient_login_id"] = str(report["patient_login_id"])
            report["hospital_login_id"] = str(report["hospital_login_id"])

            # Get hospital info
            hosp = hospital_col.find_one(
                {"login_id": ObjectId(report["hospital_login_id"])}
            )
            report["hospital_name"] = hosp.get("hospitalName") if hosp else "Unknown"

            # Get patient info
            patient = patient_col.find_one(
                {"login_id": ObjectId(report["patient_login_id"])}
            )
            report["patient_name"] = patient.get("name") if patient else "Unknown"

        return Response(reports, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"error": "Failed to fetch reports"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_patient_hospital_interactions(request):
    patient_login_id = request.query_params.get("patient_login_id")
    hospital_login_id = request.query_params.get("hospital_login_id")

    if not patient_login_id or not hospital_login_id:
        return Response(
            {"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST
        )

    db = get_db()
    appointment_col = db["appointments"]
    emergency_col = db["emergencies"]

    try:
        # Fetch appointments between patient and hospital
        appointments = list(
            appointment_col.find(
                {
                    "patient_login_id": ObjectId(patient_login_id),
                    "hospital_login_id": ObjectId(hospital_login_id),
                }
            )
        )
        for apt in appointments:
            apt["_id"] = str(apt["_id"])
            apt["patient_login_id"] = str(apt["patient_login_id"])
            apt["hospital_login_id"] = str(apt["hospital_login_id"])
            apt["type"] = "appointment"

        # Fetch emergencies between patient and hospital
        emergencies = list(
            emergency_col.find(
                {
                    "patient_login_id": ObjectId(patient_login_id),
                    "hospital_login_id": ObjectId(hospital_login_id),
                }
            )
        )
        for emg in emergencies:
            emg["_id"] = str(emg["_id"])
            emg["patient_login_id"] = str(emg["patient_login_id"])
            emg["hospital_login_id"] = str(emg["hospital_login_id"])
            emg["type"] = "emergency"

        interactions = appointments + emergencies
        # Sort by date/created_at if possible
        interactions.sort(
            key=lambda x: x.get("appointment_date") or x.get("created_at"), reverse=True
        )

        return Response(interactions, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"error": "Failed to fetch interactions"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def update_report_status(request):
    report_id = request.data.get("report_id")
    new_status = request.data.get("status")

    if not report_id or not new_status:
        return Response(
            {"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST
        )

    db = get_db()
    report_col = db["reports"]

    try:
        report_col.update_one(
            {"_id": ObjectId(report_id)}, {"$set": {"status": new_status}}
        )
        return Response({"message": "Status updated"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"error": "Failed to update status"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
