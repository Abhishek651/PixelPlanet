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

// --- MIDDLEWARE: VERIFY FIREBASE ID TOKEN ---
const verifyToken = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).send({ message: 'Authorization header missing.' });
    }
    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Token missing.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.uid = decodedToken.uid;
        req.userRole = decodedToken.role;
        req.instituteId = decodedToken.instituteId;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).send({ message: 'Invalid or expired token.', debugInfo: error.message });
    }
};

// --- ROUTES ---

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
        const role = adminEmail === 'cyberlord700@gmail.com' ? 'admin' : 'hod';

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
            role: 'hod',
            instituteId: instituteRef.id,
            isVerified: true,
            ecoPoints: 0,
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
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('instituteId').notEmpty(),
    body('department').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, instituteId, department } = req.body;
    let userRecord;

    try {
        userRecord = await admin.auth().createUser({ email, password, displayName: name });
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'teacher', instituteId });
        
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid, name, email, role: 'teacher', instituteId, department,
            isVerified: false, ecoPoints: 0, createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ message: 'Teacher registered. Awaiting verification.' });
    } catch (error) {
        if (userRecord?.uid) await admin.auth().deleteUser(userRecord.uid).catch(console.error);
        res.status(500).json({ message: getFirebaseErrorMessage(error) });
    }
});

// 4. REGISTER STUDENT
router.post('/register-student', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('instituteId').notEmpty(),
    body('admissionNumber').notEmpty(),
    body('class').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, instituteId, admissionNumber, class: studentClass, section } = req.body;
    let userRecord;

    try {
        userRecord = await admin.auth().createUser({ email, password, displayName: name });
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'student', instituteId });
        
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid, name, email, role: 'student', instituteId, admissionNumber,
            class: studentClass, section: section || '', isVerified: true, ecoPoints: 0, level: 1,
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
router.patch('/verify-teacher/:teacherId', verifyToken, async (req, res) => {
    if (req.userRole !== 'hod') return res.status(403).json({ message: 'HOD access required.' });
    
    try {
        const { teacherId } = req.params;
        const { approved } = req.body;
        
        if (approved) {
            await db.collection('users').doc(teacherId).update({ isVerified: true });
            res.json({ message: 'Teacher verified.' });
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

// 9. CREATE OR UPDATE USER DOCUMENT (for direct Firebase Auth signups)
// Note: This endpoint uses a modified verifyToken that doesn't require existing claims
router.post('/sync-user', async (req, res) => {
    try {
        // Verify token manually without requiring existing claims
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ message: 'Authorization header missing.' });
        }
        const token = header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing.' });
        }

        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(token);
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        const uid = decodedToken.uid;
        const { name, email } = req.body;
        
        // Check if user document already exists
        const userDoc = await db.collection('users').doc(uid).get();
        
        if (userDoc.exists()) {
            // User document exists, just return it
            return res.json({ 
                message: 'User document already exists.',
                user: userDoc.data() 
            });
        }
        
        // Create new user document for direct signup (global user)
        const userData = {
            uid: uid,
            name: name || email.split('@')[0],
            email: email,
            role: 'global', // Global user, not tied to any institute
            instituteId: null,
            isVerified: true,
            ecoPoints: 0,
            level: 1,
            badges: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('users').doc(uid).set(userData);
        
        // Set custom claims for global user
        await admin.auth().setCustomUserClaims(uid, { 
            role: 'global',
            instituteId: null 
        });
        
        res.status(201).json({ 
            message: 'User document created successfully.',
            user: userData 
        });
        
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ 
            message: 'Failed to sync user document.',
            error: error.message 
        });
    }
});

module.exports = router;