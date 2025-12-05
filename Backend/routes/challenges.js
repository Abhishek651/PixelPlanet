const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');
const { body, validationResult } = require('express-validator');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing.' });
    
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.uid = decoded.uid;
        req.userRole = decoded.role;
        req.instituteId = decoded.instituteId;
        
        // If custom claims are missing, fetch from Firestore
        if (!req.instituteId || !req.userRole) {
            const userDoc = await db.collection('users').doc(req.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                req.instituteId = req.instituteId || userData.instituteId;
                req.userRole = req.userRole || userData.role;
            }
        }
        
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

// Create Physical Challenge
router.post('/create-physical', verifyToken, [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('targetClass').notEmpty(),
    body('rewardPoints').isInt({ min: 1 }),
    body('expiryDate').isISO8601()
], async (req, res) => {
    // Only teachers, admins, and creators can create challenges
    const allowedRoles = ['teacher', 'hod', 'admin', 'creator'];
    if (!allowedRoles.includes(req.userRole)) {
        return res.status(403).json({ message: 'Insufficient permissions.' });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        // Determine if challenge is global
        const isGlobal = req.body.isGlobal === true && (req.userRole === 'admin' || req.userRole === 'creator');
        
        // Teachers/HODs can only create institute challenges
        if (req.userRole === 'teacher' || req.userRole === 'hod') {
            if (!req.instituteId) {
                return res.status(400).json({ message: 'Institute ID required for institute challenges.' });
            }
        }
        
        const challengeRef = db.collection('challenges').doc();
        await challengeRef.set({
            id: challengeRef.id,
            type: 'physical',
            ...req.body,
            rewardPoints: req.body.rewardPoints || 100,
            rewardCoins: req.body.rewardCoins || 50,
            rewardXP: req.body.rewardXP || 30,
            expiryDate: new Date(req.body.expiryDate),
            createdBy: req.uid,
            creatorRole: req.userRole,
            instituteId: isGlobal ? null : req.instituteId,
            isGlobal: isGlobal,
            isActive: true,
            enrolledStudents: [],
            submissions: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.status(201).json({ 
            message: `${isGlobal ? 'Global' : 'Institute'} physical challenge created.`, 
            challengeId: challengeRef.id 
        });
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ message: 'Failed to create challenge.' });
    }
});

// Create Auto Quiz
router.post('/create-auto-quiz', verifyToken, [
    body('title').notEmpty(),
    body('numQuestions').isInt({ min: 1, max: 50 }),
    body('difficulty').isIn(['easy', 'medium', 'hard']),
    body('targetClass').notEmpty(),
    body('rewardPoints').isInt({ min: 1 })
], async (req, res) => {
    const allowedRoles = ['teacher', 'hod', 'admin', 'creator'];
    if (!allowedRoles.includes(req.userRole)) {
        return res.status(403).json({ message: 'Insufficient permissions.' });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const isGlobal = req.body.isGlobal === true && (req.userRole === 'admin' || req.userRole === 'creator');
        
        const challengeRef = db.collection('challenges').doc();
        await challengeRef.set({
            id: challengeRef.id,
            type: 'quiz_auto',
            title: req.body.title,
            description: req.body.description,
            numQuestions: req.body.numQuestions,
            difficulty: req.body.difficulty,
            targetClass: req.body.targetClass,
            rewardPoints: req.body.rewardPoints || 100,
            rewardCoins: req.body.rewardCoins || 50,
            rewardXP: req.body.rewardXP || 30,
            questions: req.body.questions || [],
            paragraph: req.body.paragraph || null,
            startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
            expiryDate: new Date(req.body.expiryDate),
            createdBy: req.uid,
            creatorRole: req.userRole,
            instituteId: isGlobal ? null : req.instituteId,
            isGlobal: isGlobal,
            isActive: true,
            enrolledStudents: [],
            submissions: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.status(201).json({ 
            message: `${isGlobal ? 'Global' : 'Institute'} auto quiz created.`, 
            challengeId: challengeRef.id 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create quiz.' });
    }
});

// Create Manual Quiz
router.post('/create-manual-quiz', verifyToken, [
    body('title').notEmpty(),
    body('targetClass').notEmpty(),
    body('questions').isArray({ min: 1 }),
    body('rewardPoints').isInt({ min: 1 })
], async (req, res) => {
    const allowedRoles = ['teacher', 'hod', 'admin', 'creator'];
    if (!allowedRoles.includes(req.userRole)) {
        return res.status(403).json({ message: 'Insufficient permissions.' });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const isGlobal = req.body.isGlobal === true && (req.userRole === 'admin' || req.userRole === 'creator');
        
        const challengeRef = db.collection('challenges').doc();
        await challengeRef.set({
            id: challengeRef.id,
            type: 'quiz_manual',
            ...req.body,
            rewardPoints: req.body.rewardPoints || 100,
            rewardCoins: req.body.rewardCoins || 50,
            rewardXP: req.body.rewardXP || 30,
            startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
            expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdBy: req.uid,
            creatorRole: req.userRole,
            instituteId: isGlobal ? null : req.instituteId,
            isGlobal: isGlobal,
            isActive: true,
            enrolledStudents: [],
            submissions: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.status(201).json({ 
            message: `${isGlobal ? 'Global' : 'Institute'} manual quiz created.`, 
            challengeId: challengeRef.id 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create quiz.' });
    }
});

// Get Challenges
router.get('/list', verifyToken, async (req, res) => {
    try {
        let challenges = [];
        
        // Fetch global challenges (visible to everyone)
        const globalSnapshot = await db.collection('challenges')
            .where('isGlobal', '==', true)
            .orderBy('createdAt', 'desc')
            .get();
        challenges = globalSnapshot.docs.map(doc => doc.data());
        
        // If user has institute, also fetch institute challenges
        if (req.instituteId && req.userRole !== 'global') {
            let instituteQuery = db.collection('challenges')
                .where('instituteId', '==', req.instituteId)
                .where('isGlobal', '==', false);
            
            // Filter by class for students
            if (req.userRole === 'student' && req.query.class) {
                instituteQuery = instituteQuery.where('targetClass', '==', req.query.class);
            }
            // Filter by creator for teachers
            else if (req.userRole === 'teacher') {
                instituteQuery = instituteQuery.where('createdBy', '==', req.uid);
            }

            const instituteSnapshot = await instituteQuery.orderBy('createdAt', 'desc').get();
            const instituteChallenges = instituteSnapshot.docs.map(doc => doc.data());
            
            // Combine global and institute challenges
            challenges = [...challenges, ...instituteChallenges];
        }
        
        // Sort by creation date
        challenges.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
        });
        
        res.json({ 
            challenges,
            message: challenges.length === 0 ? 'No challenges available.' : undefined
        });
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ message: 'Failed to fetch challenges.', error: error.message });
    }
});

// Enroll in Challenge
router.post('/enroll/:challengeId', verifyToken, async (req, res) => {
    if (req.userRole !== 'student') return res.status(403).json({ message: 'Student access required.' });
    
    try {
        await db.collection('challenges').doc(req.params.challengeId).update({
            enrolledStudents: admin.firestore.FieldValue.arrayUnion(req.uid)
        });
        res.json({ message: 'Enrolled successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Enrollment failed.' });
    }
});

// Submit Challenge
router.post('/submit/:challengeId', verifyToken, [
    body('submissionType').isIn(['text', 'image', 'video', 'quiz']),
    body('content').notEmpty()
], async (req, res) => {
    if (req.userRole !== 'student') return res.status(403).json({ message: 'Student access required.' });
    
    try {
        const submission = {
            studentId: req.uid,
            submissionType: req.body.submissionType,
            content: req.body.content,
            answers: req.body.answers || null,
            submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            isVerified: false
        };

        await db.collection('challenges').doc(req.params.challengeId).update({
            submissions: admin.firestore.FieldValue.arrayUnion(submission)
        });
        
        res.json({ message: 'Submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Submission failed.' });
    }
});

// Verify Submission
router.patch('/verify-submission/:challengeId', verifyToken, [
    body('studentId').notEmpty(),
    body('approved').isBoolean()
], async (req, res) => {
    if (req.userRole !== 'teacher') return res.status(403).json({ message: 'Teacher access required.' });
    
    try {
        const { studentId, approved } = req.body;
        const challengeDoc = await db.collection('challenges').doc(req.params.challengeId).get();
        const challengeData = challengeDoc.data();
        
        const updatedSubmissions = challengeData.submissions.map(sub => 
            sub.studentId === studentId ? { ...sub, isVerified: true, approved } : sub
        );

        await db.collection('challenges').doc(req.params.challengeId).update({ submissions: updatedSubmissions });

        if (approved) {
            await db.collection('users').doc(studentId).update({
                ecoPoints: admin.firestore.FieldValue.increment(challengeData.rewardPoints)
            });
        }

        res.json({ message: 'Submission verified.' });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed.' });
    }
});

module.exports = router;