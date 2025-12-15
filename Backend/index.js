// index.js - Simple entry point for Vercel
// This file exists to prevent Vercel from trying to use server.js
// All actual API routes are in the /api directory

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.status(200).json({
    message: 'Pixel Planet API - Using Vercel API Routes',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      status: '/api/status',
      test: '/api/test-cors',
      challenges: '/api/challenges/list',
      leaderboard: '/api/leaderboard/institute',
      auth: '/api/auth/verify'
    }
  });
};