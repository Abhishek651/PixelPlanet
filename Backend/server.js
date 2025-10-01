// backend/server.js

// --- 1. IMPORT DEPENDENCIES ---
require('dotenv').config(); // <-- ADD THIS AT THE VERY TOP
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');       // <-- ADD fs (File System)
const path = require('path');   // <-- ADD path

// --- 2. INITIALIZE FIREBASE ADMIN (CORRECTED & SECURE WAY) ---
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
// You correctly load the port from the .env file
const PORT = process.env.PORT || 5001;

// --- 4. APPLY MIDDLEWARE ---
app.use(express.json());

// Use the CORS_ORIGIN from your .env file for better security
const corsOptions = {
    origin: process.env.CORS_ORIGIN
};
app.use(cors(corsOptions)); 
console.log(`CORS enabled for origin: ${process.env.CORS_ORIGIN}`);


// --- 5. IMPORT & USE ROUTES ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// --- 6. START THE SERVER ---
app.listen(PORT, () => {
    console.log(`✅ PixelPlanet backend server is running at http://localhost:${PORT}`);
});