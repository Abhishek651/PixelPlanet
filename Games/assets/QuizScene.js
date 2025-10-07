// --- 1. GAME DATA (Question Database) ------------------------------------------
const QUIZ_DATA = [
    {
        question: "Which item belongs in the COMPOST bin?",
        options: ["Plastic Bottle", "Banana Peel", "Aluminum Can", "Glass Jar"],
        answer: "Banana Peel",
        note: "Organic waste like fruit peels decompose naturally!",
        emoji: "🍌",
        category: "Sorting"
    },
    {
        question: "What percentage of plastic ever produced has been recycled?",
        options: ["Less than 10%", "About 25%", "Around 50%", "Over 75%"],
        answer: "Less than 10%",
        note: "Only 9% of all plastic waste has ever been recycled!",
        emoji: "♻️",
        category: "Facts"
    },
    {
        question: "How long does a plastic bottle take to decompose?",
        options: ["10 years", "50 years", "450 years", "1000 years"],
        answer: "450 years",
        note: "Plastic bottles can take up to 450 years to break down!",
        emoji: "🍾",
        category: "Facts"
    },
    {
        question: "Which renewable energy source has the highest capacity factor?",
        options: ["Solar", "Wind", "Geothermal", "Hydroelectric"],
        answer: "Geothermal",
        note: "Geothermal plants can run nearly 24/7, unlike solar or wind.",
        emoji: "⚡",
        category: "Energy"
    },
    {
        question: "What is the leading cause of species extinction?",
        options: ["Pollution", "Climate Change", "Habitat Loss", "Invasive Species"],
        answer: "Habitat Loss",
        note: "Destroying natural habitats is the #1 threat to wildlife.",
        emoji: "🌳",
        category: "Wildlife"
    },
    {
        question: "Which bin should a greasy pizza box go in?",
        options: ["Paper Recycling", "Compost", "Plastic Recycling", "Landfill"],
        answer: "Compost",
        note: "Grease contaminates paper recycling, but it can compost!",
        emoji: "🍕",
        category: "Sorting"
    },
    {
        question: "How much water is needed to produce 1 pound of beef?",
        options: ["100 gallons", "500 gallons", "1,800 gallons", "3,500 gallons"],
        answer: "1,800 gallons",
        note: "animal agriculture has a massive water footprint!",
        emoji: "💧",
        category: "Food"
    },
    {
        question: "What causes eutrophication in water bodies?",
        options: ["Oil Spills", "Nutrient Runoff", "Plastic Waste", "Acid Rain"],
        answer: "Nutrient Runoff",
        note: "Excess nitrogen and phosphorus cause harmful algae blooms.",
        emoji: "🌊",
        category: "Water"
    },
    {
        question: "Which material can be recycled infinitely?",
        options: ["Paper", "Plastic", "Aluminum", "Glass"],
        answer: "Aluminum",
        note: "Aluminum and glass can be recycled endlessly without quality loss!",
        emoji: "🥫",
        category: "Recycling"
    },
    {
        question: "What percentage of Earth's water is fresh and accessible?",
        options: ["Less than 1%", "About 10%", "Around 25%", "Over 50%"],
        answer: "Less than 1%",
        note: "Only 0.3% of Earth's water is accessible freshwater!",
        emoji: "🌍",
        category: "Water"
    },
    {
        question: "Which gas is released when permafrost thaws?",
        options: ["Carbon Dioxide", "Methane", "Nitrous Oxide", "Ozone"],
        answer: "Methane",
        note: "Methane is 25x more potent than CO2 as a greenhouse gas!",
        emoji: "🔥",
        category: "Climate"
    },
    {
        question: "Where should broken glass go?",
        options: ["Glass Recycling", "Landfill", "Compost", "Plastic Bin"],
        answer: "Landfill",
        note: "Broken glass can contaminate recycling and isn't safe to process.",
        emoji: "🔨",
        category: "Sorting"
    }
];

const QUESTION_TIME = 10; // seconds per question
const TOTAL_QUESTIONS = 5; // Use the number of questions in your QUIZ_DATA
const SCORE_PER_CORRECT = 20;
const SCORE_SPEED_BONUS = 5;

// --- 2. PHASER GAME SCENE -----------------------------------------------------
class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene');
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.questions = []; // Questions for the current game
        this.timerEvent;
    }

    preload() {
        // No assets needed, but you could load a background image here
    }

    create() {
        // Create beautiful gradient background
        this.createBackground();
        
        this.questions = Phaser.Utils.Array.Shuffle(QUIZ_DATA).slice(0, TOTAL_QUESTIONS);
        this.scoreText = this.add.text(16, 70, 'Score: 0 KP', { 
            fontSize: '24px', 
            fill: '#fff',
            fontFamily: 'Arial Black',
            stroke: '#000',
            strokeThickness: 3
        });
        this.timerDisplay = this.add.text(800 - 16, 70, 'Time: 10s', { 
            fontSize: '24px', 
            fill: '#fff',
            fontFamily: 'Arial Black',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(1, 0);
        
        // Question number display
        this.questionNumberText = this.add.text(400, 100, '', {
            fontSize: '18px',
            fill: '#bdc3c7',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Emoji display (large)
        this.emojiDisplay = this.add.text(400, 160, '', {
            fontSize: '64px'
        }).setOrigin(0.5);
        
        // Category badge
        this.categoryBadge = this.add.text(400, 220, '', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#3498db',
            padding: { x: 15, y: 5 },
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        this.questionText = this.add.text(400, 280, '', { 
            fontSize: '28px', 
            fill: '#fff', 
            wordWrap: { width: 700 },
            align: 'center',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.optionButtons = [];

        // Back to Menu Button
        const menuButton = this.add.text(400, 16, '🏠 MENU', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#e74c3c',
            padding: { x: 15, y: 8 },
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });

        menuButton.on('pointerover', () => {
            menuButton.setBackgroundColor('#c0392b');
            menuButton.setScale(1.1);
        });

        menuButton.on('pointerout', () => {
            menuButton.setBackgroundColor('#e74c3c');
            menuButton.setScale(1);
        });

        menuButton.on('pointerdown', () => {
            if (this.timerEvent) this.timerEvent.remove();
            this.scene.start('MenuScene');
        });

        this.loadQuestion();
    }

    createBackground() {
        // Gradient background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x2c3e50, 0x2c3e50, 0x34495e, 0x2c3e50, 1);
        graphics.fillRect(0, 0, 800, 600);

        // Add decorative circles
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const circle = this.add.circle(x, y, Phaser.Math.Between(20, 60), 0x3498db, 0.05);
        }

        // Title
        this.add.text(400, 40, '🧠 ECO KNOWLEDGE QUIZ', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#0f3460',
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    // --- 3. QUESTION FLOW ---
    
    loadQuestion() {
        if (this.currentQuestionIndex >= TOTAL_QUESTIONS) {
            this.endGame();
            return;
        }

        const q = this.questions[this.currentQuestionIndex];

        // Clear previous buttons
        this.optionButtons.forEach(btn => btn.destroy());
        this.optionButtons = [];

        // Update question number
        this.questionNumberText.setText(`Question ${this.currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`);

        // Update emoji
        this.emojiDisplay.setText(q.emoji || '❓');
        this.tweens.add({
            targets: this.emojiDisplay,
            scale: { from: 0, to: 1 },
            duration: 300,
            ease: 'Back.easeOut'
        });

        // Update category badge
        this.categoryBadge.setText(q.category || 'General');
        const categoryColors = {
            'Sorting': '#27ae60',
            'Facts': '#e74c3c',
            'Energy': '#f39c12',
            'Wildlife': '#16a085',
            'Food': '#d35400',
            'Water': '#3498db',
            'Recycling': '#9b59b6',
            'Climate': '#c0392b'
        };
        this.categoryBadge.setBackgroundColor(categoryColors[q.category] || '#3498db');

        // Update Question Text
        this.questionText.setText(q.question);

        // Create Option Buttons with better styling
        const buttonYStart = 360;
        q.options.forEach((option, index) => {
            const button = this.add.text(400, buttonYStart + index * 60, option, {
                fontSize: '20px',
                padding: { x: 25, y: 12 },
                backgroundColor: '#2980b9',
                fill: '#fff',
                fontFamily: 'Arial',
                wordWrap: { width: 600 }
            }).setOrigin(0.5)
              .setInteractive({ useHandCursor: true })
              .setAlpha(0);

            // Animate button in
            this.tweens.add({
                targets: button,
                alpha: 1,
                x: { from: 300, to: 400 },
                duration: 300,
                delay: index * 100,
                ease: 'Back.easeOut'
            });

            button.on('pointerdown', () => this.checkAnswer(option, button));
            button.on('pointerover', () => {
                button.setBackgroundColor('#3498db');
                button.setScale(1.05);
            });
            button.on('pointerout', () => {
                button.setBackgroundColor('#2980b9');
                button.setScale(1);
            });

            this.optionButtons.push(button);
        });

        this.startQuestionTimer();
    }

    startQuestionTimer() {
        let timeRemaining = QUESTION_TIME;
        this.timerDisplay.setText(`Time: ${timeRemaining}s`);

        // Stop any existing timer
        if (this.timerEvent) {
            this.timerEvent.remove();
        }

        // Start new timer for this question
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                timeRemaining--;
                this.timerDisplay.setText(`Time: ${timeRemaining}s`);

                if (timeRemaining <= 0) {
                    this.handleTimeout();
                }
            },
            loop: true
        });
    }

    // --- 4. SCORING AND FEEDBACK ---

    checkAnswer(selectedOption, button) {
        // Stop timer and disable all buttons
        this.timerEvent.remove();
        this.optionButtons.forEach(btn => btn.disableInteractive());
        
        const q = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedOption === q.answer;
        
        const timeElapsed = QUESTION_TIME - Math.ceil(this.timerEvent.getRemainingSeconds());

        if (isCorrect) {
            this.handleCorrect(button, timeElapsed);
        } else {
            this.handleIncorrect(button, q.answer, q.note);
        }
    }

    handleCorrect(button, timeElapsed) {
        let earnedPoints = SCORE_PER_CORRECT;
        let bonus = '';

        // Check for Speed Bonus (e.g., answered within 3 seconds)
        if (timeElapsed <= 3) {
            earnedPoints += SCORE_SPEED_BONUS;
            bonus = ` (+${SCORE_SPEED_BONUS} Speed Bonus!)`;
        }

        this.score += earnedPoints;
        this.scoreText.setText(`Score: ${this.score} KP`);
        
        button.setBackgroundColor('#27ae60'); // Green for correct

        // Show feedback message
        this.showFeedback(`✅ Correct! +${earnedPoints} KP${bonus}`, '#2ecc71');
        
        this.time.delayedCall(1500, () => {
            this.currentQuestionIndex++;
            this.loadQuestion();
        });
    }

    handleIncorrect(button, correctAnswer, note) {
        button.setBackgroundColor('#c0392b'); // Red for incorrect

        // Highlight the correct answer
        this.optionButtons.forEach(btn => {
            if (btn.text === correctAnswer) {
                btn.setBackgroundColor('#f39c12'); // Amber for correct answer reveal
            }
        });

        // Show educational feedback
        this.showFeedback(`❌ Wrong! The answer was ${correctAnswer}. Note: ${note}`, '#e74c3c');

        this.time.delayedCall(3000, () => {
            this.currentQuestionIndex++;
            this.loadQuestion();
        });
    }
    
    handleTimeout() {
        this.optionButtons.forEach(btn => btn.disableInteractive());
        const q = this.questions[this.currentQuestionIndex];

        // Highlight the correct answer
        this.optionButtons.forEach(btn => {
            if (btn.text === q.answer) {
                btn.setBackgroundColor('#f39c12');
            }
        });

        this.showFeedback(`⏰ Time's up! The answer was ${q.answer}.`, '#8e44ad');

        this.time.delayedCall(3000, () => {
            this.currentQuestionIndex++;
            this.loadQuestion();
        });
    }

    showFeedback(message, color) {
        const feedback = this.add.text(400, 550, message, {
            fontSize: '20px',
            fill: color,
            backgroundColor: '#fff',
            padding: { x: 10, y: 5 },
            wordWrap: { width: 700 }
        }).setOrigin(0.5);

        // Fade out animation
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            duration: 1000,
            delay: 1000,
            onComplete: () => feedback.destroy()
        });
    }

    endGame() {
        this.timerEvent.remove();
        this.questionText.destroy();
        this.optionButtons.forEach(btn => btn.destroy());
        this.scoreText.destroy();
        this.timerDisplay.destroy();

        this.add.text(400, 300, `QUIZ COMPLETE!\nFinal Score: ${this.score} KP`, {
            fontSize: '48px',
            fill: '#ffeb3b',
            align: 'center'
        }).setOrigin(0.5);
    }
}