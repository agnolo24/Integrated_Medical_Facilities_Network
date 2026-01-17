from django.urls import path
from . import views

urlpatterns = [
    path('getDoctorData/',views.getDoctorData,name="getDoctorData"),
    
]