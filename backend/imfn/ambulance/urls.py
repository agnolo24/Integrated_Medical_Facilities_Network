from django.urls import path
from . import views

urlpatterns = [
    path('getAmbulanceData/', views.getAmbulanceData, name='getAmbulanceData'),
    path('get_duty/', views.get_duty, name='get_duty'),
    path('accept_duty/', views.accept_duty, name='accept_duty'),
    path('complete_duty/', views.complete_duty, name='complete_duty'),
]