// Backend/utils/novaVerification.js
const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_PRIMARY = 'amazon/nova-2-lite-v1:free';
const MODEL_FALLBACK = 'allenai/molmo-2-8b:free';

const { createLogger } = require('./logger');
const logger = createLogger('novaVerification');

// In-memory metrics (reset on process restart)
const metrics = {
    primaryCalls: 0,
    primaryFailures: 0,
    fallbackCalls: 0,
    fallbackFailures: 0,
    lastEvent: null
};

// Optional Firestore persistence for metrics (best-effort)
let db = null, admin = null;
try {
    const firebaseConfig = require('../firebaseConfig');
    db = firebaseConfig.db;
    admin = firebaseConfig.admin;
} catch (err) {
    logger.warn('Firestore not available for metrics persistence', { error: err.message });
}

async function recordMetricToFirestore(event, details) {
    try {
        if (!db || !admin) return;
        await db.collection('aiVerificationMetrics').add({
            event,
            details,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (err) {
        logger.warn('Failed to persist metric to Firestore', { event, error: err.message });
    }
}

/**
 * Detect MIME type from buffer
 */
function getMimeType(buffer) {
    const signatures = {
        'ffd8ff': 'image/jpeg',
        '89504e47': 'image/png',
        '52494646': 'image/webp' // RIFF header for WebP
    };
    const hex = buffer.toString('hex', 0, 4);
    for (const [sig, mime] of Object.entries(signatures)) {
        if (hex.startsWith(sig)) return mime;
    }
    return 'image/jpeg'; // default
}

/**
 * Call Amazon Nova 2 Lite via OpenRouter with retry logic
 */
async function callNova(prompt, imageBuffer, model = MODEL_PRIMARY, retries = 2) {
    console.log(`🔄 Calling Nova AI (model: ${model}, attempts: ${retries + 1})...`);
    let mimeType = getMimeType(imageBuffer);
    console.log(`📷 Image MIME type: ${mimeType}`);
    
    // Nova only supports JPEG and PNG, convert WebP to JPEG
    if (mimeType === 'image/webp') {
        try {
            console.log('🔄 Converting WebP to JPEG...');
            const sharp = require('sharp');
            imageBuffer = await sharp(imageBuffer).jpeg().toBuffer();
            mimeType = 'image/jpeg';
            console.log('✅ WebP converted to JPEG');
        } catch (error) {
            console.error('❌ Sharp conversion error:', error);
            mimeType = 'image/jpeg';
        }
    }
    
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (attempt > 0) {
                console.log(`🔄 Retry attempt ${attempt + 1}/${retries + 1}...`);
            }
            
            console.log(`📤 Sending request to OpenRouter API (model: ${model})...`);
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://pixelplanet.app',
                    'X-Title': 'PixelPlanet Environmental Education'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: `data:${mimeType};base64,${imageBuffer.toString('base64')}`
                                    }
                                }
                            ]
                        }
                    ]
                })
            });

            console.log(`📥 Response status: ${response.status}`);

            // Update metrics on response
            if (model === MODEL_PRIMARY) {
                metrics.primaryCalls += 1;
            } else if (model === MODEL_FALLBACK) {
                metrics.fallbackCalls += 1;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ API error ${response.status}:`, errorText.substring(0, 200));

                // Track failures and persist metric
                if (response.status === 503) {
                    if (model === MODEL_PRIMARY) {
                        metrics.primaryFailures += 1;
                    } else if (model === MODEL_FALLBACK) {
                        metrics.fallbackFailures += 1;
                    }
                    metrics.lastEvent = { type: 'service_unavailable', model, status: response.status, attempt };
                    logger.warn('AI service returned 503', metrics.lastEvent);
                    recordMetricToFirestore('service_unavailable', metrics.lastEvent);
                }

                if (response.status === 401) {
                    throw new Error('Invalid OpenRouter API key. Please get a valid key from https://openrouter.ai/keys');
                }
                if (response.status === 503 && attempt < retries) {
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`⏳ OpenRouter unavailable (503), retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`SERVICE_UNAVAILABLE_${response.status}`);
            } else {
                // success
                metrics.lastEvent = { type: 'success', model, status: response.status };
                recordMetricToFirestore('service_success', metrics.lastEvent);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error('❌ Unexpected API response:', JSON.stringify(data, null, 2));
                throw new Error('Invalid API response structure');
            }
            
            console.log('✅ Nova AI response received successfully');
            return data.choices[0].message.content;
        } catch (error) {
            console.error(`❌ Attempt ${attempt + 1} failed:`, error.message);
            // Mark attempt failure
            if (model === MODEL_PRIMARY) {
                metrics.primaryFailures += 1;
            } else if (model === MODEL_FALLBACK) {
                metrics.fallbackFailures += 1;
            }
            metrics.lastEvent = { type: 'attempt_failed', model, attempt, message: error.message };
            recordMetricToFirestore('attempt_failed', metrics.lastEvent);

            // If attempts exhausted and we're using the primary model, try fallback once (unless API key invalid)
            if (attempt === retries || error.message.includes('Invalid OpenRouter API key')) {
                if (model === MODEL_PRIMARY && !error.message.includes('Invalid OpenRouter API key')) {
                    logger.info(`Primary model (${MODEL_PRIMARY}) failed after retries; attempting fallback model (${MODEL_FALLBACK})`);
                    return await callNova(prompt, imageBuffer, MODEL_FALLBACK, retries);
                }
                throw error;
            }
        }
    }
}

/**
 * Verify if image is AI-generated using Nova
 */
async function detectAIGeneratedImage(imageBuffer) {
    try {
        const prompt = `Analyze this image and determine if it is:
1. A real photograph taken with a camera
2. An AI-generated image
3. A digitally manipulated/edited photo
4. A screenshot or computer-generated graphic

Provide your analysis in JSON format:
{
  "isReal": boolean,
  "confidence": number (0-100),
  "type": "real_photo" | "ai_generated" | "manipulated" | "screenshot" | "graphic",
  "reasoning": "brief explanation",
  "indicators": ["list of visual indicators that led to this conclusion"]
}`;

        const text = await callNova(prompt, imageBuffer);
        console.log('Nova AI response (detection):', text);
        
        // Remove markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                isReal: analysis.isReal,
                confidence: analysis.confidence,
                type: analysis.type,
                reasoning: analysis.reasoning,
                indicators: analysis.indicators || []
            };
        }

        console.warn('Could not parse JSON from response:', text);
        return {
            success: false,
            error: 'Could not parse AI response',
            isReal: true
        };
    } catch (error) {
        console.error('❌ Error detecting AI-generated image:', error);
        if (error.message.includes('Invalid OpenRouter API key')) {
            return {
                success: false,
                error: 'AI verification unavailable - Invalid API key',
                isReal: true,
                skipVerification: true
            };
        }
        if (error.message.includes('SERVICE_UNAVAILABLE')) {
            console.log('⚠️ AI service temporarily unavailable - returning service error');
            return {
                success: false,
                error: 'AI_SERVICE_UNAVAILABLE',
                isReal: false,
                serviceDown: true
            };
        }
        return {
            success: false,
            error: error.message,
            isReal: true
        };
    }
}

/**
 * Verify challenge completion using Nova
 */
async function verifyChallengeCompletion(imageBuffer, challengeDescription, challengeTitle) {
    try {
        const prompt = `You are verifying if a user has completed an environmental challenge.

Challenge Title: "${challengeTitle}"
Challenge Description: "${challengeDescription}"

Analyze the provided image and determine:
1. Does the image show evidence of completing this specific challenge?
2. What environmental action is visible in the image?
3. Does it match the challenge requirements?
4. Is the evidence convincing and legitimate?

Provide your analysis in JSON format:
{
  "completed": boolean,
  "confidence": number (0-100),
  "matchScore": number (0-100),
  "observedAction": "description of what you see in the image",
  "matchesChallenge": boolean,
  "reasoning": "detailed explanation of your decision",
  "positiveIndicators": ["list of things that support completion"],
  "concerns": ["list of any concerns or missing elements"],
  "feedback": "constructive feedback for the user"
}`;

        const text = await callNova(prompt, imageBuffer);
        console.log('Nova AI response (verification):', text);
        
        // Remove markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                ...analysis
            };
        }

        return {
            success: false,
            error: 'Could not parse AI response',
            completed: false
        };
    } catch (error) {
        console.error('❌ Error verifying challenge completion:', error);
        if (error.message.includes('Invalid OpenRouter API key')) {
            return {
                success: false,
                error: 'AI verification unavailable - Invalid API key',
                completed: true,
                confidence: 0,
                reasoning: 'Manual review required - AI verification unavailable',
                skipVerification: true
            };
        }
        if (error.message.includes('SERVICE_UNAVAILABLE')) {
            console.log('⚠️ AI service temporarily unavailable - returning service error');
            return {
                success: false,
                error: 'AI_SERVICE_UNAVAILABLE',
                completed: false,
                serviceDown: true
            };
        }
        return {
            success: false,
            error: error.message,
            completed: false,
            reasoning: 'AI verification failed'
        };
    }
}

/**
 * Get detailed image description
 */
async function getImageDescription(imageBuffer) {
    try {
        const prompt = `Provide a detailed description of this image, focusing on:
1. Main subject/activity
2. Environmental context
3. Any eco-friendly actions visible
4. Location type (indoor/outdoor, urban/rural, etc.)
5. Time of day (if determinable)
6. Any text or signs visible

Be specific and objective.`;

        const text = await callNova(prompt, imageBuffer);
        console.log('Nova AI response (description):', text);
        return text;
    } catch (error) {
        console.error('❌ Error getting image description:', error);
        if (error.message.includes('Invalid OpenRouter API key')) {
            return 'AI description unavailable - Invalid API key';
        }
        if (error.message.includes('SERVICE_UNAVAILABLE')) {
            console.log('⚠️ AI service temporarily unavailable');
            return 'AI service temporarily unavailable';
        }
        return 'Could not generate image description';
    }
}

function getMetrics() {
    return { ...metrics };
}

module.exports = {
    detectAIGeneratedImage,
    verifyChallengeCompletion,
    getImageDescription,
    getMetrics
};
