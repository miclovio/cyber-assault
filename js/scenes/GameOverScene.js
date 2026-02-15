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

        // Space marine close-up (behind text)
        const marine = this.add.sprite(160, h / 2, 'run-gun1');
        marine.setScale(10);
        marine.setAlpha(0.25);
        marine.play('player-run-gun');

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

        // Load scores from Firebase, show leaderboard, check for high score
        Leaderboard.loadScores().then(() => {
            this._createLeaderboard(w, h);
            if (Leaderboard.isHighScore(this.finalScore)) {
                this._showInitialsEntry(w, h);
            } else {
                this._showOptions(w, h);
            }
        });

        // Apply saved volume
        const savedVol = localStorage.getItem(AudioManager.VOLUME_KEY);
        this.sound.volume = savedVol !== null ? parseFloat(savedVol) : 0.75;

        // Music
        this.sound.stopAll();
        this.sound.play('music-gameover', { loop: true, volume: 0.5 });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    _createLeaderboard(w, h) {
        const scores = Leaderboard.getScores();
        const x = 600;
        const startY = 100;

        this.add.text(670, startY, 'HIGH SCORES', {
            fontSize: '14px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold',
            stroke: '#003333', strokeThickness: 2
        }).setOrigin(0.5);

        for (let i = 0; i < 10; i++) {
            const y = startY + 28 + i * 22;
            const entry = scores[i];
            const rank = `${(i + 1).toString().padStart(2, ' ')}.`;

            if (entry) {
                const color = i < 3 ? '#ffff00' : '#888888';
                this.add.text(x, y, `${rank} ${entry.name}  ${entry.score.toString().padStart(7, ' ')}  L${entry.level}`, {
                    fontSize: '12px', fontFamily: 'monospace', color: color
                }).setOrigin(0);
            } else {
                this.add.text(x, y, `${rank} ---`, {
                    fontSize: '12px', fontFamily: 'monospace', color: '#444444'
                }).setOrigin(0);
            }
        }
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

        // Flash all letters gold
        this._initialTexts.forEach(t => t.setColor('#ffcc00'));

        Leaderboard.addScore(name, this.finalScore, this.levelReached).then(() => {
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
