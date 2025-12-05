import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChallenges } from '../context/useChallenges';
import DashboardLayout from '../components/DashboardLayout';
import ChallengesList from '../components/ChallengesList';
import { Plus, BookOpen, TrendingUp } from 'lucide-react';
import ChallengeTypeModal from '../components/ChallengeTypeModal';

const TeacherClassroomPage = () => {
    const { challenges, isLoading, refreshChallenges } = useChallenges();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        // Refresh challenges when component mounts
        refreshChallenges();
    }, []);

    const stats = {
        totalChallenges: challenges.length,
        activeChallenges: challenges.filter(c => c.isActive).length,
        totalSubmissions: challenges.reduce((sum, c) => sum + (c.submissions?.length || 0), 0),
    };

    return (
        <DashboardLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Classroom</h1>
                    <p className="text-gray-600">Manage your challenges and track student progress</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Challenges</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalChallenges}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Active Challenges</p>
                                <p className="text-3xl font-bold text-green-600">{stats.activeChallenges}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.totalSubmissions}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600">assignment_turned_in</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Create Challenge Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Challenge
                    </button>
                </motion.div>

                {/* Challenges List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    ) : challenges.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Challenges Yet</h3>
                            <p className="text-gray-600 mb-6">Create your first challenge to get started!</p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Challenge
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900">My Challenges</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Showing {challenges.length} challenge{challenges.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <ChallengesList />
                        </div>
                    )}
                </motion.div>

                {/* Create Challenge Modal */}
                <ChallengeTypeModal 
                    isOpen={showCreateModal} 
                    onClose={() => setShowCreateModal(false)} 
                />
            </div>
        </DashboardLayout>
    );
};

export default TeacherClassroomPage;
