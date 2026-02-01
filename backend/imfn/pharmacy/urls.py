from django.urls import path
from . import views

urlpatterns = [
    path('get_pharmacy_data/', views.get_pharmacy_data, name="get_pharmacy_data"),
    path('add_medicine/', views.add_medicine, name="add_medicine"),
    path('view_medicines/', views.view_medicines, name="view_medicines"),
    path('edit_medicine/', views.edit_medicine, name="edit_medicine"),
    path('delete_medicine/', views.delete_medicine, name="delete_medicine"),
]