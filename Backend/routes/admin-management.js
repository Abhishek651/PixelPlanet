const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');
const { body, validationResult } = require('express-validator');

// Verify token and check admin permissions
const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing.' });
    
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.uid = decoded.uid;
        req.userRole = decoded.role;
        
        // Check if user is admin or sub-admin with permission
        if (req.userRole !== 'admin' && req.userRole !== 'sub-admin') {
            return res.status(403).json({ message: 'Admin access required.' });
        }
        
        // For sub-admins, check if they have permission to manage admins
        if (req.userRole === 'sub-admin') {
            const userDoc = await db.collection('users').doc(req.uid).get();
            if (!userDoc.exists || !userDoc.data().permissions?.canManageAdmins) {
                return res.status(403).json({ message: 'Insufficient permissions.' });
            }
        }
        
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

// Create Sub-Admin
router.post('/create-sub-admin', verifyAdmin, [
    body('email').isEmail(),
    body('name').notEmpty(),
    body('password').isLength({ min: 6 }),
    body('permissions').isObject()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { email, name, password, permissions } = req.body;
    let userRecord;
    
    try {
        // Create Firebase Auth user
        userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name
        });
        
        // Set custom claims
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'sub-admin',
            instituteId: null
        });
        
        // Create Firestore document
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            name,
            role: 'sub-admin',
            instituteId: null,
            permissions: {
                canManageUsers: permissions.canManageUsers || false,
                canDeleteContent: permissions.canDeleteContent || false,
                canViewAnalytics: permissions.canViewAnalytics || false,
                canCreateGlobalChallenges: permissions.canCreateGlobalChallenges || false,
                canManageInstitutes: permissions.canManageInstitutes || false,
                canManageAdmins: false // Sub-admins can't manage other admins by default
            },
            isVerified: true,
            ecoPoints: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: req.uid
        });
        
        res.status(201).json({ 
            message: 'Sub-admin created successfully',
            userId: userRecord.uid
        });
        
    } catch (error) {
        if (userRecord?.uid) {
            await admin.auth().deleteUser(userRecord.uid).catch(console.error);
        }
        res.status(500).json({ message: error.message });
    }
});

// Create Global Creator
router.post('/create-creator', verifyAdmin, [
    body('email').isEmail(),
    body('name').notEmpty(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { email, name, password } = req.body;
    let userRecord;
    
    try {
        // Create Firebase Auth user
        userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name
        });
        
        // Set custom claims
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'creator',
            instituteId: null
        });
        
        // Create Firestore document
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            name,
            role: 'creator',
            instituteId: null,
            permissions: {
                canCreateGlobalChallenges: true,
                canViewAnalytics: true
            },
            isVerified: true,
            ecoPoints: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: req.uid
        });
        
        res.status(201).json({ 
            message: 'Global creator created successfully',
            userId: userRecord.uid
        });
        
    } catch (error) {
        if (userRecord?.uid) {
            await admin.auth().deleteUser(userRecord.uid).catch(console.error);
        }
        res.status(500).json({ message: error.message });
    }
});

// Update Sub-Admin Permissions
router.put('/update-permissions/:userId', verifyAdmin, [
    body('permissions').isObject()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { userId } = req.params;
    const { permissions } = req.body;
    
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (userDoc.data().role !== 'sub-admin') {
            return res.status(400).json({ message: 'Can only update sub-admin permissions' });
        }
        
        await db.collection('users').doc(userId).update({
            permissions: {
                canManageUsers: permissions.canManageUsers || false,
                canDeleteContent: permissions.canDeleteContent || false,
                canViewAnalytics: permissions.canViewAnalytics || false,
                canCreateGlobalChallenges: permissions.canCreateGlobalChallenges || false,
                canManageInstitutes: permissions.canManageInstitutes || false,
                canManageAdmins: false
            },
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.json({ message: 'Permissions updated successfully' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List All Admins and Creators
router.get('/list-admins', verifyAdmin, async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users')
            .where('role', 'in', ['admin', 'sub-admin', 'creator'])
            .get();
        
        const admins = usersSnapshot.docs.map(doc => ({
            ...doc.data(),
            password: undefined // Don't send password
        }));
        
        res.json({ admins });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Sub-Admin or Creator
router.delete('/remove-admin/:userId', verifyAdmin, async (req, res) => {
    const { userId } = req.params;
    
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const userData = userDoc.data();
        
        // Can't delete main admin
        if (userData.role === 'admin' && !userData.createdBy) {
            return res.status(403).json({ message: 'Cannot delete main admin' });
        }
        
        // Delete from Firestore
        await db.collection('users').doc(userId).delete();
        
        // Delete from Firebase Auth
        await admin.auth().deleteUser(userId);
        
        res.json({ message: 'Admin removed successfully' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Institute (with cascading operations)
router.delete('/delete-institute/:instituteId', verifyAdmin, async (req, res) => {
    const { instituteId } = req.params;
    
    try {
        console.log(`[Admin] Deleting institute: ${instituteId}`);
        
        // 1. Get all users from this institute
        const usersSnapshot = await db.collection('users')
            .where('instituteId', '==', instituteId)
            .get();
        
        const userUpdates = [];
        const teachersToDelete = [];
        
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            
            if (userData.role === 'student') {
                // Convert students to global users
                userUpdates.push(
                    db.collection('users').doc(doc.id).update({
                        role: 'global',
                        instituteId: admin.firestore.FieldValue.delete(),
                        class: admin.firestore.FieldValue.delete(),
                        section: admin.firestore.FieldValue.delete()
                    })
                );
                
                // Update custom claims
                userUpdates.push(
                    admin.auth().setCustomUserClaims(doc.id, { role: 'global' })
                );
            } else if (userData.role === 'teacher' || userData.role === 'hod') {
                // Mark teachers/HODs for deletion
                teachersToDelete.push(doc.id);
            }
        });
        
        // 2. Delete all challenges from this institute
        const challengesSnapshot = await db.collection('challenges')
            .where('instituteId', '==', instituteId)
            .get();
        
        const challengeDeletes = challengesSnapshot.docs.map(doc => 
            db.collection('challenges').doc(doc.id).delete()
        );
        
        // 3. Delete all submissions related to institute challenges
        const submissionsSnapshot = await db.collection('submissions')
            .where('instituteId', '==', instituteId)
            .get();
        
        const submissionDeletes = submissionsSnapshot.docs.map(doc =>
            db.collection('submissions').doc(doc.id).delete()
        );
        
        // 4. Delete teachers and HODs
        const teacherDeletes = teachersToDelete.map(async (userId) => {
            await db.collection('users').doc(userId).delete();
            await admin.auth().deleteUser(userId);
        });
        
        // 5. Delete the institute document
        const instituteDelete = db.collection('institutes').doc(instituteId).delete();
        
        // Execute all operations
        await Promise.all([
            ...userUpdates,
            ...challengeDeletes,
            ...submissionDeletes,
            ...teacherDeletes,
            instituteDelete
        ]);
        
        console.log(`[Admin] Institute deleted successfully: ${instituteId}`);
        console.log(`[Admin] Students converted to global: ${usersSnapshot.docs.filter(d => d.data().role === 'student').length}`);
        console.log(`[Admin] Teachers/HODs deleted: ${teachersToDelete.length}`);
        console.log(`[Admin] Challenges deleted: ${challengesSnapshot.size}`);
        console.log(`[Admin] Submissions deleted: ${submissionsSnapshot.size}`);
        
        res.json({ 
            message: 'Institute deleted successfully',
            stats: {
                studentsConverted: usersSnapshot.docs.filter(d => d.data().role === 'student').length,
                teachersDeleted: teachersToDelete.length,
                challengesDeleted: challengesSnapshot.size,
                submissionsDeleted: submissionsSnapshot.size
            }
        });
        
    } catch (error) {
        console.error('[Admin] Error deleting institute:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
