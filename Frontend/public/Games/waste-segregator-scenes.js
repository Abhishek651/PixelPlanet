// Phaser Scenes for Adaptive Waste Segregator Game

// Calculate responsive game dimensions
function getGameDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    let gameWidth, gameHeight;
    
    if (aspectRatio > 1.5) {
        gameWidth = Math.min(1200, width);
        gameHeight = Math.min(800, height);
    } else if (aspectRatio > 1) {
        gameWidth = Math.min(1000, width);
        gameHeight = Math.min(700, height);
    } else {
        gameWidth = width;
        gameHeight = height;
    }
    
    return { width: gameWidth, height: gameHeight };
}

// ============================================================================
// MENU SCENE
// ============================================================================

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, width, height);
        
        // Title
        const title = this.add.text(width / 2, height * 0.2, 'ECO SORTING', {
            fontSize: Math.min(width * 0.1, 72) + 'px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#0f3460',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(width / 2, height * 0.28, 'FACTORY', {
            fontSize: Math.min(width * 0.06, 48) + 'px',
            fontFamily: 'Arial Black',
            fill: '#fff',
            stroke: '#0f3460',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Get profile info
        const game = window.gameInstance;
        const currentLevel = game && game.profile ? game.profile.currentLevelId : 1;
        const isNewPlayer = !game || !game.profile || game.profile.totalGamesPlayed === 0;
        
        // Menu buttons
        const btnY = height * 0.45;
        const btnSpacing = height * 0.12;
        
        // NEW GAME button
        this.createMenuButton(width / 2, btnY, '🎮 NEW GAME', 0x27ae60, () => {
            this.scene.start('GameScene', { level: 1 });
        });
        
        // CONTINUE button (only if player has progress)
        if (!isNewPlayer) {
            this.createMenuButton(width / 2, btnY + btnSpacing, 
                `▶️ CONTINUE (Level ${currentLevel})`, 0x3498db, () => {
                this.scene.start('GameScene', { level: currentLevel });
            });
        }
        
        // TUTORIAL button
        this.createMenuButton(width / 2, btnY + (isNewPlayer ? btnSpacing : btnSpacing * 2), 
            '📚 TUTORIAL', 0xf39c12, () => {
            this.scene.start('TutorialScene');
        });
        
        // EXIT button
        this.createMenuButton(width / 2, btnY + (isNewPlayer ? btnSpacing * 2 : btnSpacing * 3), 
            '🚪 EXIT GAME', 0xe74c3c, () => {
            if (window.parent !== window) {
                window.parent.location.href = '/games';
            } else {
                window.location.href = '/games';
            }
        });
        
        // Animations
        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createMenuButton(x, y, text, color, callback) {
        const { width } = this.cameras.main;
        const btnWidth = Math.min(width * 0.7, 400);
        const btnHeight = Math.min(width * 0.1, 60);
        
        const container = this.add.container(x, y);
        
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
        bg.lineStyle(4, 0xffffff, 0.8);
        bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
        
        const btnText = this.add.text(0, 0, text, {
            fontSize: Math.min(width * 0.04, 26) + 'px',
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
        
        return container;
    }
}

// ============================================================================
// INTRO SCENE - Shows new bins and items
// ============================================================================

class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }
    
    init(data) {
        this.newBins = data.newBins || [];
        this.newItems = data.newItems || [];
        this.levelId = data.levelId;
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        // Overlay
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.9);
        
        let yPos = height * 0.15;
        
        // Title
        const title = this.add.text(width/2, yPos, 'NEW CONTENT!', {
            fontSize: Math.min(width * 0.07, 48) + 'px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        yPos += height * 0.1;
        
        // Show new bins
        if (this.newBins.length > 0) {
            const binsTitle = this.add.text(width/2, yPos, 'New Bins:', {
                fontSize: Math.min(width * 0.04, 24) + 'px',
                fontFamily: 'Arial Black',
                fill: '#fff'
            }).setOrigin(0.5);
            
            yPos += height * 0.06;
            
            this.newBins.forEach(bin => {
                const binText = this.add.text(width/2, yPos, 
                    `${bin.emoji} ${bin.name}`, {
                    fontSize: Math.min(width * 0.05, 32) + 'px',
                    fontFamily: 'Arial',
                    fill: '#fff'
                }).setOrigin(0.5);
                
                yPos += height * 0.05;
                
                const desc = this.add.text(width/2, yPos, bin.intro, {
                    fontSize: Math.min(width * 0.03, 18) + 'px',
                    fontFamily: 'Arial',
                    fill: '#bdc3c7',
                    wordWrap: { width: width * 0.8 },
                    align: 'center'
                }).setOrigin(0.5);
                
                yPos += height * 0.08;
            });
        }
        
        // Show new items
        if (this.newItems.length > 0 && yPos < height * 0.7) {
            const itemsTitle = this.add.text(width/2, yPos, 'New Items:', {
                fontSize: Math.min(width * 0.04, 24) + 'px',
                fontFamily: 'Arial Black',
                fill: '#fff'
            }).setOrigin(0.5);
            
            yPos += height * 0.06;
            
            const itemsToShow = this.newItems.slice(0, 3);
            const itemText = itemsToShow.map(item => item.emoji).join('  ');
            
            this.add.text(width/2, yPos, itemText, {
                fontSize: Math.min(width * 0.06, 40) + 'px'
            }).setOrigin(0.5);
        }
        
        // Continue button
        const continueBtn = this.add.text(width/2, height * 0.85, 'TAP TO CONTINUE', {
            fontSize: Math.min(width * 0.04, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#f1c40f',
            backgroundColor: '#00000088',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // Blink animation
        this.tweens.add({
            targets: continueBtn,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        const startGame = () => {
            this.scene.start('GameScene', { level: this.levelId, skipIntro: true });
        };
        
        continueBtn.on('pointerdown', startGame);
        continueBtn.on('pointerup', startGame);
        overlay.setInteractive().on('pointerdown', startGame);
    }
}

// ============================================================================
// TUTORIAL SCENE
// ============================================================================

class TutorialScene extends Phaser.Scene {
    constructor() {
        super('TutorialScene');
    }
    
    create() {
        const { width, height } = this.cameras.main;
        
        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, width, height);
        
        // Title
        const title = this.add.text(width/2, height * 0.08, '📚 HOW TO PLAY', {
            fontSize: Math.min(width * 0.06, 42) + 'px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        let yPos = height * 0.16;
        
        // Instructions
        const instructions = this.add.text(width/2, yPos, 
            'Drag items from the conveyor belt to the correct bins!', {
            fontSize: Math.min(width * 0.03, 20) + 'px',
            fontFamily: 'Arial',
            fill: '#fff',
            wordWrap: { width: width * 0.85 },
            align: 'center'
        }).setOrigin(0.5);
        
        yPos += height * 0.08;
        
        // Bins section
        const binsTitle = this.add.text(width/2, yPos, 'WASTE BINS:', {
            fontSize: Math.min(width * 0.04, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#f1c40f'
        }).setOrigin(0.5);
        
        yPos += height * 0.06;
        
        // Show all bins with descriptions
        const bins = [
            { emoji: '♻️', name: 'ORGANIC', desc: 'Food waste, compostable materials', color: '#27ae60' },
            { emoji: '🗑️', name: 'RECYCLABLE', desc: 'Paper, plastic, metal, glass', color: '#3498db' },
            { emoji: '⚠️', name: 'HAZARDOUS', desc: 'Batteries, chemicals, sharp objects', color: '#e74c3c' },
            { emoji: '📱', name: 'E-WASTE', desc: 'Electronic devices and components', color: '#9b59b6' }
        ];
        
        bins.forEach(bin => {
            const binContainer = this.add.container(width/2, yPos);
            
            const binText = this.add.text(0, 0, 
                `${bin.emoji} ${bin.name}`, {
                fontSize: Math.min(width * 0.035, 22) + 'px',
                fontFamily: 'Arial Black',
                fill: bin.color
            }).setOrigin(0.5);
            
            yPos += height * 0.04;
            
            const descText = this.add.text(0, height * 0.025, bin.desc, {
                fontSize: Math.min(width * 0.025, 16) + 'px',
                fontFamily: 'Arial',
                fill: '#bdc3c7',
                wordWrap: { width: width * 0.8 },
                align: 'center'
            }).setOrigin(0.5, 0);
            
            binContainer.add([binText, descText]);
            
            yPos += height * 0.06;
        });
        
        // Tips
        yPos += height * 0.02;
        const tipsTitle = this.add.text(width/2, yPos, '💡 TIPS:', {
            fontSize: Math.min(width * 0.04, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#f1c40f'
        }).setOrigin(0.5);
        
        yPos += height * 0.05;
        
        const tips = [
            '• Hover over items to see their names',
            '• Correct sorting: +10 points',
            '• Wrong bin: -5 points',
            '• Missed items: -2 points',
            '• Complete all items before time runs out!'
        ];
        
        tips.forEach(tip => {
            this.add.text(width/2, yPos, tip, {
                fontSize: Math.min(width * 0.025, 16) + 'px',
                fontFamily: 'Arial',
                fill: '#fff',
                wordWrap: { width: width * 0.85 }
            }).setOrigin(0.5);
            yPos += height * 0.035;
        });
        
        // Back button
        const backBtn = this.add.text(width/2, height * 0.92, '◀️ BACK TO MENU', {
            fontSize: Math.min(width * 0.035, 22) + 'px',
            fontFamily: 'Arial Black',
            fill: '#fff',
            backgroundColor: '#3498db',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        backBtn.on('pointerover', () => {
            this.tweens.add({ targets: backBtn, scale: 1.05, duration: 200 });
        });
        
        backBtn.on('pointerout', () => {
            this.tweens.add({ targets: backBtn, scale: 1, duration: 200 });
        });
        
        const goToMenu = () => {
            this.scene.start('MenuScene');
        };
        
        backBtn.on('pointerdown', goToMenu);
        backBtn.on('pointerup', goToMenu);
    }
}

// Export scenes
window.MenuScene = MenuScene;
window.IntroScene = IntroScene;
window.TutorialScene = TutorialScene;
