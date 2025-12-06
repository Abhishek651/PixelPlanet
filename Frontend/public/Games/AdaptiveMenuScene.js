// Adaptive Menu Scene
class AdaptiveMenuScene extends Phaser.Scene {
  constructor() {
    super('AdaptiveMenuScene');
  }

  init(data) {
    this.gameManager = data.gameManager;
  }

  create() {
    const { width, height } = this.cameras.main;

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    bg.fillRect(0, 0, width, height);

    this.add.text(width / 2, height * 0.15, 'WASTE SEGREGATOR', {
      fontSize: '48px', fontFamily: 'Arial Black',
      fill: '#4ecca3', stroke: '#0f3460', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.23, 'Adaptive Learning Edition', {
      fontSize: '20px', fontFamily: 'Arial',
      fill: '#bdc3c7'
    }).setOrigin(0.5);

    const profile = this.gameManager.profile;
    const statsText = `Level: ${profile.currentLevelId} | Games: ${profile.totalGamesPlayed} | Best: ${profile.bestLevelUnlocked}`;
    this.add.text(width / 2, height * 0.32, statsText, {
      fontSize: '16px', fontFamily: 'Arial',
      fill: '#fff', backgroundColor: '#00000088',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    let yPos = height * 0.45;

    this.createLevelButton(width / 2, yPos, 'CONTINUE', profile.currentLevelId, 0x27ae60);
    yPos += 70;

    this.add.text(width / 2, yPos, 'SELECT LEVEL', {
      fontSize: '18px', fontFamily: 'Arial Black', fill: '#fff'
    }).setOrigin(0.5);
    yPos += 40;

    const colors = [0x27ae60, 0x3498db, 0xf39c12, 0xe74c3c, 0x9b59b6];
    GAME_CONFIG.LEVEL_CONFIG.forEach((level, index) => {
      const isLocked = level.id > profile.bestLevelUnlocked;
      this.createLevelButton(width / 2, yPos, `Level ${level.id}: ${level.name}`, level.id, colors[index], isLocked);
      yPos += 55;
    });

    this.createButton(width / 2, height * 0.92, '🔄 RESET PROGRESS', 0xe74c3c, () => {
      if (confirm('Reset all progress?')) {
        this.gameManager.profile = this.gameManager.createNewProfile();
        this.gameManager.saveProfile();
        this.scene.restart({ gameManager: this.gameManager });
      }
    });
  }

  createLevelButton(x, y, text, levelId, color, isLocked = false) {
    const btn = this.add.text(x, y, isLocked ? `🔒 ${text}` : text, {
      fontSize: '20px', fontFamily: 'Arial Black',
      fill: isLocked ? '#7f8c8d' : '#fff',
      backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba,
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    if (!isLocked) {
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => this.tweens.add({ targets: btn, scale: 1.05, duration: 200 }));
      btn.on('pointerout', () => this.tweens.add({ targets: btn, scale: 1, duration: 200 }));
      btn.on('pointerdown', () => {
        this.scene.start('AdaptiveGameScene', { gameManager: this.gameManager, levelId: levelId });
      });
    }

    return btn;
  }

  createButton(x, y, text, color, callback) {
    const btn = this.add.text(x, y, text, {
      fontSize: '16px', fontFamily: 'Arial',
      fill: '#fff',
      backgroundColor: Phaser.Display.Color.IntegerToColor(color).rgba,
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', callback);
    return btn;
  }
}
