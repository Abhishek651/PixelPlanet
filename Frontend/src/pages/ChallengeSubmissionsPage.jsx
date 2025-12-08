import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';

const ChallengeSubmissionsPage = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [challengeId]);

    const fetchData = async () => {
        try {
            // Fetch challenge
            const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
            if (challengeDoc.exists()) {
                setChallenge({ id: challengeDoc.id, ...challengeDoc.data() });
            }

            // Fetch submissions
            const submissionsQuery = query(
                collection(db, 'quizSubmissions'),
                where('challengeId', '==', challengeId)
            );
            const submissionsSnapshot = await getDocs(submissionsQuery);
            
            const submissionsData = await Promise.all(
                submissionsSnapshot.docs.map(async (subDoc) => {
                    const data = subDoc.data();
                    // Fetch user data
                    const userDoc = await getDoc(doc(db, 'users', data.userId));
                    const userData = userDoc.exists() ? userDoc.data() : {};
                    
                    return {
                        id: subDoc.id,
                        ...data,
                        userName: userData.displayName || userData.email || 'Unknown',
                        userEmail: userData.email
                    };
                })
            );

            setSubmissions(submissionsData);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    const avgScore = submissions.length > 0
        ? (submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length).toFixed(1)
        : 0;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {challenge?.title || 'Challenge Submissions'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {submissions.length} submissions • Avg Score: {avgScore}%
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Submissions</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{submissions.length}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{avgScore}%</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pass Rate</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                            {submissions.length > 0
                                ? ((submissions.filter(s => (s.score || 0) >= 60).length / submissions.length) * 100).toFixed(0)
                                : 0}%
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Highest Score</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                            {submissions.length > 0 ? Math.max(...submissions.map(s => s.score || 0)) : 0}%
                        </p>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Correct</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time Taken</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Submitted</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {submissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">{submission.userName}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{submission.userEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-lg font-bold ${
                                                submission.score >= 80 ? 'text-green-600' :
                                                submission.score >= 60 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                                {submission.score}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {submission.correctAnswers}/{submission.totalQuestions}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {submission.timeTaken ? `${Math.floor(submission.timeTaken / 60)}m ${submission.timeTaken % 60}s` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {submission.submittedAt?.toDate?.().toLocaleDateString() || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                submission.score >= 60
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {submission.score >= 60 ? 'Passed' : 'Failed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {submissions.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No submissions yet</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChallengeSubmissionsPage;
