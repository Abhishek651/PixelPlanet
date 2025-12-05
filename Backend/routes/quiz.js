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
    const { title, numQuestions, difficulty, description, targetClass, generationMethod, paragraph, generateParagraph, existingQuestions } = req.body;

    if (!numQuestions || !difficulty) {
        return res.status(400).json({ error: 'Missing required fields: numQuestions, difficulty' });
    }

    let prompt;
    if (generationMethod === 'paragraph') {
        if (!paragraph) {
            return res.status(400).json({ error: 'Missing required field: paragraph' });
        }
        const avoidQuestionsText = existingQuestions && existingQuestions.length > 0 
            ? `\n\nIMPORTANT: Avoid generating questions similar to these existing ones:\n${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nGenerate DIFFERENT questions with unique angles and perspectives.`
            : '';
        
        prompt = `You are an educational quiz generator. Create multiple-choice questions from this paragraph:

PARAGRAPH:
"${paragraph}"

Number of Questions: ${numQuestions}
Difficulty: ${difficulty}${avoidQuestionsText}

CRITICAL: ALL questions MUST be answerable ONLY from information in the paragraph. Do NOT use external knowledge.

TASK: Create ${numQuestions} multiple-choice questions based STRICTLY on the paragraph above.

Each question MUST have:
- A complete question sentence ending with "?"
- Exactly 4 answer options
- One correct answer that matches exactly one of the 4 options
- Be answerable from the paragraph ONLY

EXAMPLE FORMAT:
{
  "questions": [
    {
      "question": "What is the main topic discussed in the paragraph?",
      "options": ["Climate change", "Ocean pollution", "Deforestation", "Renewable energy"],
      "answer": "Climate change"
    },
    {
      "question": "According to the text, what causes global warming?",
      "options": ["Solar flares", "Greenhouse gases", "Ocean currents", "Wind patterns"],
      "answer": "Greenhouse gases"
    }
  ]
}

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown, NO code blocks, NO extra text
- Each "question" must be a complete sentence with "?"
- Each "options" must be an array of exactly 4 strings
- Each "answer" must exactly match one option string
- Generate exactly ${numQuestions} questions
- Questions must be answerable from paragraph ONLY

Return the JSON now:`;
    } else {
        if (!title) {
            return res.status(400).json({ error: 'Missing required field: title' });
        }
        
        // If generateParagraph is true, request both paragraph and questions
        if (generateParagraph) {
            prompt = `You are an educational quiz generator. Generate BOTH a paragraph AND multiple-choice questions.

Topic: "${title}"
${description ? `Description: "${description}"` : ''}
Number of Questions: ${numQuestions}
Difficulty: ${difficulty}
Target: ${targetClass || 'General'}

TASK:
1. Write an educational paragraph (150-250 words) about "${title}"
2. Create ${numQuestions} multiple-choice questions based STRICTLY on that paragraph
3. Each question MUST have:
   - A complete question sentence ending with "?"
   - Exactly 4 answer options
   - One correct answer that matches exactly one of the 4 options
   - Be answerable from the paragraph ONLY

EXAMPLE FORMAT:
{
  "paragraph": "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas.",
  "questions": [
    {
      "question": "What has been the main driver of climate change since the 1800s?",
      "options": ["Natural weather patterns", "Human activities", "Solar radiation", "Ocean currents"],
      "answer": "Human activities"
    },
    {
      "question": "Which of the following is a primary cause of human-driven climate change?",
      "options": ["Planting trees", "Burning fossil fuels", "Using solar panels", "Recycling waste"],
      "answer": "Burning fossil fuels"
    }
  ]
}

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown, NO code blocks, NO extra text
- Each "question" must be a complete sentence with "?"
- Each "options" must be an array of exactly 4 strings
- Each "answer" must exactly match one option string
- Generate exactly ${numQuestions} questions

Return the JSON now:`;
        } else {
            const avoidQuestionsText = existingQuestions && existingQuestions.length > 0 
                ? `\n\nIMPORTANT: Avoid generating questions similar to these existing ones:\n${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nGenerate DIFFERENT questions with unique angles and perspectives.`
                : '';
            
            prompt = `You are an educational quiz generator. Create multiple-choice questions on this topic.

Topic: "${title}"
${description ? `Description: "${description}"` : ''}
Number of Questions: ${numQuestions}
Difficulty: ${difficulty}
Target: ${targetClass || 'General'}${avoidQuestionsText}

TASK: Create ${numQuestions} multiple-choice questions about "${title}".

Each question MUST have:
- A complete question sentence ending with "?"
- Exactly 4 answer options
- One correct answer that matches exactly one of the 4 options

EXAMPLE FORMAT:
{
  "questions": [
    {
      "question": "What is the primary cause of ocean acidification?",
      "options": ["Plastic pollution", "Carbon dioxide absorption", "Oil spills", "Overfishing"],
      "answer": "Carbon dioxide absorption"
    },
    {
      "question": "Which renewable energy source uses photovoltaic cells?",
      "options": ["Wind power", "Solar power", "Hydroelectric power", "Geothermal power"],
      "answer": "Solar power"
    }
  ]
}

CRITICAL RULES:
- Return ONLY valid JSON
- NO markdown, NO code blocks, NO extra text
- Each "question" must be a complete sentence with "?"
- Each "options" must be an array of exactly 4 strings
- Each "answer" must exactly match one option string
- Generate exactly ${numQuestions} questions
- Focus on ${title} (general knowledge allowed)

Return the JSON now:`;
        }
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

router.post('/expand-paragraph', async (req, res) => {
    const { paragraph } = req.body;

    if (!paragraph) {
        return res.status(400).json({ error: 'Missing required field: paragraph' });
    }

    const prompt = `You are an educational content expander. Expand the following paragraph to provide more detailed information while maintaining accuracy and educational value.

ORIGINAL PARAGRAPH:
"${paragraph}"

TASK:
1. Expand this paragraph to approximately 300-400 words
2. Add more details, examples, and context
3. Maintain the same topic and educational focus
4. Keep the content accurate and informative
5. Make it suitable for generating diverse quiz questions

Return ONLY the expanded paragraph as plain text, NO JSON, NO formatting, NO extra text.

Expanded paragraph:`;

    try {
        const { defaultProvider, keys } = await getApiSettings();
        const providers = [defaultProvider, 'openrouter', 'gemini', 'openai'].filter((v, i, a) => a.indexOf(v) === i);

        for (const provider of providers) {
            const apiKey = keys[provider];
            if (!apiKey) continue;

            console.log(`Attempting to expand paragraph with ${provider}...`);
            const config = getProviderConfig(provider, apiKey, prompt);
            if (!config) continue;

            try {
                const response = await fetch(config.url, config.options);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.warn(`API call to ${provider} failed with status ${response.status}:`, errorText);
                    continue;
                }
                
                const data = await response.json();
                let expandedParagraph;
                
                switch (provider) {
                    case 'openrouter':
                    case 'openai':
                        expandedParagraph = data.choices[0].message.content.trim();
                        break;
                    case 'gemini':
                        expandedParagraph = data.candidates[0].content.parts[0].text.trim();
                        break;
                    default:
                        throw new Error('Unknown provider response format');
                }
                
                return res.json({ expandedParagraph });
            } catch (e) {
                console.warn(`Error during fetch or parsing for ${provider}:`, e.message);
                continue;
            }
        }

        res.status(503).json({ error: 'Paragraph expansion unavailable. Please contact admin to configure API settings.' });

    } catch (error) {
        console.error('Failed to expand paragraph:', error);
        res.status(500).json({ error: 'Internal server error while expanding paragraph.' });
    }
});

module.exports = router;
