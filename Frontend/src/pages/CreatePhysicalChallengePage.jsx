// Frontend/src/pages/CreatePhysicalChallengePage.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft, MapPin, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getUserFriendlyError, getValidationError } from '../utils/errorMessages';
import { logUserAction, logError, logApiRequest, logApiResponse } from '../utils/logger';
import { DateTimePicker } from '../components/base/DatePicker';
import Switch from '../components/Switch';

const CreatePhysicalChallengePage = () => {
    const navigate = useNavigate();
    const { currentUser, userRole } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [expiryDate, setExpiryDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [rewardPoints, setRewardPoints] = useState(100);
    const [isGlobal, setIsGlobal] = useState(false);
    const [location, setLocation] = useState({
        enabled: false,
        latitude: 28.7041, // Delhi default
        longitude: 77.1025,
        name: 'Delhi',
        radius: 50 // km
    });
    const [aiVerification, setAiVerification] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const classes = [
        { id: '1', name: 'Class A' },
        { id: '2', name: 'Class B' },
        { id: '3', name: 'Class C' },
    ];

    // Get current location
    const getCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        name: 'Current Location'
                    }));
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Could not get your location. Using Delhi as default.');
                }
            );
        }
    };

    const handleClassChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedClasses(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!currentUser) {
            setError('You must be logged in to create a challenge.');
            return;
        }

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
        logUserAction('Create physical challenge attempt', { title, isGlobal, locationEnabled: location.enabled });

        try {
            const token = await currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            const payload = {
                title,
                description,
                targetClass: selectedClasses.join(',') || 'All',
                startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
                expiryDate: new Date(expiryDate).toISOString(),
                rewardPoints: Number(rewardPoints),
                isGlobal: isGlobal && (userRole === 'admin' || userRole === 'creator'),
                location: location.enabled ? {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    name: location.name,
                    radius: location.radius
                } : null,
                requiresVerification: aiVerification, // AI verification toggle
                type: 'physical'
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
                logUserAction('Physical challenge created', { title, isGlobal, aiVerification });
                const message = aiVerification 
                    ? 'Physical challenge created successfully! AI verification is enabled with Amazon Nova 2 Lite.'
                    : 'Physical challenge created successfully!';
                setSuccess(message);
                setTimeout(() => navigate('/challenges', { state: { refresh: true } }), 2000);
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
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Physical Challenge</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    📸 Real-world environmental action tracking
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-3">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                                <p className="font-semibold mb-1">AI Verification Available</p>
                                <p>When enabled, submissions will be verified using:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>Image metadata extraction (EXIF data)</li>
                                    <li>GPS location verification</li>
                                    <li>AI-generated image detection</li>
                                    <li>Challenge completion verification with Amazon Nova 2 Lite (Free)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Challenge Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Plant 5 Trees in Your Neighborhood"
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what participants need to do. Be specific about requirements for photo verification."
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                required
                            ></textarea>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                💡 Tip: Include specific visual elements that should appear in the photo
                            </p>
                        </div>

                        {/* Location Settings */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Location Verification
                                    </label>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={location.enabled}
                                        onChange={(e) => setLocation(prev => ({ ...prev, enabled: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* AI Verification Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-green-200 dark:border-gray-600">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">🤖</span>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Use Gemini AI to verify submissions automatically
                                        </p>
                                    </div>
                                </div>
                                <Switch 
                                    checked={aiVerification}
                                    onChange={(e) => setAiVerification(e.target.checked)}
                                />
                            </div>

                            {location.enabled && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Latitude
                                            </label>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={location.latitude}
                                                onChange={(e) => setLocation(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Longitude
                                            </label>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                value={location.longitude}
                                                onChange={(e) => setLocation(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Location Name
                                        </label>
                                        <input
                                            type="text"
                                            value={location.name}
                                            onChange={(e) => setLocation(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Allowed Radius (km)
                                        </label>
                                        <input
                                            type="number"
                                            value={location.radius}
                                            onChange={(e) => setLocation(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                                            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        📍 Use My Current Location
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Assign to Classes
                            </label>
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
                                label="Start Date (Optional)"
                                value={startDate}
                                onChange={setStartDate}
                                helperText="Leave empty to start immediately"
                            />
                            <DateTimePicker
                                label="Expiry Date *"
                                value={expiryDate}
                                onChange={setExpiryDate}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="rewardPoints" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Reward Points
                                </label>
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
                                {loading ? 'Creating...' : `🚀 Create Challenge${aiVerification ? ' with AI Verification' : ''}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreatePhysicalChallengePage;
