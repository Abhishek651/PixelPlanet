// Backend/config/backblazeConfig.js
const { S3Client } = require('@aws-sdk/client-s3');

// Backblaze B2 configuration using S3-compatible API
const b2Client = new S3Client({
    endpoint: `https://${process.env.B2_ENDPOINT}`,
    region: 'us-east-005', // Backblaze region
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY,
    },
    forcePathStyle: true, // Required for Backblaze B2
});

const B2_CONFIG = {
    bucketName: process.env.B2_BUCKET_NAME || 'pixelplanet-700',
    bucketId: process.env.B2_BUCKET_ID || '25fbfd9166c9f3969cac0617',
    endpoint: process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com',
    publicUrl: `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME || 'pixelplanet-700'}`,
};

module.exports = { b2Client, B2_CONFIG };
