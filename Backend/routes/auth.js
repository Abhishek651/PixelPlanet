const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');
const { body, validationResult } = require('express-validator');

// --- HELPER FUNCTION TO GENERATE READABLE CODES ---
const generateReadableCode = (prefix, length = 6) => { // Changed default length back to 6 for consistency
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    // No prefix for the general codes as they are looked up directly by value
    return result; // Simplified for direct code matching
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
        // Attach decoded token info directly to req for easier access
        req.uid = decodedToken.uid;
        req.userRole = decodedToken.role; // Custom claim
        req.instituteId = decodedToken.instituteId; // Custom claim
        // req.user = decodedToken; // You could also set a full user object if desired, but direct properties are fine

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).send({ message: 'Invalid or expired token.', debugInfo: error.message });
    }
};

// --- ROUTES ---

// 1. REGISTER INSTITUTE (HOD/Admin) - Cleaned and Consolidated
router.post(
    '/register-institute',
    [
        body('instituteName').notEmpty().withMessage('Institute name is required.'),
        body('instituteType').notEmpty().withMessage('Institute type is required.'),
        body('instituteLocation').notEmpty().withMessage('Institute location is required.'),
        body('adminName').notEmpty().withMessage('Administrator name is required.'),
        body('adminEmail').isEmail().withMessage('Valid admin email is required.'),
        body('adminPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
        }

        const { instituteName, instituteType, instituteLocation, adminName, adminEmail, adminPassword } = req.body;
        let userRecord; // Declare userRecord outside try-catch for cleanup

        try {
            // Create the user in Firebase Auth
            userRecord = await admin.auth().createUser({
                email: adminEmail,
                password: adminPassword,
                displayName: adminName,
            });

            const instituteRef = db.collection('institutes').doc(); // Auto-generate ID

            // TEMPORARY: Assign 'admin' role if email is cyberlord700@gmail.com
            const role = adminEmail === 'cyberlord700@gmail.com' ? 'admin' : 'hod';

            // --- CRITICAL FIX: Add instituteId to HOD claims for granular security
            await admin.auth().setCustomUserClaims(userRecord.uid, {
                role: role,
                instituteId: instituteRef.id
            });
            console.log(`Custom claims set for HOD ${userRecord.uid}: role=${role}, instituteId=${instituteRef.id}`);


            // Generate initial unique codes for this institute (no prefix here, just raw code)
            const teacherCode = generateReadableCode();
            const studentCode = generateReadableCode();

            // Use a Firestore batch for atomic writes
            const batch = db.batch();

            // Create an institute document in Firestore
            batch.set(instituteRef, {
                instituteId: instituteRef.id, // Store the ID explicitly
                name: instituteName,
                type: instituteType,
                location: instituteLocation,
                adminUid: userRecord.uid,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                teacherRegistrationCode: teacherCode, // Store the generated codes
                studentRegistrationCode: studentCode,
            });
            console.log(`Firestore institute document created for ${instituteRef.id} with codes.`);


            // Create a user profile document in Firestore
            const userRef = db.collection('users').doc(userRecord.uid);
            batch.set(userRef, {
                uid: userRecord.uid, // Store UID explicitly
                name: adminName,
                email: adminEmail,
                role: 'hod',
                instituteId: instituteRef.id,
                isVerified: true, // HODs are auto-verified upon registration
            });
            console.log(`Firestore user document created for HOD ${userRecord.uid}`);


            await batch.commit(); // Commit the batch
            console.log("Firestore batch committed successfully for institute registration.");


            res.status(201).send({
                message: 'Institute and Admin registered successfully!',
                instituteId: instituteRef.id,
                teacherRegistrationCode: teacherCode, // Return the generated codes
                studentRegistrationCode: studentCode
            });

        } catch (error) {
            // If Auth user was created but Firestore failed, delete the orphaned Auth user
            if (userRecord && userRecord.uid) {
                console.warn(`Rolling back Auth user creation for UID: ${userRecord.uid} due to an error.`);
                await admin.auth().deleteUser(userRecord.uid).catch(delErr => {
                    console.error(`CRITICAL: Failed to clean up orphaned user ${userRecord.uid}`, delErr);
                });
            }
            console.error(`Error during institute registration for email ${adminEmail}:`, error); // Detailed backend logging
            const userFriendlyMessage = getFirebaseErrorMessage(error);
            res.status(500).send({
                message: `Failed to register institute. ${userFriendlyMessage}`,
                debugInfo: { code: error.code, detail: error.message }
            });
        }
    }
);


// 2. VERIFY INSTITUTE REGISTRATION CODE (Used by JoinInstitutePage)
router.post(
    '/verify-institute-code',
    [
        body('code').notEmpty().withMessage('Registration code is required.'),
        // Remove body('role') validation as role is now inferred
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
        }

        const { code } = req.body; // Only expecting 'code' now

        try {
            // Try to find if the code matches a teacher registration code
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
                // If not a teacher code, try to find if it matches a student registration code
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
                console.log(`Verification failed: No institute found for code '${code}'.`);
                return res.status(404).send({ message: 'Invalid institute code.' });
            }

            const instituteData = instituteDoc.data();

            return res.status(200).send({
                message: 'Code verified successfully.',
                instituteId: instituteData.instituteId,
                instituteName: instituteData.name,
                role: inferredRole, // Return the inferred role
            });

        } catch (error) {
            console.error("Error verifying institute code:", error);
            return res.status(500).send({
                message: 'Internal server error during code verification.',
                debugInfo: error.message,
            });
        }
    }
);


// 3. SET USER CLAIMS AND CREATE USER FIRESTORE DOCUMENT (Used by JoinInstitutePage after Firebase Auth signup)
router.post(
    '/set-user-claims',
    verifyToken, // Ensure only logged-in users (even if temporary) can call this
    [
        body('uid').notEmpty().withMessage('User UID is required.'),
        body('email').isEmail().withMessage('Valid email is required.'),
        body('name').notEmpty().withMessage('Name is required.'),
        body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher.'),
        body('instituteId').notEmpty().withMessage('Institute ID is required.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
        }

        const { uid, email, name, role, instituteId } = req.body;
        const requestingUid = req.uid; // UID from the token of the user making the request

        // IMPORTANT SECURITY CHECK: Ensure the user making the request
        // is the same user whose claims are being set.
        if (uid !== requestingUid) {
            console.warn(`Security Alert: User ${requestingUid} attempted to set claims for ${uid}.`);
            return res.status(403).send({ message: 'Unauthorized: Cannot set claims for another user.' });
        }

        const batch = db.batch();

        try {
            // Set custom claims in Firebase Auth
            await admin.auth().setCustomUserClaims(uid, { role: role, instituteId: instituteId });
            console.log(`Custom claims set for user ${uid}: role=${role}, instituteId=${instituteId}`);

            // Create user document in Firestore 'users' collection
            const userRef = db.collection('users').doc(uid);
            batch.set(userRef, {
                uid: uid,
                email: email,
                name: name,
                role: role,
                instituteId: instituteId,
                isVerified: (role === 'student' || role === 'hod'), // Students & HODs are auto-verified
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`Firestore user document created for ${uid}`);

            await batch.commit();
            console.log("Firestore batch committed for user claims/profile.");

            return res.status(200).send({
                message: 'User claims and profile set successfully.',
                uid: uid,
                role: role,
                instituteId: instituteId,
            });

        } catch (error) {
            console.error("Error setting user claims and profile:", error);
            return res.status(500).send({
                message: 'Failed to set user claims and profile.',
                debugInfo: error.message,
            });
        }
    }
);


// 4. GET USER ROLE & VERIFICATION STATUS (Protected)
router.get('/get-role', verifyToken, async (req, res) => {
    const userRole = req.userRole || 'global';
    const instituteId = req.instituteId || null;

    let isVerified = true; // Default to true, then check if it's a role that requires verification
    if (userRole === 'teacher' || userRole === 'hod') { // Check Firestore for teacher/HOD verification status
        try {
            const userDoc = await db.collection('users').doc(req.uid).get();
            if (userDoc.exists) {
                isVerified = userDoc.data().isVerified || false;
            } else {
                console.warn(`User document not found for UID: ${req.uid} with role ${userRole} during /get-role.`);
                isVerified = false;
            }
        } catch (dbError) {
            console.error(`Error fetching isVerified for UID ${req.uid}:`, dbError);
            isVerified = false;
        }
    }

    res.status(200).send({
        message: `Your role is: ${userRole}. Verified status: ${isVerified}`,
        role: userRole,
        isVerified: isVerified,
        instituteId: instituteId
    });
});


// 5. GET USER PROFILE (Protected)
router.get('/users/:uid', verifyToken, async (req, res) => {
    const { uid } = req.params;
    const requestingUid = req.uid;
    const requestingRole = req.userRole;
    const requestingInstituteId = req.instituteId;

    try {
        const targetUserDoc = await db.collection('users').doc(uid).get();
        if (!targetUserDoc.exists) {
            console.warn(`User document not found for UID: ${uid}`);
            return res.status(404).send({ message: 'User profile not found.' });
        }

        const targetUserData = targetUserDoc.data();

        // Authorization checks
        const isOwner = requestingUid === uid;
        const isHodOfSameInstitute =
            requestingRole === 'hod' &&
            requestingInstituteId && // Ensure requesting HOD has an instituteId claim
            requestingInstituteId === targetUserData.instituteId;

        if (!isOwner && !isHodOfSameInstitute) {
            console.warn(`Unauthorized attempt by ${requestingUid} (role: ${requestingRole}, inst: ${requestingInstituteId}) to access profile for ${uid} (role: ${targetUserData.role}, inst: ${targetUserData.instituteId})`);
            return res.status(403).send({ message: 'You are not authorized to view this profile.' });
        }

        // IMPORTANT: Never send passwords or sensitive authentication tokens.
        // Filter out sensitive fields like passwords if they were ever stored (they shouldn't be).
        const { password, ...safeUserData } = targetUserData; // Example of filtering
        res.status(200).send(safeUserData);
    } catch (error) {
        console.error(`Error fetching user profile for UID ${uid}:`, error);
        res.status(500).send({ message: 'Failed to fetch user profile.', error: error.message });
    }
});

// 6. GET INSTITUTE CODES (Protected, HOD only)
router.get('/institute-codes/:instituteId', verifyToken, async (req, res) => {
    const { instituteId } = req.params;
    const requestingUid = req.uid;
    const requestingRole = req.userRole;
    const requestingInstituteId = req.instituteId;

    // Authorization: Only the HOD of this institute can access these codes
    if (requestingRole !== 'hod' || !requestingInstituteId || requestingInstituteId !== instituteId) {
        console.warn(`Unauthorized access attempt to institute codes by ${requestingUid} (role: ${requestingRole}, claim_inst: ${requestingInstituteId}) for requested_inst: ${instituteId}`);
        return res.status(403).send({ message: 'Unauthorized to view these institute codes.' });
    }

    try {
        const instituteDoc = await db.collection('institutes').doc(instituteId).get();
        if (!instituteDoc.exists) {
            console.warn(`Institute document not found for ID: ${instituteId} during codes fetch.`);
            return res.status(404).send({ message: 'Institute not found.' });
        }

        const data = instituteDoc.data();
        res.status(200).send({
            instituteId: data.instituteId, // Use data.instituteId as it's guaranteed to be correct from doc
            instituteName: data.name,
            teacherRegistrationCode: data.teacherRegistrationCode,
            studentRegistrationCode: data.studentRegistrationCode,
        });

    } catch (error) {
        console.error(`Error fetching institute codes for ID ${instituteId}:`, error);
        res.status(500).send({ message: 'Failed to fetch institute codes.', error: error.message });
    }
});

// 7. REGENERATE CODE (Protected, HOD only)
router.post(
    '/institute-codes/:instituteId/regenerate',
    verifyToken,
    [
        body('type').isIn(['teacher', 'student']).withMessage('Type must be "teacher" or "student".'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed.', errors: errors.array() });
        }

        const { instituteId } = req.params;
        const { type } = req.body;
        const requestingUid = req.uid;
        const requestingRole = req.userRole;
        const requestingInstituteId = req.instituteId;

        // Authorization: Only the HOD of this institute can regenerate codes
        if (requestingRole !== 'hod' || !requestingInstituteId || requestingInstituteId !== instituteId) {
            console.warn(`Unauthorized regeneration attempt by ${requestingUid} (role: ${requestingRole}, claim_inst: ${requestingInstituteId}) for requested_inst: ${instituteId}`);
            return res.status(403).send({ message: 'Unauthorized to regenerate codes.' });
        }

        try {
            const instituteRef = db.collection('institutes').doc(instituteId);
            let newCode = generateReadableCode(); // Use the single generator
            const fieldToUpdate = `${type}RegistrationCode`;

            await instituteRef.update({
                [fieldToUpdate]: newCode,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            res.status(200).send({ message: `${type} registration code regenerated successfully!`, newCode });
        } catch (error) {
            console.error(`Error regenerating ${type} code for institute ${instituteId}:`, error);
            res.status(500).send({ message: `Failed to regenerate ${type} code.`, error: error.message });
        }
    }
);


// Removed old register-teacher and register-student routes
// as the JoinInstitutePage with /verify-institute-code and /set-user-claims
// should now handle this flow for teachers and students.


module.exports = router;