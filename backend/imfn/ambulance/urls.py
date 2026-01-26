from django.urls import path
from . import views

urlpatterns = [
    path('getAmbulanceData/', views.getAmbulanceData, name='getAmbulanceData'),
    path('get_duty/', views.get_duty, name='get_duty'),
]