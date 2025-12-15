// api/test-cors.js - Comprehensive CORS test
const { setCorsHeaders } = require('../utils/cors.js');

module.exports = (req, res) => {
  console.log('CORS Test - Method:', req.method);
  console.log('CORS Test - Origin:', req.headers.origin);
  console.log('CORS Test - Headers:', req.headers);
  
  // Set CORS headers
  setCorsHeaders(res, req.headers.origin);
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    console.log('CORS Test - Handling OPTIONS preflight');
    return res.status(200).end();
  }
  
  // Handle GET request
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'CORS test successful',
      method: req.method,
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
      cors: 'working properly',
      preflight: 'handled'
    });
  }
  
  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
};