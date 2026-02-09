// ============================================================================
// HUD Scene - Overlay: lives, score, health, weapon, boss HP
// ============================================================================

class HUDScene extends Phaser.Scene {
    constructor() {
        super('HUDScene');
    }

    create() {
        const margin = 10;

        // Dark backing panel
        const panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.5);
        panel.fillRoundedRect(4, 4, 200, 64, 6);

        // Score text
        this.scoreText = this.add.text(margin, margin, 'SCORE: 0', {
            fontSize: '16px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
        });

        // Lives display
        this.livesText = this.add.text(margin, 30, 'LIVES: 3', {
            fontSize: '14px', fontFamily: 'monospace', color: '#00ff00', fontStyle: 'bold',
            stroke: '#003300', strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 3, fill: true }
        });

        // Health bar shadow
        this.add.rectangle(margin + 22, 59, 102, 12, 0x000000, 0.5).setOrigin(0, 0.5);
        // Health bar border
        this.add.rectangle(margin + 20, 57, 106, 16, 0x111111).setOrigin(0, 0.5);
        // Health bar background
        this.add.rectangle(margin + 22, 57, 102, 12, 0x333333).setOrigin(0, 0.5);
        this.healthBar = this.add.rectangle(margin + 23, 57, 100, 10, 0x00ff00).setOrigin(0, 0.5);

        this.add.text(margin, 57, 'HP', {
            fontSize: '12px', fontFamily: 'monospace', color: '#aaaaaa', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
        }).setOrigin(0, 0.5);

        // Shield indicator (shown when shield is active)
        this.shieldIcon = this.add.graphics();
        this.shieldIcon.fillStyle(0x0088ff, 0.8);
        this.shieldIcon.fillRoundedRect(0, 0, 52, 16, 4);
        this.shieldIcon.setPosition(margin + 132, 49);
        this.shieldText = this.add.text(margin + 158, 57, 'SH', {
            fontSize: '10px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5, 0.5);
        this.shieldIcon.setVisible(false);
        this.shieldText.setVisible(false);

        // Weapon indicator
        this.weaponText = this.add.text(GAME_WIDTH - margin, margin, 'PULSE RIFLE', {
            fontSize: '14px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold',
            stroke: '#003333', strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
        }).setOrigin(1, 0);

        // Level indicator
        this.levelText = this.add.text(GAME_WIDTH / 2, margin, 'LEVEL 1', {
            fontSize: '14px', fontFamily: 'monospace', color: '#888888', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
        }).setOrigin(0.5, 0);

        // Boss HP bar (hidden initially)
        this.bossBarShadow = this.add.rectangle(GAME_WIDTH / 2 + 2, 62, 302, 16, 0x000000, 0.5);
        this.bossBarBorder = this.add.rectangle(GAME_WIDTH / 2, 60, 306, 20, 0x111111);
        this.bossBarBg = this.add.rectangle(GAME_WIDTH / 2, 60, 302, 16, 0x333333);
        this.bossBar = this.add.rectangle(GAME_WIDTH / 2 - 149, 60, 298, 12, 0xff0000).setOrigin(0, 0.5);
        this.bossLabel = this.add.text(GAME_WIDTH / 2, 44, 'BOSS', {
            fontSize: '12px', fontFamily: 'monospace', color: '#ff4444', fontStyle: 'bold',
            stroke: '#330000', strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
        }).setOrigin(0.5);
        this.bossBarShadow.setVisible(false);
        this.bossBarBorder.setVisible(false);
        this.bossBarBg.setVisible(false);
        this.bossBar.setVisible(false);
        this.bossLabel.setVisible(false);

        // Extra life notification
        this.extraLifeText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, '1UP!', {
            fontSize: '32px', fontFamily: 'monospace', color: '#ff00ff', fontStyle: 'bold',
            stroke: '#330033', strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 3, fill: true }
        }).setOrigin(0.5).setAlpha(0);

        // Listen for game events
        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('player-score-changed', this.updateScore, this);
        gameScene.events.on('player-hp-changed', this.updateHP, this);
        gameScene.events.on('player-lives-changed', this.updateLives, this);
        gameScene.events.on('player-weapon-changed', this.updateWeapon, this);
        gameScene.events.on('boss-hp-changed', this.updateBossHP, this);
        gameScene.events.on('boss-start', this.showBossBar, this);
        gameScene.events.on('boss-defeated', this.hideBossBar, this);
        gameScene.events.on('level-changed', this.updateLevel, this);
        gameScene.events.on('extra-life', this.showExtraLife, this);
        gameScene.events.on('player-shield-changed', this.updateShield, this);

        // Touch controls (only visible on touch devices)
        this.touchControls = new TouchControls(this);

        // Gamepad controls
        this.gamepadControls = new GamepadControls(this);

        // Touch pause button (only on touch devices)
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isTouchDevice) {
            const pauseBtnX = GAME_WIDTH - 30;
            const pauseBtnY = 50;

            const pauseBg = this.add.circle(pauseBtnX, pauseBtnY, 18, 0x000000, 0.4);
            pauseBg.setInteractive();

            const pauseIcon = this.add.text(pauseBtnX, pauseBtnY, '| |', {
                fontSize: '14px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            pauseBg.on('pointerdown', () => {
                const gameScene = this.scene.get('GameScene');
                gameScene.events.emit('toggle-pause', 'touch');
            });
        }
    }

    update(time, delta) {
        if (this.touchControls && this.touchControls.enabled) {
            this.touchControls.update();
        }
        this.gamepadControls.update();
    }

    updateScore(score) {
        this.scoreText.setText(`SCORE: ${score}`);
    }

    updateHP(hp) {
        const ratio = hp / PLAYER_CONFIG.MAX_HP;
        this.healthBar.width = 100 * ratio;

        if (ratio > 0.6) this.healthBar.setFillStyle(0x00ff00);
        else if (ratio > 0.3) this.healthBar.setFillStyle(0xffff00);
        else this.healthBar.setFillStyle(0xff0000);
    }

    updateLives(lives) {
        this.livesText.setText(`LIVES: ${lives}`);
    }

    updateWeapon(weaponKey) {
        const weapon = WEAPONS[weaponKey];
        this.weaponText.setText(weapon ? weapon.name.toUpperCase() : 'PULSE RIFLE');
        const c = weapon ? weapon.color : 0xffff00;
        this.weaponText.setColor('#' + c.toString(16).padStart(6, '0'));
    }

    updateLevel(level) {
        const names = ['', 'INDUSTRIAL BASE', 'UNDERGROUND CAVERNS', 'ROCKY RIDGE', 'SPACE STATION'];
        this.levelText.setText(`LEVEL ${level} - ${names[level] || ''}`);

        // Flash level name
        const bigText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, names[level] || `LEVEL ${level}`, {
            fontSize: '28px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold',
            stroke: '#003333', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: bigText,
            alpha: 1,
            duration: 500,
            yoyo: true,
            hold: 2000,
            onComplete: () => bigText.destroy()
        });
    }

    showBossBar(bossName) {
        this.bossBarShadow.setVisible(true);
        this.bossBarBorder.setVisible(true);
        this.bossBarBg.setVisible(true);
        this.bossBar.setVisible(true);
        this.bossLabel.setVisible(true);
        this.bossLabel.setText(bossName || 'BOSS');
        this.bossBar.width = 298;

        // Warning flash
        const warning = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'WARNING!', {
            fontSize: '36px', fontFamily: 'monospace', color: '#ff0000', fontStyle: 'bold',
            stroke: '#330000', strokeThickness: 5,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: warning,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 1500,
            onComplete: () => warning.destroy()
        });
    }

    updateBossHP(hp, maxHp) {
        const ratio = Math.max(0, hp / maxHp);
        this.bossBar.width = 298 * ratio;
    }

    hideBossBar() {
        this.bossBarShadow.setVisible(false);
        this.bossBarBorder.setVisible(false);
        this.bossBarBg.setVisible(false);
        this.bossBar.setVisible(false);
        this.bossLabel.setVisible(false);
    }

    updateShield(hits) {
        if (hits > 0) {
            this.shieldText.setText(`SH ${hits}`);
            if (!this.shieldIcon.visible) {
                this.shieldIcon.setVisible(true);
                this.shieldText.setVisible(true);
                this.shieldIcon.setScale(0);
                this.shieldText.setScale(0);
                this.tweens.add({
                    targets: [this.shieldIcon, this.shieldText],
                    scaleX: 1, scaleY: 1,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
        } else {
            this.tweens.add({
                targets: [this.shieldIcon, this.shieldText],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.shieldIcon.setVisible(false);
                    this.shieldText.setVisible(false);
                    this.shieldIcon.setAlpha(1);
                    this.shieldText.setAlpha(1);
                }
            });
        }
    }

    showExtraLife() {
        this.extraLifeText.setAlpha(1);
        this.tweens.add({
            targets: this.extraLifeText,
            alpha: 0,
            y: this.extraLifeText.y - 40,
            duration: 1500,
            onComplete: () => {
                this.extraLifeText.y += 40;
            }
        });
    }
}
