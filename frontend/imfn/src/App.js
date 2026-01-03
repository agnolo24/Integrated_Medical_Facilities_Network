import React from 'react'
import RegForm1 from './components/forms/userRegForm/RegForm1'
import HospitalRegForm from './components/forms/hospitalRegForm/HospitalRegForm'
import AmbulanceForm from './components/forms/AmbulanceForm/AmbulanceForm'

import DoctorRegForm from './components/forms/doctorRegForm/DoctorRegForm'

function App() {
  return (
    <div>
          <RegForm1 />
          <HospitalRegForm /> 
          <AmbulanceForm/>
          <HospitalRegForm />  
          <DoctorRegForm />
    </div>
  )
}

export default App