import React from 'react'
import RegForm1 from './components/forms/userRegForm/RegForm1'
import HospitalRegForm from './components/forms/hospitalRegForm/HospitalRegForm'
import DoctorRegForm from './components/forms/doctorRegForm/DoctorRegForm'

function App() {
  return (
    <div>
          <RegForm1 />
          <HospitalRegForm />  
          <DoctorRegForm />
    </div>
  )
}

export default App