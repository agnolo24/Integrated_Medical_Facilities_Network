from django.urls import path
from . import views

urlpatterns = [
    path("get_hospitals/", views.get_hospitals, name="get_hospitals"),
    path("verify_hospital/", views.verify_hospital, name="verify_hospital"),
    path(
        "get_hospital_details/", views.get_hospital_details, name="get_hospital_details"
    ),
    path("view_doctor_history/", views.view_doctor_history, name="view_doctor_history"),
    path("get_all_reports/", views.get_all_reports, name="get_all_reports"),
    path(
        "get_interactions/",
        views.get_patient_hospital_interactions,
        name="get_interactions",
    ),
    path(
        "update_report_status/", views.update_report_status, name="update_report_status"
    ),
]
