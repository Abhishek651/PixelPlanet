// Responsive Waste Segregator Game with Multiple Levels
// Game Configuration
const GAME_CONFIG = {
    levels: [
        { name: 'BEGINNER', speed: 60, spawnDelay: 3000, itemCount: 8, timeLimit: 45 },
        { name: 'INTERMEDIATE', speed: 80, spawnDelay: 2500, itemCount: 10, timeLimit: 50 },
        { name: 'ADVANCED', speed: 100, spawnDelay: 2000, itemCount: 12, timeLimit: 55 },
        { name: 'EXPERT', speed: 120, spawnDelay: 1700, itemCount: 15, timeLimit: 60 },
        { name: 'MASTER', speed: 140, spawnDelay: 1500, itemCount: 18, timeLimit: 65 }
    ],
    bins: [
        { type: 'compost', color: 0x27ae60, emoji: '♻️', label: 'COMPOST' },
        { type: 'containers', color: 0x3498db, emoji: '🗑️', label: 'CONTAINERS' },
        { type: 'paper', color: 0xf39c12, emoji: '📄', label: 'PAPER' },
        { type: 'landfill', color: 0x7f8c8d, emoji: '🚮', label: 'LANDFILL' }
    ],
    items: [
        { name: "Plastic Bottle", emoji: "🍾", bin: "containers", note: "Rinse before recycling!" },
        { name: "Banana Peel", emoji: "🍌", bin: "compost", note: "Great for composting!" },
        { name: "Soda Can", emoji: "🥫", bin: "containers", note: "Aluminum is recyclable!" },
        { name: "Pizza Box", emoji: "🍕", bin: "compost", note: "Grease makes it compostable!" },
        { name: "Office Paper", emoji: "📃", bin: "paper", note: "Clean paper only!" },
        { name: "Broken Glass", emoji: "🔨", bin: "landfill", note: "Not standard recycling!" },
        { name: "Coffee Cup", emoji: "☕", bin: "landfill", note: "Has plastic lining!" },
        { name: "Newspaper", emoji: "📰", bin: "paper", note: "Recycle old news!" },
        { name: "Apple Core", emoji: "🍎", bin: "compost", note: "Perfect for compost!" },
        { name: "Milk Carton", emoji: "🥛", bin: "containers", note: "Rinse first!" }
    ]
};

// Calculate responsive game dimensions
function getGameDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    let gameWidth, gameHeight;
    
    if (aspectRatio > 1.5) {
        // Wide screen (desktop)
        gameWidth = Math.min(1200, width);
        gameHeight = Math.min(800, height);
    } else if (aspectRatio > 1) {
        // Tablet landscape
        gameWidth = Math.min(1000, width);
        gameHeight = Math.min(700, height);
    } else {
        // Mobile portrait
        gameWidth = width;
        gameHeight = height;
    }
    
    return { width: gameWidth, height: gameHeight };
}

// Menu Scene
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
        const title = this.add.text(width / 2, height * 0.15, 'ECO SORTING', {
            fontSize: Math.min(width * 0.08, 64) + 'px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#0f3460',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(width / 2, height * 0.23, 'FACTORY', {
            fontSize: Math.min(width * 0.06, 48) + 'px',
            fontFamily: 'Arial Black',
            fill: '#fff',
            stroke: '#0f3460',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Level selection
        const levelY = height * 0.4;
        const levelSpacing = Math.min(height * 0.12, 90);
        
        GAME_CONFIG.levels.forEach((level, index) => {
            this.createLevelButton(width / 2, levelY + (index * levelSpacing), level, index + 1);
        });
        
        // Quit button
        const quitBtn = this.createButton(width / 2, height * 0.9, 'QUIT', 0xe74c3c, () => {
            // Check if running in iframe
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

    createLevelButton(x, y, levelConfig, levelNum) {
        const { width } = this.cameras.main;
        const btnWidth = Math.min(width * 0.7, 400);
        const btnHeight = Math.min(width * 0.12, 60);
        
        const container = this.add.container(x, y);
        
        const bg = this.add.graphics();
        const colors = [0x27ae60, 0x3498db, 0xf39c12, 0xe74c3c, 0x9b59b6];
        bg.fillStyle(colors[levelNum - 1], 1);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
        bg.lineStyle(3, 0xffffff, 0.8);
        bg.strokeRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 12);
        
        const text = this.add.text(0, 0, `LEVEL ${levelNum}: ${levelConfig.name}`, {
            fontSize: Math.min(width * 0.04, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        container.add([bg, text]);
        container.setSize(btnWidth, btnHeight);
        container.setInteractive({ useHandCursor: true });
        
        container.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scale: 1.05,
                duration: 200
            });
        });
        
        container.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 200
            });
        });
        
        container.on('pointerdown', () => {
            this.scene.start('GameScene', { level: levelNum });
        });
        
        return container;
    }
    
    createButton(x, y, text, color, callback) {
        const { width } = this.cameras.main;
        const btnWidth = Math.min(width * 0.4, 200);
        const btnHeight = Math.min(width * 0.1, 50);
        
        const container = this.add.container(x, y);
        
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 10);
        
        const btnText = this.add.text(0, 0, text, {
            fontSize: Math.min(width * 0.035, 20) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        container.add([bg, btnText]);
        container.setSize(btnWidth, btnHeight);
        container.setInteractive({ useHandCursor: true });
        
        container.on('pointerdown', callback);
        
        return container;
    }
}

// Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    
    init(data) {
        this.currentLevel = data.level || 1;
        this.levelConfig = GAME_CONFIG.levels[this.currentLevel - 1];
        this.score = 0;
        this.itemsSorted = 0;
        this.timeLeft = this.levelConfig.timeLimit;
        this.gameRunning = false;
        this.itemQueue = [];
        this.activeItems = [];
    }
    
    create() {
        const { width, height } = this.cameras.main;
        this.gameWidth = width;
        this.gameHeight = height;
        
        // Determine if mobile
        this.isMobile = width < height || width < 768;
        
        // Background
        this.createBackground();
        
        // Conveyor belt
        this.createConveyorBelt();
        
        // Bins
        this.createBins();
        
        // UI
        this.createUI();
        
        // Show level start
        this.showLevelStart();
    }
    
    createBackground() {
        const { width, height } = this.cameras.main;
        const colors = [
            { top: 0x1a1a2e, bottom: 0x0f3460 },
            { top: 0x2c3e50, bottom: 0x34495e },
            { top: 0x16213e, bottom: 0x0f3460 },
            { top: 0x1a252f, bottom: 0x2c3e50 },
            { top: 0x0f0f1e, bottom: 0x1a1a2e }
        ];
        
        const color = colors[this.currentLevel - 1];
        const bg = this.add.graphics();
        bg.fillGradientStyle(color.top, color.top, color.bottom, color.bottom, 1);
        bg.fillRect(0, 0, width, height);
        
        // Stars
        for (let i = 0; i < 30; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height * 0.4),
                Phaser.Math.Between(1, 3),
                0xffffff,
                0.3
            );
            
            this.tweens.add({
                targets: star,
                alpha: 0.8,
                duration: Phaser.Math.Between(1000, 2000),
                yoyo: true,
                repeat: -1
            });
        }
    }

    createConveyorBelt() {
        const { width, height } = this.cameras.main;
        const beltY = this.isMobile ? height * 0.5 : height * 0.55;
        const beltHeight = this.isMobile ? height * 0.15 : height * 0.12;
        
        this.beltY = beltY;
        
        const belt = this.add.graphics();
        belt.fillStyle(0x34495e, 1);
        belt.fillRect(0, beltY - beltHeight/2, width, beltHeight);
        belt.lineStyle(3, 0x2c3e50, 1);
        
        // Belt stripes
        this.beltStripes = [];
        for (let i = 0; i < Math.ceil(width / 30) + 1; i++) {
            const stripe = this.add.rectangle(
                i * 30,
                beltY,
                20,
                beltHeight * 0.8,
                0x2c3e50,
                0.3
            );
            this.beltStripes.push(stripe);
        }
    }
    
    createBins() {
        const { width, height } = this.cameras.main;
        const binY = this.isMobile ? height * 0.8 : height * 0.85;
        const binSize = this.isMobile ? Math.min(width * 0.18, 80) : Math.min(width * 0.08, 100);
        const binSpacing = width / (GAME_CONFIG.bins.length + 1);
        
        this.bins = [];
        
        GAME_CONFIG.bins.forEach((binConfig, index) => {
            const x = binSpacing * (index + 1);
            
            // Bin container
            const bin = this.add.container(x, binY);
            
            // Bin graphic
            const binGraphic = this.add.graphics();
            binGraphic.fillStyle(binConfig.color, 1);
            binGraphic.fillRoundedRect(-binSize/2, -binSize/2, binSize, binSize, 8);
            binGraphic.lineStyle(3, 0x000000, 0.3);
            binGraphic.strokeRoundedRect(-binSize/2, -binSize/2, binSize, binSize, 8);
            
            // Emoji
            const emoji = this.add.text(0, 0, binConfig.emoji, {
                fontSize: (binSize * 0.5) + 'px'
            }).setOrigin(0.5);
            
            // Label
            const label = this.add.text(0, binSize * 0.6, binConfig.label, {
                fontSize: Math.min(binSize * 0.15, 14) + 'px',
                fontFamily: 'Arial',
                fill: '#fff',
                backgroundColor: '#00000088',
                padding: { x: 4, y: 2 }
            }).setOrigin(0.5);
            
            bin.add([binGraphic, emoji, label]);
            
            // Drop zone
            const dropZone = this.add.zone(x, binY, binSize * 1.5, binSize * 1.5)
                .setRectangleDropZone(binSize * 1.5, binSize * 1.5);
            dropZone.setData('binType', binConfig.type);
            dropZone.setData('binGraphic', binGraphic);
            dropZone.setData('originalColor', binConfig.color);
            
            this.bins.push({ container: bin, zone: dropZone, config: binConfig });
        });
    }

    createUI() {
        const { width, height } = this.cameras.main;
        const fontSize = this.isMobile ? Math.min(width * 0.04, 18) : Math.min(width * 0.025, 22);
        
        // Score
        this.scoreText = this.add.text(16, 16, 'Score: 0 KP', {
            fontSize: fontSize + 'px',
            fontFamily: 'Arial Black',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        });
        
        // Timer
        this.timerText = this.add.text(width - 16, 16, `Time: ${this.timeLeft}s`, {
            fontSize: fontSize + 'px',
            fontFamily: 'Arial Black',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(1, 0);
        
        // Items counter
        this.itemsText = this.add.text(16, 16 + fontSize + 8, `Items: 0/${this.levelConfig.itemCount}`, {
            fontSize: (fontSize * 0.8) + 'px',
            fontFamily: 'Arial',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2
        });
        
        // Level indicator
        this.levelText = this.add.text(width / 2, 16, `LEVEL ${this.currentLevel}`, {
            fontSize: fontSize + 'px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5, 0);
        
        // Menu button
        const menuBtn = this.add.text(width / 2, height - 16, '🏠 MENU', {
            fontSize: (fontSize * 0.8) + 'px',
            fontFamily: 'Arial',
            fill: '#fff',
            backgroundColor: '#e74c3c',
            padding: { x: 12, y: 6 }
        }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true });
        
        menuBtn.on('pointerdown', () => {
            this.gameRunning = false;
            // Check if running in iframe
            if (window.parent !== window) {
                window.parent.location.href = '/games';
            } else {
                this.scene.start('MenuScene');
            }
        });
    }

    showLevelStart() {
        const { width, height } = this.cameras.main;
        
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8).setDepth(100);
        
        const levelText = this.add.text(width/2, height * 0.35, `LEVEL ${this.currentLevel}`, {
            fontSize: Math.min(width * 0.1, 64) + 'px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        const nameText = this.add.text(width/2, height * 0.45, this.levelConfig.name, {
            fontSize: Math.min(width * 0.06, 32) + 'px',
            fontFamily: 'Arial',
            fill: '#fff'
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        const readyText = this.add.text(width/2, height * 0.55, 'GET READY!', {
            fontSize: Math.min(width * 0.07, 36) + 'px',
            fontFamily: 'Arial Black',
            fill: '#f1c40f',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        this.tweens.add({
            targets: levelText,
            alpha: 1,
            scale: { from: 0, to: 1 },
            duration: 400,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: nameText,
            alpha: 1,
            duration: 400,
            delay: 200
        });
        
        this.tweens.add({
            targets: readyText,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 400,
            delay: 400,
            ease: 'Elastic.easeOut'
        });
        
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: [overlay, levelText, nameText, readyText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    overlay.destroy();
                    levelText.destroy();
                    nameText.destroy();
                    readyText.destroy();
                    this.startGame();
                }
            });
        });
    }

    startGame() {
        this.gameRunning = true;
        
        // Prepare item queue
        const shuffled = Phaser.Utils.Array.Shuffle([...GAME_CONFIG.items]);
        this.itemQueue = shuffled.slice(0, this.levelConfig.itemCount);
        
        // Start timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timerText.setText(`Time: ${this.timeLeft}s`);
                if (this.timeLeft <= 0) this.endGame();
            },
            loop: true
        });
        
        // Start spawning items
        this.spawnTimer = this.time.addEvent({
            delay: this.levelConfig.spawnDelay,
            callback: () => this.spawnItem(),
            loop: true
        });
        
        // Setup drag and drop
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            if (gameObject.label) {
                gameObject.label.setPosition(dragX, dragY - gameObject.displayHeight);
            }
        });
        
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            this.handleDrop(gameObject, dropZone);
        });
        
        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (!dropped && gameObject.active) {
                gameObject.body.velocity.x = -this.levelConfig.speed;
            }
        });
    }

    spawnItem() {
        if (this.itemQueue.length === 0) return;
        
        const itemData = this.itemQueue.shift();
        const { width } = this.cameras.main;
        const itemSize = this.isMobile ? Math.min(width * 0.12, 60) : Math.min(width * 0.06, 70);
        
        // Create item container
        const item = this.add.container(width + itemSize, this.beltY);
        
        // Item graphic
        const graphic = this.add.graphics();
        graphic.fillStyle(0xffffff, 1);
        graphic.fillRoundedRect(-itemSize/2, -itemSize/2, itemSize, itemSize, 8);
        graphic.lineStyle(3, 0x000000, 0.3);
        graphic.strokeRoundedRect(-itemSize/2, -itemSize/2, itemSize, itemSize, 8);
        
        // Emoji
        const emoji = this.add.text(0, 0, itemData.emoji, {
            fontSize: (itemSize * 0.6) + 'px'
        }).setOrigin(0.5);
        
        item.add([graphic, emoji]);
        item.setSize(itemSize, itemSize);
        item.setData('correctBin', itemData.bin);
        item.setData('name', itemData.name);
        item.setData('note', itemData.note);
        
        // Add physics
        this.physics.add.existing(item);
        item.body.setVelocity(-this.levelConfig.speed, 0);
        item.body.setSize(itemSize, itemSize);
        
        // Make draggable
        item.setInteractive({ draggable: true, useHandCursor: true });
        this.input.setDraggable(item);
        
        // Label (hidden initially)
        const label = this.add.text(item.x, item.y - itemSize, itemData.name, {
            fontSize: Math.min(itemSize * 0.25, 14) + 'px',
            fontFamily: 'Arial',
            fill: '#fff',
            backgroundColor: '#000000cc',
            padding: { x: 6, y: 3 }
        }).setOrigin(0.5).setVisible(false).setDepth(50);
        
        item.label = label;
        
        // Hover effects
        item.on('pointerover', () => {
            label.setVisible(true);
            this.tweens.add({
                targets: item,
                scale: 1.1,
                duration: 200
            });
        });
        
        item.on('pointerout', () => {
            label.setVisible(false);
            this.tweens.add({
                targets: item,
                scale: 1,
                duration: 200
            });
        });
        
        item.on('drag', () => {
            item.body.setVelocity(0, 0);
            item.setScale(1.2);
            label.setVisible(true);
        });
        
        this.activeItems.push(item);
    }

    handleDrop(item, dropZone) {
        const correctBin = item.getData('correctBin');
        const droppedBin = dropZone.getData('binType');
        
        if (correctBin === droppedBin) {
            this.handleCorrect(item, dropZone);
        } else {
            this.handleIncorrect(item, dropZone);
        }
        
        // Remove item
        if (item.label) item.label.destroy();
        item.destroy();
        this.activeItems = this.activeItems.filter(i => i !== item);
        
        // Check if game complete
        if (this.itemsSorted >= this.levelConfig.itemCount) {
            this.endGame();
        }
    }
    
    handleCorrect(item, dropZone) {
        this.score += 10;
        this.itemsSorted++;
        this.scoreText.setText(`Score: ${this.score} KP`);
        this.itemsText.setText(`Items: ${this.itemsSorted}/${this.levelConfig.itemCount}`);
        
        // Particle effect
        this.createParticles(item.x, item.y, 0x00ff00);
        
        // Feedback
        const feedback = this.add.text(item.x, item.y, '✓ +10 KP', {
            fontSize: Math.min(this.gameWidth * 0.04, 24) + 'px',
            fontFamily: 'Arial Black',
            fill: '#00ff00',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(50);
        
        this.tweens.add({
            targets: feedback,
            y: feedback.y - 60,
            alpha: 0,
            duration: 1000,
            onComplete: () => feedback.destroy()
        });
        
        // Bin flash
        const binGraphic = dropZone.getData('binGraphic');
        this.tweens.add({
            targets: binGraphic,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2
        });
    }
    
    handleIncorrect(item, dropZone) {
        this.score = Math.max(0, this.score - 5);
        this.timeLeft = Math.max(0, this.timeLeft - 3);
        this.scoreText.setText(`Score: ${this.score} KP`);
        
        // Particle effect
        this.createParticles(item.x, item.y, 0xff0000);
        
        // Camera shake
        this.cameras.main.shake(200, 0.005);
        
        // Feedback
        const note = item.getData('note');
        const feedback = this.add.text(this.gameWidth/2, this.gameHeight * 0.3, '❌ WRONG BIN!', {
            fontSize: Math.min(this.gameWidth * 0.05, 32) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ff0000',
            stroke: '#fff',
            strokeThickness: 4,
            backgroundColor: '#000000cc',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setDepth(50);
        
        const noteText = this.add.text(this.gameWidth/2, this.gameHeight * 0.36, `-3s Time! ${note}`, {
            fontSize: Math.min(this.gameWidth * 0.03, 16) + 'px',
            fontFamily: 'Arial',
            fill: '#ffff00',
            backgroundColor: '#000000cc',
            padding: { x: 10, y: 5 },
            wordWrap: { width: this.gameWidth * 0.8 }
        }).setOrigin(0.5).setDepth(50);
        
        this.time.delayedCall(1500, () => {
            feedback.destroy();
            noteText.destroy();
        });
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 12; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(3, 6), color).setDepth(50);
            const angle = (Math.PI * 2 * i) / 12;
            const speed = Phaser.Math.Between(50, 120);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // Animate belt
        this.beltStripes.forEach(stripe => {
            stripe.x -= 2;
            if (stripe.x < -20) {
                stripe.x = this.gameWidth + 10;
            }
        });
        
        // Update item labels and check for missed items
        this.activeItems.forEach(item => {
            if (item.active && item.label) {
                item.label.setPosition(item.x, item.y - item.displayHeight);
                
                // Check if item went off screen
                if (item.x < -item.displayWidth) {
                    this.score = Math.max(0, this.score - 2);
                    this.scoreText.setText(`Score: ${this.score} KP`);
                    
                    const feedback = this.add.text(this.gameWidth/2, this.gameHeight * 0.3, 'MISSED! -2 KP', {
                        fontSize: Math.min(this.gameWidth * 0.04, 24) + 'px',
                        fontFamily: 'Arial',
                        fill: '#ffff00',
                        backgroundColor: '#000000cc',
                        padding: { x: 10, y: 5 }
                    }).setOrigin(0.5).setDepth(50);
                    
                    this.time.delayedCall(1000, () => feedback.destroy());
                    
                    if (item.label) item.label.destroy();
                    item.destroy();
                    this.activeItems = this.activeItems.filter(i => i !== item);
                }
            }
        });
    }

    endGame() {
        if (!this.gameRunning) return;
        this.gameRunning = false;
        
        if (this.gameTimer) this.gameTimer.remove();
        if (this.spawnTimer) this.spawnTimer.remove();
        
        // Clean up active items
        this.activeItems.forEach(item => {
            if (item.label) item.label.destroy();
            item.destroy();
        });
        this.activeItems = [];
        
        const { width, height } = this.cameras.main;
        const isSuccess = this.itemsSorted >= this.levelConfig.itemCount;
        
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
        
        // Title
        const title = this.add.text(width/2, height * 0.2, isSuccess ? '🎉 SUCCESS! 🎉' : '⏰ TIME\'S UP!', {
            fontSize: Math.min(width * 0.08, 48) + 'px',
            fontFamily: 'Arial Black',
            fill: isSuccess ? '#4ecca3' : '#e74c3c',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        // Score
        const scoreText = this.add.text(width/2, height * 0.35, `Final Score: ${this.score} KP`, {
            fontSize: Math.min(width * 0.05, 32) + 'px',
            fontFamily: 'Arial',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        // Items
        const itemsText = this.add.text(width/2, height * 0.43, `Items: ${this.itemsSorted}/${this.levelConfig.itemCount}`, {
            fontSize: Math.min(width * 0.04, 20) + 'px',
            fontFamily: 'Arial',
            fill: '#bdc3c7'
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        // Buttons
        let yPos = height * 0.55;
        const btnSpacing = height * 0.08;
        
        // Next level button
        if (isSuccess && this.currentLevel < 5) {
            const nextBtn = this.createEndButton(width/2, yPos, `⭐ LEVEL ${this.currentLevel + 1}`, 0xf39c12, () => {
                this.scene.restart({ level: this.currentLevel + 1 });
            });
            yPos += btnSpacing;
        }
        
        // Restart button
        const restartBtn = this.createEndButton(width/2, yPos, '🔄 RESTART', 0x27ae60, () => {
            this.scene.restart({ level: this.currentLevel });
        });
        yPos += btnSpacing;
        
        // Menu button
        const menuBtn = this.createEndButton(width/2, yPos, '🏠 MENU', 0x3498db, () => {
            // Check if running in iframe
            if (window.parent !== window) {
                window.parent.location.href = '/games';
            } else {
                this.scene.start('MenuScene');
            }
        });
        
        // Animate in
        this.tweens.add({ targets: title, alpha: 1, scale: { from: 0, to: 1 }, duration: 500, ease: 'Back.easeOut' });
        this.tweens.add({ targets: scoreText, alpha: 1, duration: 500, delay: 200 });
        this.tweens.add({ targets: itemsText, alpha: 1, duration: 500, delay: 400 });
    }

    createEndButton(x, y, text, color, callback) {
        const btnWidth = Math.min(this.gameWidth * 0.5, 250);
        const btnHeight = Math.min(this.gameWidth * 0.08, 50);
        
        const container = this.add.container(x, y).setDepth(101).setAlpha(0);
        
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-btnWidth/2, -btnHeight/2, btnWidth, btnHeight, 10);
        
        const btnText = this.add.text(0, 0, text, {
            fontSize: Math.min(this.gameWidth * 0.04, 22) + 'px',
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
            delay: 600,
            ease: 'Back.easeOut'
        });
        
        return container;
    }
}

// Game initialization
const dims = getGameDimensions();
const config = {
    type: Phaser.AUTO,
    width: dims.width,
    height: dims.height,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
    const newDims = getGameDimensions();
    game.scale.resize(newDims.width, newDims.height);
});
