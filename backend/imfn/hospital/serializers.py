from rest_framework import serializers


class DoctorRegistrationSerializer(serializers.Serializer):
    specialization_choice = [
        "Cardiology",
        "Dermatology",
        "Endocrinology",
        "Gastroenterology",
        "General Medicine",
        "General Surgery",
        "Gynecology",
        "Hematology",
        "Neurology",
        "Obstetrics",
        "Oncology",
        "Ophthalmology",
        "Orthopedics",
        "Otolaryngology (ENT)",
        "Pediatrics",
        "Psychiatry",
        "Pulmonology",
        "Radiology",
        "Urology",
    ]

    qualification_choice = [
        "MBBS",
        "MD (Doctor of Medicine)",
        "MS (Master of Surgery)",
        "DNB (Diplomate of National Board)",
        "DM (Doctorate of Medicine)",
        "MCh (Master of Chirurgiae)",
        "BDS (Bachelor of Dental Surgery)",
        "MDS (Master of Dental Surgery)",
        "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
        "BHMS (Bachelor of Homeopathic Medicine and Surgery)",
        "BUMS (Bachelor of Unani Medicine and Surgery)",
        "BVSc & AH (Bachelor of Veterinary Science and Animal Husbandry)",
        "BPT (Bachelor of Physiotherapy)",
    ]
    hospital_login_id = serializers.CharField(max_length=50)
    name = serializers.CharField(max_length=30)
    gender = serializers.ChoiceField(choices=["Male", "Female", "other"])
    specialization = serializers.ChoiceField(choices=specialization_choice)
    dob = serializers.DateField()
    qualification = serializers.ChoiceField(choices=qualification_choice)
    experience = serializers.IntegerField()
    contactNumber = serializers.CharField(max_length=20)
    email = serializers.EmailField()


class EditDoctorSerializer(serializers.Serializer):
    specialization_choice = [
        "Cardiology",
        "Dermatology",
        "Endocrinology",
        "Gastroenterology",
        "General Medicine",
        "General Surgery",
        "Gynecology",
        "Hematology",
        "Neurology",
        "Obstetrics",
        "Oncology",
        "Ophthalmology",
        "Orthopedics",
        "Otolaryngology (ENT)",
        "Pediatrics",
        "Psychiatry",
        "Pulmonology",
        "Radiology",
        "Urology",
    ]

    qualification_choice = [
        "MBBS",
        "MD (Doctor of Medicine)",
        "MS (Master of Surgery)",
        "DNB (Diplomate of National Board)",
        "DM (Doctorate of Medicine)",
        "MCh (Master of Chirurgiae)",
        "BDS (Bachelor of Dental Surgery)",
        "MDS (Master of Dental Surgery)",
        "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
        "BHMS (Bachelor of Homeopathic Medicine and Surgery)",
        "BUMS (Bachelor of Unani Medicine and Surgery)",
        "BVSc & AH (Bachelor of Veterinary Science and Animal Husbandry)",
        "BPT (Bachelor of Physiotherapy)",
    ]
    name = serializers.CharField(max_length=30)
    gender = serializers.ChoiceField(choices=["Male", "Female", "other"])
    specialization = serializers.ChoiceField(choices=specialization_choice)
    qualification = serializers.ChoiceField(choices=qualification_choice)
    experience = serializers.IntegerField()
    contactNumber = serializers.CharField(max_length=20)
    hospital_login_id = serializers.CharField(max_length=100)
    doctorId = serializers.CharField(max_length=100)


class AmbulanceRegistrationSerializer(serializers.Serializer):
    ambulance_choices = ["bls", "als", "micu", "icu"]

    category_choice = [
        "Category 1: Life-threatening emergencies",
        "Category 2: Emergency calls",
        "Category 3: Urgent problems",
        "Category 4: Non-urgent problems",
    ]

    hospital_login_id = serializers.CharField(max_length=50)
    name = serializers.CharField(max_length=30)
    ambulanceType = serializers.ChoiceField(choices=ambulance_choices)
    vehicleNumber = serializers.CharField(max_length=20)
    category = serializers.ChoiceField(choices=category_choice)
    contactNumber = serializers.CharField(max_length=20)
    email = serializers.EmailField()


class AmbulanceUpdateSerializer(serializers.Serializer):
    ambulance_choices = ["bls", "als", "micu", "icu"]

    category_choice = [
        "Category 1: Life-threatening emergencies",
        "Category 2: Emergency calls",
        "Category 3: Urgent problems",
        "Category 4: Non-urgent problems",
    ]
    name = serializers.CharField(max_length=30)
    ambulanceType = serializers.ChoiceField(choices=ambulance_choices)
    vehicleNumber = serializers.CharField(max_length=20)
    category = serializers.ChoiceField(choices=category_choice)
    contactNumber = serializers.CharField(max_length=20)


class AmbulanceDeleteSerializer(serializers.Serializer):
    ambulanceId = serializers.CharField(max_length=100)


class EditHospitalSerializer(serializers.Serializer):
    hospitalName = serializers.CharField(max_length=100)
    registrationId = serializers.CharField(max_length=50)
    hospitalAddress = serializers.CharField(max_length=200)
    contactNumber = serializers.CharField(max_length=20)
    hospitalId = serializers.CharField(max_length=100)
