// Migration script to add isGlobal field to existing challenges
// Run this once to update all existing challenges

require('dotenv').config();
const { db } = require('../firebaseConfig');

async function migrateChallengesToGlobal() {
    try {
        console.log('🔍 Fetching all challenges...');
        
        const challengesSnapshot = await db.collection('challenges').get();
        console.log(`📊 Found ${challengesSnapshot.size} challenges`);
        
        if (challengesSnapshot.empty) {
            console.log('✅ No challenges to migrate');
            process.exit(0);
        }
        
        const batch = db.batch();
        let count = 0;
        
        challengesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            
            // Only update if isGlobal doesn't exist
            if (data.isGlobal === undefined) {
                batch.update(doc.ref, {
                    isGlobal: false, // All existing challenges are institute challenges
                    updatedAt: new Date()
                });
                count++;
            }
        });
        
        if (count > 0) {
            await batch.commit();
            console.log(`✅ Updated ${count} challenges with isGlobal: false`);
        } else {
            console.log('✅ All challenges already have isGlobal field');
        }
        
        console.log('\n🎉 Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Error migrating challenges:', error);
    }
    
    process.exit(0);
}

migrateChallengesToGlobal();
