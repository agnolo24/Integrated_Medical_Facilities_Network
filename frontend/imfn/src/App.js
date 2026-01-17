import React from 'react'
import RegForm1 from './components/forms/userRegForm/RegForm1'
import HospitalRegForm from './components/forms/hospitalRegForm/HospitalRegForm'
import AmbulanceForm from './components/forms/AmbulanceForm/AmbulanceForm'

import DoctorRegForm from './components/forms/doctorRegForm/DoctorRegForm'
import PharmacyForm from './components/forms/pharmacyRegForm/PharmacyForm'
import LandingHome from './components/landingPage/LandingHome'
import LoginPage from './components/loginPage/LoginPage'
import AdminHomePage from './components/admin/adminHomePage/AdminHomePage'
import HospitalTable from './components/tables/hospitalTable/HospitalTable'
import { BrowserRouter, Routes, Route } from 'react-router'
import PatientHome from './components/Patient/PatientHome/PatientHome'
import HospitalHome from './components/Hospital/HospitalHome/HospitalHome'
import RegisterDoctor from './components/Hospital/ManageDoctor/RegisterDoctor/RegisterDoctor'
import ViewDoctor from './components/Hospital/ManageDoctor/ViewDoctor/ViewDoctor'
import RegisterAmbulance from './components/Hospital/ManageAmbulance/RegisterAmbulance/RegisterAmbulance'


function App() {
  return (
    <div>
      {/* <RegForm1 />
      <HospitalRegForm />
      <AmbulanceForm />
      <DoctorRegForm />
      <PharmacyForm />
      <LandingHome/>
      <LoginPage/>
      <AdminHomePage />
      <HospitalTable /> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingHome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/hospitalTable" element={<HospitalTable />} />
          <Route path="/hospitalReg" element={<HospitalRegForm />} />
          <Route path="/ambulance" element={<AmbulanceForm />} />
          <Route path="/doctorReg" element={<DoctorRegForm />} />
          <Route path="/pharmacy" element={<PharmacyForm />} />
          <Route path="/userReg" element={<RegForm1 />} />
          <Route path="/patienthome" element={<PatientHome />} />
          <Route path="/hospitalhome" element={<HospitalHome />} />
          <Route path='/registerDoctor' element={<RegisterDoctor />} />
          <Route path='/viewDoctors' element={<ViewDoctor />} />
          <Route path='/RegAmbulance' element={<RegisterAmbulance/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App