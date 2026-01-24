import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import PatientHeader from '../PatientHeader/PatientHeader'
import PatientFooter from '../PatientFooter/PatientFooter'
import './FindDoctors.css'

function FindDoctors() {
    const navigate = useNavigate()
    const searchUrl = "http://127.0.0.1:8000/patient/search/"

    const [searchQuery, setSearchQuery] = useState('')
    const [searchType, setSearchType] = useState('all')
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Debounce search
    const debounce = (func, delay) => {
        let timeoutId
        return (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func(...args), delay)
        }
    }

    const performSearch = async (query) => {
        if (!query || query.length < 1) {
            setResults([])
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.get(`${searchUrl}?q=${encodeURIComponent(query)}&type=${searchType}`)
            setResults(response.data.results || [])
            setShowSuggestions(true)
        } catch (error) {
            console.error("Search error:", error)
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce(performSearch, 300), [searchType])

    useEffect(() => {
        debouncedSearch(searchQuery)
    }, [searchQuery, debouncedSearch])

    const handleResultClick = (result) => {
        setShowSuggestions(false)
        if (result.type === 'doctor') {
            navigate('/bookAppointment', {
                state: {
                    doctorId: result._id,
                    hospitalLoginId: result.hospital_login_id
                }
            })
        } else if (result.type === 'hospital') {
            navigate('/hospitalDetails', {
                state: {
                    hospitalLoginId: result.login_id
                }
            })
        }
    }

    return (
        <div className="find-doctors-page">
            <PatientHeader />

            <div className="find-doctors-container">
                <div className="search-hero">
                    <h1>Find Your Doctor</h1>
                    <p>Search for doctors by name, specialization, or hospital</p>

                    <div className="search-box-container">
                        <div className="search-filters">
                            <button
                                className={`filter-btn ${searchType === 'all' ? 'active' : ''}`}
                                onClick={() => setSearchType('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${searchType === 'doctor' ? 'active' : ''}`}
                                onClick={() => setSearchType('doctor')}
                            >
                                Doctors
                            </button>
                            <button
                                className={`filter-btn ${searchType === 'hospital' ? 'active' : ''}`}
                                onClick={() => setSearchType('hospital')}
                            >
                                Hospitals
                            </button>
                        </div>

                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search doctors, hospitals, or specializations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => results.length > 0 && setShowSuggestions(true)}
                            />
                            {isLoading && <div className="search-spinner"></div>}
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && results.length > 0 && (
                            <div className="suggestions-dropdown">
                                {results.map((result, index) => (
                                    <div
                                        key={`${result.type}-${result._id}-${index}`}
                                        className={`suggestion-item ${result.type}`}
                                        onClick={() => handleResultClick(result)}
                                    >
                                        <div className="suggestion-icon">
                                            {result.type === 'doctor' ? '👨‍⚕️' : '🏥'}
                                        </div>
                                        <div className="suggestion-content">
                                            <div className="suggestion-name">
                                                {result.type === 'doctor' ? `Dr. ${result.name}` : result.name}
                                            </div>
                                            <div className="suggestion-detail">
                                                {result.type === 'doctor'
                                                    ? `${result.specialization} • ${result.hospital_name}`
                                                    : result.address
                                                }
                                            </div>
                                        </div>
                                        <div className="suggestion-type-badge">
                                            {result.type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showSuggestions && searchQuery && results.length === 0 && !isLoading && (
                            <div className="suggestions-dropdown">
                                <div className="no-results">
                                    No results found for "{searchQuery}"
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Quick Search by Specialization</h2>
                    <div className="specialization-grid">
                        {[
                            { name: 'Cardiology', icon: '❤️' },
                            { name: 'Dermatology', icon: '🧴' },
                            { name: 'Pediatrics', icon: '👶' },
                            { name: 'Orthopedics', icon: '🦴' },
                            { name: 'Neurology', icon: '🧠' },
                            { name: 'General Medicine', icon: '🩺' },
                            { name: 'Gynecology', icon: '👩' },
                            { name: 'Ophthalmology', icon: '👁️' }
                        ].map((spec, index) => (
                            <div
                                key={index}
                                className="specialization-card"
                                onClick={() => {
                                    setSearchType('doctor')
                                    setSearchQuery(spec.name)
                                }}
                            >
                                <span className="spec-icon">{spec.icon}</span>
                                <span className="spec-name">{spec.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <PatientFooter />
        </div>
    )
}

export default FindDoctors
