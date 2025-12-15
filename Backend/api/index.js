// api/index.js
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
    message: 'Pixel Planet API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
};
