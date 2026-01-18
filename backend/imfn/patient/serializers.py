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
