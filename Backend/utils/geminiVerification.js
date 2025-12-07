// Backend/utils/geminiVerification.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../firebaseConfig');

/**
 * Get Gemini API key from admin settings or environment variable
 */
async function getGeminiApiKey() {
    try {
        // Try to get from Firestore settings first
        const settingsDoc = await db.collection('settings').doc('siteSettings').get();
        if (settingsDoc.exists) {
            const settings = settingsDoc.data();
            if (settings.geminiApiKey) {
                return settings.geminiApiKey;
            }
        }
        
        // Fallback to environment variable
        const envApiKey = process.env.GEMINI_API_KEY;
        if (envApiKey && envApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            console.log('Using Gemini API key from environment variable');
            return envApiKey;
        }
        
        throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to your .env file or configure it in the admin panel.');
    } catch (error) {
        // If it's our custom error, rethrow it
        if (error.message.includes('Gemini API key not configured')) {
            throw error;
        }
        // For other errors (like Firestore errors), fallback to env
        const envApiKey = process.env.GEMINI_API_KEY;
        if (envApiKey && envApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            console.log('Using Gemini API key from environment variable (Firestore unavailable)');
            return envApiKey;
        }
        console.error('Error getting Gemini API key:', error);
        throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.');
    }
}

/**
 * Verify if image is AI-generated using Gemini Vision
 */
async function detectAIGeneratedImage(imageBuffer) {
    try {
        const apiKey = await getGeminiApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: 'image/jpeg'
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
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

        return {
            success: false,
            error: 'Could not parse AI response',
            isReal: true // Benefit of doubt
        };
    } catch (error) {
        console.error('Error detecting AI-generated image:', error);
        return {
            success: false,
            error: error.message,
            isReal: true // Benefit of doubt
        };
    }
}

/**
 * Verify challenge completion using Gemini Vision
 */
async function verifyChallengeCompletion(imageBuffer, challengeDescription, challengeTitle) {
    try {
        const apiKey = await getGeminiApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: 'image/jpeg'
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
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
        console.error('Error verifying challenge completion:', error);
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
        const apiKey = await getGeminiApiKey();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const prompt = `Provide a detailed description of this image, focusing on:
1. Main subject/activity
2. Environmental context
3. Any eco-friendly actions visible
4. Location type (indoor/outdoor, urban/rural, etc.)
5. Time of day (if determinable)
6. Any text or signs visible

Be specific and objective.`;

        const imagePart = {
            inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: 'image/jpeg'
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting image description:', error);
        return 'Could not generate image description';
    }
}

module.exports = {
    detectAIGeneratedImage,
    verifyChallengeCompletion,
    getImageDescription
};
