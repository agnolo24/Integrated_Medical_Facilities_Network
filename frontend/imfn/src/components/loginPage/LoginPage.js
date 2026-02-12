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
        <div>
            {!hideHeaderFooter && <LandingPageHeader />}
            <center>
                <div className='loginPage' style={hideHeaderFooter ? { padding: '20px' } : {}}>
                    <div className="login-container">
                        <div className="login-card">
                            <div className="login-header">
                                <h2>Sign In</h2>
                                <p>Enter your credentials to continue</p>
                            </div>

                            <form className="login-form" id="loginForm" noValidate onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <input type="email" id="email" name="email" required autoComplete="email" value={data.email} onChange={handleChange} />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <span className="error-message" id="emailError"></span>
                                </div>

                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <input type="password" id="password" name="password" required autoComplete="current-password" value={data.password} onChange={handleChange} />
                                        <label htmlFor="password">Password</label>
                                        <button type="button" className="password-toggle" id="passwordToggle" aria-label="Toggle password visibility">
                                            <span className="toggle-icon"></span>
                                        </button>
                                    </div>
                                    <span className="error-message" id="passwordError"></span>
                                </div>

                                <div className="form-options">
                                    <div className="remember-wrapper">
                                        <input type="checkbox" id="remember" name="remember" />
                                        <label htmlFor="remember" className="checkbox-label">
                                            <span className="checkmark"></span>
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#" className="forgot-password">Forgot password?</a>
                                </div>

                                <button type="submit" className="login-btn">
                                    <span className="btn-text">Sign In</span>
                                    <span className="btn-loader"></span>
                                </button>
                            </form>

                            <div className="signup-link">
                                <p>Don't have an account? <a href="#">Create one</a></p>
                            </div>

                            <div className="success-message" id="successMessage">
                                <div className="success-icon">✓</div>
                                <h3>Welcome back!</h3>
                                <p>Redirecting to your dashboard...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </center>

            {!hideHeaderFooter && <LandingPageFooter />}
        </div>
    )
}

export default LoginPage