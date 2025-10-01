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
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
};

console.log(`CORS will be enabled for origin: ${process.env.CORS_ORIGIN}`);

app.use(cors(corsOptions));

// ** STEP 2: USE OTHER MIDDLEWARE LIKE BODY PARSERS **
app.use(express.json());

// --- 5. IMPORT & USE ROUTES ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// --- 6. EXPORT THE APP FOR VERCEL ---
module.exports = app;

// --- 7. RUN THE SERVER LOCALLY (ONLY IF NOT IN PRODUCTION) ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`✅ Server is running for local development at http://localhost:${PORT}`);
    });
}