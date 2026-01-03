import React from 'react'
import RegForm1 from './components/forms/userRegForm/RegForm1'
import HospitalRegForm from './components/forms/hospitalRegForm/HospitalRegForm'
import AmbulanceForm from './components/forms/AmbulanceForm/AmbulanceForm'

function App() {
  return (
    <div>
          <RegForm1 />
          <HospitalRegForm /> 
          <AmbulanceForm/>
    </div>
  )
}

export default App