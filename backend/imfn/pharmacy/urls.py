from django.urls import path
from . import views

urlpatterns = [
    path('get_pharmacy_data/', views.get_pharmacy_data, name="get_pharmacy_data"),
    path('add_medicine/', views.add_medicine, name="add_medicine"),
    path('view_medicines/', views.view_medicines, name="view_medicines"),
    path('edit_medicine/', views.edit_medicine, name="edit_medicine"),
    path('delete_medicine/', views.delete_medicine, name="delete_medicine"),
    path('get_completed_appointments/', views.get_completed_appointments, name="get_completed_appointments"),
    path('get_prescription/', views.get_prescription, name="get_prescription"),
    path('update_medicine_stock/',views.update_medicine_stock,name="update_medicine_stock"),
    path('add_medicine_to_bill/',views.add_medicine_to_bill,name="add_medicine_to_bill"),
    path('get_billing_history/', views.get_billing_history, name="get_billing_history"),
    path('get_bill_history_details/', views.get_bill_history_details, name="get_bill_history_details"),
]