// Backend/migrations/addLocationToUsers.js
// Migration script to add default location fields to existing users

require('dotenv').config();
const { db, admin } = require('../firebaseConfig');

async function addLocationToUsers() {
    console.log('🔄 Starting migration: Adding location fields to existing users...\n');

    try {
        // Get all users
        const usersSnapshot = await db.collection('users').get();
        
        if (usersSnapshot.empty) {
            console.log('❌ No users found in database');
            return;
        }

        console.log(`📊 Found ${usersSnapshot.size} users to process\n`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        const batch = db.batch();
        let batchCount = 0;
        const BATCH_SIZE = 500; // Firestore batch limit

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const userId = doc.id;

            // Check if user already has location fields
            if (userData.city !== undefined && userData.country !== undefined) {
                console.log(`⏭️  Skipping ${userData.email || userId} - already has location fields`);
                skippedCount++;
                continue;
            }

            // Add default location fields
            const updates = {};
            
            if (userData.city === undefined) {
                updates.city = '';
            }
            
            if (userData.country === undefined) {
                updates.country = '';
            }

            if (Object.keys(updates).length > 0) {
                batch.update(doc.ref, updates);
                batchCount++;
                updatedCount++;
                console.log(`✅ Queued update for ${userData.email || userId}`);

                // Commit batch if we reach the limit
                if (batchCount >= BATCH_SIZE) {
                    await batch.commit();
                    console.log(`\n💾 Committed batch of ${batchCount} updates\n`);
                    batchCount = 0;
                }
            }
        }

        // Commit any remaining updates
        if (batchCount > 0) {
            await batch.commit();
            console.log(`\n💾 Committed final batch of ${batchCount} updates\n`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ Migration completed successfully!');
        console.log('='.repeat(60));
        console.log(`📊 Summary:`);
        console.log(`   Total users: ${usersSnapshot.size}`);
        console.log(`   Updated: ${updatedCount}`);
        console.log(`   Skipped (already had fields): ${skippedCount}`);
        console.log(`   Errors: ${errorCount}`);
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

// Run the migration
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  Add Location Fields Migration - PixelPlanet');
console.log('═══════════════════════════════════════════════════════');
console.log('');

addLocationToUsers()
    .then(() => {
        console.log('\n✅ Migration script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Migration script failed:', error);
        process.exit(1);
    });
