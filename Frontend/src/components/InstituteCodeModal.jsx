// frontend/src/components/InstituteCodeModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function InstituteCodeModal({ isOpen, onClose }) {
    const [instituteCode, setInstituteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!instituteCode) { // Only check for instituteCode
            setError('Please enter the institute code.');
            setLoading(false);
            return;
        }

        try {
            // Send only the code to the backend
            const response = await api.post('/api/auth/verify-institute-code', {
                code: instituteCode,
            });

            const { instituteId, instituteName, role: inferredRole } = response; // Destructure inferredRole
            console.log("Code verified:", response);

            // Close the modal and navigate to the dynamic JoinInstitutePage
            onClose(); // Close the modal
            navigate(`/join-institute/${instituteId}/${inferredRole}`, { // Use inferredRole
                state: { instituteName: instituteName } // Pass instituteName via state
            });

        } catch (err) {
            console.error("Code verification failed:", err.response?.data?.debugInfo || err);
            setError(err.response?.data?.message || err.message || 'Failed to verify institute code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>

                <h2 className="text-3xl font-bold text-purple-700 mb-4 text-center">Join Your Institute</h2>
                <p className="text-gray-600 mb-6 text-center">Enter your institute's registration code.</p>

                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleVerifyCode} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Institute Registration Code"
                        value={instituteCode}
                        onChange={(e) => setInstituteCode(e.target.value.toUpperCase())}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="w-full py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default InstituteCodeModal;