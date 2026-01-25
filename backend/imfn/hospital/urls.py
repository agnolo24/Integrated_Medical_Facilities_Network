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
    path("assign_duty_ambulance/", views.assign_duty_ambulance, name="assign_duty_ambulance"),
]
