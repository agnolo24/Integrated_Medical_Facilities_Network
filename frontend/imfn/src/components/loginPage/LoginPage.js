import React, { useState } from 'react'
import '../../asset/login_assets/style.css'
import LandingPageHeader from '../LandingPageHeader/LandingPageHeader'
import LandingPageFooter from '../LandingPageFooter/LandingPageFooter'
import axios from 'axios'
import { useNavigate } from 'react-router'

function LoginPage({ hideHeaderFooter = false }) {
    const login_url = "http://127.0.0.1:8000/api/login_function/"
    const navigate = useNavigate()

    let [data, formData] = useState({
        email: "",
        password: ""
    })

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
                                <a href="#" className="forgot-link">Forgot Password?</a>
                            </div>

                            <button type="submit" className="login-submit-btn">
                                <span>Sign In to Portal</span>
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </form>

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