# Django REST Framework (DRF) + PyMongo

login collection: email, password, usertype

patient collection: name, gender, age, contact, login_id (foreign-key style reference to login._id)


# Django REST + PyMongo backend


    pip install django djangorestframework pymongo dnspython django-cors-headers

    django-admin startproject hospital

    cd hospital

    python manage.py startapp api

# hospital/settings.py

    INSTALLED_APPS = [
        # ...
        "rest_framework",
        "corsheaders",
        "api",
    ]

    MIDDLEWARE = [
        "corsheaders.middleware.CorsMiddleware",
        # ...
    ]

    CORS_ALLOWED_ORIGINS = [
        "http://localhost:3000",
    ]

# Mongo config
    MONGO_URI = "mongodb://localhost:27017/"
    MONGO_DB_NAME = "hospital_db"



# api/mongo.py (PyMongo connection)


    from pymongo import MongoClient
    from django.conf import settings

    _client = None

    def get_db():
        global _client
        if _client is None:
            _client = MongoClient(settings.MONGO_URI)
        return _client[settings.MONGO_DB_NAME]



# api/serializers.py (validation)


    from rest_framework import serializers

    class PatientRegisterSerializer(serializers.Serializer):
        name = serializers.CharField(max_length=100)
        gender = serializers.ChoiceField(choices=["Male", "Female", "Other"])
        age = serializers.IntegerField(min_value=0, max_value=130)
        contact = serializers.CharField(max_length=20)

        email = serializers.EmailField()
        password = serializers.CharField(min_length=4, write_only=True)


# api/views.py


    from rest_framework.views import APIView
    from rest_framework.response import Response
    from rest_framework import status
    from django.contrib.auth.hashers import make_password
    from bson import ObjectId
    from datetime import datetime

    from .mongo import get_db
    from .serializers import PatientRegisterSerializer

    class PatientRegisterView(APIView):
        def post(self, request):
            serializer = PatientRegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            data = serializer.validated_data
            db = get_db()
            login_col = db["login"]
            patient_col = db["patient"]

            # 1) check email unique in login
            if login_col.find_one({"email": data["email"]}):
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 2) insert into login first
            login_doc = {
                "email": data["email"],
                "password": make_password(data["password"]),  # hashed
                "usertype": "patient",
                "created_at": datetime.utcnow()
            }

            login_id = None
            try:
                login_result = login_col.insert_one(login_doc)
                login_id = login_result.inserted_id

                # 3) insert into patient with foreign key (login_id)
                patient_doc = {
                    "login_id": login_id,
                    "name": data["name"],
                    "gender": data["gender"],
                    "age": data["age"],
                    "contact": data["contact"],
                    "created_at": datetime.utcnow()
                }
                patient_result = patient_col.insert_one(patient_doc)

                return Response({
                    "message": "Patient registered",
                    "login_id": str(login_id),
                    "patient_id": str(patient_result.inserted_id)
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                # rollback login if patient insert failed (basic atomicity)
                if login_id is not None and ObjectId.is_valid(str(login_id)):
                    login_col.delete_one({"_id": login_id})
                return Response(
                    {"error": "Registration failed", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


# api/urls.py


    from django.urls import path
    from .views import PatientRegisterView

    urlpatterns = [
        path("patients/register/", PatientRegisterView.as_view()),
    ]



# hospital/urls.py


    from django.contrib import admin
    from django.urls import path, include

    urlpatterns = [
        path("admin/", admin.site.urls),
        path("api/", include("api.urls")),
    ]



    python manage.py runserver
