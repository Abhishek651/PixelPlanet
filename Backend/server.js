// backend/server.js

console.log('🚀 Starting server initialization...');
console.log('📦 Node version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// --- 1. IMPORT DEPENDENCIES ---
try {
    console.log('📥 Loading dotenv...');
    require('dotenv').config();
    console.log('✅ dotenv loaded');
} catch (error) {
    console.error('❌ Failed to load dotenv:', error.message);
}

try {
    console.log('📥 Loading express...');
    var express = require('express');
    console.log('✅ express loaded');
} catch (error) {
    console.error('❌ Failed to load express:', error.message);
    throw error;
}

try {
    console.log('📥 Loading cors...');
    var cors = require('cors');
    console.log('✅ cors loaded');
} catch (error) {
    console.error('❌ Failed to load cors:', error.message);
    throw error;
}

// --- 2. INITIALIZE FIREBASE (with error handling) ---
let db, admin;
try {
    console.log('🔥 Initializing Firebase...');
    const firebaseConfig = require('./firebaseConfig');
    db = firebaseConfig.db;
    admin = firebaseConfig.admin;
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.error('Stack:', error.stack);
}

// --- 3. INITIALIZE EXPRESS APP ---
console.log('🎯 Creating Express app...');
const app = express();
console.log('✅ Express app created');

// --- 4. APPLY MIDDLEWARE ---
const corsOptions = {
    origin: ['https://pixel-planet-frontend.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));

// --- 5. IMPORT & USE ROUTES ---
console.log('📂 Loading routes...');
try {
    console.log('  Loading auth routes...');
    const authRoutes = require('./routes/auth');
    console.log('  Loading quiz routes...');
    const quizRoutes = require('./routes/quiz');
    console.log('  Loading challenge routes...');
    const challengeRoutes = require('./routes/challenges');
    console.log('  Loading analytics routes...');
    const analyticsRoutes = require('./routes/analytics');
    console.log('  Loading announcement routes...');
    const announcementRoutes = require('./routes/announcements');
    console.log('  Loading ecobot routes...');
    const ecobotRoutes = require('./routes/ecobot');
    console.log('  Loading leaderboard routes...');
    const leaderboardRoutes = require('./routes/leaderboard');
    console.log('  Loading admin management routes...');
    const adminManagementRoutes = require('./routes/admin-management');
    console.log('  Loading creator analytics routes...');
    const creatorAnalyticsRoutes = require('./routes/creator-analytics');
    console.log('  Loading game profile routes...');
    const gameProfileRoutes = require('./routes/game-profile');
    console.log('  Loading green feed routes...');
    const greenFeedRoutes = require('./routes/green-feed');
    console.log('  Loading physical challenge routes...');
    const physicalChallengeRoutes = require('./routes/physical-challenge');

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
    app.use('/api/green-feed', greenFeedRoutes);
    app.use('/api/physical-challenge', physicalChallengeRoutes);
    
    console.log('✅ All routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading routes:', error.message);
    console.error('Stack:', error.stack);
}

// Root route
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Pixel Planet API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found', path: req.url });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Global error handler triggered');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('Request:', req.method, req.url);
    
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
});

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
});

// --- 6. EXPORT FOR VERCEL (Serverless) ---
if (process.env.VERCEL) {
    const serverless = require('serverless-http');
    module.exports = serverless(app);
    console.log('📤 Exporting serverless handler for Vercel...');
} else {
    module.exports = app;
}

// --- 7. START SERVER (only for local development) ---
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log('\n' + '='.repeat(50));
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🚀 Server ready to accept requests`);
        console.log('='.repeat(50) + '\n');
    });
}

console.log('✅ Server initialization complete');