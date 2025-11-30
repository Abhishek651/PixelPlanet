const express = require('express');
const router = express.Router();
const { db } = require('../firebaseConfig');
const fetch = require('node-fetch');

const getApiSettings = async () => {
    const settingsDoc = await db.collection('settings').doc('site').get();
    
    // Try to get from Firestore first
    let settings = {};
    if (settingsDoc.exists) {
        settings = settingsDoc.data();
    }
    
    // Fallback to environment variables if Firestore is empty
    return {
        defaultProvider: settings.defaultApiProvider || process.env.DEFAULT_API_PROVIDER || 'openai',
        keys: {
            openrouter: settings.openRouterApiKey || process.env.OPENROUTER_API_KEY,
            gemini: settings.geminiApiKey || process.env.GEMINI_API_KEY,
            openai: settings.openaiApiKey || process.env.OPENAI_API_KEY
        }
    };
};

const getProviderConfig = (provider, apiKey, prompt) => {
    const configs = {
        openrouter: {
            url: 'https://openrouter.ai/api/v1/chat/completions',
            options: {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'openai/gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 300 })
            }
        },
        gemini: {
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            options: {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        },
        openai: {
            url: 'https://api.openai.com/v1/chat/completions',
            options: {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 300 })
            }
        }
    };
    return configs[provider];
};

const parseResponse = async (provider, response) => {
    const data = await response.json();
    switch (provider) {
        case 'openrouter':
        case 'openai':
            return data.choices[0].message.content;
        case 'gemini':
            return data.candidates[0].content.parts[0].text;
        default:
            throw new Error('Unknown provider');
    }
};

// EcoBot Chat
router.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required.' });

    const prompt = `You are EcoBot, an environmental education assistant. Answer this question about environmental topics in under 200 words: "${message}"`;

    try {
        const { defaultProvider, keys } = await getApiSettings();
        const providers = [defaultProvider, 'openrouter', 'gemini', 'openai'].filter((v, i, a) => a.indexOf(v) === i);

        for (const provider of providers) {
            const apiKey = keys[provider];
            if (!apiKey) continue;

            const config = getProviderConfig(provider, apiKey, prompt);
            if (!config) continue;

            try {
                const response = await fetch(config.url, config.options);
                if (!response.ok) continue;
                
                const botResponse = await parseResponse(provider, response);
                
                await db.collection('ecoBotConversations').add({
                    message, response: botResponse, provider, timestamp: new Date()
                });

                return res.json({ response: botResponse, timestamp: new Date().toISOString() });
            } catch (e) {
                continue;
            }
        }

        res.status(503).json({ 
            error: 'EcoBot is currently unavailable. Please contact admin to configure API settings.',
            fallback: true
        });
    } catch (error) {
        res.status(500).json({ error: 'EcoBot unavailable.' });
    }
});

// Get Eco Tips
router.get('/tips', async (req, res) => {
    const tips = [
        "Turn off lights when leaving a room to save energy.",
        "Use reusable bags instead of plastic bags.",
        "Take shorter showers to conserve water.",
        "Recycle paper, plastic, and glass properly.",
        "Walk or bike for short distances.",
        "Unplug electronics when not in use.",
        "Use both sides of paper before recycling.",
        "Plant native species in your garden."
    ];

    const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, parseInt(req.query.limit) || 5);
    res.json({ tips: randomTips, timestamp: new Date().toISOString() });
});

module.exports = router;