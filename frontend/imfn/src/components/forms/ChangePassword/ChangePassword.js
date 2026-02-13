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
            setMsg("Passwords do not match")
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
            alert("Password updated successfully!")
            setIsMsg(false)
            onClose()
        } catch (error) {
            console.log(error)
            setMsg(error?.response?.data?.error || "Failed to update password")
            setIsMsg(true)
        }
    }

    return (
        <div className="change-password-overlay" onClick={onClose}>
            <div className="change-password-container">
                <div className="change-password-card" onClick={(e) => e.stopPropagation()}>
                    <button className="change-password-close-btn" onClick={onClose}>&times;</button>

                    <div className="cp-header-banner">
                        <h2>Security Protocol</h2>
                        <p>Protect your account with a strong password</p>
                    </div>

                    <div className="cp-form-body">
                        {isMsg && (
                            <div className="change-password-error">
                                <i className="fas fa-exclamation-circle"></i> {msg}
                            </div>
                        )}

                        <form className="change-password-form" onSubmit={handlePasswordChange}>
                            <div className="cp-input-group">
                                <label><i className="fas fa-lock-open"></i> Current Password</label>
                                <input
                                    type="password"
                                    className="cp-input"
                                    name="currentPassword"
                                    placeholder="••••••••"
                                    required
                                    value={data.currentPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="cp-input-group">
                                <label><i className="fas fa-shield-alt"></i> New Password</label>
                                <input
                                    type="password"
                                    className="cp-input"
                                    name="newPassword"
                                    placeholder="At least 8 characters"
                                    required
                                    value={data.newPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="cp-input-group">
                                <label><i className="fas fa-check-double"></i> Confirm New Password</label>
                                <input
                                    type="password"
                                    className="cp-input"
                                    name="confirmPassword"
                                    placeholder="Re-type new password"
                                    required
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="cp-actions">
                                <button type="submit" className="btn-cp change-password-btn">
                                    <i className="fas fa-key"></i> Update Security Key
                                </button>
                                <button type="button" className="btn-cp change-password-cancel-btn" onClick={onClose}>
                                    Discard Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
