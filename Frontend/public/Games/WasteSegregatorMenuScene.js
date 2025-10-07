// --- WASTE SEGREGATOR MENU SCENE ---
class WasteSegregatorMenuScene extends Phaser.Scene {
    constructor() {
        super('WasteSegregatorMenuScene');
    }

    preload() {
        // No assets needed for menu
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Gradient background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        graphics.fillRect(0, 0, width, height);

        // Title
        const title = this.add.text(width / 2, 100, 'ECO-SHREDDER', {
            fontSize: '64px',
            fontFamily: 'Arial Black',
            fill: '#4ecca3',
            stroke: '#0f3460',
            strokeThickness: 8,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 5,
                fill: true
            }
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, 170, 'Sort the Scraps & Save the Planet!', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fill: '#eeeeee',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Decorative elements
        this.createFloatingIcons();

        // Play Sorting Game Button
        const playButton = this.createButton(width / 2, 320, '🎮 PLAY GAME', 0x27ae60, () => {
            this.scene.start('GameScene');
        });

        // Quit Button
        const quitButton = this.createButton(width / 2, 400, 'QUIT', 0xe74c3c, () => {
            window.location.href = '/games';
        });

        // Instructions
        const instructions = this.add.text(width / 2, 480, 
            'Drag items to the correct bins and earn Knowledge Points (KP)!', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fill: '#95a5a6',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        // Footer
        this.add.text(width / 2, height - 20, '♻️ Made with Phaser 3 | Save the Earth! 🌍', {
            fontSize: '14px',
            fill: '#7f8c8d'
        }).setOrigin(0.5);

        // Add pulsing animation to title
        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createButton(x, y, text, color, callback) {
        const button = this.add.container(x, y);

        // Button background
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(-150, -30, 300, 60, 15);
        bg.lineStyle(3, 0xffffff, 0.8);
        bg.strokeRoundedRect(-150, -30, 300, 60, 15);

        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 3,
                fill: true
            }
        }).setOrigin(0.5);

        button.add([bg, buttonText]);
        button.setSize(300, 60);
        button.setInteractive({ useHandCursor: true });

        // Hover effects
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: 1.1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            bg.clear();
            bg.fillStyle(color, 1);
            bg.fillRoundedRect(-150, -30, 300, 60, 15);
            bg.lineStyle(4, 0xffd700, 1);
            bg.strokeRoundedRect(-150, -30, 300, 60, 15);
        });

        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: 1,
                duration: 200,
                ease: 'Back.easeIn'
            });
            bg.clear();
            bg.fillStyle(color, 1);
            bg.fillRoundedRect(-150, -30, 300, 60, 15);
            bg.lineStyle(3, 0xffffff, 0.8);
            bg.strokeRoundedRect(-150, -30, 300, 60, 15);
        });

        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scale: 0.95,
                duration: 100,
                yoyo: true,
                onComplete: callback
            });
        });

        return button;
    }

    createFloatingIcons() {
        const icons = ['♻️', '🌱', '🌍', '💧', '🌿', '☀️'];
        const positions = [
            [100, 150], [700, 180], [120, 400], [680, 420], [150, 520], [650, 500]
        ];

        icons.forEach((icon, index) => {
            const [x, y] = positions[index];
            const iconText = this.add.text(x, y, icon, {
                fontSize: '48px'
            }).setAlpha(0.3);

            // Floating animation
            this.tweens.add({
                targets: iconText,
                y: y - 20,
                duration: 2000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Rotation animation
            this.tweens.add({
                targets: iconText,
                angle: 15,
                duration: 1500 + Math.random() * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
}
