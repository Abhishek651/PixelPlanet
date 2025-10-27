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
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

// Create Announcement (HOD only)
router.post('/create', verifyToken, [
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('targetAudience').isIn(['all', 'teachers', 'students']),
    body('priority').isIn(['low', 'medium', 'high'])
], async (req, res) => {
    if (req.userRole !== 'hod') return res.status(403).json({ message: 'HOD access required.' });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const announcementRef = db.collection('announcements').doc();
        await announcementRef.set({
            id: announcementRef.id,
            ...req.body,
            expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
            createdBy: req.uid,
            instituteId: req.instituteId,
            isActive: true,
            readBy: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.status(201).json({ message: 'Announcement created.', announcementId: announcementRef.id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create announcement.' });
    }
});

// Get Announcements
router.get('/list', verifyToken, async (req, res) => {
    try {
        let query = db.collection('announcements')
            .where('instituteId', '==', req.instituteId)
            .where('isActive', '==', true);

        if (req.userRole === 'teacher') {
            query = query.where('targetAudience', 'in', ['all', 'teachers']);
        } else if (req.userRole === 'student') {
            query = query.where('targetAudience', 'in', ['all', 'students']);
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();
        const announcements = snapshot.docs.map(doc => ({
            ...doc.data(),
            isRead: doc.data().readBy?.includes(req.uid) || false
        }));

        res.json({ announcements });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch announcements.' });
    }
});

// Mark as Read
router.patch('/read/:announcementId', verifyToken, async (req, res) => {
    try {
        await db.collection('announcements').doc(req.params.announcementId).update({
            readBy: admin.firestore.FieldValue.arrayUnion(req.uid)
        });
        res.json({ message: 'Marked as read.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark as read.' });
    }
});

module.exports = router;