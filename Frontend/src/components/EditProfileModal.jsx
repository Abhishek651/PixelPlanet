import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db, storage } from '../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getUserLocation } from '../utils/locationService';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { currentUser, refreshAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('basic');
    
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        gender: '',
        city: '',
        country: '',
        photoURL: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [detectingLocation, setDetectingLocation] = useState(false);

    useEffect(() => {
        if (currentUser && isOpen) {
            loadUserData();
        }
    }, [currentUser, isOpen]);

    const loadUserData = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            const userData = userDoc.data();
            
            setFormData({
                displayName: currentUser.displayName || '',
                email: currentUser.email || '',
                gender: userData?.gender || '',
                city: userData?.city || '',
                country: userData?.country || '',
                photoURL: currentUser.photoURL || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setImagePreview(currentUser.photoURL || '');
        } catch (err) {
            console.error('Error loading user data:', err);
        }
    };

    const handleDetectLocation = async () => {
        setDetectingLocation(true);
        setError('');
        
        try {
            const location = await getUserLocation();
            if (location) {
                setFormData({
                    ...formData,
                    city: location.city,
                    country: location.country
                });
                setSuccess('Location detected successfully!');
                setTimeout(() => setSuccess(''), 2000);
            }
        } catch (err) {
            setError(err.message || 'Failed to detect location. Please enter manually.');
        } finally {
            setDetectingLocation(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.photoURL;
        
        try {
            const storageRef = ref(storage, `profile-images/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (err) {
            console.error('Error uploading image:', err);
            throw new Error('Failed to upload image');
        }
    };

    const handleBasicInfoUpdate = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Upload image if changed
            let photoURL = formData.photoURL;
            if (imageFile) {
                photoURL = await uploadImage();
            }

            // Update Firebase Auth profile
            await updateProfile(currentUser, {
                displayName: formData.displayName,
                photoURL: photoURL
            });

            // Update Firestore user document
            await updateDoc(doc(db, 'users', currentUser.uid), {
                name: formData.displayName,
                gender: formData.gender,
                city: formData.city,
                country: formData.country,
                photoURL: photoURL,
                updatedAt: new Date().toISOString()
            });

            await refreshAuth();
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailUpdate = async () => {
        if (!formData.currentPassword) {
            setError('Please enter your current password to change email');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Reauthenticate user
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                formData.currentPassword
            );
            await reauthenticateWithCredential(currentUser, credential);

            // Update email
            await updateEmail(currentUser, formData.email);
            
            // Update Firestore
            await updateDoc(doc(db, 'users', currentUser.uid), {
                email: formData.email,
                updatedAt: new Date().toISOString()
            });

            await refreshAuth();
            setSuccess('Email updated successfully!');
            setFormData({ ...formData, currentPassword: '' });
        } catch (err) {
            console.error('Error updating email:', err);
            if (err.code === 'auth/wrong-password') {
                setError('Incorrect password');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Email already in use');
            } else {
                setError(err.message || 'Failed to update email');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!formData.currentPassword) {
            setError('Please enter your current password');
            return;
        }
        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Reauthenticate user
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                formData.currentPassword
            );
            await reauthenticateWithCredential(currentUser, credential);

            // Update password
            await updatePassword(currentUser, formData.newPassword);

            setSuccess('Password updated successfully!');
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Error updating password:', err);
            if (err.code === 'auth/wrong-password') {
                setError('Incorrect current password');
            } else {
                setError(err.message || 'Failed to update password');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`flex-1 py-3 px-4 font-medium transition-colors ${
                                activeTab === 'basic'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Basic Info
                        </button>
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 py-3 px-4 font-medium transition-colors ${
                                activeTab === 'email'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Email
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 py-3 px-4 font-medium transition-colors ${
                                activeTab === 'password'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Password
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                {/* Profile Image */}
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-6xl text-gray-400">person</span>
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Click camera icon to change photo</p>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                        placeholder="Your name"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                            placeholder="City"
                                        />
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                            placeholder="Country"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDetectLocation}
                                        disabled={detectingLocation}
                                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">location_on</span>
                                        {detectingLocation ? 'Detecting...' : 'Auto-Detect My Location'}
                                    </button>
                                </div>

                                <button
                                    onClick={handleBasicInfoUpdate}
                                    disabled={loading}
                                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                                >
                                    {loading ? 'Updating...' : 'Update Basic Info'}
                                </button>
                            </div>
                        )}

                        {/* Email Tab */}
                        {activeTab === 'email' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                        placeholder="new.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password (required)
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <button
                                    onClick={handleEmailUpdate}
                                    disabled={loading}
                                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                                >
                                    {loading ? 'Updating...' : 'Update Email'}
                                </button>
                            </div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                        placeholder="Enter new password (min 6 characters)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                                        placeholder="Confirm new password"
                                    />
                                </div>

                                <button
                                    onClick={handlePasswordUpdate}
                                    disabled={loading}
                                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        )}

                        {/* Error/Success Messages */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm"
                            >
                                {success}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditProfileModal;
