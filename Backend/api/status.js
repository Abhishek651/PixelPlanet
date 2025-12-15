// api/status.js - Simple status check
const { setCorsHeaders } = require('../utils/cors.js');

module.exports = (req, res) => {
  // Set CORS headers
  setCorsHeaders(res, req.headers.origin);
  
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle GET request
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      cors: 'enabled',
      deployment: 'vercel-api-routes'
    });
  }
  
  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
};