from django.urls import path
from . import views

urlpatterns = [
    path('doctor_registration/', views.doctor_registration, name='doctor_registration'),
    path('view_doctors/', views.view_doctors, name='view_doctors'),
    path('edit_doctor/', views.edit_doctor, name='edit_doctor'),
    path('delete_doctor/', views.delete_doctor, name='delete_doctor'),
    path('register_ambulance/', views.register_ambulance, name='register_ambulance'),
    path('view_ambulance/', views.view_ambulance, name='view_ambulance'),
    
]
