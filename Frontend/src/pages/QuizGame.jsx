import React from 'react';

const QuizGame = () => {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe
                src="/Games/quiz.html"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Quiz Game"
            ></iframe>
        </div>
    );
};

export default QuizGame;
