// --- 1. GAME DATA (Item Database) ----------------------------------------------
const ITEM_DB = [
    { name: "Plastic Bottle", key: "item_plastic_bottle", correctBin: "containers", note: "Remember to rinse!" },
    { name: "Banana Peel", key: "item_banana_peel", correctBin: "compost", note: "Great for soil!" },
    { name: "Soda Can", key: "item_soda_can", correctBin: "containers", note: "Infinitely recyclable." },
    { name: "Greasy Pizza Box", key: "item_pizza_box", correctBin: "compost", note: "Oil contaminates paper!" },
    { name: "Office Paper", key: "item_office_paper", correctBin: "paper", note: "Clean paper only." },
    { name: "Broken Glass", key: "item_broken_glass", correctBin: "landfill", note: "Not standard recycling glass." },
    { name: "Used Coffee Cup", key: "item_coffee_cup", correctBin: "landfill", note: "Plastic lining!" },
    // Add more items here, ensuring you have corresponding image keys loaded in preload!
    // Example: { name: "Newspaper", key: "item_newspaper", correctBin: "paper", note: "Recycle old news!" },
];

const TOTAL_ITEMS_TO_SORT = 10;
const GAME_TIME = 60; // seconds

// --- 2. PHASER GAME SCENE -----------------------------------------------------

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        console.log("GameScene: Constructor");
    }

    init(data) {
        console.log("GameScene: Init", data);
        // Initialize or reset game state
        this.currentLevel = data.level || 1;
        this.score = data.score || 0;
        this.itemsSorted = 0;
        this.timeLeft = GAME_TIME;
        this.gameRunning = false;
        this.itemsToSpawn = [];
        this.itemsOnScreen = null;
    }

    preload() {
        console.log("GameScene: Preload");
        // Try to load real images, fallback to graphics if they don't exist
        this.load.on('loaderror', (file) => {
            console.log('Image not found, will use graphics:', file.key);
        });

        // Load bin images
        this.load.image('bin_compost', 'assets/bin_compost.png');
        this.load.image('bin_containers', 'assets/bin_containers.png');
        this.load.image('bin_paper', 'assets/bin_paper.png');
        this.load.image('bin_landfill', 'assets/bin_landfill.png');

        // Load item images
        this.load.image('item_plastic_bottle', 'assets/item_plastic_bottle.png');
        this.load.image('item_banana_peel', 'assets/item_banana_peel.png');
        this.load.image('item_soda_can', 'assets/item_soda_can.png');
        this.load.image('item_pizza_box', 'assets/item_pizza_box.png');
        this.load.image('item_office_paper', 'assets/item_office_paper.png');
        this.load.image('item_broken_glass', 'assets/item_broken_glass.png');
        this.load.image('item_coffee_cup', 'assets/item_coffee_cup.png');
    }
    
    // --- 3. GAME SETUP ---

    create() {
        console.log("GameScene: Create");
        this.textures.remove('bin_compost');
        this.textures.remove('bin_containers');
        this.textures.remove('bin_paper');
        this.textures.remove('bin_landfill');
        this.textures.remove('item_plastic_bottle');
        this.textures.remove('item_banana_peel');
        this.textures.remove('item_soda_can');
        this.textures.remove('item_pizza_box');
        this.textures.remove('item_office_paper');
        this.textures.remove('item_broken_glass');
        this.textures.remove('item_coffee_cup');
        
        // Create beautiful gradient background
        this.createBackground();
        
        // Use a 2D physics system for conveyor belt movement
        this.physics.world.setBounds(0, 0, 800, 600);

        // Initialize the items group
        this.itemsOnScreen = this.add.group();

        // Always create graphics (Phaser caches textures automatically)
        this.createPlaceholderGraphics();
        
        // Create conveyor belt visual
        this.createConveyorBelt();
        
        this.createBins();
        this.createUI();
        
        // Enable drag-and-drop functionality
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            this.handleItemDrop(pointer, gameObject, dropZone);
        });
        
        // Show level start animation
        this.showLevelStart();
    }

    showLevelStart() {
        console.log("GameScene: showLevelStart");
        // Create level start overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setDepth(200);
        
        const levelColors = ['#4ecca3', '#3498db', '#f39c12', '#e74c3c', '#9b59b6'];
        const levelNames = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'MASTER'];
        
        // Level number
        const levelNum = this.add.text(400, 200, `LEVEL ${this.currentLevel}`, {
            fontSize: '72px',
            fontFamily: 'Arial Black',
            fill: levelColors[this.currentLevel - 1],
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(201).setAlpha(0);

        // Level name
        const levelName = this.add.text(400, 280, levelNames[this.currentLevel - 1], {
            fontSize: '32px',
            fontFamily: 'Arial',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(201).setAlpha(0);

        // Difficulty info
        const config = this.getLevelConfig();
        const diffText = this.add.text(400, 340, `Speed: ${config.itemSpeed}px/s | Spawn: ${config.spawnDelay/1000}s`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#bdc3c7'
        }).setOrigin(0.5).setDepth(201).setAlpha(0);

        // Ready text
        const readyText = this.add.text(400, 400, 'GET READY!', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            fill: '#f1c40f',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(201).setAlpha(0);

        // Animate in
        this.tweens.add({
            targets: levelNum,
            alpha: 1,
            scale: { from: 0, to: 1 },
            duration: 400,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: levelName,
            alpha: 1,
            y: { from: 250, to: 280 },
            duration: 400,
            delay: 200
        });

        this.tweens.add({
            targets: diffText,
            alpha: 1,
            duration: 400,
            delay: 400
        });

        this.tweens.add({
            targets: readyText,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 400,
            delay: 600,
            ease: 'Elastic.easeOut'
        });

        // Fade out and start game
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: [overlay, levelNum, levelName, diffText, readyText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    overlay.destroy();
                    levelNum.destroy();
                    levelName.destroy();
                    diffText.destroy();
                    readyText.destroy();
                    this.startGame();
                }
            });
        });
    }

    createBackground() {
        // Level-based gradient colors
        const levelColors = {
            1: { top: 0x1a1a2e, bottom: 0x0f3460 },
            2: { top: 0x2c3e50, bottom: 0x34495e },
            3: { top: 0x16213e, bottom: 0x0f3460 },
            4: { top: 0x1a252f, bottom: 0x2c3e50 },
            5: { top: 0x0f0f1e, bottom: 0x1a1a2e }
        };
        
        const colors = levelColors[this.currentLevel] || levelColors[1];
        
        // Gradient background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(colors.top, colors.top, colors.bottom, colors.bottom, 1);
        graphics.fillRect(0, 0, 800, 600);

        // Add decorative elements (more for higher levels)
        const starCount = 15 + (this.currentLevel * 5);
        for (let i = 0; i < starCount; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 300);
            const size = Phaser.Math.Between(2, 5);
            const circle = this.add.circle(x, y, size, 0xffffff, 0.1 + (this.currentLevel * 0.05));
            
            // Twinkling animation (faster for higher levels)
            this.tweens.add({
                targets: circle,
                alpha: 0.3 + (this.currentLevel * 0.1),
                duration: Phaser.Math.Between(1000, 3000) - (this.currentLevel * 100),
                yoyo: true,
                repeat: -1
            });
        }

        // Factory title with level color
        const titleColors = ['#4ecca3', '#3498db', '#f39c12', '#e74c3c', '#9b59b6'];
        this.add.text(400, 30, '🏭 ECO SORTING FACTORY', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            fill: titleColors[this.currentLevel - 1] || '#4ecca3',
            stroke: '#0f3460',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(5);
    }

    createConveyorBelt() {
        const beltY = 400;
        const beltWidth = 900;
        const beltHeight = 100;

        // Belt base
        const belt = this.add.graphics();
        belt.fillStyle(0x34495e, 1);
        belt.fillRoundedRect(-50, beltY - beltHeight/2, beltWidth, beltHeight, 10);
        
        // Belt stripes for movement effect
        belt.lineStyle(3, 0x2c3e50, 1);
        for (let i = -50; i < beltWidth; i += 40) {
            belt.lineBetween(i, beltY - beltHeight/2, i + 20, beltY + beltHeight/2);
        }

        // Belt edges
        belt.lineStyle(5, 0x1a252f, 1);
        belt.strokeRoundedRect(-50, beltY - beltHeight/2, beltWidth, beltHeight, 10);

        // Animated belt stripes
        this.beltStripes = [];
        for (let i = 0; i < 25; i++) {
            const stripe = this.add.rectangle(
                i * 40 - 50,
                beltY,
                30,
                80,
                0x2c3e50,
                0.3
            );
            this.beltStripes.push(stripe);
        }

        // Belt rollers
        const rollerLeft = this.add.circle(-30, beltY, 50, 0x7f8c8d);
        const rollerRight = this.add.circle(830, beltY, 50, 0x7f8c8d);
        
        // Roller rotation animation
        this.tweens.add({
            targets: [rollerLeft, rollerRight],
            angle: 360,
            duration: 2000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    createPlaceholderGraphics() {
        // Create detailed bin graphics
        this.createBinGraphic('bin_compost', 0x27ae60, '♻️');
        this.createBinGraphic('bin_containers', 0x3498db, '🗑️');
        this.createBinGraphic('bin_paper', 0xf39c12, '📄');
        this.createBinGraphic('bin_landfill', 0x7f8c8d, '🚮');

        // Create detailed item graphics
        this.createItemGraphic('item_plastic_bottle', 0x3498db, 0x2980b9, '🍾');
        this.createItemGraphic('item_banana_peel', 0xf1c40f, 0xf39c12, '🍌');
        this.createItemGraphic('item_soda_can', 0xe74c3c, 0xc0392b, '🥫');
        this.createItemGraphic('item_pizza_box', 0xe67e22, 0xd35400, '🍕');
        this.createItemGraphic('item_office_paper', 0xecf0f1, 0xbdc3c7, '📃');
        this.createItemGraphic('item_broken_glass', 0x95a5a6, 0x7f8c8d, '🔨');
        this.createItemGraphic('item_coffee_cup', 0x8e44ad, 0x6c3483, '☕');
    }

    createBinGraphic(key, color, emoji) {
        const width = 140;
        const height = 140;
        const rt = this.add.renderTexture(0, 0, width, height);
        const graphics = this.add.graphics();

        const rgb = Phaser.Display.Color.IntegerToRGB(color);
        
        // Shadow
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillRoundedRect(15, 115, width - 30, 8, 4);

        // Bin body - main color
        graphics.fillStyle(color, 1);
        graphics.fillRoundedRect(15, 30, width - 30, height - 50, 12);
        
        // Left side shadow for 3D effect
        graphics.fillStyle(Phaser.Display.Color.GetColor(rgb.r * 0.6, rgb.g * 0.6, rgb.b * 0.6), 1);
        graphics.fillRoundedRect(15, 30, 15, height - 50, 12);
        
        // Top depth line
        graphics.fillStyle(Phaser.Display.Color.GetColor(rgb.r * 0.7, rgb.g * 0.7, rgb.b * 0.7), 1);
        graphics.fillRect(20, 32, width - 40, 18);

        // Bin lid with gradient
        graphics.fillStyle(Phaser.Display.Color.GetColor(rgb.r * 0.85, rgb.g * 0.85, rgb.b * 0.85), 1);
        graphics.fillRoundedRect(10, 15, width - 20, 20, 8);
        
        // Lid highlight
        graphics.fillStyle(0xffffff, 0.3);
        graphics.fillRoundedRect(15, 17, width - 30, 8, 4);

        // Handle
        graphics.lineStyle(5, 0x000000, 0.5);
        graphics.strokeRoundedRect(width / 2 - 20, 18, 40, 12, 4);
        graphics.fillStyle(Phaser.Display.Color.GetColor(rgb.r * 0.9, rgb.g * 0.9, rgb.b * 0.9), 1);
        graphics.fillRoundedRect(width / 2 - 20, 18, 40, 12, 4);

        // Strong border
        graphics.lineStyle(4, 0x000000, 0.4);
        graphics.strokeRoundedRect(15, 30, width - 30, height - 50, 12);

        rt.draw(graphics);
        graphics.destroy();

        // Add emoji with shadow
        const shadowText = this.add.text(width / 2 + 2, height / 2 + 12, emoji, {
            fontSize: '50px',
            color: '#000000',
            alpha: 0.3
        }).setOrigin(0.5);
        
        const text = this.add.text(width / 2, height / 2 + 10, emoji, {
            fontSize: '50px'
        }).setOrigin(0.5);
        
        rt.draw(shadowText);
        rt.draw(text);
        rt.saveTexture(key);
        
        shadowText.destroy();
        text.destroy();
        rt.destroy();
    }

    createItemGraphic(key, color, darkColor, emoji) {
        const size = 80;
        const rt = this.add.renderTexture(0, 0, size, size);
        const graphics = this.add.graphics();

        const rgb = Phaser.Display.Color.IntegerToRGB(color);
        const darkRgb = Phaser.Display.Color.IntegerToRGB(darkColor);

        // Drop shadow
        graphics.fillStyle(0x000000, 0.25);
        graphics.fillRoundedRect(8, 8, size - 16, size - 16, 12);

        // Main body with gradient
        graphics.fillStyle(color, 1);
        graphics.fillRoundedRect(6, 6, size - 12, size - 12, 12);
        
        // Left side darker for 3D
        graphics.fillStyle(darkColor, 1);
        graphics.fillRoundedRect(6, 6, 12, size - 12, 12);
        
        // Bottom darker for 3D
        graphics.fillStyle(darkColor, 1);
        graphics.fillRoundedRect(6, size - 18, size - 12, 12, 12);

        // Top highlight
        graphics.fillStyle(0xffffff, 0.4);
        graphics.fillRoundedRect(10, 10, size - 30, size - 50, 10);

        // Glossy shine
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillRoundedRect(12, 12, size - 40, 15, 8);

        // Strong border
        graphics.lineStyle(4, 0x000000, 0.6);
        graphics.strokeRoundedRect(6, 6, size - 12, size - 12, 12);

        rt.draw(graphics);
        graphics.destroy();

        // Add emoji with shadow
        const shadowText = this.add.text(size / 2 + 1, size / 2 + 3, emoji, {
            fontSize: '38px',
            color: '#000000',
            alpha: 0.4
        }).setOrigin(0.5);
        
        const text = this.add.text(size / 2, size / 2 + 2, emoji, {
            fontSize: '38px'
        }).setOrigin(0.5);
        
        rt.draw(shadowText);
        rt.draw(text);
        rt.saveTexture(key);
        
        shadowText.destroy();
        text.destroy();
        rt.destroy();
    }

    createBins() {
        const binWidth = 150; // Visual width of the bin image
        const binHeight = 150; // Visual height of the bin image
        const binY = 600 - binHeight / 2 - 20; // Position bins slightly above bottom edge
        const xPositions = [100, 300, 500, 700];

        // Bin Data: [x, type, texture key]
        const binConfigs = [
            { x: xPositions[0], type: "compost", texture: 'bin_compost' },
            { x: xPositions[1], type: "containers", texture: 'bin_containers' },
            { x: xPositions[2], type: "paper", texture: 'bin_paper' },
            { x: xPositions[3], type: "landfill", texture: 'bin_landfill' },
        ];

        binConfigs.forEach(config => {
            // Add bin image
            let bin = this.add.image(config.x, binY, config.texture)
                       .setOrigin(0.5, 0.5); // Center the image
            // You might need to adjust scale based on your image sizes
            // .setScale(0.8); 
            
            // Add text label
            this.add.text(config.x, binY + bin.displayHeight / 2 + 10, config.type.toUpperCase(), { 
                fontSize: '14px', 
                fill: '#fff', // Use white text for labels
                backgroundColor: '#00000088' // Semi-transparent black background for readability
            }).setOrigin(0.5, 0); // Position label below the bin image

            // Create a drop zone area over the bin. Make it slightly larger than the image for easier drops.
            let dropZone = this.add.zone(config.x, binY, bin.displayWidth + 50, bin.displayHeight + 50)
                           .setRectangleDropZone(bin.displayWidth + 50, bin.displayHeight + 50);
            dropZone.setData('binType', config.type);

            // Add visual feedback for the zone
            dropZone.on('pointerover', (pointer, localX, localY) => {
                bin.setTint(0xcccccc); // Lighten on hover
            });
            dropZone.on('pointerout', () => {
                bin.clearTint(); // Remove tint when mouse leaves
            });
        });
    }

    createUI() {
        // Level indicator
        this.levelText = this.add.text(400, 16, `LEVEL ${this.currentLevel}`, {
            fontSize: '28px',
            fill: '#4ecca3',
            fontFamily: 'Arial Black',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5, 0);

        // Score Text (Top Left)
        this.scoreText = this.add.text(16, 16, `Score: ${this.score} KP`, { 
            fontSize: '24px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 3
        });

        // Timer Text (Top Right)
        this.timerText = this.add.text(800 - 16, 16, 'Time: 60s', { 
            fontSize: '24px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(1, 0);

        // Items Remaining/Sorted Text
        this.itemsText = this.add.text(16, 50, `Items: 0/${TOTAL_ITEMS_TO_SORT}`, { 
            fontSize: '18px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 2
        });

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
            this.gameRunning = false;
            if (this.gameTimer) this.gameTimer.remove();
            if (this.spawnTimer) this.spawnTimer.remove();
            this.scene.start('MenuScene');
        });
    }

    // --- 4. GAME FLOW & LOGIC ---

    startGame() {
        console.log("GameScene: startGame");
        this.gameRunning = true;
        this.itemsToSpawn = Phaser.Utils.Array.Shuffle(ITEM_DB).slice(0, TOTAL_ITEMS_TO_SORT);

        // Level-based difficulty adjustments
        const levelConfig = this.getLevelConfig();
        
        // Start timer countdown
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Start item spawning with level-based speed
        this.spawnTimer = this.time.addEvent({
            delay: levelConfig.spawnDelay,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        });
    }

    getLevelConfig() {
        // Difficulty increases with each level
        const configs = {
            1: { spawnDelay: 2500, itemSpeed: 40, timeBonus: 0 },
            2: { spawnDelay: 2000, itemSpeed: 50, timeBonus: 10 },
            3: { spawnDelay: 1700, itemSpeed: 60, timeBonus: 15 },
            4: { spawnDelay: 1500, itemSpeed: 70, timeBonus: 20 },
            5: { spawnDelay: 1300, itemSpeed: 80, timeBonus: 25 }
        };
        return configs[this.currentLevel] || configs[5]; // Default to hardest if beyond level 5
    }

    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}s`);

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    spawnItem() {
        if (this.itemsToSpawn.length === 0 && this.itemsOnScreen.getLength() === 0) {
            // No more items to spawn and none left on screen, game might be over
            if (this.gameRunning) this.endGame();
            return;
        }
        if (this.itemsToSpawn.length === 0) { // All items spawned, just wait for current ones to clear
            return;
        }
        
        const itemData = this.itemsToSpawn.pop();
        const itemX = 800 + 40; // Start off-screen right
        const itemY = 400; // Position on the "conveyor belt"

        // Create the Item Sprite using its actual image key
        let item = this.physics.add.sprite(itemX, itemY, itemData.key)
                       .setInteractive({ draggable: true });
        
        // Set item properties
        item.setData('correctBin', itemData.correctBin);
        item.setData('note', itemData.note);
        item.setData('name', itemData.name);
        
        // Level-based speed
        const levelConfig = this.getLevelConfig();
        item.body.velocity.x = -levelConfig.itemSpeed;
        item.setDepth(10); // Bring it above the belt

        // Add to group for tracking
        this.itemsOnScreen.add(item);

        // Enable Phaser Dragging
        this.input.setDraggable(item);

        // Create item name label (hidden by default)
        const nameLabel = this.add.text(item.x, item.y - 50, itemData.name, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000000cc',
            padding: { x: 8, y: 4 },
            fontFamily: 'Arial'
        }).setOrigin(0.5).setVisible(false).setDepth(20);
        item.setData('nameLabel', nameLabel);

        // Hover effects
        item.on('pointerover', () => {
            item.setTint(0xffff00); // Yellow tint on hover
            nameLabel.setVisible(true);
            nameLabel.setPosition(item.x, item.y - 50);
        });

        item.on('pointerout', () => {
            item.clearTint();
            nameLabel.setVisible(false);
        });

        // Drag event: keep the item at the pointer location
        item.on('drag', (pointer, dragX, dragY) => {
            item.x = dragX;
            item.y = dragY;
            item.body.velocity.x = 0; // Stop movement while dragging
            nameLabel.setPosition(dragX, dragY - 50);
            item.setScale(1.2); // Make it bigger while dragging
        });
        
        // Drop/DragEnd event: If not dropped on a zone, resume movement
        item.on('dragend', (pointer, dropped) => {
            item.setScale(1); // Reset scale
            if (!dropped) {
                 item.body.velocity.x = -50; // Resume conveyor movement
            }
        });
    }

    update() {
        if (!this.gameRunning) return;

        // Animate conveyor belt stripes
        if (this.beltStripes) {
            this.beltStripes.forEach(stripe => {
                stripe.x -= 2;
                if (stripe.x < -50) {
                    stripe.x = 850;
                }
            });
        }

        // Update label positions and check for missed items
        this.itemsOnScreen.children.each(item => {
            if (item.active) {
                // Update name label position if it exists and is visible
                const nameLabel = item.getData('nameLabel');
                if (nameLabel && nameLabel.visible) {
                    nameLabel.setPosition(item.x, item.y - 50);
                }
                
                // Check if item fell off the left edge
                if (item.x < -item.displayWidth / 2) {
                    this.handleMissedItem(item);
                }
            }
        });

        // If all items sorted and no more on screen, end game
        if (this.itemsSorted >= TOTAL_ITEMS_TO_SORT && this.itemsOnScreen.getLength() === 0) {
            this.endGame();
        }
    }

    // --- 5. SCORING AND FEEDBACK ---

    handleItemDrop(pointer, item, dropZone) {
        const correctBinType = item.getData('correctBin');
        const droppedBinType = dropZone.getData('binType');

        if (correctBinType === droppedBinType) {
            this.handleCorrectSort(item);
        } else {
            this.handleIncorrectSort(item);
        }

        // Destroy the name label
        const nameLabel = item.getData('nameLabel');
        if (nameLabel) nameLabel.destroy();

        // Disable further interaction and move item off-screen to be destroyed
        item.disableInteractive(); 
        item.destroy(); 
    }

    handleCorrectSort(item) {
        this.score += 10;
        this.itemsSorted++;
        this.scoreText.setText(`Score: ${this.score} KP`);
        this.itemsText.setText(`Items: ${this.itemsSorted}/${TOTAL_ITEMS_TO_SORT}`);
        
        // Create particle effect for correct sort
        this.createParticleEffect(item.x, item.y, 0x00ff00);
        
        // Positive visual feedback (text animation)
        const feedback = this.add.text(item.x, item.y, '✓ +10 KP', { 
            fontSize: '24px', 
            fill: '#00ff00',
            fontFamily: 'Arial Black',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: feedback,
            y: feedback.y - 80,
            scale: 1.5,
            alpha: 0,
            duration: 1000,
            ease: 'Back.easeOut',
            onComplete: () => { feedback.destroy(); }
        });

        // Flash the score text
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.3,
            duration: 200,
            yoyo: true,
            ease: 'Bounce.easeOut'
        });
    }

    createParticleEffect(x, y, color) {
        // Create particle burst
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(3, 8), color);
            const angle = Phaser.Math.Between(0, 360);
            const speed = Phaser.Math.Between(50, 150);
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 800,
                ease: 'Cubic.easeOut',
                onComplete: () => { particle.destroy(); }
            });
        }
    }

    handleIncorrectSort(item) {
        this.score = Math.max(0, this.score - 5); // Score penalty, not below zero
        this.timeLeft -= 5; // Time penalty
        this.scoreText.setText(`Score: ${this.score} KP`);
        
        // Create red particle effect for wrong sort
        this.createParticleEffect(item.x, item.y, 0xff0000);
        
        // Screen shake effect
        this.cameras.main.shake(200, 0.005);
        
        // Negative visual feedback and educational note
        const note = item.getData('note');
        const feedback = this.add.text(400, 250, `❌ WRONG BIN!`, { 
            fontSize: '36px', 
            fill: '#ff0000',
            fontFamily: 'Arial Black',
            stroke: '#fff',
            strokeThickness: 4,
            backgroundColor: '#000000cc',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        const noteText = this.add.text(400, 310, `-5s Time! ${note}`, { 
            fontSize: '18px', 
            fill: '#ffff00',
            fontFamily: 'Arial',
            backgroundColor: '#000000cc',
            padding: { x: 15, y: 8 },
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: [feedback, noteText],
            alpha: 0,
            duration: 1500,
            delay: 1000,
            onComplete: () => { 
                feedback.destroy(); 
                noteText.destroy();
            }
        });

        // Flash timer red
        this.tweens.add({
            targets: this.timerText,
            tint: 0xff0000,
            duration: 300,
            yoyo: true,
            repeat: 2
        });
    }
    
    handleMissedItem(item) {
        if (!item.active) return; // Ensure item is still active
        
        // Destroy the name label
        const nameLabel = item.getData('nameLabel');
        if (nameLabel) nameLabel.destroy();
        
        item.destroy(); // Item fell off the belt
        this.score = Math.max(0, this.score - 2); 
        this.scoreText.setText(`Score: ${this.score} KP`);
        
        const feedback = this.add.text(400, 300, `Item Missed! -2 KP`, { 
            fontSize: '25px', 
            fill: '#ffff00', 
            backgroundColor: '#000000cc' 
        }).setOrigin(0.5);
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            duration: 1000,
            delay: 500,
            onComplete: () => { feedback.destroy(); }
        });
    }

    endGame() {
        if (!this.gameRunning) return; // Prevent multiple calls
        console.log("GameScene: endGame");
        this.gameRunning = false;
        if (this.gameTimer) this.gameTimer.remove();
        if (this.spawnTimer) this.spawnTimer.remove();
        this.itemsOnScreen.children.each(item => {
            const nameLabel = item.getData('nameLabel');
            if (nameLabel) nameLabel.destroy();
            item.destroy();
        });

        // Create overlay
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8).setDepth(100);

        const isSuccess = this.itemsSorted >= TOTAL_ITEMS_TO_SORT;
        const emoji = isSuccess ? '🎉' : '⏰';
        const title = isSuccess ? 'MISSION COMPLETE!' : 'TIME\'S UP!';
        const color = isSuccess ? '#4ecca3' : '#e74c3c';

        // Celebration particles
        if (isSuccess) {
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const x = Phaser.Math.Between(100, 700);
                    const particle = this.add.text(x, -20, ['🎉', '⭐', '✨', '🌟'][Phaser.Math.Between(0, 3)], {
                        fontSize: '30px'
                    }).setDepth(101);
                    
                    this.tweens.add({
                        targets: particle,
                        y: 650,
                        duration: Phaser.Math.Between(2000, 4000),
                        onComplete: () => particle.destroy()
                    });
                }, i * 50);
            }
        }

        // Title
        const titleText = this.add.text(400, 150, `${emoji} ${title} ${emoji}`, {
            fontSize: '52px',
            fontFamily: 'Arial Black',
            fill: color,
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(101).setAlpha(0);

        // Score display
        const scoreText = this.add.text(400, 250, `Final Score: ${this.score} KP`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(101).setAlpha(0);

        // Items sorted
        const itemsText = this.add.text(400, 310, `Items Sorted: ${this.itemsSorted}/${TOTAL_ITEMS_TO_SORT}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#bdc3c7'
        }).setOrigin(0.5).setDepth(101).setAlpha(0);

        // Level info
        const levelInfo = this.add.text(400, 345, `Level ${this.currentLevel} Complete!`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: '#f39c12'
        }).setOrigin(0.5).setDepth(101).setAlpha(0);

        let nextLevelBtn = null;
        let restartBtn = null;

        // Show Next Level button if successful and not at max level
        if (isSuccess && this.currentLevel < 5) {
            nextLevelBtn = this.add.text(400, 400, `⭐ NEXT LEVEL (${this.currentLevel + 1})`, {
                fontSize: '28px',
                fontFamily: 'Arial Black',
                fill: '#fff',
                backgroundColor: '#f39c12',
                padding: { x: 30, y: 15 }
            }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true }).setAlpha(0);

            nextLevelBtn.on('pointerover', () => {
                nextLevelBtn.setBackgroundColor('#e67e22');
                nextLevelBtn.setScale(1.1);
            });
            nextLevelBtn.on('pointerout', () => {
                nextLevelBtn.setBackgroundColor('#f39c12');
                nextLevelBtn.setScale(1);
            });
            nextLevelBtn.on('pointerdown', () => {
                this.scene.restart({ level: this.currentLevel + 1, score: this.score });
            });

            // Restart button (smaller, below next level)
            restartBtn = this.add.text(400, 465, '🔄 RESTART LEVEL', {
                fontSize: '20px',
                fontFamily: 'Arial',
                fill: '#fff',
                backgroundColor: '#27ae60',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true }).setAlpha(0);
        } else {
            // Just restart button if failed or at max level
            restartBtn = this.add.text(400, 400, '🔄 PLAY AGAIN', {
                fontSize: '28px',
                fontFamily: 'Arial Black',
                fill: '#fff',
                backgroundColor: '#27ae60',
                padding: { x: 30, y: 15 }
            }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true }).setAlpha(0);
        }

        restartBtn.on('pointerover', () => {
            restartBtn.setBackgroundColor('#229954');
            restartBtn.setScale(1.1);
        });
        restartBtn.on('pointerout', () => {
            restartBtn.setBackgroundColor('#27ae60');
            restartBtn.setScale(1);
        });
        restartBtn.on('pointerdown', () => {
            this.scene.restart({ level: this.currentLevel, score: 0 });
        });

        // Menu button
        const menuBtn = this.add.text(400, 480, '🏠 MAIN MENU', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#fff',
            backgroundColor: '#3498db',
            padding: { x: 25, y: 12 }
        }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true }).setAlpha(0);

        menuBtn.on('pointerover', () => {
            menuBtn.setBackgroundColor('#2980b9');
            menuBtn.setScale(1.1);
        });
        menuBtn.on('pointerout', () => {
            menuBtn.setBackgroundColor('#3498db');
            menuBtn.setScale(1);
        });
        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Animate elements in
        this.tweens.add({
            targets: titleText,
            alpha: 1,
            scale: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: scoreText,
            alpha: 1,
            y: { from: 200, to: 250 },
            duration: 500,
            delay: 200
        });

        this.tweens.add({
            targets: itemsText,
            alpha: 1,
            duration: 500,
            delay: 400
        });

        this.tweens.add({
            targets: levelInfo,
            alpha: 1,
            duration: 500,
            delay: 500
        });

        if (nextLevelBtn) {
            this.tweens.add({
                targets: nextLevelBtn,
                alpha: 1,
                scale: { from: 0, to: 1 },
                duration: 500,
                delay: 600,
                ease: 'Back.easeOut'
            });
        }

        this.tweens.add({
            targets: restartBtn,
            alpha: 1,
            scale: { from: 0, to: 1 },
            duration: 500,
            delay: nextLevelBtn ? 700 : 600,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: menuBtn,
            alpha: 1,
            scale: { from: 0, to: 1 },
            duration: 500,
            delay: nextLevelBtn ? 800 : 700,
            ease: 'Back.easeOut'
        });
    }
}

// Phaser configuration has been moved to index.html