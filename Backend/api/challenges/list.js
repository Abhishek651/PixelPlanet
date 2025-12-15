// api/challenges/list.js
const { corsMiddleware } = require('../../utils/cors.js');

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Import Firebase config
    const firebaseConfig = require('../../firebaseConfig');
    const { db } = firebaseConfig;

    // Get query parameters
    const { instituteId, userId, userRole } = req.query;

    let challengesQuery = db.collection('challenges');

    // Filter based on user role and institute
    if (userRole === 'student' && instituteId) {
      challengesQuery = challengesQuery.where('instituteId', '==', instituteId);
    }

    const snapshot = await challengesQuery.get();
    const challenges = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      challenges.push({
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate?.() || data.startDate,
        expiryDate: data.expiryDate?.toDate?.() || data.expiryDate
      });
    });

    res.status(200).json({
      success: true,
      challenges
    });

  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenges'
    });
  }
}

module.exports = corsMiddleware(handler);