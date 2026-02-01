from django.urls import path
from . import views

urlpatterns = [
    path('getDoctorData/',views.getDoctorData,name="getDoctorData"),
    path('get_patient_appointment/',views.get_patient_appointment,name= "get_patient_appointment"),
    path('get_patient_appointment_details/',views.get_patient_appointment_details,name= "get_patient_appointment_details"),
    path('check_history_code/',views.check_history_code,name= "check_history_code"),
    path('add_prescription_by_doctor/',views.add_prescription_by_doctor,name= "add_prescription_by_doctor"),
    path('get_prescription_data/',views.get_prescription_data,name="get_prescription_data"),
    path('set_appointment_complete/',views.set_appointment_complete,name="set_appointment_complete"),
    path('get_patient_history/',views.get_patient_history,name="get_patient_history"),
    
]