// Backend/routes/physical-challenge.js
const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { b2Client, B2_CONFIG } = require('../config/backblazeConfig');
const { verifyImage } = require('../utils/imageVerification');
const { detectAIGeneratedImage, verifyChallengeCompletion, getImageDescription } = require('../utils/novaVerification');

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

/**
 * Submit physical challenge with AI verification
 */
router.post('/submit/:challengeId', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { challengeId } = req.params;
        const userId = req.uid;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ 
                success: false,
                error: 'Image is required for physical challenge submission' 
            });
        }

        // Get challenge details
        const challengeDoc = await db.collection('challenges').doc(challengeId).get();
        if (!challengeDoc.exists) {
            return res.status(404).json({ 
                success: false,
                error: 'Challenge not found' 
            });
        }

        const challenge = challengeDoc.data();
        
        // Check if challenge has expired
        if (challenge.expiryDate && new Date(challenge.expiryDate) < new Date()) {
            return res.status(400).json({
                success: false,
                error: 'Challenge has expired'
            });
        }

        console.log('🔍 Starting image verification process...');

        // STEP 1: Extract metadata and verify location (only if location is enabled)
        let metadataVerification = { passed: true, summary: { warnings: [] } };
        
        if (challenge.location && challenge.location.latitude && challenge.location.longitude) {
            console.log('📍 Step 1: Verifying image metadata and location...');
            
            metadataVerification = await verifyImage(imageFile.buffer, challenge.location);
            
            if (!metadataVerification.passed) {
                return res.status(400).json({
                    success: false,
                    stage: 'metadata_verification',
                    error: 'Image verification failed',
                    details: metadataVerification.summary,
                    feedback: generateFeedback('metadata', metadataVerification)
                });
            }

            console.log('✅ Metadata verification passed');
        } else {
            console.log('⏭️ Step 1: Location verification skipped (not enabled for this challenge)');
        }

        // STEP 2: Detect AI-generated images
        console.log('🤖 Step 2: Checking for AI-generated content...');
        const aiDetection = await detectAIGeneratedImage(imageFile.buffer);
        
        if (aiDetection.success && !aiDetection.isReal) {
            return res.status(400).json({
                success: false,
                stage: 'ai_detection',
                error: 'Image appears to be AI-generated',
                details: {
                    confidence: aiDetection.confidence,
                    type: aiDetection.type,
                    reasoning: aiDetection.reasoning
                },
                feedback: generateFeedback('ai_generated', aiDetection)
            });
        }

        console.log('✅ AI detection passed');

        // STEP 3: Get image description
        console.log('📝 Step 3: Analyzing image content...');
        const imageDescription = await getImageDescription(imageFile.buffer);
        console.log('Image description:', imageDescription);

        // STEP 4: Verify challenge completion with Nova AI (if enabled)
        let challengeVerification = { success: true, completed: true, confidence: 100, matchScore: 100 };
        
        if (challenge.requiresVerification) {
            console.log('🎯 Step 4: Verifying challenge completion with Nova AI...');
            challengeVerification = await verifyChallengeCompletion(
                imageFile.buffer,
                challenge.description,
                challenge.title
            );
        } else {
            console.log('⏭️ Step 4: AI verification skipped (not enabled for this challenge)');
        }

        if (!challengeVerification.success) {
            return res.status(500).json({
                success: false,
                stage: 'ai_verification',
                error: 'AI verification service failed',
                details: { error: challengeVerification.error }
            });
        }

        // Check if challenge was completed
        if (!challengeVerification.completed || challengeVerification.matchScore < 60) {
            return res.status(400).json({
                success: false,
                stage: 'challenge_verification',
                error: 'Challenge completion not verified',
                details: {
                    confidence: challengeVerification.confidence,
                    matchScore: challengeVerification.matchScore,
                    observedAction: challengeVerification.observedAction,
                    reasoning: challengeVerification.reasoning
                },
                feedback: generateFeedback('challenge_mismatch', challengeVerification)
            });
        }

        console.log('✅ Challenge verification passed');

        // STEP 5: Upload image to Backblaze
        console.log('☁️ Step 5: Uploading verified image...');
        const timestamp = Date.now();
        const filename = `physical-challenges/${userId}/${challengeId}/${timestamp}_${imageFile.originalname}`;
        
        const uploadParams = {
            Bucket: B2_CONFIG.bucketName,
            Key: filename,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype,
        };

        await b2Client.send(new PutObjectCommand(uploadParams));
        const imageUrl = `${B2_CONFIG.publicUrl}/${filename}`;

        console.log('✅ Image uploaded successfully');

        // STEP 6: Create submission record
        const submissionData = {
            challengeId,
            userId,
            imageUrl,
            imageDescription,
            submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            verification: {
                metadata: metadataVerification.summary,
                aiDetection: {
                    isReal: aiDetection.isReal,
                    confidence: aiDetection.confidence,
                    type: aiDetection.type
                },
                challengeMatch: {
                    completed: challengeVerification.completed,
                    confidence: challengeVerification.confidence,
                    matchScore: challengeVerification.matchScore,
                    observedAction: challengeVerification.observedAction,
                    reasoning: challengeVerification.reasoning
                }
            },
            status: 'approved', // Auto-approved after AI verification
            points: challenge.rewardPoints || 100
        };

        const submissionRef = await db.collection('physicalChallengeSubmissions').add(submissionData);

        // STEP 7: Award points to user
        await db.collection('users').doc(userId).update({
            xp: admin.firestore.FieldValue.increment(challenge.rewardPoints || 100),
            coins: admin.firestore.FieldValue.increment(Math.floor((challenge.rewardPoints || 100) / 2)),
            completedChallenges: admin.firestore.FieldValue.arrayUnion(challengeId)
        });

        console.log('🎉 Challenge submission completed successfully!');

        res.status(201).json({
            success: true,
            message: 'Challenge completed successfully!',
            submissionId: submissionRef.id,
            points: challenge.rewardPoints || 100,
            verification: {
                allChecksPassed: true,
                confidence: challengeVerification.confidence,
                matchScore: challengeVerification.matchScore
            },
            feedback: {
                title: '🎉 Challenge Completed!',
                message: challengeVerification.feedback || 'Great job! Your submission has been verified and approved.',
                positiveIndicators: challengeVerification.positiveIndicators || [],
                observedAction: challengeVerification.observedAction
            }
        });

    } catch (error) {
        console.error('❌ Error submitting physical challenge:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        
        res.status(500).json({
            success: false,
            error: 'Failed to submit challenge',
            details: error.message,
            feedback: {
                title: '❌ Submission Error',
                message: 'An error occurred while processing your submission. Please try again.',
                suggestions: [
                    'Make sure your image is a valid JPEG or PNG file',
                    'Try using a smaller image (under 10MB)',
                    'Ensure you have a stable internet connection',
                    'Contact support if the problem persists'
                ]
            }
        });
    }
});

/**
 * Generate user-friendly feedback based on rejection reason
 */
function generateFeedback(stage, details) {
    switch (stage) {
        case 'metadata':
            return {
                title: '❌ Image Verification Failed',
                message: 'Your image did not pass our verification checks.',
                reasons: details.summary.warnings,
                suggestions: [
                    !details.locationCheck.hasGPS && 'Enable location services on your camera',
                    !details.locationCheck.verified && `Take the photo at the challenge location (${details.locationCheck.reason})`,
                    details.authenticityCheck.score < 60 && 'Use your phone\'s camera app (not screenshots or edited images)',
                    'Ensure your photo has proper metadata (EXIF data)',
                    'Take a fresh photo at the actual location'
                ].filter(Boolean)
            };

        case 'ai_generated':
            return {
                title: '🤖 AI-Generated Image Detected',
                message: 'Our system detected that this image may be artificially generated.',
                reasons: [
                    `Detection confidence: ${details.confidence}%`,
                    `Image type: ${details.type}`,
                    details.reasoning
                ],
                suggestions: [
                    'Take a real photo with your camera',
                    'Do not use AI image generators',
                    'Do not use heavily edited or filtered images',
                    'Submit authentic documentation of your environmental action'
                ]
            };

        case 'challenge_mismatch':
            return {
                title: '❌ Challenge Not Completed',
                message: 'Your submission does not match the challenge requirements.',
                reasons: [
                    `Match score: ${details.matchScore}%`,
                    `What we observed: ${details.observedAction}`,
                    details.reasoning
                ],
                concerns: details.concerns || [],
                suggestions: [
                    'Review the challenge description carefully',
                    'Ensure your photo clearly shows the required action',
                    'Include all necessary elements mentioned in the challenge',
                    'Take a clearer photo that better demonstrates completion',
                    ...(details.concerns || []).map(c => `Address: ${c}`)
                ]
            };

        default:
            return {
                title: '❌ Verification Failed',
                message: 'Your submission could not be verified.',
                suggestions: ['Please try again with a valid image']
            };
    }
}

/**
 * Get user's submission history
 */
router.get('/submissions', verifyToken, async (req, res) => {
    try {
        const userId = req.uid;
        const { limit = 20 } = req.query;

        const snapshot = await db.collection('physicalChallengeSubmissions')
            .where('userId', '==', userId)
            .orderBy('submittedAt', 'desc')
            .limit(parseInt(limit))
            .get();

        const submissions = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            const challengeDoc = await db.collection('challenges').doc(data.challengeId).get();
            
            submissions.push({
                id: doc.id,
                ...data,
                challenge: challengeDoc.exists ? {
                    id: data.challengeId,
                    title: challengeDoc.data().title,
                    description: challengeDoc.data().description
                } : null,
                submittedAt: data.submittedAt?.toDate().toISOString()
            });
        }

        res.json({ submissions });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

module.exports = router;
