const { admin, db } = require('../firebaseConfig');

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
        console.error("Token verification failed:", error);
        return res.status(403).send({ message: 'Invalid or expired token.', debugInfo: error.message });
    }
};

module.exports = { verifyToken };
