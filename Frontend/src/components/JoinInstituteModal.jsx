import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { getUserFriendlyError, getValidationError } from '../utils/errorMessages';
import { logUserAction, logError, logAuthEvent } from '../utils/logger';

// ============================================
// COMPONENT: JoinInstituteModal
// Modal for existing global users to join an institute
// Verifies registration code and updates user role
// ============================================

const JoinInstituteModal = ({ isOpen, onClose }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    // Handle join institute form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate code input
        if (!code || code.trim().length === 0) {
            setError(getValidationError('registration code', 'required'));
            return;
        }

        setError('');
        setSuccess(false);
        setLoading(true);

        logUserAction('Join institute attempt', { code });

        try {
            const token = await auth.currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

            // Join institute directly (for existing users)
            const res = await fetch(`${apiUrl}/api/auth/join-institute`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                logAuthEvent('Joined institute', { code, role: data.role });
                
                // Show success message then reload
                setTimeout(async () => {
                    // Force token refresh to get new claims
                    await auth.currentUser.getIdToken(true);
                    
                    // Close modal and reload page to update UI
                    onClose();
                    window.location.reload();
                }, 2000);
            } else {
                setError(data.message || 'Invalid registration code. Please check and try again.');
            }
        } catch (error) {
            logError('JoinInstituteModal', 'Join institute failed', error);
            setError(getUserFriendlyError(error, 'join'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Join Institute
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                            close
                        </span>
                    </button>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Enter the registration code provided by your institute to join as a teacher or student.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                                ✓ Successfully joined institute! Redirecting...
                            </p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Registration Code
                        </label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Enter code (e.g., ABC123)"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg font-mono tracking-wider"
                            required
                            maxLength={10}
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading || success}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !code || success}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Joining...' : success ? 'Success!' : 'Join Institute'}
                        </button>
                    </div>
                </form>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-semibold">Note:</span> You'll keep access to global challenges after joining an institute.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JoinInstituteModal;
