from rest_framework import serializers

class PatientRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    gender = serializers.ChoiceField(choices=["Male", "Female", "Other"])
    age = serializers.IntegerField(min_value=0, max_value=130)
    dob = serializers.DateField()
    contact = serializers.CharField(max_length=20)

    email = serializers.EmailField()
    password = serializers.CharField(min_length=4, write_only=True)
    

class HospitalRegistrationSerializer(serializers.Serializer):
    hospitalName = serializers.CharField(max_length = 100)
    registrationId = serializers.CharField(max_length = 30)
    hospitalAddress = serializers.CharField(max_length = 100)
    contactNumber = serializers.CharField(max_length = 20)
    
    email = serializers.EmailField()
    password = serializers.CharField(min_length = 4, write_only = True)
    
    