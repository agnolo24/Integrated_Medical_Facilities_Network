from django.urls import path
from . import views

urlpatterns = [
    path("patient_register/", views.patient_register, name="patient_register"),
    path(
        "hospital_registration/",
        views.hospital_registration,
        name="hospital_registration",
    ),
    path("login_function/", views.login_function, name="login_function"),
    path("register_admin/", views.register_admin, name="register_admin"),
    path("change_password/", views.change_password, name="change_password"),
    path("forgot_password_request/", views.forgot_password_request, name="forgot_password_request"),
    path("reset_password_with_otp/", views.reset_password_with_otp, name="reset_password_with_otp"),
]
