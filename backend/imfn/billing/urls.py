from django.urls import path
from . import views

urlpatterns = [
    path("get_billing_data/", views.get_billing_data, name="get_billing_data"),
]
