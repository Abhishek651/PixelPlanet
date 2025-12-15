// api/auth/verify.js
const { corsMiddleware } = require('../../utils/cors.js');

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Import Firebase config
    const firebaseConfig = require('../../firebaseConfig');
    const { admin, db } = firebaseConfig;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing.' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      user: {
        uid,
        ...userData
      }
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ 
      success: false,
      message: 'Invalid token.' 
    });
  }
}

module.exports = corsMiddleware(handler);