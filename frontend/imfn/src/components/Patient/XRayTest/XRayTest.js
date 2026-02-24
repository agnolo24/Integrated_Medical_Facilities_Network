import React, { useState } from 'react';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientFooter from '../PatientFooter/PatientFooter';
import './XRayTest.css';

const XRayTest = () => {
    const [selectedTest, setSelectedTest] = useState('covid');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleTestChange = (test) => {
        setSelectedTest(test);
        setResult(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handlePredict = () => {
        if (!image) return;

        setLoading(true);
        // Mock prediction delay
        setTimeout(() => {
            const mockResults = {
                covid: { status: 'Negative', confidence: '98.5%' },
                tuberculosis: { status: 'Normal', confidence: '96.2%' },
                pneumonia: { status: 'Positive', confidence: '92.1%' }
            };
            setResult(mockResults[selectedTest]);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="xray-page">
            <PatientHeader />

            <section className="xray-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="xray-card">
                                <h2 className="xray-title">AI X-Ray Analysis</h2>

                                <div className="test-selection">
                                    <button
                                        className={`test-btn ${selectedTest === 'covid' ? 'active' : ''}`}
                                        onClick={() => handleTestChange('covid')}
                                    >
                                        COVID-19
                                    </button>
                                    <button
                                        className={`test-btn ${selectedTest === 'tuberculosis' ? 'active' : ''}`}
                                        onClick={() => handleTestChange('tuberculosis')}
                                    >
                                        Tuberculosis
                                    </button>
                                    <button
                                        className={`test-btn ${selectedTest === 'pneumonia' ? 'active' : ''}`}
                                        onClick={() => handleTestChange('pneumonia')}
                                    >
                                        Pneumonia
                                    </button>
                                </div>

                                <div className="upload-area" onClick={() => document.getElementById('xray-upload').click()}>
                                    <input
                                        type="file"
                                        id="xray-upload"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {preview ? (
                                        <img src={preview} alt="X-Ray Preview" className="preview-image" />
                                    ) : (
                                        <>
                                            <i className="fas fa-cloud-upload-alt upload-icon"></i>
                                            <h5>Upload X-Ray Image</h5>
                                            <p>Drag and drop or click to browse</p>
                                        </>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button
                                        className="btn-predict"
                                        disabled={!image || loading}
                                        onClick={handlePredict}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i> Analyzing...
                                            </>
                                        ) : 'Analyze X-Ray'}
                                    </button>
                                </div>

                                {result && (
                                    <div className="result-area animate__animated animate__fadeIn">
                                        <h3 className="result-title">Analysis Result</h3>
                                        <div className="result-status">
                                            Status: <span style={{ color: result.status === 'Positive' ? '#dc3545' : '#28a745' }}>{result.status}</span>
                                        </div>
                                        <div className="confidence">
                                            Confidence: {result.confidence}
                                        </div>
                                        <p className="mt-3 text-muted">* This is an AI-generated result for informational purposes only. Please consult a doctor for a professional diagnosis.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PatientFooter />
        </div>
    );
};

export default XRayTest;
