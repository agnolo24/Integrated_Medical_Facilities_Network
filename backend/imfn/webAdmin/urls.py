from django.urls import path
from . import views

urlpatterns = [
    path("get_hospitals/", views.get_hospitals, name="get_hospitals"),
    path("verify_hospital/", views.verify_hospital, name="verify_hospital"),
    path(
        "get_hospital_details/", views.get_hospital_details, name="get_hospital_details"
    ),
]
