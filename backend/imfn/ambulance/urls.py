from django.urls import path
from . import views

urlpatterns = [
    path('getAmbulanceData/', views.getAmbulanceData, name='getAmbulanceData'),
]