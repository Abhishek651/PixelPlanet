const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');
const { verifyToken } = require('../middleware/auth');

console.log('🎨 Creator Analytics route loaded');

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
    console.log('🧪 Test endpoint called');
    res.json({ message: 'Creator analytics route is working!', timestamp: new Date().toISOString() });
});



// Get Creator Analytics
router.get('/analytics', verifyToken, async (req, res) => {
    console.log('📊 GET /api/creator/analytics called');
    console.log('   User ID:', req.uid);
    console.log('   User Role:', req.userRole);
    
    // Only creators can access this endpoint
    if (req.userRole !== 'creator') {
        console.log('❌ Access denied - not a creator');
        return res.status(403).json({ message: 'Creator access required.' });
    }

    try {
        console.log('✅ Fetching analytics for creator:', req.uid);
        
        // Get all challenges created by this creator
        const challengesSnapshot = await db.collection('challenges')
            .where('createdBy', '==', req.uid)
            .get();
        
        console.log('Found challenges:', challengesSnapshot.size);
        
        const challenges = challengesSnapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Challenge:', data.id, data.title);
            return data;
        });
        
        // Calculate statistics
        const totalChallenges = challenges.length;
        const activeChallenges = challenges.filter(c => c.isActive).length;
        const completedChallenges = challenges.filter(c => !c.isActive).length;
        
        // Get unique participants across all challenges
        const allParticipantsIds = new Set();
        let totalSubmissions = 0;
        let totalEnrollments = 0;
        
        challenges.forEach(challenge => {
            // Add enrolled students
            if (challenge.enrolledStudents && Array.isArray(challenge.enrolledStudents)) {
                challenge.enrolledStudents.forEach(studentId => allParticipantsIds.add(studentId));
                totalEnrollments += challenge.enrolledStudents.length;
            }
            
            // Add students who submitted
            if (challenge.submissions && Array.isArray(challenge.submissions)) {
                challenge.submissions.forEach(sub => {
                    if (sub.studentId) allParticipantsIds.add(sub.studentId);
                });
                totalSubmissions += challenge.submissions.length;
            }
        });
        
        const totalParticipants = allParticipantsIds.size;

        // Fetch participant details
        const participants = [];
        for (const studentId of allParticipantsIds) {
            const userDoc = await db.collection('users').doc(studentId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                participants.push({
                    id: studentId,
                    name: userData.displayName || 'Unknown',
                    email: userData.email,
                });
            }
        }
        
        let studentsSnapshot;
        let globalStudentsWithInstitute = 0;
        let globalStudentsWithoutInstitute = 0;

        if (req.instituteId) {
            // Creator belongs to an institute, get students from that institute
            studentsSnapshot = await db.collection('users')
                .where('instituteId', '==', req.instituteId)
                .where('role', 'in', ['student', 'global'])
                .get();
        } else {
            // Global creator, get all students
            studentsSnapshot = await db.collection('users')
                .where('role', 'in', ['student', 'global'])
                .get();
            
            studentsSnapshot.docs.forEach(doc => {
                if (doc.data().instituteId) {
                    globalStudentsWithInstitute++;
                } else {
                    globalStudentsWithoutInstitute++;
                }
            });
        }
        const totalStudents = studentsSnapshot.size;
        
        console.log('Total students:', totalStudents);
        console.log('Total participants:', totalParticipants);
        
        // Calculate challenge type breakdown
        const challengesByType = {
            physical: challenges.filter(c => c.type === 'physical').length,
            quiz_auto: challenges.filter(c => c.type === 'quiz_auto').length,
            quiz_manual: challenges.filter(c => c.type === 'quiz_manual').length,
            video: challenges.filter(c => c.type === 'video').length
        };
        
        // Get recent challenges with participation data
        const recentChallenges = challenges
            .sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            })
            .slice(0, 10)
            .map(challenge => ({
                id: challenge.id,
                title: challenge.title,
                type: challenge.type,
                isActive: challenge.isActive,
                enrolledCount: challenge.enrolledStudents?.length || 0,
                submissionsCount: challenge.submissions?.length || 0,
                createdAt: challenge.createdAt,
                expiryDate: challenge.expiryDate
            }));
        
        // Calculate participation rate
        const participationRate = totalStudents > 0 
            ? ((totalParticipants / totalStudents) * 100).toFixed(1)
            : 0;
        
        const response = {
            overview: {
                totalChallenges,
                activeChallenges,
                completedChallenges,
                totalParticipants,
                totalStudents,
                totalEnrollments,
                totalSubmissions,
                participationRate: parseFloat(participationRate),
                globalStudentsWithInstitute,
                globalStudentsWithoutInstitute,
            },
            challengesByType,
            recentChallenges,
            topChallenges: challenges
                .map(c => ({
                    id: c.id,
                    title: c.title,
                    type: c.type,
                    participants: (c.enrolledStudents?.length || 0) + (c.submissions?.length || 0)
                }))
                .sort((a, b) => b.participants - a.participants)
                .slice(0, 5),
            participants
        };
        
        console.log('Sending response:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('Error fetching creator analytics:', error);
        res.status(500).json({ message: 'Failed to fetch analytics.', error: error.message });
    }
});

// Get detailed challenge analytics
router.get('/challenge/:challengeId', verifyToken, async (req, res) => {
    if (req.userRole !== 'creator') {
        return res.status(403).json({ message: 'Creator access required.' });
    }

    try {
        const challengeDoc = await db.collection('challenges').doc(req.params.challengeId).get();
        
        if (!challengeDoc.exists) {
            return res.status(404).json({ message: 'Challenge not found.' });
        }
        
        const challenge = challengeDoc.data();
        
        // Verify the creator owns this challenge
        if (challenge.createdBy !== req.uid) {
            return res.status(403).json({ message: 'You do not own this challenge.' });
        }
        
        // Get participant details
        const participantIds = [...new Set([
            ...(challenge.enrolledStudents || []),
            ...(challenge.submissions || []).map(s => s.studentId).filter(Boolean)
        ])];
        
        const participants = [];
        for (const studentId of participantIds) {
            const userDoc = await db.collection('users').doc(studentId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const submission = challenge.submissions?.find(s => s.studentId === studentId);
                participants.push({
                    id: studentId,
                    name: userData.displayName || 'Unknown',
                    email: userData.email,
                    enrolled: challenge.enrolledStudents?.includes(studentId) || false,
                    submitted: !!submission,
                    submittedAt: submission?.submittedAt,
                    isVerified: submission?.isVerified || false,
                    approved: submission?.approved || false
                });
            }
        }
        
        res.json({
            challenge: {
                id: challenge.id,
                title: challenge.title,
                type: challenge.type,
                description: challenge.description,
                isActive: challenge.isActive,
                createdAt: challenge.createdAt,
                expiryDate: challenge.expiryDate
            },
            stats: {
                totalEnrolled: challenge.enrolledStudents?.length || 0,
                totalSubmissions: challenge.submissions?.length || 0,
                verifiedSubmissions: challenge.submissions?.filter(s => s.isVerified).length || 0,
                approvedSubmissions: challenge.submissions?.filter(s => s.approved).length || 0
            },
            participants
        });
    } catch (error) {
        console.error('Error fetching challenge analytics:', error);
        res.status(500).json({ message: 'Failed to fetch challenge analytics.' });
    }
});

module.exports = router;
