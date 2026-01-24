import React, { useState } from 'react'
import './ChangePassword.css'
import axios from 'axios'

export default function ChangePassword({ onClose }) {

    const [msg, setMsg] = useState("")
    const [isMsg, setIsMsg] = useState(false)

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
        if (!login_id) {
            setMsg("Login ID not found")
            setIsMsg(true)
            return
        }

        if (data.currentPassword === "") {
            setMsg("Current Password is required")
            setIsMsg(true)
            return
        }

        if (data.newPassword === "") {
            setMsg("New Password is required")
            setIsMsg(true)
            return
        }

        if (data.confirmPassword === "") {
            setMsg("Confirm Password is required")
            setIsMsg(true)
            return
        }

        if (data.newPassword !== data.confirmPassword) {
            setMsg("New Password and Confirm Password do not match")
            setIsMsg(true)
            return
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/change_password/", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,

                loginId: login_id,
            })
            console.log(response.data)
            alert("Password changed successfully!")
            setIsMsg(false)
            onClose()
        } catch (error) {
            console.log(error)
            setMsg(error?.response?.data?.error || "An Error Occurred while Changing Password")
            setIsMsg(true)
        }
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
                    {isMsg && <p className="change-password-error">{msg}</p>}
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
                        <button type="button" className="change-password-cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
