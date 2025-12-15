module.exports = (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Pixel Planet API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
