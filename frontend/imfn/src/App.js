import React from 'react'
import RegForm1 from './components/forms/userRegForm/RegForm1'
import HospitalRegForm from './components/forms/hospitalRegForm/HospitalRegForm'
import AmbulanceForm from './components/forms/AmbulanceForm/AmbulanceForm'

import DoctorRegForm from './components/forms/doctorRegForm/DoctorRegForm'
import PharmacyForm from './components/forms/pharmacyRegForm/PharmacyForm'
import LandingHome from './components/landingPage/LandingHome'
import LoginPage from './components/loginPage/LoginPage'
import AdminHomePage from './components/admin/AdminDashboard/AdminDashboard'
import HospitalTable from './components/tables/hospitalTable/HospitalTable'
import { BrowserRouter, Routes, Route } from 'react-router'
import PatientHome from './components/Patient/PatientHome/PatientHome'
import HospitalHome from './components/Hospital/HospitalHome/HospitalHome'
import RegisterDoctor from './components/Hospital/ManageDoctor/RegisterDoctor/RegisterDoctor'
import ViewDoctor from './components/Hospital/ManageDoctor/ViewDoctor/ViewDoctor'
import RegisterAmbulance from './components/Hospital/ManageAmbulance/RegisterAmbulance/RegisterAmbulance'
import DoctorHome from './components/Doctor/DoctorHome/DoctorHome'
import AmbulanceHome from './components/Ambulance/AmbulanceHome/AmbulanceHome'
import AmbulanceProfile from './components/Ambulance/AmbulanceProfile/AmbulanceProfile'
import AmbulanceEditProfile from './components/Ambulance/AmbulanceEditProfile/AmbulanceEditProfile'
import ViewAmbulance from './components/Hospital/ManageAmbulance/ViewAmbulance/ViewAmbulance'
import DoctorProfile from './components/Doctor/DoctorProfile/DoctorProfile'
import SheduleDoctors from './components/Hospital/ManageDoctor/SheduleDoctors/SheduleDoctors'
import RegisterPharmacy from './components/Hospital/ManagePharmacy/RegisterPharmacy/RegisterPharmacy'
import RegisterBilling from './components/Hospital/ManageBilling/RegisterBilling/RegisterBilling'
import PharmacyHome from './components/Pharmacy/PharmacyHome/PharmacyHome'
import BillingHome from './components/Billing/BillingHome/BillingHome'
import ManageMedicine from './components/Pharmacy/ManageMedicine/ManageMedicine'
import ViewCompletedAppointments from './components/Pharmacy/ViewCompletedAppointments/ViewCompletedAppointments'
import ManageInvoices from './components/Billing/ManageInvoices/ManageInvoices'
import PharmacyHistory from './components/Pharmacy/PharmacyHistory/PharmacyHistory'

// Patient Module Components
import FindDoctors from './components/Patient/FindDoctors/FindDoctors'
import BookAppointment from './components/Patient/BookAppointment/BookAppointment'
import HospitalDetails from './components/Patient/HospitalDetails/HospitalDetails'
import ViewAppointments from './components/Patient/ViewAppointments/ViewAppointments'

//Doctor Module Components
import ViewPatientAppointments from './components/Doctor/ManagePatient/ViewPatientAppointments/ViewPatientAppointments'
import DoctorAppointmentHistory from './components/admin/AdminDashboard/DoctorAppointmentHistory'
import HospitalDetailsPage from './components/admin/AdminDashboard/HospitalDetailsPage'
import PatientMedicalHistory from './components/Patient/PatientMedicalHistory/PatientMedicalHistory'
import MeetingRoom from './components/MeetingRoom/MeetingRoom'
import MyReports from './components/Patient/MyReports/MyReports'
import ManageReports from './components/admin/ManageReports/ManageReports'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingHome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/hospital/:id" element={<HospitalDetailsPage />} />
          <Route path="/manageReports" element={<ManageReports />} />
          <Route path="/doctorAppointmentHistory" element={<DoctorAppointmentHistory />} />
          <Route path="/hospitalTable" element={<HospitalTable />} />
          <Route path="/hospitalReg" element={<HospitalRegForm />} />
          <Route path="/ambulance" element={<AmbulanceForm />} />
          <Route path="/doctorReg" element={<DoctorRegForm />} />
          <Route path="/pharmacy" element={<PharmacyForm />} />
          <Route path="/userReg" element={<RegForm1 />} />
          <Route path="/patienthome" element={<PatientHome />} />
          <Route path="/myReports" element={<MyReports />} />
          <Route path="/hospitalhome" element={<HospitalHome />} />
          <Route path='/registerDoctor' element={<RegisterDoctor />} />
          <Route path='/viewDoctors' element={<ViewDoctor />} />
          <Route path='/RegAmbulance' element={<RegisterAmbulance />} />
          <Route path='/viewAmbulance' element={<ViewAmbulance />} />
          <Route path='/doctorHome' element={<DoctorHome />} />
          <Route path='/AmbulanceHome' element={<AmbulanceHome />} />
          <Route path='/DoctorProfile' element={<DoctorProfile />} />
          <Route path='/AmbulanceProfile' element={<AmbulanceProfile />} />
          <Route path='/AmbulanceEditProfile' element={<AmbulanceEditProfile />} />
          <Route path='/scheduleDoctor' element={<SheduleDoctors />} />
          <Route path='/registerPharmacy' element={<RegisterPharmacy />} />
          <Route path='/registerBilling' element={<RegisterBilling />} />
          <Route path='/findDoctors' element={<FindDoctors />} />
          <Route path='/bookAppointment' element={<BookAppointment />} />
          <Route path='/hospitalDetails' element={<HospitalDetails />} />
          <Route path='/viewAppointments' element={<ViewAppointments />} />
          <Route path='/viewPatientAppointments' element={<ViewPatientAppointments />} />
          <Route path='/PatientMedicalHistory' element={<PatientMedicalHistory />} />
          <Route path='/pharmacyHome' element={<PharmacyHome />} />
          <Route path='/manageMedicine' element={<ManageMedicine />} />
          <Route path='/viewCompletedAppointments' element={<ViewCompletedAppointments />} />
          <Route path='/pharmacyHistory' element={<PharmacyHistory />} />
          <Route path='/billinghome' element={<BillingHome />} />
          <Route path='/manageInvoices' element={<ManageInvoices />} />
          <Route path='/PatientMedicalHistory' element={<PatientMedicalHistory />} />
          <Route path='/meeting/:appointmentId' element={<MeetingRoom />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App
