// backend/firebaseConfig.js

require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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
        throw new Error('Firebase credentials not found');
    }
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

module.exports = { db, admin };
