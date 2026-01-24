from unicodedata import name
from django.urls import path
from . import views

urlpatterns = [
    path('getDoctorData/',views.getDoctorData,name="getDoctorData"),
    path('get_patient_appointment/',views.get_patient_appointment,name= "get_patient_appointment"),
    path('get_patient_appointment_details/',views.get_patient_appointment_details,name= "get_patient_appointment_details"),
    
]