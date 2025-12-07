// Backend/utils/signedUrl.js
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { b2Client, B2_CONFIG } = require('../config/backblazeConfig');

/**
 * Generate a signed URL for private Backblaze B2 files
 * @param {string} fileKey - The file key/path in the bucket (e.g., "green-feed/userId/filename.jpg")
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} - Signed URL
 */
async function generateSignedUrl(fileKey, expiresIn = 3600) {
    try {
        const command = new GetObjectCommand({
            Bucket: B2_CONFIG.bucketName,
            Key: fileKey,
        });

        const signedUrl = await getSignedUrl(b2Client, command, { expiresIn });
        return signedUrl;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
}

/**
 * Extract file key from full Backblaze URL
 * @param {string} fullUrl - Full Backblaze URL
 * @returns {string} - File key
 */
function extractFileKey(fullUrl) {
    if (!fullUrl) return null;
    
    // Extract key from URL like: https://f005.backblazeb2.com/file/pixelplanet-700/green-feed/userId/file.jpg
    const match = fullUrl.match(/\/file\/[^\/]+\/(.+)$/);
    return match ? match[1] : null;
}

module.exports = {
    generateSignedUrl,
    extractFileKey,
};
