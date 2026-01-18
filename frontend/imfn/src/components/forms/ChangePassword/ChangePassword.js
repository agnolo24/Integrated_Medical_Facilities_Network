import React, { useState } from 'react'
import './ChangePassword.css'
import axios from 'axios'

export default function ChangePassword({ onClose }) {

    const [data, setData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        loginId: "",
    })

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        const login_id = localStorage.getItem("loginId");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/change_password/", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,

                loginId: login_id,
            })
            console.log(response.data)
            alert("Password changed successfully!")
            onClose()
        } catch (error) {
            console.log(error)
            alert(error?.response?.data?.error || "An Error Occurred while Changing Password")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(data)
    }

    return (
        <div className="change-password-overlay" onClick={onClose}>
            <div className="change-password-container">
                <div className="change-password-card" onClick={(e) => e.stopPropagation()}>
                    <button className="change-password-close-btn" onClick={onClose}>&times;</button>
                    <div className="change-password-header">
                        <h2>Change Password</h2>
                        <p>Enter your new password details</p>
                    </div>

                    <form className="change-password-form" onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <div className="change-password-input-wrapper">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    required
                                    value={data.currentPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="change-password-input-wrapper">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    value={data.newPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="change-password-input-wrapper">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="change-password-btn">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
