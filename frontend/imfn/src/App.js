import React from 'react'
import RegForm1 from './components/forms/userRegForm/RegForm1'
import HospitalRegForm from './components/forms/hospitalRegForm/HospitalRegForm'
import AmbulanceForm from './components/forms/AmbulanceForm/AmbulanceForm'

import DoctorRegForm from './components/forms/doctorRegForm/DoctorRegForm'
import PharmacyForm from './components/forms/pharmacyRegForm/PharmacyForm'
import LandingHome from './components/landingPage/LandingHome'
import LoginPage from './components/loginPage/LoginPage'
import AdminHomePage from './components/adminHomePage/AdminHomePage'
import HospitalTable from './components/tables/hospitalTable/HospitalTable'


function App() {
  return (
    <div>
      {/* <RegForm1 />
      <HospitalRegForm />
      <AmbulanceForm />
      <DoctorRegForm />
      <PharmacyForm /> */}
      {/* <LandingHome/>
      <LoginPage/> */}
      {/* <AdminHomePage /> */}
      <HospitalTable />
    </div>
  )
}

export default App