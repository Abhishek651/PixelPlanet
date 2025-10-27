const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { db } = require('../firebaseConfig');

const getApiSettings = async () => {
    const settingsDoc = await db.collection('settings').doc('site').get();
    if (!settingsDoc.exists) {
        throw new Error('API settings not configured by admin.');
    }
    const settings = settingsDoc.data();
    if (!settings.openRouterApiKey && !settings.geminiApiKey && !settings.openaiApiKey) {
        throw new Error('No API keys configured by admin.');
    }
    return {
        defaultProvider: settings.defaultApiProvider || 'openrouter',
        keys: {
            openrouter: settings.openRouterApiKey,
            gemini: settings.geminiApiKey,
            openai: settings.openaiApiKey,
        },
    };
};

const getProviderConfig = (provider, apiKey, prompt) => {
    switch (provider) {
        case 'openrouter':
            return {
                url: 'https://openrouter.ai/api/v1/chat/completions',
                options: {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: 'openai/gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }] }),
                },
            };
        case 'gemini':
            return {
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                options: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                },
            };
        case 'openai':
            return {
                url: 'https://api.openai.com/v1/chat/completions',
                options: {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }] }),
                },
            };
        default:
            return null;
    }
};

const parseProviderResponse = async (provider, response) => {
    const data = await response.json();
    let content;
    switch (provider) {
        case 'openrouter':
        case 'openai':
            content = data.choices[0].message.content;
            break;
        case 'gemini':
            content = data.candidates[0].content.parts[0].text;
            break;
        default:
            throw new Error('Unknown provider response format');
    }
    return JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
};

router.post('/generate', async (req, res) => {
    const { title, numQuestions, difficulty, description, targetClass, generationMethod, paragraph } = req.body;

    if (!numQuestions || !difficulty) {
        return res.status(400).json({ error: 'Missing required fields: numQuestions, difficulty' });
    }

    let prompt;
    if (generationMethod === 'paragraph') {
        if (!paragraph) {
            return res.status(400).json({ error: 'Missing required field: paragraph' });
        }
        prompt = `
            Generate a multiple-choice quiz based on the following paragraph:
            "${paragraph}"

            - Number of Questions: ${numQuestions}
            - Difficulty: ${difficulty}

            For each question, provide:
            - The question text ("question").
            - An array of 4 options ("options").
            - The correct answer ("answer").

            Return the output as a single valid JSON object with a "questions" key, which is an array of question objects.
            Example: { "questions": [{ "question": "...", "options": ["...", "...", "...", "..."], "answer": "..." }] }
        `;
    } else {
        if (!title) {
            return res.status(400).json({ error: 'Missing required field: title' });
        }
        prompt = `
            Generate a multiple-choice quiz based on the following details:
            - Topic: "${title}"
            - Description: "${description || 'Not provided'}"
            - Number of Questions: ${numQuestions}
            - Difficulty: ${difficulty}
            - Target Audience: ${targetClass || 'General'}

            For each question, provide:
            - The question text ("question").
            - An array of 4 options ("options").
            - The correct answer ("answer").

            Return the output as a single valid JSON object with a "questions" key, which is an array of question objects.
            Example: { "questions": [{ "question": "...", "options": ["...", "...", "...", "..."], "answer": "..." }] }
        `;
    }

    try {
        const { defaultProvider, keys } = await getApiSettings();
        const providers = [defaultProvider, 'openrouter', 'gemini', 'openai'].filter((v, i, a) => a.indexOf(v) === i);

        for (const provider of providers) {
            const apiKey = keys[provider];
            if (!apiKey) continue;

            console.log(`Attempting to generate quiz with ${provider}...`);
            const config = getProviderConfig(provider, apiKey, prompt);
            if (!config) continue;

            try {
                const response = await fetch(config.url, config.options);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.warn(`API call to ${provider} failed with status ${response.status}:`, errorText);
                    continue; // Try next provider
                }
                const quizContent = await parseProviderResponse(provider, response);
                return res.json(quizContent);
            } catch (e) {
                console.warn(`Error during fetch or parsing for ${provider}:`, e.message);
                continue; // Try next provider
            }
        }

        res.status(503).json({ error: 'Quiz generation unavailable. Please contact admin to configure API settings.' });

    } catch (error) {
        console.error('Failed to fetch API settings or an unexpected error occurred:', error);
        res.status(500).json({ error: 'Internal server error while generating quiz.' });
    }
});

module.exports = router;
