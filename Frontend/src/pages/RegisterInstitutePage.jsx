// frontend/src/pages/RegisterInstitutePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterInstitutePage() {
    const [formData, setFormData] = useState({
        instituteName: '',
        instituteType: 'school',
        instituteLocation: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register-institute`, formData);
            
            // Store registration data in localStorage to pass to the login page then to InstituteAdminPage
            localStorage.setItem('institute_registration_success', JSON.stringify({
                instituteId: response.data.instituteId,
                instituteName: formData.instituteName, // Pass name for display
                teacherRegistrationCode: response.data.teacherRegistrationCode,
                studentRegistrationCode: response.data.studentRegistrationCode,
                adminEmail: formData.adminEmail // Pass email for potential auto-fill hint
            }));

            // No immediate login, navigate to login page, user will log in as HOD
            alert(`Institute "${formData.instituteName}" registered successfully! Now, please log in with your admin email and password.`);
            navigate('/login', { state: { emailHint: formData.adminEmail } }); // Pass email hint
        } catch (err) {
            console.error("Frontend caught error during institute registration:", err.response?.data?.debugInfo || err);
            setError(err.response?.data?.message || err.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    // ... (rest of your component code - unchanged) ...
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Register Your Institute</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="instituteName" placeholder="Institute Name" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
                    <select name="instituteType" onChange={handleChange} value={formData.instituteType} className="w-full px-3 py-2 border rounded">
                        <option value="school">School</option>
                        <option value="college">College</option>
                    </select>
                    <input type="text" name="instituteLocation" placeholder="Location (City, State)" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
                    <hr />
                    <h3 className="text-lg font-semibold pt-2">Administrator Details</h3>
                    <input type="text" name="adminName" placeholder="Your Full Name" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
                    <input type="email" name="adminEmail" placeholder="Your Email (this will be your login)" onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
                    <input type="password" name="adminPassword" placeholder="Password (min 6 characters)" onChange={handleChange} required className="w-full px-3 py-2 border rounded" /> {/* Added min chars hint */}

                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                        {loading ? 'Registering...' : 'Register Institute'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterInstitutePage;