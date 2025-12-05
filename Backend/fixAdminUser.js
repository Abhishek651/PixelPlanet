// Script to fix admin user role in database
// Run this once to update existing admin user

require('dotenv').config();
const { db, admin } = require('./firebaseConfig');

const ADMIN_EMAIL = 'cyberlord700@gmail.com';

async function fixAdminUser() {
    try {
        console.log('🔍 Searching for admin user...');
        
        // Find user by email
        const userRecord = await admin.auth().getUserByEmail(ADMIN_EMAIL);
        console.log('✅ Found user:', userRecord.uid);
        
        // Update custom claims
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'admin',
            instituteId: null // Admin doesn't need institute
        });
        console.log('✅ Updated custom claims to admin');
        
        // Update Firestore document with full admin permissions
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: ADMIN_EMAIL,
            name: 'Main Admin',
            role: 'admin',
            instituteId: null,
            permissions: {
                canManageUsers: true,
                canDeleteContent: true,
                canViewAnalytics: true,
                canCreateGlobalChallenges: true,
                canManageInstitutes: true,
                canManageAdmins: true
            },
            isVerified: true,
            ecoPoints: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log('✅ Updated Firestore document to admin with full permissions');
        
        console.log('\n🎉 Admin user fixed successfully!');
        console.log('Please log out and log back in for changes to take effect.');
        
    } catch (error) {
        console.error('❌ Error fixing admin user:', error);
    }
    
    process.exit(0);
}

fixAdminUser();
