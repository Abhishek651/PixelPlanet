// api/leaderboard/institute.js
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
    const { limit = 10, instituteId } = req.query;

    let usersQuery = db.collection('users')
      .orderBy('totalPoints', 'desc')
      .limit(parseInt(limit));

    // Filter by institute if provided
    if (instituteId) {
      usersQuery = usersQuery.where('instituteId', '==', instituteId);
    }

    const snapshot = await usersQuery.get();
    const leaderboard = [];

    snapshot.forEach((doc, index) => {
      const data = doc.data();
      leaderboard.push({
        id: doc.id,
        rank: index + 1,
        name: data.name,
        totalPoints: data.totalPoints || 0,
        badges: data.badges || [],
        instituteId: data.instituteId
      });
    });

    res.status(200).json({
      success: true,
      leaderboard
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
}

module.exports = corsMiddleware(handler);