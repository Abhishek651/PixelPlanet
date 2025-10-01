// backend/server.js

// --- 1. IMPORT DEPENDENCIES ---
require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// --- 2. INITIALIZE FIREBASE ADMIN ---
let serviceAccount;

// PRODUCTION: Use the environment variable if it exists (for Vercel, etc.)
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    console.log("Initializing Firebase Admin with environment variable...");
    serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
} 
// LOCAL DEVELOPMENT: Fallback to the local JSON file
else {
    console.log("Initializing Firebase Admin with local service account file...");
    const serviceAccountKeyPath = path.resolve(__dirname, './serviceAccountKey.json');
    if (fs.existsSync(serviceAccountKeyPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
    } else {
        console.error("Could not find service account key.");
        console.error("Please set GOOGLE_APPLICATION_CREDENTIALS_JSON or place 'serviceAccountKey.json' in the backend root.");
        process.exit(1); // Exit if no credentials found
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Export firestore instance and admin for use in other files
const db = admin.firestore();
module.exports = { db, admin };

// --- 3. INITIALIZE EXPRESS APP ---
const app = express();
const PORT = process.env.PORT || 5001;

// --- 4. APPLY MIDDLEWARE (CORRECTED ORDER) ---

// ** STEP 1: CONFIGURE AND USE CORS MIDDLEWARE FIRST **
// This ensures preflight OPTIONS requests are handled correctly before anything else.
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS", // Be explicit about allowed methods
    allowedHeaders: "Content-Type, Authorization"  // Be explicit about allowed headers
};

console.log(`CORS will be enabled for origin: ${process.env.CORS_ORIGIN}`);

// Use the cors middleware for all incoming requests
app.use(cors(corsOptions));

// Explicitly handle preflight requests for all routes
app.options('*', cors(corsOptions));

// ** STEP 2: USE OTHER MIDDLEWARE LIKE BODY PARSERS **
// This now runs AFTER the preflight check has been handled.
app.use(express.json());

// --- 5. IMPORT & USE ROUTES ---
// This now runs AFTER CORS has been configured and allowed.
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// --- 6. START THE SERVER ---
app.listen(PORT, () => {
    console.log(`✅ PixelPlanet backend server is running at http://localhost:${PORT}`);
});