from django.urls import path
from . import views

urlpatterns = [
    path("get_billing_data/", views.get_billing_data, name="get_billing_data"),
    path("get_all_invoices/", views.get_all_invoices, name="get_all_invoices"),
    path("get_invoice_details/", views.get_invoice_details, name="get_invoice_details"),
    path("update_invoice_status/", views.update_invoice_status, name="update_invoice_status"),
    path("add_other_charges/", views.add_other_charges, name="add_other_charges"),
]
