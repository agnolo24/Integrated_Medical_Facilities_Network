from django.urls import path
from . import views

urlpatterns = [
    path("getPatientData/", views.getPatientData, name="getPatientData"),
    path("edit_patient/", views.editPatient, name="editPatient"),
    path("change_password/", views.change_password, name="change_password"),
]
