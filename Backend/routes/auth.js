const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');
const { body, validationResult } = require('express-validator');

// --- HELPER FUNCTION TO GENERATE READABLE CODES ---
const generateReadableCode = (prefix, length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// --- HELPER FUNCTION FOR FIREBASE AUTH ERRORS ---
const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/email-already-exists':
            return 'The provided email is already in use by an existing user.';
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/uid-already-exists':
            return 'A user with the given UID already exists.';
        case 'auth/invalid-uid':
            return 'The user ID is not valid.';
        case 'auth/argument-error':
            return 'Invalid argument provided to authentication function.';
        default:
            return error.message || 'An unknown authentication error occurred.';
    }
};

const { verifyToken } = require('../middleware/auth');

// --- ROUTES ---

// 0. HEALTH CHECK
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Auth routes are working', timestamp: new Date().toISOString() });
});

// 1. REGISTER INSTITUTE (HOD/Admin)
router.post('/register-institute', [
    body('instituteName').notEmpty().withMessage('Institute name is required.'),
    body('instituteType').notEmpty().withMessage('Institute type is required.'),
    body('instituteLocation').notEmpty().withMessage('Institute location is required.'),
    body('adminName').notEmpty().withMessage('Administrator name is required.'),
    body('adminEmail').isEmail().withMessage('Valid admin email is required.'),
    body('adminPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
    }

    const { instituteName, instituteType, instituteLocation, adminName, adminEmail, adminPassword } = req.body;
    let userRecord;

    try {
        userRecord = await admin.auth().createUser({
            email: adminEmail,
            password: adminPassword,
            displayName: adminName,
        });

        const instituteRef = db.collection('institutes').doc();
        // All institute registrations create HOD, never admin
        // Admin is created separately via script for security
        const role = 'hod';

        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: role,
            instituteId: instituteRef.id
        });

        const teacherCode = generateReadableCode();
        const studentCode = generateReadableCode();
        const batch = db.batch();

        batch.set(instituteRef, {
            instituteId: instituteRef.id,
            name: instituteName,
            type: instituteType,
            location: instituteLocation,
            adminUid: userRecord.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            teacherRegistrationCode: teacherCode,
            studentRegistrationCode: studentCode,
        });

        const userRef = db.collection('users').doc(userRecord.uid);
        batch.set(userRef, {
            uid: userRecord.uid,
            name: adminName,
            email: adminEmail,
            role: role, // Use the determined role (admin or hod)
            instituteId: instituteRef.id,
            isVerified: true,
            ecoPoints: 0,
            coins: 0,
            xp: 0,
            level: 1,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        await batch.commit();

        res.status(201).send({
            message: 'Institute and Admin registered successfully!',
            instituteId: instituteRef.id,
            teacherRegistrationCode: teacherCode,
            studentRegistrationCode: studentCode
        });

    } catch (error) {
        if (userRecord && userRecord.uid) {
            await admin.auth().deleteUser(userRecord.uid).catch(console.error);
        }
        const userFriendlyMessage = getFirebaseErrorMessage(error);
        res.status(500).send({
            message: `Failed to register institute. ${userFriendlyMessage}`,
            debugInfo: { code: error.code, detail: error.message }
        });
    }
});

// 2. VERIFY INSTITUTE REGISTRATION CODE
router.post('/verify-institute-code', [
    body('code').notEmpty().withMessage('Registration code is required.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
    }

    const { code } = req.body;

    try {
        let querySnapshot = await db.collection('institutes')
            .where('teacherRegistrationCode', '==', code)
            .limit(1)
            .get();

        let inferredRole = null;
        let instituteDoc = null;

        if (!querySnapshot.empty) {
            instituteDoc = querySnapshot.docs[0];
            inferredRole = 'teacher';
        } else {
            querySnapshot = await db.collection('institutes')
                .where('studentRegistrationCode', '==', code)
                .limit(1)
                .get();

            if (!querySnapshot.empty) {
                instituteDoc = querySnapshot.docs[0];
                inferredRole = 'student';
            }
        }

        if (!instituteDoc) {
            return res.status(404).json({ message: 'Invalid registration code.' });
        }

        const instituteData = instituteDoc.data();
        res.status(200).json({
            message: 'Registration code verified successfully.',
            instituteId: instituteDoc.id,
            instituteName: instituteData.name,
            role: inferredRole
        });

    } catch (error) {
        console.error('Error verifying institute code:', error);
        res.status(500).json({ message: 'Failed to verify registration code.' });
    }
});

// 3. REGISTER TEACHER
router.post('/register-teacher', [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('instituteId').notEmpty().withMessage('Institute ID is required.'),
    body('department').notEmpty().withMessage('Department is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        return res.status(400).json({ message: errorMessages, errors: errors.array() });
    }

    const { name, email, password, instituteId, department } = req.body;
    let userRecord;

    console.log('[register-teacher] Request received:', { name, email, instituteId, department });

    try {
        userRecord = await admin.auth().createUser({ email, password, displayName: name });
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'teacher', instituteId });
        
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid, name, email, role: 'teacher', instituteId, department,
            isVerified: false, ecoPoints: 0, coins: 0, xp: 0, level: 1, createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ message: 'Teacher registered. Awaiting verification.' });
    } catch (error) {
        console.error('[register-teacher] Error:', error);
        if (userRecord?.uid) await admin.auth().deleteUser(userRecord.uid).catch(console.error);
        res.status(500).json({ 
            message: getFirebaseErrorMessage(error),
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 4. REGISTER STUDENT
router.post('/register-student', [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('instituteId').notEmpty().withMessage('Institute ID is required.'),
    body('admissionNumber').notEmpty().withMessage('Admission number is required.'),
    body('class').notEmpty().withMessage('Class is required.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        return res.status(400).json({ message: errorMessages, errors: errors.array() });
    }

    const { name, email, password, instituteId, admissionNumber, class: studentClass, section } = req.body;
    let userRecord;

    try {
        userRecord = await admin.auth().createUser({ email, password, displayName: name });
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'student', instituteId });
        
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid, name, email, role: 'student', instituteId, admissionNumber,
            class: studentClass, section: section || '', isVerified: true, ecoPoints: 0, coins: 0, xp: 0, level: 1,
            badges: [], createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ message: 'Student registered successfully.' });
    } catch (error) {
        if (userRecord?.uid) await admin.auth().deleteUser(userRecord.uid).catch(console.error);
        res.status(500).json({ message: getFirebaseErrorMessage(error) });
    }
});

// 5. GET USER PROFILE
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.uid).get();
        if (!userDoc.exists) return res.status(404).json({ message: 'User not found.' });
        res.json({ user: userDoc.data() });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile.' });
    }
});

// 6. VERIFY TEACHER (HOD only)
router.put('/verify-teacher/:teacherId', verifyToken, async (req, res) => {
    if (req.userRole !== 'hod') return res.status(403).json({ message: 'HOD access required.' });
    
    try {
        const { teacherId } = req.params;
        const { approved } = req.body;
        
        if (approved) {
            await db.collection('users').doc(teacherId).update({ 
                isVerified: true, 
                approved: true,
                approvedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.json({ message: 'Teacher approved successfully.' });
        } else {
            await db.collection('users').doc(teacherId).delete();
            await admin.auth().deleteUser(teacherId);
            res.json({ message: 'Teacher rejected.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Verification failed.' });
    }
});

// 7. GET PENDING TEACHERS (HOD only)
router.get('/pending-teachers', verifyToken, async (req, res) => {
    if (req.userRole !== 'hod') return res.status(403).json({ message: 'HOD access required.' });
    
    try {
        const snapshot = await db.collection('users')
            .where('instituteId', '==', req.instituteId)
            .where('role', '==', 'teacher')
            .where('isVerified', '==', false)
            .get();
        
        res.json({ teachers: snapshot.docs.map(doc => doc.data()) });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch pending teachers.' });
    }
});

// 8. GET INSTITUTE STATS (HOD only)
router.get('/institute-stats', verifyToken, async (req, res) => {
    if (req.userRole !== 'hod') return res.status(403).json({ message: 'HOD access required.' });
    
    try {
        const [teachersSnapshot, studentsSnapshot] = await Promise.all([
            db.collection('users').where('instituteId', '==', req.instituteId).where('role', '==', 'teacher').where('isVerified', '==', true).get(),
            db.collection('users').where('instituteId', '==', req.instituteId).where('role', '==', 'student').get()
        ]);

        res.json({
            totalTeachers: teachersSnapshot.size,
            totalStudents: studentsSnapshot.size,
            teachers: teachersSnapshot.docs.map(doc => doc.data()),
            students: studentsSnapshot.docs.map(doc => doc.data())
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats.' });
    }
});

// 9. GET ALL USERS (Admin only)
router.get('/admin/users', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => doc.data());
        
        // Count by role
        const stats = {
            total: users.length,
            global: users.filter(u => u.role === 'global').length,
            students: users.filter(u => u.role === 'student').length,
            teachers: users.filter(u => u.role === 'teacher').length,
            hods: users.filter(u => u.role === 'hod').length,
            admins: users.filter(u => u.role === 'admin').length
        };
        
        res.json({ users, stats });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

// 10. GET ALL INSTITUTES (Admin only)
router.get('/admin/institutes', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    
    try {
        const institutesSnapshot = await db.collection('institutes').get();
        const institutes = [];
        
        for (const doc of institutesSnapshot.docs) {
            const instituteData = doc.data();
            
            // Count students and teachers for this institute
            const [studentsSnapshot, teachersSnapshot] = await Promise.all([
                db.collection('users').where('instituteId', '==', doc.id).where('role', '==', 'student').get(),
                db.collection('users').where('instituteId', '==', doc.id).where('role', '==', 'teacher').get()
            ]);
            
            institutes.push({
                ...instituteData,
                studentCount: studentsSnapshot.size,
                teacherCount: teachersSnapshot.size
            });
        }
        
        res.json({ institutes });
    } catch (error) {
        console.error('Error fetching institutes:', error);
        res.status(500).json({ message: 'Failed to fetch institutes.' });
    }
});

// 11. GET INSTITUTE DETAILS WITH USERS (Admin only)
router.get('/admin/institutes/:instituteId', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    
    try {
        const { instituteId } = req.params;
        const instituteDoc = await db.collection('institutes').doc(instituteId).get();
        
        if (!instituteDoc.exists) {
            return res.status(404).json({ message: 'Institute not found.' });
        }
        
        const [studentsSnapshot, teachersSnapshot, hodSnapshot] = await Promise.all([
            db.collection('users').where('instituteId', '==', instituteId).where('role', '==', 'student').get(),
            db.collection('users').where('instituteId', '==', instituteId).where('role', '==', 'teacher').get(),
            db.collection('users').where('instituteId', '==', instituteId).where('role', '==', 'hod').get()
        ]);
        
        res.json({
            institute: instituteDoc.data(),
            students: studentsSnapshot.docs.map(doc => doc.data()),
            teachers: teachersSnapshot.docs.map(doc => doc.data()),
            hods: hodSnapshot.docs.map(doc => doc.data())
        });
    } catch (error) {
        console.error('Error fetching institute details:', error);
        res.status(500).json({ message: 'Failed to fetch institute details.' });
    }
});

// 12. DELETE USER (Admin only)
router.delete('/admin/users/:userId', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    
    try {
        const { userId } = req.params;
        
        // Delete from Firestore
        await db.collection('users').doc(userId).delete();
        
        // Delete from Firebase Auth
        await admin.auth().deleteUser(userId);
        
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user.', error: error.message });
    }
});

// 13. DELETE INSTITUTE (Admin only)
router.delete('/admin/institutes/:instituteId', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
    
    try {
        const { instituteId } = req.params;
        
        // Get all users from this institute
        const usersSnapshot = await db.collection('users').where('instituteId', '==', instituteId).get();
        
        // Delete all users
        const batch = db.batch();
        const deleteAuthPromises = [];
        
        usersSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
            deleteAuthPromises.push(admin.auth().deleteUser(doc.id).catch(err => console.error('Error deleting auth user:', err)));
        });
        
        // Delete institute document
        batch.delete(db.collection('institutes').doc(instituteId));
        
        await Promise.all([batch.commit(), ...deleteAuthPromises]);
        
        res.json({ message: 'Institute and all associated users deleted successfully.' });
    } catch (error) {
        console.error('Error deleting institute:', error);
        res.status(500).json({ message: 'Failed to delete institute.', error: error.message });
    }
});

// 14. CREATE OR UPDATE USER DOCUMENT (for direct Firebase Auth signups)
// Note: This endpoint uses a modified verifyToken that doesn't require existing claims
router.post('/sync-user', async (req, res) => {
    console.log('[sync-user] Request received');
    try {
        // Verify token manually without requiring existing claims
        const header = req.headers.authorization;
        if (!header) {
            console.error('[sync-user] Authorization header missing');
            return res.status(401).json({ message: 'Authorization header missing.' });
        }
        const token = header.split(' ')[1];
        if (!token) {
            console.error('[sync-user] Token missing from header');
            return res.status(401).json({ message: 'Token missing.' });
        }

        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(token);
            console.log('[sync-user] Token verified for uid:', decodedToken.uid);
        } catch (error) {
            console.error('[sync-user] Token verification failed:', error);
            return res.status(403).json({ message: 'Invalid or expired token.', error: error.message });
        }

        const uid = decodedToken.uid;
        const { name, email } = req.body;
        console.log('[sync-user] Processing for uid:', uid, 'name:', name, 'email:', email);
        
        // Check if user document already exists
        const userDoc = await db.collection('users').doc(uid).get();
        
        if (userDoc.exists) {  // Note: Admin SDK uses .exists (property), not .exists() (function)
            console.log('[sync-user] User document already exists');
            // User document exists, just return it
            return res.json({ 
                message: 'User document already exists.',
                user: userDoc.data() 
            });
        }
        
        console.log('[sync-user] Creating new user document');
        // Create new user document for direct signup (global user)
        const { city, country } = req.body;
        const userData = {
            uid: uid,
            name: name || email.split('@')[0],
            email: email,
            role: 'global', // Global user, not tied to any institute
            instituteId: null,
            isVerified: true,
            ecoPoints: 0,
            coins: 0,
            xp: 0,
            level: 1,
            badges: [],
            city: city || '',
            country: country || '',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('users').doc(uid).set(userData);
        console.log('[sync-user] User document created in Firestore');
        
        // Set custom claims for global user
        await admin.auth().setCustomUserClaims(uid, { 
            role: 'global',
            instituteId: null 
        });
        console.log('[sync-user] Custom claims set successfully');
        
        res.status(201).json({ 
            message: 'User document created successfully.',
            user: userData 
        });
        
    } catch (error) {
        console.error('[sync-user] Error syncing user:', error);
        console.error('[sync-user] Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Failed to sync user document.',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 15. JOIN INSTITUTE (for existing global users)
router.post('/join-institute', verifyToken, [
    body('code').notEmpty().withMessage('Registration code is required.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
    }

    const { code } = req.body;
    const uid = req.uid;

    try {
        // Get current user data
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userData = userDoc.data();

        // Check if user is already in an institute
        if (userData.instituteId) {
            return res.status(400).json({ message: 'You are already part of an institute.' });
        }

        // Verify the code and determine role
        let querySnapshot = await db.collection('institutes')
            .where('teacherRegistrationCode', '==', code)
            .limit(1)
            .get();

        let inferredRole = null;
        let instituteDoc = null;

        if (!querySnapshot.empty) {
            instituteDoc = querySnapshot.docs[0];
            inferredRole = 'teacher';
        } else {
            querySnapshot = await db.collection('institutes')
                .where('studentRegistrationCode', '==', code)
                .limit(1)
                .get();

            if (!querySnapshot.empty) {
                instituteDoc = querySnapshot.docs[0];
                inferredRole = 'student';
            }
        }

        if (!instituteDoc) {
            return res.status(404).json({ message: 'Invalid registration code.' });
        }

        const instituteData = instituteDoc.data();
        const instituteId = instituteDoc.id;

        // Update user document
        const updateData = {
            role: inferredRole,
            instituteId: instituteId,
            wasGlobal: true, // Track that this user was global before
            joinedInstituteAt: admin.firestore.FieldValue.serverTimestamp(),
            isVerified: inferredRole === 'student' ? true : false // Teachers need HOD approval
        };

        // For teachers, add department field if not exists
        if (inferredRole === 'teacher' && !userData.department) {
            updateData.department = 'General';
        }

        // For students, add class field if not exists
        if (inferredRole === 'student' && !userData.class) {
            updateData.class = 'Not Specified';
        }

        await db.collection('users').doc(uid).update(updateData);

        // Update custom claims
        await admin.auth().setCustomUserClaims(uid, {
            role: inferredRole,
            instituteId: instituteId
        });

        res.status(200).json({
            message: `Successfully joined institute as ${inferredRole}.`,
            role: inferredRole,
            instituteName: instituteData.name,
            instituteId: instituteId,
            needsVerification: inferredRole === 'teacher'
        });

    } catch (error) {
        console.error('Error joining institute:', error);
        res.status(500).json({ 
            message: 'Failed to join institute.',
            error: error.message 
        });
    }
});

module.exports = router;