// Backend/utils/imageVerification.js
const exifParser = require('exif-parser');
const { getDistance } = require('geolib');
const sharp = require('sharp');

/**
 * Extract EXIF metadata from image buffer
 */
async function extractMetadata(imageBuffer) {
    try {
        // Validate buffer is large enough for EXIF parsing
        if (!imageBuffer || imageBuffer.length < 100) {
            throw new Error('Buffer too small for EXIF data');
        }
        
        const parser = exifParser.create(imageBuffer);
        const result = parser.parse();
        
        return {
            hasExif: !!result.tags,
            timestamp: result.tags?.DateTimeOriginal || result.tags?.DateTime || null,
            gps: result.tags?.GPSLatitude && result.tags?.GPSLongitude ? {
                latitude: result.tags.GPSLatitude,
                longitude: result.tags.GPSLongitude
            } : null,
            camera: {
                make: result.tags?.Make || null,
                model: result.tags?.Model || null,
                software: result.tags?.Software || null
            },
            imageInfo: {
                width: result.imageSize?.width || null,
                height: result.imageSize?.height || null
            }
        };
    } catch (error) {
        // EXIF parsing failed - this is common for screenshots, edited images, etc.
        // Use sharp to get basic image info instead
        try {
            const image = sharp(imageBuffer);
            const metadata = await image.metadata();
            return {
                hasExif: false,
                timestamp: null,
                gps: null,
                camera: {},
                imageInfo: {
                    width: metadata.width,
                    height: metadata.height
                }
            };
        } catch (sharpError) {
            return {
                hasExif: false,
                timestamp: null,
                gps: null,
                camera: {},
                imageInfo: {}
            };
        }
    }
}

/**
 * Verify image location against challenge location
 */
function verifyLocation(imageGPS, challengeLocation, maxDistanceKm = 50) {
    if (!imageGPS || !imageGPS.latitude || !imageGPS.longitude) {
        return {
            verified: false,
            reason: 'No GPS data found in image',
            hasGPS: false
        };
    }

    if (!challengeLocation || !challengeLocation.latitude || !challengeLocation.longitude) {
        return {
            verified: true, // If challenge has no location requirement, pass
            reason: 'Challenge has no location requirement',
            hasGPS: true
        };
    }

    const distance = getDistance(
        { latitude: imageGPS.latitude, longitude: imageGPS.longitude },
        { latitude: challengeLocation.latitude, longitude: challengeLocation.longitude }
    );

    const distanceKm = distance / 1000;

    return {
        verified: distanceKm <= maxDistanceKm,
        reason: distanceKm <= maxDistanceKm 
            ? `Image taken within ${distanceKm.toFixed(2)}km of challenge location`
            : `Image taken ${distanceKm.toFixed(2)}km away from challenge location (max: ${maxDistanceKm}km)`,
        hasGPS: true,
        distance: distanceKm,
        imageLocation: imageGPS,
        challengeLocation: challengeLocation
    };
}

/**
 * Analyze image for signs of manipulation or AI generation
 */
async function analyzeImageAuthenticity(imageBuffer) {
    try {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        const stats = await image.stats();

        // Check for suspicious patterns
        const checks = {
            hasMetadata: !!metadata.exif || !!metadata.icc,
            format: metadata.format,
            hasTransparency: metadata.hasAlpha,
            colorSpace: metadata.space,
            channels: metadata.channels,
            
            // Statistical analysis
            entropy: calculateEntropy(stats),
            uniformity: calculateUniformity(stats),
            
            // Suspicious indicators
            suspiciousFormat: metadata.format === 'webp' && !metadata.exif, // AI often generates WebP
            suspiciousSize: metadata.width === metadata.height && [512, 1024, 2048].includes(metadata.width), // Common AI sizes
            noExif: !metadata.exif && metadata.format === 'jpeg', // Real photos usually have EXIF
        };

        // Calculate authenticity score (0-100)
        let score = 100;
        if (checks.suspiciousFormat) score -= 20;
        if (checks.suspiciousSize) score -= 15;
        if (checks.noExif) score -= 25;
        if (checks.entropy < 6) score -= 20; // Low entropy suggests artificial
        if (checks.uniformity > 0.8) score -= 20; // Too uniform suggests AI

        return {
            score,
            isLikelyReal: score >= 60,
            checks,
            warnings: [
                checks.suspiciousFormat && 'Image format suggests possible AI generation',
                checks.suspiciousSize && 'Image dimensions match common AI output sizes',
                checks.noExif && 'No camera metadata found (expected in real photos)',
                checks.entropy < 6 && 'Low image entropy suggests artificial generation',
                checks.uniformity > 0.8 && 'Unusually uniform color distribution'
            ].filter(Boolean)
        };
    } catch (error) {
        console.error('Error analyzing image authenticity:', error);
        return {
            score: 50,
            isLikelyReal: true, // Benefit of doubt
            checks: {},
            warnings: ['Could not perform full authenticity analysis']
        };
    }
}

/**
 * Calculate image entropy (measure of randomness)
 */
function calculateEntropy(stats) {
    try {
        const channels = stats.channels;
        let totalEntropy = 0;

        channels.forEach(channel => {
            const mean = channel.mean;
            const std = channel.std;
            // Simplified entropy calculation
            const entropy = Math.log2(std + 1);
            totalEntropy += entropy;
        });

        return totalEntropy / channels.length;
    } catch (error) {
        return 7; // Default middle value
    }
}

/**
 * Calculate color uniformity
 */
function calculateUniformity(stats) {
    try {
        const channels = stats.channels;
        let totalUniformity = 0;

        channels.forEach(channel => {
            const std = channel.std;
            const max = channel.max;
            // Lower std relative to max = more uniform
            const uniformity = 1 - (std / (max + 1));
            totalUniformity += uniformity;
        });

        return totalUniformity / channels.length;
    } catch (error) {
        return 0.5; // Default middle value
    }
}

/**
 * Comprehensive image verification
 */
async function verifyImage(imageBuffer, challengeLocation) {
    const metadata = await extractMetadata(imageBuffer);
    const locationCheck = verifyLocation(metadata.gps, challengeLocation);
    const authenticityCheck = await analyzeImageAuthenticity(imageBuffer);

    const passed = locationCheck.verified && authenticityCheck.isLikelyReal;

    return {
        passed,
        metadata,
        locationCheck,
        authenticityCheck,
        summary: {
            hasGPS: locationCheck.hasGPS,
            locationVerified: locationCheck.verified,
            authenticityScore: authenticityCheck.score,
            isLikelyReal: authenticityCheck.isLikelyReal,
            warnings: [
                ...(!locationCheck.verified ? [locationCheck.reason] : []),
                ...authenticityCheck.warnings
            ]
        }
    };
}

module.exports = {
    extractMetadata,
    verifyLocation,
    analyzeImageAuthenticity,
    verifyImage
};
