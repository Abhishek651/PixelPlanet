// Script to update expired challenge dates
const admin = require('firebase-admin');

// Initialize Firebase Admin (make sure serviceAccountKey.json is in the same directory)
const serviceAccount = require('./Backend/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateChallengeExpiryDates() {
  try {
    const challengesRef = db.collection('challenges');
    const snapshot = await challengesRef.get();
    
    const batch = db.batch();
    const currentDate = new Date();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
      
      // If challenge has expired, extend it by 30 days from now
      if (expiryDate && expiryDate < currentDate) {
        const newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + 30);
        
        console.log(`Updating challenge "${data.title}"`);
        console.log(`  Old expiry: ${expiryDate}`);
        console.log(`  New expiry: ${newExpiryDate}`);
        
        batch.update(doc.ref, {
          expiryDate: admin.firestore.Timestamp.fromDate(newExpiryDate)
        });
      }
    });
    
    await batch.commit();
    console.log('✅ Challenge expiry dates updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating challenges:', error);
  }
}

updateChallengeExpiryDates();