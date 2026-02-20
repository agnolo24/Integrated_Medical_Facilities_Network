from rest_framework import serializers


class EditPatientSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, required=False)
    gender = serializers.ChoiceField(
        choices=["Male", "Female", "Other"], required=False
    )
    age = serializers.IntegerField(min_value=0, max_value=130, required=False)
    dob = serializers.DateField(required=False)
    contact = serializers.CharField(max_length=20, required=False)
    patientId = serializers.CharField(max_length=100)  # To identify the patient record


class SearchSerializer(serializers.Serializer):
    """Serializer for search queries"""

    query = serializers.CharField(max_length=100, min_length=1)
    search_type = serializers.ChoiceField(
        choices=["all", "doctor", "hospital"], default="all", required=False
    )


class BookAppointmentSerializer(serializers.Serializer):
    """Serializer for booking an appointment"""

    APPOINTMENT_TYPE_CHOICES = ["online", "offline"]

    patient_login_id = serializers.CharField(max_length=100)
    doctor_id = serializers.CharField(max_length=100)
    hospital_login_id = serializers.CharField(max_length=100)
    appointment_date = serializers.DateField()
    time_slot = serializers.CharField(max_length=50)  # e.g., "10:00 AM - 11:00 AM"
    appointment_type = serializers.ChoiceField(choices=APPOINTMENT_TYPE_CHOICES)
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True)


class CancelAppointmentSerializer(serializers.Serializer):
    """Serializer for cancelling an appointment"""

    appointment_id = serializers.CharField(max_length=100)
    patient_login_id = serializers.CharField(max_length=100)


class ReportSerializer(serializers.Serializer):
    patient_login_id = serializers.CharField(max_length=100)
    hospital_login_id = serializers.CharField(max_length=100)
    report_text = serializers.CharField(max_length=1000)

