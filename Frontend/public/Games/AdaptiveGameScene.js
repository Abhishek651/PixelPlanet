// Adaptive Game Scene with Progressive Difficulty
class AdaptiveGameScene extends Phaser.Scene {
  constructor() {
    super('AdaptiveGameScene');
  }

  init(data) {
    this.gameManager = data.gameManager;
    this.levelId = data.levelId || this.gameManager.profile.currentLevelId;
  }

  async create() {
    const { width, height } = this.cameras.main;
    this.gameWidth = width;
    this.gameHeight = height;
    this.isMobile = width < height || width < 768;

    // Start level
    const levelData = this.gameManager.startLevel(this.levelId);
    if (!levelData) {
      this.scene.start('AdaptiveMenuScene', { gameManager: this.gameManager });
      return;
    }

    this.levelConfig = levelData.level;
    this.itemQueue = [];
    this.activeItems = [];
    this.gameRunning = false;

    this.createBackground();
    this.createConveyorBelt();
    this.createBins();
    this.createUI();

    // Show intro for new content
    if (levelData.showIntro) {
      await this.showIntroduction(levelData.newBins, levelData.newItems);
      this.gameManager.markContentAsSeen(
        levelData.newBins.map(b => b.name.toLowerCase()),
        levelData.newItems.map(i => i.name)
      );
    }

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

    const color = colors[this.levelId - 1] || colors[0];
    const bg = this.add.graphics();
    bg.fillGradientStyle(color.top, color.top, color.bottom, color.bottom, 1);
    bg.fillRect(0, 0, width, height);

    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height * 0.4),
        Phaser.Math.Between(1, 3),
        0xffffff, 0.3
      );
      this.tweens.add({
        targets: star, alpha: 0.8, duration: Phaser.Math.Between(1000, 2000),
        yoyo: true, repeat: -1
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
    belt.fillRect(0, beltY - beltHeight / 2, width, beltHeight);

    this.beltStripes = [];
    for (let i = 0; i < Math.ceil(width / 30) + 1; i++) {
      const stripe = this.add.rectangle(i * 30, beltY, 20, beltHeight * 0.8, 0x2c3e50, 0.3);
      this.beltStripes.push(stripe);
    }
  }

  createBins() {
    const { width, height } = this.cameras.main;
    const binY = this.isMobile ? height * 0.8 : height * 0.85;
    const binSize = this.isMobile ? Math.min(width * 0.18, 80) : Math.min(width * 0.08, 100);
    const binSpacing = width / (this.levelConfig.bins.length + 1);

    this.bins = [];

    this.levelConfig.bins.forEach((binId, index) => {
      const binConfig = GAME_CONFIG.BIN_CONFIG[binId];
      const x = binSpacing * (index + 1);

      const bin = this.add.container(x, binY);
      const binGraphic = this.add.graphics();
      binGraphic.fillStyle(binConfig.color, 1);
      binGraphic.fillRoundedRect(-binSize / 2, -binSize / 2, binSize, binSize, 8);
      binGraphic.lineStyle(3, 0x000000, 0.3);
      binGraphic.strokeRoundedRect(-binSize / 2, -binSize / 2, binSize, binSize, 8);

      const emoji = this.add.text(0, 0, binConfig.emoji, {
        fontSize: (binSize * 0.5) + 'px'
      }).setOrigin(0.5);

      const label = this.add.text(0, binSize * 0.6, binConfig.name, {
        fontSize: Math.min(binSize * 0.15, 14) + 'px',
        fontFamily: 'Arial',
        fill: '#fff',
        backgroundColor: '#00000088',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5);

      bin.add([binGraphic, emoji, label]);

      const dropZone = this.add.zone(x, binY, binSize * 1.5, binSize * 1.5)
        .setRectangleDropZone(binSize * 1.5, binSize * 1.5);
      dropZone.setData('binType', binId);
      dropZone.setData('binGraphic', binGraphic);

      this.bins.push({ container: bin, zone: dropZone, config: binConfig });
    });
  }

  createUI() {
    const { width, height } = this.cameras.main;
    const fontSize = this.isMobile ? Math.min(width * 0.04, 18) : Math.min(width * 0.025, 22);

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: fontSize + 'px', fontFamily: 'Arial Black',
      fill: '#fff', stroke: '#000', strokeThickness: 3
    });

    this.timerText = this.add.text(width - 16, 16, `Time: ${this.levelConfig.timeLimit}s`, {
      fontSize: fontSize + 'px', fontFamily: 'Arial Black',
      fill: '#fff', stroke: '#000', strokeThickness: 3
    }).setOrigin(1, 0);

    this.itemsText = this.add.text(16, 16 + fontSize + 8, `Items: 0/${this.levelConfig.itemCount}`, {
      fontSize: (fontSize * 0.8) + 'px', fontFamily: 'Arial',
      fill: '#fff', stroke: '#000', strokeThickness: 2
    });

    this.levelText = this.add.text(width / 2, 16, `LEVEL ${this.levelId}: ${this.levelConfig.name}`, {
      fontSize: fontSize + 'px', fontFamily: 'Arial Black',
      fill: '#4ecca3', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5, 0);
  }

  async showIntroduction(newBins, newItems) {
    if (newBins.length === 0 && newItems.length === 0) return;

    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.9).setDepth(200);

    let yPos = height * 0.2;

    if (newBins.length > 0) {
      const title = this.add.text(width / 2, yPos, '🎯 NEW BIN!', {
        fontSize: '32px', fontFamily: 'Arial Black', fill: '#4ecca3'
      }).setOrigin(0.5).setDepth(201);
      yPos += 60;

      for (const bin of newBins) {
        const binText = this.add.text(width / 2, yPos, `${bin.emoji} ${bin.name}`, {
          fontSize: '28px', fontFamily: 'Arial Black', fill: '#fff'
        }).setOrigin(0.5).setDepth(201);
        yPos += 40;

        const desc = this.add.text(width / 2, yPos, bin.intro, {
          fontSize: '18px', fontFamily: 'Arial', fill: '#bdc3c7',
          wordWrap: { width: width * 0.8 }, align: 'center'
        }).setOrigin(0.5).setDepth(201);
        yPos += 60;
      }
    }

    const continueBtn = this.add.text(width / 2, height * 0.8, '✓ GOT IT!', {
      fontSize: '24px', fontFamily: 'Arial Black', fill: '#fff',
      backgroundColor: '#27ae60', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });

    return new Promise(resolve => {
      continueBtn.on('pointerdown', () => {
        overlay.destroy();
        continueBtn.destroy();
        this.children.list.filter(c => c.depth === 201).forEach(c => c.destroy());
        resolve();
      });
    });
  }

  showLevelStart() {
    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8).setDepth(100);

    const levelText = this.add.text(width / 2, height * 0.4, `LEVEL ${this.levelId}`, {
      fontSize: '48px', fontFamily: 'Arial Black', fill: '#4ecca3',
      stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(101).setAlpha(0);

    const readyText = this.add.text(width / 2, height * 0.55, 'GET READY!', {
      fontSize: '36px', fontFamily: 'Arial Black', fill: '#f1c40f',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(101).setAlpha(0);

    this.tweens.add({ targets: levelText, alpha: 1, scale: { from: 0, to: 1 }, duration: 400, ease: 'Back.easeOut' });
    this.tweens.add({ targets: readyText, alpha: 1, scale: { from: 0.5, to: 1 }, duration: 400, delay: 400, ease: 'Elastic.easeOut' });

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: [overlay, levelText, readyText], alpha: 0, duration: 500,
        onComplete: () => {
          overlay.destroy();
          levelText.destroy();
          readyText.destroy();
          this.startGame();
        }
      });
    });
  }

  startGame() {
    this.gameRunning = true;
    this.score = 0;
    this.itemsSorted = 0;
    this.timeLeft = this.levelConfig.timeLimit;

    const shuffled = Phaser.Utils.Array.Shuffle([...this.levelConfig.itemTypes]);
    this.itemQueue = shuffled.slice(0, this.levelConfig.itemCount);

    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}s`);
        if (this.timeLeft <= 0) this.endGame();
      },
      loop: true
    });

    this.spawnTimer = this.time.addEvent({
      delay: this.levelConfig.spawnDelay,
      callback: () => this.spawnItem(),
      loop: true
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      if (gameObject.label) gameObject.label.setPosition(dragX, dragY - gameObject.displayHeight);
    });

    this.input.on('drop', (pointer, gameObject, dropZone) => this.handleDrop(gameObject, dropZone));
    this.input.on('dragend', (pointer, gameObject, dropped) => {
      if (!dropped && gameObject.active) gameObject.body.velocity.x = -this.levelConfig.speed;
    });
  }

  spawnItem() {
    if (this.itemQueue.length === 0) return;

    const itemId = this.itemQueue.shift();
    const itemData = GAME_CONFIG.ITEM_DATABASE[itemId];
    const { width } = this.cameras.main;
    const itemSize = this.isMobile ? Math.min(width * 0.12, 60) : Math.min(width * 0.06, 70);

    const item = this.add.container(width + itemSize, this.beltY);
    const graphic = this.add.graphics();
    graphic.fillStyle(0xffffff, 1);
    graphic.fillRoundedRect(-itemSize / 2, -itemSize / 2, itemSize, itemSize, 8);

    const emoji = this.add.text(0, 0, itemData.emoji, {
      fontSize: (itemSize * 0.6) + 'px'
    }).setOrigin(0.5);

    item.add([graphic, emoji]);
    item.setSize(itemSize, itemSize);
    item.setData('itemId', itemId);
    item.setData('correctBin', itemData.bin);
    item.setData('spawnTime', Date.now());

    this.physics.add.existing(item);
    item.body.setVelocity(-this.levelConfig.speed, 0);
    item.body.setSize(itemSize, itemSize);

    item.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(item);

    const label = this.add.text(item.x, item.y - itemSize, itemData.name, {
      fontSize: Math.min(itemSize * 0.25, 14) + 'px',
      fontFamily: 'Arial', fill: '#fff',
      backgroundColor: '#000000cc', padding: { x: 6, y: 3 }
    }).setOrigin(0.5).setVisible(false).setDepth(50);

    item.label = label;

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
    const itemId = item.getData('itemId');
    const correctBin = item.getData('correctBin');
    const selectedBin = dropZone.getData('binType');
    const spawnTime = item.getData('spawnTime');
    const reactionTime = (Date.now() - spawnTime) / 1000;

    const feedback = this.gameManager.handleItemDrop(itemId, correctBin, selectedBin, reactionTime);

    if (feedback.isCorrect) {
      this.score += 10;
      this.itemsSorted++;
      this.showFeedback(item.x, item.y, '✓ +10', 0x00ff00);
    } else {
      this.score = Math.max(0, this.score - 5);
      this.timeLeft = Math.max(0, this.timeLeft - 3);
      this.showFeedback(item.x, item.y, '✗ -5', 0xff0000);
      this.cameras.main.shake(200, 0.005);
    }

    this.scoreText.setText(`Score: ${this.score}`);
    this.itemsText.setText(`Items: ${this.itemsSorted}/${this.levelConfig.itemCount}`);

    if (item.label) item.label.destroy();
    item.destroy();
    this.activeItems = this.activeItems.filter(i => i !== item);

    if (this.itemsSorted >= this.levelConfig.itemCount) this.endGame();
  }

  showFeedback(x, y, text, color) {
    const feedback = this.add.text(x, y, text, {
      fontSize: '24px', fontFamily: 'Arial Black',
      fill: Phaser.Display.Color.IntegerToColor(color).rgba,
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(50);

    this.tweens.add({
      targets: feedback, y: feedback.y - 60, alpha: 0, duration: 1000,
      onComplete: () => feedback.destroy()
    });
  }

  async endGame() {
    if (!this.gameRunning) return;
    this.gameRunning = false;

    if (this.gameTimer) this.gameTimer.remove();
    if (this.spawnTimer) this.spawnTimer.remove();

    this.activeItems.forEach(item => {
      if (item.label) item.label.destroy();
      item.destroy();
    });
    this.activeItems = [];

    const results = await this.gameManager.endGame();
    this.showResults(results);
  }

  showResults(results) {
    const { width, height } = this.cameras.main;
    const { performance, decision } = results;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85).setDepth(100);

    const title = this.add.text(width / 2, height * 0.15, decision.reason, {
      fontSize: '32px', fontFamily: 'Arial Black', fill: '#4ecca3',
      stroke: '#000', strokeThickness: 4, wordWrap: { width: width * 0.8 }, align: 'center'
    }).setOrigin(0.5).setDepth(101);

    const stats = this.add.text(width / 2, height * 0.28, 
      `Accuracy: ${(performance.accuracy * 100).toFixed(0)}%\nCorrect: ${performance.correct}/${performance.totalItems}`, {
      fontSize: '20px', fontFamily: 'Arial', fill: '#fff', align: 'center'
    }).setOrigin(0.5).setDepth(101);

    let yPos = height * 0.42;

    if (decision.hints.length > 0) {
      decision.hints.forEach(hint => {
        this.add.text(width / 2, yPos, hint, {
          fontSize: '16px', fontFamily: 'Arial', fill: '#f1c40f',
          backgroundColor: '#00000088', padding: { x: 10, y: 5 },
          wordWrap: { width: width * 0.8 }, align: 'center'
        }).setOrigin(0.5).setDepth(101);
        yPos += 35;
      });
    }

    yPos = height * 0.65;

    if (decision.action === 'advance' || decision.action === 'complete') {
      this.createButton(width / 2, yPos, decision.action === 'complete' ? '🏆 FINISH' : '⭐ NEXT LEVEL', 0xf39c12, () => {
        if (decision.action === 'complete') {
          this.scene.start('AdaptiveMenuScene', { gameManager: this.gameManager });
        } else {
          this.scene.restart({ gameManager: this.gameManager, levelId: decision.nextLevelId });
        }
      });
      yPos += 60;
    }

    this.createButton(width / 2, yPos, '🔄 RETRY', 0x27ae60, () => {
      this.scene.restart({ gameManager: this.gameManager, levelId: this.levelId });
    });
    yPos += 60;

    this.createButton(width / 2, yPos, '🏠 MENU', 0x3498db, () => {
      this.scene.start('AdaptiveMenuScene', { gameManager: this.gameManager });
    });
  }

  createButton(x, y, text, color, callback) {
    const btn = this.add.text(x, y, text, {
      fontSize: '22px', fontFamily: 'Arial Black', fill: '#fff',
      backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba,
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(101).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => this.tweens.add({ targets: btn, scale: 1.05, duration: 200 }));
    btn.on('pointerout', () => this.tweens.add({ targets: btn, scale: 1, duration: 200 }));
    btn.on('pointerdown', callback);

    return btn;
  }

  update() {
    if (!this.gameRunning) return;

    this.beltStripes.forEach(stripe => {
      stripe.x -= 2;
      if (stripe.x < -20) stripe.x = this.gameWidth + 10;
    });

    this.activeItems.forEach(item => {
      if (item.active && item.label) {
        item.label.setPosition(item.x, item.y - item.displayHeight);

        if (item.x < -item.displayWidth) {
          this.score = Math.max(0, this.score - 2);
          this.scoreText.setText(`Score: ${this.score}`);
          if (item.label) item.label.destroy();
          item.destroy();
          this.activeItems = this.activeItems.filter(i => i !== item);
        }
      }
    });
  }
}
