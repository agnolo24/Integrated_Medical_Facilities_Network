from django.urls import path
from . import views

urlpatterns = [
    # Patient profile management
    path("getPatientData/", views.getPatientData, name="getPatientData"),
    path("edit_patient/", views.editPatient, name="editPatient"),
    path("change_password/", views.change_password, name="change_password"),
    # Search functionality
    path("search/", views.search, name="search"),
    # Hospital and doctor info
    path("hospital_doctors/", views.get_hospital_doctors, name="hospital_doctors"),
    path("doctor_details/", views.get_doctor_details, name="doctor_details"),
    path("available_slots/", views.get_available_slots, name="available_slots"),
    # Appointment management
    path("book_appointment/", views.book_appointment, name="book_appointment"),
    path("appointments/", views.get_appointments, name="get_appointments"),
    path("cancel_appointment/", views.cancel_appointment, name="cancel_appointment"),
    # Emergency functionality
    path("getNearestHospital/", views.getNearestHospital, name="getNearestHospital"),
    path("get_patient_med_history/", views.get_patient_med_history, name='get_patient_med_history'),
    path('get_portal_data/', views.get_portal_data, name='get_portal_data'),
    path('get_emergency_details/', views.get_emergency_details, name='get_emergency_details'),
]
