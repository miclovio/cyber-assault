// ============================================================================
// Game Over Scene - Game over / continue
// ============================================================================

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.levelReached = data.level || 1;
    }

    create() {
        const w = GAME_WIDTH;
        const h = GAME_HEIGHT;

        // Background
        this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.9);

        // Game Over text
        this.add.text(w / 2, 100, 'GAME OVER', {
            fontSize: '48px', fontFamily: 'monospace', color: '#ff0000', fontStyle: 'bold',
            stroke: '#330000', strokeThickness: 6
        }).setOrigin(0.5);

        // Score
        this.add.text(w / 2, 180, `FINAL SCORE: ${this.finalScore}`, {
            fontSize: '20px', fontFamily: 'monospace', color: '#ffffff'
        }).setOrigin(0.5);

        // Level reached
        this.add.text(w / 2, 210, `LEVEL REACHED: ${this.levelReached}`, {
            fontSize: '16px', fontFamily: 'monospace', color: '#888888'
        }).setOrigin(0.5);

        // Continue option
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const continueText = this.add.text(w / 2, 290,
            isTouchDevice ? 'TAP TO CONTINUE' : 'PRESS ENTER TO CONTINUE', {
            fontSize: '18px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: continueText,
            alpha: 0.3,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        // Menu option
        if (!isTouchDevice) {
            this.add.text(w / 2, 330, 'PRESS ESC FOR MENU', {
                fontSize: '14px', fontFamily: 'monospace', color: '#666666'
            }).setOrigin(0.5);
        }

        // Input
        this._transitioning = false;
        const continueGame = () => {
            if (this._transitioning) return;
            this._transitioning = true;
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop('HUDScene');
                this.scene.start('GameScene', { level: this.levelReached });
            });
        };
        this.input.keyboard.once('keydown-ENTER', continueGame);
        this.input.once('pointerdown', continueGame);
        this._continueGame = continueGame;

        const goToMenu = () => {
            if (this._transitioning) return;
            this._transitioning = true;
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop('HUDScene');
                this.scene.start('MenuScene');
            });
        };
        this.input.keyboard.once('keydown-ESC', goToMenu);
        this._goToMenu = goToMenu;

        // Gamepad polling
        this._gp = new GamepadControls(this);

        // Music
        this.sound.stopAll();
        this.sound.play('music-gameover', { loop: true, volume: 0.5 });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    update() {
        this._gp.update();
        if (this._gp.confirm) this._continueGame();
        if (this._gp.back) this._goToMenu();
    }
}
