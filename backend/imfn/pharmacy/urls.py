from django.urls import path
from . import views

urlpatterns = [
    path('get_pharmacy_data/',views.get_pharmacy_data,name="get_pharmacy_data"),
    
]