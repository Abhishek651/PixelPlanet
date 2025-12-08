import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { NotificationModal } from '../components/base/NotificationModal';
import SideNavbar from '../components/SideNavbar';
import BottomNavbar from '../components/BottomNavbar';

const ChallengeDetailPage = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [notification, setNotification] = useState({ show: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        fetchChallenge();
    }, [challengeId, currentUser]);

    const fetchChallenge = async () => {
        try {
            const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
            if (challengeDoc.exists()) {
                const data = challengeDoc.data();
                setChallenge(data);
                
                // Check if user is enrolled
                if (data.enrolledStudents?.includes(currentUser.uid)) {
                    setEnrolled(true);
                }
                
                // Check if user has submitted
                if (data.submissions?.some(sub => sub.studentId === currentUser.uid)) {
                    setSubmitted(true);
                }
            }
        } catch (error) {
            console.error('Error fetching challenge:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        try {
            const token = await currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            const response = await fetch(`${apiUrl}/api/challenges/enroll/${challengeId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setEnrolled(true);
                setNotification({
                    show: true,
                    type: 'success',
                    title: '✅ Enrolled Successfully!',
                    message: 'You can now submit your work for this challenge.'
                });
            } else {
                const errorData = await response.json();
                setNotification({
                    show: true,
                    type: 'error',
                    title: 'Enrollment Failed',
                    message: errorData.message || 'Failed to enroll in challenge'
                });
            }
        } catch (error) {
            console.error('Error enrolling:', error);
            setNotification({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to enroll in challenge'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // For physical challenges, require image upload
        if (challenge.type === 'physical') {
            if (!submissionFile) {
                setNotification({
                    show: true,
                    type: 'error',
                    title: 'Photo Required',
                    message: 'Please upload a photo of your completed challenge'
                });
                return;
            }
        } else if (!submissionContent.trim()) {
            setNotification({
                show: true,
                type: 'error',
                title: 'Content Required',
                message: 'Please provide submission details'
            });
            return;
        }

        setSubmitting(true);
        try {
            const token = await currentUser.getIdToken();
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            
            // Physical challenges use different endpoint with AI verification
            if (challenge.type === 'physical') {
                const formData = new FormData();
                formData.append('image', submissionFile);
                
                const response = await fetch(`${apiUrl}/api/physical-challenge/submit/${challengeId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const result = await response.json();
                console.log('Submission response:', result);
                
                if (response.ok && result.success) {
                    setSubmitted(true);
                    const feedback = result.feedback || {};
                    let message = feedback.message || 'Your submission has been verified and approved!';
                    if (result.points) message += `\n\n🎁 Points earned: ${result.points}`;
                    if (feedback.observedAction) message += `\n\n✓ ${feedback.observedAction}`;
                    
                    setNotification({
                        show: true,
                        type: 'success',
                        title: feedback.title || '🎉 Challenge Completed!',
                        message: message
                    });
                } else {
                    // Show detailed feedback for rejection
                    const feedback = result.feedback || {};
                    const details = result.details || {};
                    
                    let message = feedback.message || result.error || 'Your submission could not be verified.';
                    
                    // Add reasoning if available
                    if (details.reasoning) {
                        message += `\n\n${details.reasoning}`;
                    }
                    
                    // Add reasons
                    if (feedback.reasons && feedback.reasons.length > 0) {
                        message += '\n\nReasons:\n' + feedback.reasons.map(r => `• ${r}`).join('\n');
                    }
                    
                    // Add concerns
                    if (details.concerns && details.concerns.length > 0) {
                        message += '\n\nConcerns:\n' + details.concerns.map(c => `• ${c}`).join('\n');
                    }
                    
                    // Add suggestions
                    if (feedback.suggestions && feedback.suggestions.length > 0) {
                        message += '\n\nSuggestions:\n' + feedback.suggestions.map(s => `• ${s}`).join('\n');
                    }
                    
                    setNotification({
                        show: true,
                        type: 'error',
                        title: feedback.title || '❌ Verification Failed',
                        message: message
                    });
                }
            } else {
                // Regular challenges (quiz, video, etc.)
                const response = await fetch(`${apiUrl}/api/challenges/submit/${challengeId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        submissionType: challenge.type === 'video' ? 'video' : 'text',
                        content: submissionContent
                    })
                });

                if (response.ok) {
                    setSubmitted(true);
                    setNotification({
                        show: true,
                        type: 'success',
                        title: '✅ Submission Successful!',
                        message: 'Your teacher will review it soon.'
                    });
                } else {
                    const errorData = await response.json();
                    setNotification({
                        show: true,
                        type: 'error',
                        title: 'Submission Failed',
                        message: errorData.message || 'Failed to submit. Please try again.'
                    });
                }
            }
        } catch (error) {
            console.error('Error submitting:', error);
            setNotification({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to submit. Please try again.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Challenge Not Found</h2>
                    <button 
                        onClick={() => navigate('/challenges')}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light"
                    >
                        Back to Challenges
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <SideNavbar />
            
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-0 h-full">
                {/* Notification Modal */}
                <NotificationModal
                    isOpen={notification.show}
                    onClose={() => setNotification({ ...notification, show: false })}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                />
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-b from-primary to-primary-light p-6 pb-12 rounded-b-3xl shadow-lg"
                >
                <button 
                    onClick={() => navigate('/challenges')}
                    className="material-symbols-outlined text-white text-2xl mb-4"
                >
                    arrow_back
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">{challenge.title}</h1>
                <p className="text-white/90 text-sm">
                    {challenge.type === 'physical' ? 'Physical Challenge' : 'Video Challenge'}
                </p>
            </motion.div>

            {/* Content */}
            <div className="px-4 -mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-6"
                >
                    {/* Challenge Details */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                        <p className="text-gray-600 whitespace-pre-wrap">{challenge.description}</p>
                    </div>

                    {/* Challenge Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Reward Points</p>
                            <p className="text-2xl font-bold text-primary">{challenge.rewardPoints}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Expires On</p>
                            <p className="text-sm font-semibold text-gray-800">
                                {challenge.expiryDate?.toDate?.().toLocaleDateString() || 'No expiry'}
                            </p>
                        </div>
                    </div>

                    {/* Instructions */}
                    {challenge.instructions && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
                            <p className="text-sm text-blue-800 whitespace-pre-wrap">{challenge.instructions}</p>
                        </div>
                    )}

                    {/* Enrollment Status */}
                    {!enrolled && !submitted && (
                        <button
                            onClick={handleEnroll}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors mb-6"
                        >
                            Enroll in Challenge
                        </button>
                    )}

                    {/* Submission Form */}
                    {enrolled && !submitted && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {challenge.type === 'physical' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        📸 Upload Photo of Completed Challenge
                                    </label>
                                    <p className="text-sm text-gray-600 mb-3">
                                        AI will verify your submission automatically. Make sure your photo clearly shows the completed challenge.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSubmissionFile(e.target.files[0])}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        required
                                    />
                                    {submissionFile && (
                                        <div className="mt-2 text-sm text-green-600">
                                            ✓ {submissionFile.name} selected
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {challenge.type === 'video' ? 'Video URL or Description' : 'Submission Details'}
                                    </label>
                                    <textarea
                                        value={submissionContent}
                                        onChange={(e) => setSubmissionContent(e.target.value)}
                                        placeholder={challenge.type === 'video' 
                                            ? 'Paste your video URL (YouTube, Drive, etc.) or describe your submission'
                                            : 'Describe what you did for this challenge'
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        rows="6"
                                        required
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Submit Challenge
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Submitted Status */}
                    {submitted && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-900 mb-2">Submission Complete!</h3>
                            <p className="text-green-700">
                                Your submission has been received and is awaiting teacher verification.
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
            
            <BottomNavbar />
            </div>
        </div>
    );
};

export default ChallengeDetailPage;
