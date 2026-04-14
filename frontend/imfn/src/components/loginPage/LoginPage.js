import React, { useState } from 'react'
import '../../asset/login_assets/style.css'
import LandingPageHeader from '../LandingPageHeader/LandingPageHeader'
import LandingPageFooter from '../LandingPageFooter/LandingPageFooter'
import axios from 'axios'
import { useNavigate } from 'react-router'

function LoginPage({ hideHeaderFooter = false }) {
    const login_url = "http://127.0.0.1:8000/api/login_function/"
    const forgot_request_url = "http://127.0.0.1:8000/api/forgot_password_request/"
    const reset_url = "http://127.0.0.1:8000/api/reset_password_with_otp/"
    
    const navigate = useNavigate()

    const [view, setView] = useState('login') // 'login', 'forgot', 'reset'

    let [data, formData] = useState({
        email: "",
        password: ""
    })

    const [forgotEmail, setForgotEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")

    function handleChange(e) {
        formData({ ...data, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const response = await axios.post(login_url, data)

            const { login_id, user } = response.data

            localStorage.setItem("loginId", login_id)
            localStorage.setItem("userType", user)

            if (user === 'patient') {
                navigate('/patienthome')
            } else if (user === 'hospital') {
                navigate('/hospitalhome')
            } else if (user === 'doctor') {
                navigate('/doctorhome')
            } else if (user === 'ambulance') {
                navigate('/AmbulanceHome')
            } else if (user === 'admin') {
                navigate('/admin')
            } else if (user === 'pharmacy') {
                navigate('/pharmacyhome')
            } else if (user === 'billing') {
                navigate('/billinghome')
            } else {
                navigate('/login')
            }
        } catch (err) {
            if (err.response) {
                alert(err.response.data.error || "Login failed")
            } else {
                alert("Server not reachable")
            }
            console.error("Login error:", err)
        }
    }

    async function handleForgotRequest(e) {
        e.preventDefault()
        try {
            await axios.post(forgot_request_url, { email: forgotEmail })
            alert("OTP sent to your email!")
            setView('reset')
        } catch (err) {
            alert(err.response?.data?.error || "Failed to send OTP")
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault()
        try {
            await axios.post(reset_url, {
                email: forgotEmail,
                otp: otp,
                newPassword: newPassword
            })
            alert("Password reset successful! Please login with your new password.")
            setOtp("")
            setNewPassword("")
            setView('login')
        } catch (err) {
            alert(err.response?.data?.error || "Reset failed")
        }
    }

    return (
        <div className="login-wrapper">
            {!hideHeaderFooter && <LandingPageHeader />}

            <div className={`login-main-content ${hideHeaderFooter ? 'in-modal' : ''}`}>
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="login-logo-circle">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <h2>Welcome Back</h2>
                            <p>Integrated Medical Facility Network Portal</p>
                        </div>

                        {view === 'login' && (
                            <form className="login-form-modern" onSubmit={handleSubmit}>
                                <div className="modern-form-group">
                                    <label><i className="fas fa-envelope"></i> Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        value={data.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="modern-form-group">
                                    <label><i className="fas fa-lock"></i> Password</label>
                                    <div className="password-input-modern">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            required
                                            value={data.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-utilities">
                                    <label className="custom-checkbox">
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                        Remember Me
                                    </label>
                                    <span onClick={() => setView('forgot')} className="forgot-link" style={{ cursor: 'pointer' }}>Forgot Password?</span>
                                </div>

                                <button type="submit" className="login-submit-btn">
                                    <span>Sign In to Portal</span>
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </form>
                        )}

                        {view === 'forgot' && (
                            <form className="login-form-modern" onSubmit={handleForgotRequest}>
                                <div className="modern-form-group">
                                    <label><i className="fas fa-envelope"></i> Reset Password</label>
                                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Enter your email to receive a 6-digit verification code.</p>
                                    <input
                                        type="email"
                                        placeholder="Enter your registered email"
                                        required
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="login-submit-btn">
                                    <span>Send OTP</span>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                                
                                <button type="button" className="login-submit-btn" style={{ background: '#6c757d', marginTop: '10px' }} onClick={() => setView('login')}>
                                    <span>Back to Login</span>
                                </button>
                            </form>
                        )}

                        {view === 'reset' && (
                            <form className="login-form-modern" onSubmit={handleResetPassword}>
                                <div className="modern-form-group">
                                    <label><i className="fas fa-key"></i> Verify OTP</label>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        required
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>

                                <div className="modern-form-group">
                                    <label><i className="fas fa-lock"></i> New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="login-submit-btn">
                                    <span>Reset Password</span>
                                    <i className="fas fa-check-circle"></i>
                                </button>

                                <button type="button" className="login-submit-btn" style={{ background: '#6c757d', marginTop: '10px' }} onClick={() => setView('forgot')}>
                                    <span>Resend OTP</span>
                                </button>
                            </form>
                        )}

                        {/* <div className="login-divider">
                            <span>OR</span>
                        </div>

                        <div className="social-login-grid">
                            <button className="social-btn google">
                                <i className="fab fa-google"></i>
                            </button>
                            <button className="social-btn facebook">
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button className="social-btn github">
                                <i className="fab fa-github"></i>
                            </button>
                        </div>

                        <div className="login-footer">
                            <p>New to IMFN? <a href="#">Create an Account</a></p>
                        </div> */}
                    </div>
                </div>
            </div>

            {!hideHeaderFooter && <LandingPageFooter />}
        </div>
    )
}

export default LoginPage