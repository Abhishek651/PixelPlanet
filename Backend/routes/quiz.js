const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/generate', async (req, res) => {
    const { title, numQuestions, difficulty } = req.body;

    if (!title || !numQuestions || !difficulty) {
        return res.status(400).json({ error: 'Missing required fields: title, numQuestions, difficulty' });
    }

    const prompt = `
        Generate a multiple-choice quiz about "${title}".
        The quiz should have ${numQuestions} questions.
        The difficulty level should be ${difficulty}.

        For each question, provide:
        - The question text.
        - An array of 4 options.
        - The correct answer.

        Return the output as a valid JSON object with a single key "questions" which is an array of question objects.
        Each question object should have the following properties: "question", "options", "correctAnswer".

        Example format:
        {
            "questions": [
                {
                    "question": "What is the capital of France?",
                    "options": ["Berlin", "Madrid", "Paris", "Rome"],
                    "correctAnswer": "Paris"
                }
            ]
        }
    `;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter API error:', errorText);
            return res.status(response.status).json({ error: 'Failed to generate quiz from OpenRouter API.', details: errorText });
        }

        const data = await response.json();
        const quizContent = JSON.parse(data.choices[0].message.content);
        res.json(quizContent);

    } catch (error) {
        console.error('Error calling OpenRouter API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
