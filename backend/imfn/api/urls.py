from django.urls import path
from . import views

urlpatterns = [
    path('patient_register/', views.patient_register, name='patient_register'),
    path('hospital_registration/', views.hospital_registration, name='hospital_registration'),
    path('login_function/', views.login_function, name='login_function'),
]
