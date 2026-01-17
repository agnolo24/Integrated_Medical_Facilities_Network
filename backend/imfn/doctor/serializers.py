from rest_framework import serializers

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