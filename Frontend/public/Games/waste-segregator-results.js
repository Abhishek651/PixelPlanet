// Results Scene for Adaptive Waste Segregator

class ResultsScene extends Phaser.Scene {
    constructor() {
        super('ResultsScene');
    }
    
    init(data) {
        this.score = data.score || 0;
        this.itemsSorted = data.itemsSorted || 0;
        this.levelId = data.levelId || 1;
        this.performance = data.performance || {};
        this.decision = data.decision || {};
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        const isSuccess = this.decision.action === 'advance' || this.decision.action === 'complete';
        const accuracy = this.performance.accuracy || 0;
        
        // Calculate rewards
        const baseEcoPoints = 50 * this.levelId;
        const baseXP = 30 + (this.levelId * 10);
        const ecoPoints = Math.floor(baseEcoPoints * (isSuccess ? 1 : accuracy * 0.5));
        const coins = this.score;
        const xp = Math.floor(baseXP * (isSuccess ? 1 : accuracy * 0.5));
        
        // Send rewards to parent
        if (this.score > 0 || this.itemsSorted > 0) {
            console.log('Sending game rewards:', { ecoPoints, coins, xp, isSuccess });
            
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'GAME_COMPLETE',
                    game: 'waste-segregator-adaptive',
                    level: this.levelId,
                    score: this.score,
                    ecoPoints: ecoPoints,
                    coins: coins,
                    xp: xp,
                    isSuccess: isSuccess,
                    accuracy: accuracy
                }, '*');
            }
        }
        
        // Overlay
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.85).setDepth(100);
        
        // Celebration particles
        if (isSuccess) {
            for (let i = 0; i < 40; i++) {
                this.time.delayedCall(i * 50, () => {
                    const x = Phaser.Math.Between(width * 0.1, width * 0.9);
                    const particle = this.add.text(x, -20, ['🎉', '⭐', '✨'][Phaser.Math.Between(0, 2)], {
                        fontSize: '24px'
                    }).setDepth(101);
                    
                    this.tweens.add({
                        targets: particle,
                        y: height + 20,
                        duration: Phaser.Math.Between(2000, 3000),
                        onComplete: () => particle.destroy()
                    });
                });
            }
        }
        
        let yPos = height * 0.12;
        
        // Title
        const titleText = this.getTitleText();
        const title = this.add.text(width/2, yPos, titleText, {
            fontSize: Math.min(width * 0.07, 42) + 'px',
            fontFamily: 'Arial Black',
            fill: isSuccess ? '#4ecca3' : '#f39c12',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        yPos += height * 0.08;
        
        // Decision reason
        const reason = this.add.text(width/2, yPos, this.decision.reason || '', {
            fontSize: Math.min(width * 0.04, 24) + 'px',
            fontFamily: 'Arial',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        yPos += height * 0.06;
        
        // Stats
        const statsText = `Score: ${this.score} | Items: ${this.itemsSorted} | Accuracy: ${(accuracy * 100).toFixed(0)}%`;
        const stats = this.add.text(width/2, yPos, statsText, {
            fontSize: Math.min(width * 0.035, 20) + 'px',
            fontFamily: 'Arial',
            fill: '#bdc3c7'
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        yPos += height * 0.06;
        
        // Rewards
        const rewardsText = this.add.text(width/2, yPos, 
            `🌱 +${ecoPoints} Points  🪙 +${coins} Coins  ⭐ +${xp} XP`, {
            fontSize: Math.min(width * 0.035, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#f1c40f',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        yPos += height * 0.08;
        
        // Category mastery
        if (this.performance.categoryAccuracy) {
            const masteryTitle = this.add.text(width/2, yPos, 'Category Performance:', {
                fontSize: Math.min(width * 0.035, 20) + 'px',
                fontFamily: 'Arial Black',
                fill: '#fff'
            }).setOrigin(0.5).setDepth(101).setAlpha(0);
            
            yPos += height * 0.05;
            
            const masteryTexts = [];
            for (const [category, acc] of Object.entries(this.performance.categoryAccuracy)) {
                const emoji = this.getCategoryEmoji(category);
                const color = acc >= 0.8 ? '#00ff00' : acc >= 0.6 ? '#ffff00' : '#ff6b6b';
                const masteryText = this.add.text(width/2, yPos, 
                    `${emoji} ${category.replace('_', ' ')}: ${(acc * 100).toFixed(0)}%`, {
                    fontSize: Math.min(width * 0.03, 18) + 'px',
                    fontFamily: 'Arial',
                    fill: color
                }).setOrigin(0.5).setDepth(101).setAlpha(0);
                
                masteryTexts.push(masteryText);
                yPos += height * 0.04;
            }
        }
        
        // Hints (if any)
        if (this.decision.hints && this.decision.hints.length > 0) {
            yPos += height * 0.02;
            
            const hintsTitle = this.add.text(width/2, yPos, '💡 Tips:', {
                fontSize: Math.min(width * 0.035, 20) + 'px',
                fontFamily: 'Arial Black',
                fill: '#f1c40f'
            }).setOrigin(0.5).setDepth(101).setAlpha(0);
            
            yPos += height * 0.04;
            
            this.decision.hints.slice(0, 2).forEach(hint => {
                const hintText = this.add.text(width/2, yPos, hint, {
                    fontSize: Math.min(width * 0.028, 16) + 'px',
                    fontFamily: 'Arial',
                    fill: '#ffff00',
                    backgroundColor: '#00000088',
                    padding: { x: 8, y: 4 },
                    wordWrap: { width: width * 0.8 },
                    align: 'center'
                }).setOrigin(0.5).setDepth(101).setAlpha(0);
                
                yPos += height * 0.04;
            });
        }
        
        // Buttons
        yPos = height * 0.75;
        const btnSpacing = height * 0.08;
        
        // Next level button (if advancing)
        if (this.decision.action === 'advance' && this.decision.nextLevelId <= 5) {
            const nextBtn = this.createButton(width/2, yPos, 
                `⭐ NEXT: LEVEL ${this.decision.nextLevelId}`, 0xf39c12, () => {
                this.scene.start('GameScene', { level: this.decision.nextLevelId });
            });
            yPos += btnSpacing;
        }
        
        // Retry button
        const retryText = this.decision.action === 'repeat_easier' ? '🔄 TRY EASIER' : '🔄 RETRY';
        const retryBtn = this.createButton(width/2, yPos, retryText, 0x27ae60, () => {
            this.scene.start('GameScene', { level: this.levelId });
        });
        yPos += btnSpacing;
        
        // Menu button
        const menuBtn = this.createButton(width/2, yPos, '🏠 MENU', 0x3498db, () => {
            this.scene.start('MenuScene');
        });
        
        // Animate in
        this.tweens.add({ targets: title, alpha: 1, scale: { from: 0, to: 1 }, duration: 500, ease: 'Back.easeOut' });
        this.tweens.add({ targets: reason, alpha: 1, duration: 500, delay: 200 });
        this.tweens.add({ targets: stats, alpha: 1, duration: 500, delay: 400 });
        this.tweens.add({ targets: rewardsText, alpha: 1, scale: { from: 0.5, to: 1 }, duration: 600, delay: 600, ease: 'Back.easeOut' });
    }
    
    getTitleText() {
        switch (this.decision.action) {
            case 'advance':
                return '🎉 LEVEL COMPLETE! 🎉';
            case 'complete':
                return '👑 ALL LEVELS MASTERED! 👑';
            case 'repeat':
                return '📚 KEEP PRACTICING!';
            case 'repeat_easier':
                return '💪 TRY AGAIN!';
            default:
                return '⏰ TIME\'S UP!';
        }
    }
    
    getCategoryEmoji(category) {
        const emojis = {
            'food_waste': '🍌',
            'plastic': '🍾',
            'metal': '🥫',
            'paper': '📰',
            'chemical': '🔋',
            'sharp': '🔨',
            'electronics': '📱'
        };
        return emojis[category] || '📦';
    }
    
    createButton(x, y, text, color, callback) {
        const btnWidth = Math.min(this.cameras.main.width * 0.6, 300);
        const btnHeight = Math.min(this.cameras.main.width * 0.08, 50);
        
        const container = this.add.container(x, y).setDepth(101).setAlpha(0);
        
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 10);
        
        const btnText = this.add.text(0, 0, text, {
            fontSize: Math.min(this.cameras.main.width * 0.035, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        container.add([bg, btnText]);
        container.setSize(btnWidth, btnHeight);
        container.setInteractive({ useHandCursor: true });
        
        container.on('pointerover', () => {
            this.tweens.add({ targets: container, scale: 1.05, duration: 200 });
        });
        
        container.on('pointerout', () => {
            this.tweens.add({ targets: container, scale: 1, duration: 200 });
        });
        
        container.on('pointerdown', callback);
        
        this.tweens.add({
            targets: container,
            alpha: 1,
            scale: { from: 0, to: 1 },
            duration: 500,
            delay: 800,
            ease: 'Back.easeOut'
        });
        
        return container;
    }
}

// Export
window.ResultsScene = ResultsScene;
