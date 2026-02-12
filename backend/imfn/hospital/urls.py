from django.urls import path
from . import views

urlpatterns = [
    path("doctor_registration/", views.doctor_registration, name="doctor_registration"),
    path("view_doctors/", views.view_doctors, name="view_doctors"),
    path("edit_doctor/", views.edit_doctor, name="edit_doctor"),
    path("delete_doctor/", views.delete_doctor, name="delete_doctor"),
    path("register_ambulance/", views.register_ambulance, name="register_ambulance"),
    path("view_ambulance/", views.view_ambulance, name="view_ambulance"),
    path("edit_ambulance/", views.edit_ambulance, name="edit_ambulance"),
    path("delete_ambulance/", views.delete_ambulance, name="delete_ambulance"),
    path("getHospitalData/", views.getHospitalData, name="getHospitalData"),
    path("editHospital/", views.editHospital, name="editHospital"),
    path(
        "change_hospital_password/",
        views.change_hospital_password,
        name="change_hospital_password",
    ),
    # Schedule management endpoints
    path("create_schedule/", views.create_schedule, name="create_schedule"),
    path("get_schedule/", views.get_schedule, name="get_schedule"),
    path(
        "assign_duty_ambulance/",
        views.assign_duty_ambulance,
        name="assign_duty_ambulance",
    ),
    path(
        "get_pending_emergencies/",
        views.get_pending_emergencies,
        name="get_pending_emergencies",
    ),
    path(
        "respond_to_emergency/", views.respond_to_emergency, name="respond_to_emergency"
    ),
    path(
        "get_available_ambulances/",
        views.get_available_ambulances,
        name="get_available_ambulances",
    ),
    path(
        "assign_emergency_to_ambulance/",
        views.assign_emergency_to_ambulance,
        name="assign_emergency_to_ambulance",
    ),
    path("register_pharmacy/", views.register_pharmacy, name="register_pharmacy"),
    path("check_pharmacy_exist/", views.check_pharmacy_exist, name="check_pharmacy_exist"),
    path("register_billing/", views.register_billing, name="register_billing"),
    path("check_billing_exist/", views.check_billing_exist, name="check_billing_exist"),
]

