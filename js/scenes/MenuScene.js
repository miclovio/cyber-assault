// ============================================================================
// Menu Scene - Title screen with parallax backdrop
// ============================================================================

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const w = GAME_WIDTH;
        const h = GAME_HEIGHT;

        // Parallax background layers
        this.bgLayer = this.add.tileSprite(0, 0, w, h, 'l1-bg').setOrigin(0).setScrollFactor(0).setTileScale(3, 3);
        this.farLayer = this.add.tileSprite(0, 0, w, h, 'l1-far').setOrigin(0).setScrollFactor(0).setTileScale(4, 4);
        this.midLayer = this.add.tileSprite(0, 0, w, h, 'l1-mid').setOrigin(0).setScrollFactor(0).setTileScale(3, 3);

        // Dark overlay
        this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.5);

        // Title
        this.add.text(w / 2, 100, 'CYBER ASSAULT', {
            fontSize: '48px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold',
            stroke: '#003333', strokeThickness: 6
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(w / 2, 155, 'RUN AND GUN', {
            fontSize: '16px', fontFamily: 'monospace', color: '#ff6600',
            letterSpacing: 8
        }).setOrigin(0.5);

        // Controls info
        const controls = [
            'WASD / ARROWS - Move / Aim',
            'SPACE / Z - Jump',
            'CLICK / X - Fire',
            'S / DOWN - Crouch'
        ];
        controls.forEach((text, i) => {
            this.add.text(w / 2, 220 + i * 25, text, {
                fontSize: '14px', fontFamily: 'monospace', color: '#aaaaaa'
            }).setOrigin(0.5);
        });

        // Start prompt (blinking)
        this.startText = this.add.text(w / 2, 370, 'PRESS ENTER TO START', {
            fontSize: '20px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.startText,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Input
        this.input.keyboard.once('keydown-ENTER', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene', { level: 1 });
            });
        });

        // Music
        this.sound.stopAll();
        this.sound.play('music-intro', { loop: true, volume: 0.5 });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    update() {
        // Scroll backgrounds (divided by tileScale)
        this.bgLayer.tilePositionX += 0.1 / 3;
        this.farLayer.tilePositionX += 0.3 / 4;
        this.midLayer.tilePositionX += 0.6 / 3;
    }
}
