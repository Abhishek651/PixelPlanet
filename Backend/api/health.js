// api/health.js - Health check with Firebase test
const { setCorsHeaders } = require('../utils/cors.js');

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res, req.headers.origin);
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test Firebase connection
    let firebaseStatus = 'not tested';
    let firebaseError = null;
    
    try {
      const firebaseConfig = require('../firebaseConfig');
      const { db, admin } = firebaseConfig;
      
      // Simple test - just check if we can access the db object
      if (db && admin) {
        firebaseStatus = 'connected';
      } else {
        firebaseStatus = 'configuration error';
      }
    } catch (error) {
      firebaseStatus = 'error';
      firebaseError = error.message;
    }

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      firebase: {
        status: firebaseStatus,
        error: firebaseError
      },
      cors: 'enabled',
      deployment: 'vercel-api-routes'
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};