// Game Scene for Adaptive Waste Segregator

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    
    init(data) {
        this.currentLevel = data.level || 1;
        this.skipIntro = data.skipIntro || false;
        this.score = 0;
        this.itemsSorted = 0;
        this.timeLeft = 0;
        this.gameRunning = false;
        this.itemQueue = [];
        this.activeItems = [];
        this.itemStartTimes = new Map();
        
        // Get game instance
        this.gameLogic = window.gameInstance;
    }
    
    async create() {
        const { width, height } = this.cameras.main;
        this.gameWidth = width;
        this.gameHeight = height;
        this.isMobile = width < height || width < 768;
        
        // Start level in game logic
        const levelData = this.gameLogic.startLevel(this.currentLevel);
        
        if (!levelData) {
            console.error('Level not found!');
            this.scene.start('MenuScene');
            return;
        }
        
        this.levelConfig = levelData.level;
        this.timeLeft = this.levelConfig.timeLimit;
        
        // Check if we need to show intro
        if (levelData.showIntro && !this.skipIntro) {
            // Mark content as seen
            this.gameLogic.markContentAsSeen(levelData.newBins, levelData.newItems);
            
            // Show intro scene
            this.scene.start('IntroScene', {
                newBins: levelData.newBins,
                newItems: levelData.newItems,
                levelId: this.currentLevel
            });
            return;
        }
        
        // Initialize game state
        this.gameLogic.initializeGameState(this.currentLevel, this.levelConfig);
        
        // Create game elements
        this.createBackground();
        this.createConveyorBelt();
        this.createBins();
        this.createUI();
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
        
        // Only show bins for this level
        const levelBins = this.levelConfig.bins;
        const binSpacing = width / (levelBins.length + 1);
        
        this.bins = [];
        
        levelBins.forEach((binType, index) => {
            const binConfig = window.BIN_CONFIG[binType];
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
            const label = this.add.text(0, binSize * 0.6, binConfig.name.toUpperCase(), {
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
            dropZone.setData('binType', binType);
            dropZone.setData('binGraphic', binGraphic);
            dropZone.setData('originalColor', binConfig.color);
            
            this.bins.push({ container: bin, zone: dropZone, config: binConfig });
        });
    }

    createUI() {
        const { width, height } = this.cameras.main;
        const fontSize = this.isMobile ? Math.min(width * 0.04, 18) : Math.min(width * 0.025, 22);
        
        // Score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
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
        this.levelText = this.add.text(width / 2, 16, `LEVEL ${this.currentLevel}: ${this.levelConfig.name}`, {
            fontSize: (fontSize * 0.9) + 'px',
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
            this.scene.start('MenuScene');
        });
    }

    showLevelStart() {
        const { width, height } = this.cameras.main;
        
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8).setDepth(100);
        
        const readyText = this.add.text(width/2, height * 0.45, 'GET READY!', {
            fontSize: Math.min(width * 0.08, 48) + 'px',
            fontFamily: 'Arial Black',
            fill: '#f1c40f',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(101).setAlpha(0);
        
        this.tweens.add({
            targets: readyText,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 400,
            ease: 'Elastic.easeOut'
        });
        
        this.time.delayedCall(1500, () => {
            this.tweens.add({
                targets: [overlay, readyText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    overlay.destroy();
                    readyText.destroy();
                    this.startGame();
                }
            });
        });
    }

    startGame() {
        this.gameRunning = true;
        
        // Prepare item queue
        const itemTypes = this.levelConfig.itemTypes;
        const shuffled = Phaser.Utils.Array.Shuffle([...itemTypes]);
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
        
        const itemType = this.itemQueue.shift();
        const itemData = window.ITEM_DATABASE[itemType];
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
        item.setData('itemType', itemType);
        item.setData('name', itemData.name);
        
        // Track spawn time for reaction time
        this.itemStartTimes.set(item, Date.now());
        
        // Add physics
        this.physics.add.existing(item);
        item.body.setVelocity(-this.levelConfig.speed, 0);
        item.body.setSize(itemSize, itemSize);
        
        // Make draggable
        item.setInteractive({ draggable: true, useHandCursor: true });
        this.input.setDraggable(item);
        
        // Label
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
            this.tweens.add({ targets: item, scale: 1.1, duration: 200 });
        });
        
        item.on('pointerout', () => {
            label.setVisible(false);
            this.tweens.add({ targets: item, scale: 1, duration: 200 });
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
        const itemType = item.getData('itemType');
        
        // Calculate reaction time
        const startTime = this.itemStartTimes.get(item);
        const reactionTime = (Date.now() - startTime) / 1000;
        this.itemStartTimes.delete(item);
        
        // Update game logic
        const result = this.gameLogic.updateGameStats(itemType, correctBin, droppedBin, reactionTime);
        
        if (result.isCorrect) {
            this.handleCorrect(item, dropZone);
        } else {
            this.handleIncorrect(item, dropZone, result.hint);
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
        this.scoreText.setText(`Score: ${this.score}`);
        this.itemsText.setText(`Items: ${this.itemsSorted}/${this.levelConfig.itemCount}`);
        
        // Particle effect
        this.createParticles(item.x, item.y, 0x00ff00);
        
        // Feedback
        const feedback = this.add.text(item.x, item.y, '✓ +10', {
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
    
    handleIncorrect(item, dropZone, hint) {
        this.score = Math.max(0, this.score - 5);
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Particle effect
        this.createParticles(item.x, item.y, 0xff0000);
        
        // Camera shake
        this.cameras.main.shake(200, 0.005);
        
        // Feedback with hint
        const feedback = this.add.text(this.gameWidth/2, this.gameHeight * 0.3, '❌ WRONG BIN!', {
            fontSize: Math.min(this.gameWidth * 0.05, 32) + 'px',
            fontFamily: 'Arial Black',
            fill: '#ff0000',
            stroke: '#fff',
            strokeThickness: 4,
            backgroundColor: '#000000cc',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setDepth(50);
        
        const hintText = this.add.text(this.gameWidth/2, this.gameHeight * 0.36, hint, {
            fontSize: Math.min(this.gameWidth * 0.03, 16) + 'px',
            fontFamily: 'Arial',
            fill: '#ffff00',
            backgroundColor: '#000000cc',
            padding: { x: 10, y: 5 },
            wordWrap: { width: this.gameWidth * 0.8 }
        }).setOrigin(0.5).setDepth(50);
        
        this.time.delayedCall(2000, () => {
            feedback.destroy();
            hintText.destroy();
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
                    const correctBin = item.getData('correctBin');
                    
                    // Only penalize if the item's correct bin is available in this level
                    if (this.levelConfig.bins.includes(correctBin)) {
                        this.score = Math.max(0, this.score - 2);
                        this.scoreText.setText(`Score: ${this.score}`);
                        
                        const feedback = this.add.text(this.gameWidth/2, this.gameHeight * 0.3, 'MISSED! -2', {
                            fontSize: Math.min(this.gameWidth * 0.04, 24) + 'px',
                            fontFamily: 'Arial',
                            fill: '#ffff00',
                            backgroundColor: '#000000cc',
                            padding: { x: 10, y: 5 }
                        }).setOrigin(0.5).setDepth(50);
                        
                        this.time.delayedCall(1000, () => feedback.destroy());
                    }
                    // If bin not available, item just disappears (no penalty, no reward)
                    
                    if (item.label) item.label.destroy();
                    this.itemStartTimes.delete(item);
                    item.destroy();
                    this.activeItems = this.activeItems.filter(i => i !== item);
                }
            }
        });
        
        // Check if all items have been dealt with (sorted or missed)
        if (this.itemQueue.length === 0 && this.activeItems.length === 0 && this.gameRunning) {
            this.endGame();
        }
    }

    async endGame() {
        if (!this.gameRunning) return;
        this.gameRunning = false;
        
        if (this.gameTimer) this.gameTimer.remove();
        if (this.spawnTimer) this.spawnTimer.remove();
        
        // Clean up
        this.activeItems.forEach(item => {
            if (item.label) item.label.destroy();
            item.destroy();
        });
        this.activeItems = [];
        this.itemStartTimes.clear();
        
        // Evaluate performance
        const results = await this.gameLogic.endGame();
        
        // Show results scene
        this.scene.start('ResultsScene', {
            score: this.score,
            itemsSorted: this.itemsSorted,
            levelId: this.currentLevel,
            performance: results.performance,
            decision: results.decision
        });
    }
}

// Export
window.GameScene = GameScene;
