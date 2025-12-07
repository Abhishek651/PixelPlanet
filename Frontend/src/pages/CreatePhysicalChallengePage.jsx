// ============================================
// PAGE: CreatePhysicalChallengePage
// Form for creating physical eco-challenges
// Supports both global and institute challenges
// ============================================

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getUserFriendlyError, getValidationError } from '../utils/errorMessages';
import { logUserAction, logError, logApiRequest, logApiResponse } from '../utils/logger';
import { DateTimePicker } from '../components/base/DatePicker';

const CreatePhysicalChallengePage = () => {
    const navigate = useNavigate();
    const { currentUser, userRole } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [expiryDate, setExpiryDate] = useState('');
    const [rewardPoints, setRewardPoints] = useState(100);
    const [isGlobal, setIsGlobal] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const classes = [
        { id: '1', name: 'Class A' },
        { id: '2', name: 'Class B' },
        { id: '3', name: 'Class C' },
    ];

    // Handle class selection
    const handleClassChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedClasses(values);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate user authentication
        if (!currentUser) {
            setError('You must be logged in to create a challenge.');
            return;
        }

        // Validate required fields
        if (!title.trim()) {
            setError(getValidationError('title', 'required'));
            return;
        }
        if (!description.trim()) {
            setError(getValidationError('description', 'required'));
            return;
        }
        if (!expiryDate) {
            setError(getValidationError('expiry date', 'required'));
            return;
        }

        setLoading(true);
        logUserAction('Create physical challenge attempt', { title, isGlobal });

        try {
            const token = await currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            const payload = {
                title,
                description,
                targetClass: selectedClasses.join(',') || 'All',
                expiryDate: new Date(expiryDate).toISOString(),
                rewardPoints: Number(rewardPoints),
                isGlobal: isGlobal && (userRole === 'admin' || userRole === 'creator')
            };

            logApiRequest('POST', '/api/challenges/create-physical', payload);

            const res = await fetch(`${apiUrl}/api/challenges/create-physical`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            logApiResponse('POST', '/api/challenges/create-physical', res.status);

            if (res.ok) {
                logUserAction('Physical challenge created', { title, isGlobal });
                alert('Physical challenge created successfully!');
                navigate('/challenges');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to create challenge. Please try again.');
            }
        } catch (error) {
            logError('CreatePhysicalChallengePage', 'Challenge creation failed', error);
            setError(getUserFriendlyError(error, 'create'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Physical Challenge</h2>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to Classes</label>
                            <select
                                id="class"
                                multiple
                                value={selectedClasses}
                                onChange={handleClassChange}
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            >
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DateTimePicker
                                label="Expiry Date"
                                value={expiryDate}
                                onChange={setExpiryDate}
                                required
                            />
                            <div>
                                <label htmlFor="rewardPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reward Points</label>
                                <input
                                    type="number"
                                    id="rewardPoints"
                                    value={rewardPoints}
                                    onChange={(e) => setRewardPoints(e.target.value)}
                                    className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Global Challenge Toggle (only for admin/creator) */}
                        {(userRole === 'admin' || userRole === 'creator') && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isGlobal}
                                        onChange={(e) => setIsGlobal(e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            Make this a global challenge
                                        </span>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            Global challenges are visible to all users, not just your institute
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Challenge'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreatePhysicalChallengePage;
