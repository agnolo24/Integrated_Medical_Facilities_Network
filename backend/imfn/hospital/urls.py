from django.urls import path
from . import views

urlpatterns = [
    path('doctor_registration/', views.doctor_registration, name='doctor_registration'),
    path('view_doctors/', views.view_doctors, name='view_doctors'),
    
]
