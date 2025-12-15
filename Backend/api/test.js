// api/test.js - CORS test endpoint
const { setCorsHeaders } = require('../utils/cors.js');

module.exports = (req, res) => {
  // Set CORS headers
  setCorsHeaders(res, req.headers.origin);
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.status(200).json({
    status: 'ok',
    message: 'CORS test successful',
    method: req.method,
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    cors: 'properly configured',
    env: {
      hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasGoogleCreds: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      nodeVersion: process.version
    }
  });
};
