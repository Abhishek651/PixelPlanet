import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const PendingApprovalScreen = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-yellow-600 dark:text-yellow-400">
                        pending
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    Account Pending Approval
                </h1>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Your teacher account has been created successfully! However, it needs to be approved by your institute's HOD or administrator before you can access all features.
                </p>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">
                            info
                        </span>
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                What happens next?
                            </h3>
                            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Your HOD/Admin will review your account</li>
                                <li>• You'll receive an email once approved</li>
                                <li>• You can then log in and access all features</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    If you have any questions, please contact your institute administrator.
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={async () => {
                            // Force refresh the auth token and reload
                            try {
                                const { auth } = await import('../services/firebase');
                                if (auth.currentUser) {
                                    await auth.currentUser.getIdToken(true); // Force refresh token
                                }
                            } catch (error) {
                                console.error('Error refreshing token:', error);
                            }
                            window.location.reload();
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        Check Approval Status
                    </button>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        This is a security measure to ensure only authorized teachers can access the platform.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalScreen;
