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


class DayScheduleSerializer(serializers.Serializer):
    """Serializer for individual day schedule - expects a list of time slot strings"""

    pass  # This is a placeholder, we validate the list in the parent serializer


class CreateScheduleSerializer(serializers.Serializer):
    """Serializer for creating doctor schedules"""

    VALID_DAYS = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ]

    doctorId = serializers.CharField(max_length=100)
    hospital_login_id = serializers.CharField(max_length=100)
    schedules = serializers.DictField(
        child=serializers.ListField(
            child=serializers.CharField(max_length=50), allow_empty=True
        )
    )

    def validate_schedules(self, value):
        """Validate that schedules contains valid day keys"""
        for day in value.keys():
            if day.lower() not in self.VALID_DAYS:
                raise serializers.ValidationError(
                    f"Invalid day: {day}. Must be one of {self.VALID_DAYS}"
                )
        return value

    def validate(self, data):
        """Validate that at least one day has schedules"""
        schedules = data.get("schedules", {})
        has_schedules = any(len(slots) > 0 for slots in schedules.values())
        if not has_schedules:
            raise serializers.ValidationError(
                {"schedules": "At least one schedule slot is required"}
            )
        return data


class GetScheduleSerializer(serializers.Serializer):
    """Serializer for getting doctor schedules"""

    doctorId = serializers.CharField(max_length=100)


class AmbulanceDutySerializer(serializers.Serializer):
    risk_level = [
        'low',
        'medium',
        'high'
    ]
    
    from_address = serializers.CharField(max_length = 100)
    to_address = serializers.CharField(max_length = 100)
    risk_level = serializers.ChoiceField(choices = risk_level)
    ambulance_id = serializers.CharField(max_length = 50)


class PharmacyRegisterSerializer(serializers.Serializer):
    hospital_login_id = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(min_length = 4, write_only = True)


class BillingRegisterSerializer(serializers.Serializer):
    hospital_login_id = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=4, write_only=True)