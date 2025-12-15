module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.status(200).json({ 
    status: 'ok',
    message: 'Test endpoint working',
    env: {
      hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasGoogleCreds: !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      nodeVersion: process.version
    }
  });
};
