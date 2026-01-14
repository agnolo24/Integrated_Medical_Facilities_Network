import React from 'react'
import DoctorRegForm from '../../../forms/doctorRegForm/DoctorRegForm'
import HospitalHeader from '../../HospitalHeader/HospitalHeader'
import HospitalFooter from '../../HospitalFooter/HospitalFooter'

function RegisterDoctor() {
    return (
        <div>
            <HospitalHeader/>
            <DoctorRegForm />
            <HospitalFooter/>
        </div>
    )
}

export default RegisterDoctor
