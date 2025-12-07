// Backend/routes/green-feed.js
const express = require('express');
const router = express.Router();
const { db, admin } = require('../firebaseConfig');
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { b2Client, B2_CONFIG } = require('../config/backblazeConfig');
const { generateSignedUrl, extractFileKey } = require('../utils/signedUrl');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed'));
        }
    }
});

// Get all posts (with pagination)
router.get('/posts', verifyToken, async (req, res) => {
    try {
        const { limit = 10, lastPostId } = req.query;
        const userId = req.uid;

        let query = db.collection('greenFeedPosts')
            .orderBy('createdAt', 'desc')
            .limit(parseInt(limit));

        if (lastPostId) {
            const lastDoc = await db.collection('greenFeedPosts').doc(lastPostId).get();
            if (lastDoc.exists) {
                query = query.startAfter(lastDoc);
            }
        }

        const snapshot = await query.get();
        const posts = [];

        for (const doc of snapshot.docs) {
            const postData = doc.data();
            const userDoc = await db.collection('users').doc(postData.userId).get();
            const userData = userDoc.data();

            // Check if current user has liked this post
            const likeDoc = await db.collection('greenFeedPosts').doc(doc.id)
                .collection('likes').doc(userId).get();

            // Generate signed URL for media if it exists
            let signedMediaUrl = postData.mediaUrl;
            if (postData.mediaUrl) {
                try {
                    const fileKey = extractFileKey(postData.mediaUrl);
                    if (fileKey) {
                        signedMediaUrl = await generateSignedUrl(fileKey, 3600); // 1 hour expiry
                    }
                } catch (error) {
                    console.error('Error generating signed URL for post:', doc.id, error);
                }
            }

            posts.push({
                id: doc.id,
                ...postData,
                mediaUrl: signedMediaUrl, // Use signed URL
                user: {
                    id: postData.userId,
                    name: userData?.name || 'Anonymous',
                    avatar: userData?.avatar || null,
                },
                isLiked: likeDoc.exists,
                createdAt: postData.createdAt?.toDate().toISOString(),
            });
        }

        res.json({ posts, hasMore: snapshot.docs.length === parseInt(limit) });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Create a new post
router.post('/posts', verifyToken, upload.single('media'), async (req, res) => {
    try {
        console.log('📝 Creating Green Feed post...');
        console.log('User ID:', req.uid);
        console.log('Has file:', !!req.file);
        
        const { caption, type = 'post' } = req.body;
        const userId = req.uid;
        const file = req.file;

        if (!caption && !file) {
            return res.status(400).json({ error: 'Caption or media is required' });
        }

        let mediaUrl = null;
        let mediaType = null;

        // Upload file to Backblaze B2 if provided
        if (file) {
            const timestamp = Date.now();
            const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `green-feed/${userId}/${timestamp}_${sanitizedFilename}`;
            
            const uploadParams = {
                Bucket: B2_CONFIG.bucketName,
                Key: filename,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            try {
                console.log('☁️ Uploading to Backblaze:', filename);
                await b2Client.send(new PutObjectCommand(uploadParams));
                mediaUrl = `${B2_CONFIG.publicUrl}/${filename}`;
                mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
                console.log('✅ Upload successful:', mediaUrl);
            } catch (uploadError) {
                console.error('❌ Error uploading to Backblaze:', uploadError);
                console.error('Upload error details:', {
                    message: uploadError.message,
                    code: uploadError.code,
                    statusCode: uploadError.$metadata?.httpStatusCode
                });
                return res.status(500).json({ 
                    error: 'Failed to upload media',
                    details: uploadError.message 
                });
            }
        }

        // Create post document
        const postData = {
            userId,
            caption: caption || '',
            mediaUrl,
            mediaType,
            type, // 'post' or 'reel'
            likes: 0,
            comments: 0,
            shares: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const postRef = await db.collection('greenFeedPosts').add(postData);

        // Award XP for creating a post
        await db.collection('users').doc(userId).update({
            xp: admin.firestore.FieldValue.increment(10),
            coins: admin.firestore.FieldValue.increment(5),
        });

        console.log('🎉 Post created successfully:', postRef.id);
        
        res.status(201).json({ 
            id: postRef.id, 
            ...postData,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ Error creating post:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to create post',
            details: error.message 
        });
    }
});

// Like/Unlike a post
router.post('/posts/:postId/like', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.uid;

        const postRef = db.collection('greenFeedPosts').doc(postId);
        const likeRef = postRef.collection('likes').doc(userId);

        const likeDoc = await likeRef.get();

        if (likeDoc.exists) {
            // Unlike
            await likeRef.delete();
            await postRef.update({
                likes: admin.firestore.FieldValue.increment(-1),
            });
            res.json({ liked: false });
        } else {
            // Like
            await likeRef.set({
                userId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            await postRef.update({
                likes: admin.firestore.FieldValue.increment(1),
            });
            res.json({ liked: true });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// Get comments for a post
router.get('/posts/:postId/comments', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { limit = 20 } = req.query;

        const snapshot = await db.collection('greenFeedPosts').doc(postId)
            .collection('comments')
            .orderBy('createdAt', 'desc')
            .limit(parseInt(limit))
            .get();

        const comments = [];
        for (const doc of snapshot.docs) {
            const commentData = doc.data();
            const userDoc = await db.collection('users').doc(commentData.userId).get();
            const userData = userDoc.data();

            comments.push({
                id: doc.id,
                ...commentData,
                user: {
                    id: commentData.userId,
                    name: userData?.name || 'Anonymous',
                    avatar: userData?.avatar || null,
                },
                createdAt: commentData.createdAt?.toDate().toISOString(),
            });
        }

        res.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add a comment to a post
router.post('/posts/:postId/comments', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.uid;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const commentData = {
            userId,
            text: text.trim(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const commentRef = await db.collection('greenFeedPosts').doc(postId)
            .collection('comments').add(commentData);

        // Increment comment count
        await db.collection('greenFeedPosts').doc(postId).update({
            comments: admin.firestore.FieldValue.increment(1),
        });

        res.status(201).json({ 
            id: commentRef.id, 
            ...commentData,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Delete a post (only by owner)
router.delete('/posts/:postId', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.uid;

        const postDoc = await db.collection('greenFeedPosts').doc(postId).get();
        
        if (!postDoc.exists) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const postData = postDoc.data();
        
        if (postData.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }

        // Delete media from Backblaze if exists
        if (postData.mediaUrl) {
            try {
                // Extract filename from URL
                const urlParts = postData.mediaUrl.split('/');
                const filename = urlParts.slice(-3).join('/'); // green-feed/{userId}/{file}
                
                const deleteParams = {
                    Bucket: B2_CONFIG.bucketName,
                    Key: filename,
                };
                
                await b2Client.send(new DeleteObjectCommand(deleteParams));
            } catch (deleteError) {
                console.error('Error deleting file from Backblaze:', deleteError);
                // Continue with post deletion even if file deletion fails
            }
        }

        // Delete post and subcollections
        await postDoc.ref.delete();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router;
