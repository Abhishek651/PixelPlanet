 // backend/server.js

// --- 1. IMPORT DEPENDENCIES ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db, admin } = require('./firebaseConfig'); // Import db and admin

// --- 3. INITIALIZE EXPRESS APP ---
const app = express();

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
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const challengeRoutes = require('./routes/challenges');
const analyticsRoutes = require('./routes/analytics');
const announcementRoutes = require('./routes/announcements');
const ecobotRoutes = require('./routes/ecobot');
const leaderboardRoutes = require('./routes/leaderboard');
const adminManagementRoutes = require('./routes/admin-management');
const creatorAnalyticsRoutes = require('./routes/creator-analytics');

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/ecobot', ecobotRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminManagementRoutes);
app.use('/api/creator', creatorAnalyticsRoutes);

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

// Add a catch-all route to log 404s
app.use((req, res, next) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found', path: req.url });
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