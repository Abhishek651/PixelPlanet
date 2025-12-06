 // backend/server.js

// --- 1. IMPORT DEPENDENCIES ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- 2. INITIALIZE FIREBASE (with error handling) ---
let db, admin;
try {
    const firebaseConfig = require('./firebaseConfig');
    db = firebaseConfig.db;
    admin = firebaseConfig.admin;
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    // Continue anyway - routes will handle missing Firebase
}

// --- 3. INITIALIZE EXPRESS APP ---
const app = express();

// Add a logging middleware to see incoming requests
app.use((req, res, next) => {
    console.log(`➡️  Incoming Request: ${req.method} ${req.url}`);
    next();
});

// --- 4. APPLY MIDDLEWARE (CORRECTED ORDER) ---

// ** STEP 1: CONFIGURE AND USE CORS MIDDLEWARE FIRST **
// Support both local development and production
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'https://pixel-planet-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:5001'
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`⚠️ CORS blocked origin: ${origin}`);
            console.log(`✅ Allowed origins:`, allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
};

console.log(`🌐 CORS enabled for origins:`, allowedOrigins);

app.use(cors(corsOptions));

// ** STEP 2: USE OTHER MIDDLEWARE LIKE BODY PARSERS **
app.use(express.json());

// --- 5. IMPORT & USE ROUTES ---
try {
    const authRoutes = require('./routes/auth');
    const quizRoutes = require('./routes/quiz');
    const challengeRoutes = require('./routes/challenges');
    const analyticsRoutes = require('./routes/analytics');
    const announcementRoutes = require('./routes/announcements');
    const ecobotRoutes = require('./routes/ecobot');
    const leaderboardRoutes = require('./routes/leaderboard');
    const adminManagementRoutes = require('./routes/admin-management');
    const creatorAnalyticsRoutes = require('./routes/creator-analytics');
    const gameProfileRoutes = require('./routes/game-profile');

    app.use('/api/auth', authRoutes);
    app.use('/api/quiz', quizRoutes);
    app.use('/api/challenges', challengeRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/announcements', announcementRoutes);
    app.use('/api/ecobot', ecobotRoutes);
    app.use('/api/leaderboard', leaderboardRoutes);
    app.use('/api/admin', adminManagementRoutes);
    app.use('/api/creator', creatorAnalyticsRoutes);
    app.use('/api/game', gameProfileRoutes);
    
    console.log('✅ All routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading routes:', error.message);
    console.error(error.stack);
}

console.log('📋 Registered routes:');
console.log('  - /api/auth');
console.log('  - /api/quiz');
console.log('  - /api/challenges');
console.log('  - /api/analytics');
console.log('  - /api/announcements');
console.log('  - /api/ecobot');
console.log('  - /api/leaderboard');
console.log('  - /api/admin');
console.log('  - /api/creator ✨ (Creator Analytics)');
console.log('  - /api/game 🎮 (Game Profiles)');
console.log('  - /api ✨ (API Health Check)');

// Root route for health check
app.get('/api', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Pixel Planet API is running',
        timestamp: new Date().toISOString(),
        routes: [
            '/api',
            '/api/auth',
            '/api/quiz',
            '/api/challenges',
            '/api/analytics',
            '/api/announcements',
            '/api/ecobot',
            '/api/leaderboard',
            '/api/admin',
            '/api/creator',
            '/api/game'
        ]
    });
});

// Add a catch-all route to log 404s
app.use((req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found', path: req.url });
});

// Global error handler - ensures JSON responses even on errors
app.use((err, req, res, next) => {
    console.error('❌ Global error handler:', err);
    
    // Ensure we always return JSON, never HTML
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
});

// --- 6. EXPORT THE APP FOR VERCEL ---
module.exports = app;

// --- 7. RUN THE SERVER LOCALLY (ONLY IF NOT IN PRODUCTION) ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`✅ Server is running for local development at http://localhost:${PORT}`);
    });
}