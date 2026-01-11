import React, { useState } from 'react'
import '../../asset/login_assets/style.css'
import LandingPageHeader from '../LandingPageHeader/LandingPageHeader'
import LandingPageFooter from '../LandingPageFooter/LandingPageFooter'
import axios from 'axios'
import {useNavigate} from 'react-router'

function LoginPage() {
    const login_url = "http://127.0.0.1:8000/api/login_function/"
    const navigate = useNavigate()

    const [loginInfo, setLoginInfo] = useState({
        loginId: '',
        userType: ''
    })

    let [data, formData] = useState({
        email: "",
        password: ""
    })

    function handleChange(e) {
        formData({...data, [e.target.name]:e.target.value})
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const response = await axios.post(login_url, data)

            setLoginInfo({
                loginId: response.data.login_id,
                userType: response.data.user
            })

            localStorage.setItem("loginId", loginInfo.loginId)
            localStorage.setItem("userType", loginInfo.userType)

            if (loginInfo.userType === 'patient') {
                navigate('')
            } else if (loginInfo.userType === 'hospital') {
                navigate('')
            } else {
                navigate('')
            }
        } catch (error) {
            
        }
    }

    return (
        <div>
            <LandingPageHeader />
            <center>
                <div className='loginPage'>
                    <div class="login-container">
                        <div class="login-card">
                            <div class="login-header">
                                <h2>Sign In</h2>
                                <p>Enter your credentials to continue</p>
                            </div>

                            <form class="login-form" id="loginForm" novalidate onSubmit={handleSubmit}>
                                <div class="form-group">
                                    <div class="input-wrapper">
                                        <input type="email" id="email" name="email" required autocomplete="email" value={data.email} onChange={handleChange}/>
                                        <label for="email">Email</label>
                                    </div>
                                    <span class="error-message" id="emailError"></span>
                                </div>

                                <div class="form-group">
                                    <div class="input-wrapper">
                                        <input type="password" id="password" name="password" required autocomplete="current-password" value={data.password} onChange={handleChange}/>
                                        <label for="password">Password</label>
                                        <button type="button" class="password-toggle" id="passwordToggle" aria-label="Toggle password visibility">
                                            <span class="toggle-icon"></span>
                                        </button>
                                    </div>
                                    <span class="error-message" id="passwordError"></span>
                                </div>

                                <div class="form-options">
                                    <div class="remember-wrapper">
                                        <input type="checkbox" id="remember" name="remember" />
                                        <label for="remember" class="checkbox-label">
                                            <span class="checkmark"></span>
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#" class="forgot-password">Forgot password?</a>
                                </div>

                                <button type="submit" class="login-btn">
                                    <span class="btn-text">Sign In</span>
                                    <span class="btn-loader"></span>
                                </button>
                            </form>

                            <div class="signup-link">
                                <p>Don't have an account? <a href="#">Create one</a></p>
                            </div>

                            <div class="success-message" id="successMessage">
                                <div class="success-icon">✓</div>
                                <h3>Welcome back!</h3>
                                <p>Redirecting to your dashboard...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </center>

            <LandingPageFooter/>
        </div>
    )
}

export default LoginPage