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
        this.add.text(w / 2, 80, 'GAME OVER', {
            fontSize: '48px', fontFamily: 'monospace', color: '#ff0000', fontStyle: 'bold',
            stroke: '#330000', strokeThickness: 6
        }).setOrigin(0.5);

        // Score
        this.add.text(w / 2, 160, `FINAL SCORE: ${this.finalScore}`, {
            fontSize: '20px', fontFamily: 'monospace', color: '#ffffff'
        }).setOrigin(0.5);

        // Level reached
        this.add.text(w / 2, 190, `LEVEL REACHED: ${this.levelReached}`, {
            fontSize: '16px', fontFamily: 'monospace', color: '#888888'
        }).setOrigin(0.5);

        // Gamepad polling
        this._gp = new GamepadControls(this);
        this._transitioning = false;
        this._initialsActive = false;
        this._optionsReady = false;

        // Check for high score
        if (Leaderboard.isHighScore(this.finalScore)) {
            this._showInitialsEntry(w, h);
        } else {
            this._showOptions(w, h);
        }

        // Music
        this.sound.stopAll();
        this.sound.play('music-gameover', { loop: true, volume: 0.5 });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    _showInitialsEntry(w, h) {
        this._initialsActive = true;
        this._initials = ['A', 'A', 'A'];
        this._initialSlot = 0;

        // "NEW HIGH SCORE!" label
        this.add.text(w / 2, 240, 'NEW HIGH SCORE!', {
            fontSize: '16px', fontFamily: 'monospace', color: '#ffcc00', fontStyle: 'bold',
            stroke: '#332200', strokeThickness: 3
        }).setOrigin(0.5);

        // Instruction
        this.add.text(w / 2, 260, 'ENTER YOUR INITIALS', {
            fontSize: '12px', fontFamily: 'monospace', color: '#888888'
        }).setOrigin(0.5);

        // 3-letter display
        this._initialTexts = [];
        for (let i = 0; i < 3; i++) {
            const t = this.add.text(w / 2 - 30 + i * 30, 295, 'A', {
                fontSize: '24px', fontFamily: 'monospace', color: '#888888', fontStyle: 'bold'
            }).setOrigin(0.5);
            this._initialTexts.push(t);
        }
        this._updateInitialsDisplay();

        // Keyboard handler
        this._keyHandler = (e) => {
            if (!this._initialsActive) return;
            const key = e.key.toUpperCase();
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                this._initials[this._initialSlot] = key;
                this._updateInitialsDisplay();
                if (this._initialSlot < 2) this._initialSlot++;
                this._updateInitialsDisplay();
            } else if (e.key === 'Backspace') {
                if (this._initialSlot > 0) this._initialSlot--;
                this._updateInitialsDisplay();
            } else if (e.key === 'Enter') {
                this._confirmInitials();
            }
        };
        this.input.keyboard.on('keydown', this._keyHandler);

        // Gamepad state
        this._gpLastDir = null;
    }

    _updateInitialsDisplay() {
        for (let i = 0; i < 3; i++) {
            this._initialTexts[i].setText(this._initials[i]);
            this._initialTexts[i].setColor(i === this._initialSlot ? '#00ffff' : '#888888');
        }
    }

    _confirmInitials() {
        if (!this._initialsActive) return;
        this._initialsActive = false;
        this.input.keyboard.off('keydown', this._keyHandler);

        const name = this._initials.join('');
        Leaderboard.addScore(name, this.finalScore, this.levelReached);

        // Flash all letters gold
        this._initialTexts.forEach(t => t.setColor('#ffcc00'));

        this.time.delayedCall(500, () => {
            this._showOptions(GAME_WIDTH, GAME_HEIGHT);
        });
    }

    _showOptions(w, h) {
        this._optionsReady = true;
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        // Continue option
        const continueText = this.add.text(w / 2, 350,
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
            this.add.text(w / 2, 390, 'PRESS ESC FOR MENU', {
                fontSize: '14px', fontFamily: 'monospace', color: '#666666'
            }).setOrigin(0.5);
        }

        // Input
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
    }

    update() {
        this._gp.update();

        // Gamepad initials entry
        if (this._initialsActive && this._gp.enabled) {
            const pad = navigator.getGamepads()[0];
            if (pad) {
                const up = pad.buttons[12] && pad.buttons[12].pressed;
                const down = pad.buttons[13] && pad.buttons[13].pressed;
                const left = pad.buttons[14] && pad.buttons[14].pressed;
                const right = pad.buttons[15] && pad.buttons[15].pressed;

                const dir = up ? 'up' : down ? 'down' : left ? 'left' : right ? 'right' : null;
                if (dir && dir !== this._gpLastDir) {
                    this._gpLastDir = dir;
                    const code = this._initials[this._initialSlot].charCodeAt(0);
                    if (dir === 'up') {
                        this._initials[this._initialSlot] = String.fromCharCode(code === 65 ? 90 : code - 1);
                    } else if (dir === 'down') {
                        this._initials[this._initialSlot] = String.fromCharCode(code === 90 ? 65 : code + 1);
                    } else if (dir === 'left' && this._initialSlot > 0) {
                        this._initialSlot--;
                    } else if (dir === 'right' && this._initialSlot < 2) {
                        this._initialSlot++;
                    }
                    this._updateInitialsDisplay();
                }
                if (!dir) this._gpLastDir = null;

                if (this._gp.confirm) this._confirmInitials();
            }
        }

        if (this._optionsReady) {
            if (this._gp.confirm) this._continueGame();
            if (this._gp.back) this._goToMenu();
        }
    }
}
