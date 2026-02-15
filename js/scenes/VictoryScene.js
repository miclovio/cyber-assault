// ============================================================================
// Victory Scene - Win screen
// ============================================================================

class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        const w = GAME_WIDTH;
        const h = GAME_HEIGHT;

        // Background
        this.add.rectangle(w / 2, h / 2, w, h, 0x000011);

        // Space marine close-up (behind text)
        const marine = this.add.sprite(160, h / 2, 'run-gun1');
        marine.setScale(10);
        marine.setAlpha(0.25);
        marine.play('player-run-gun');

        // Victory text
        this.add.text(w / 2, 80, 'MISSION COMPLETE', {
            fontSize: '40px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold',
            stroke: '#003333', strokeThickness: 6
        }).setOrigin(0.5);

        // Stars/particles effect
        for (let i = 0; i < 50; i++) {
            const star = this.add.rectangle(
                Math.random() * w, Math.random() * h,
                2, 2, 0xffffff
            );
            this.tweens.add({
                targets: star,
                alpha: 0,
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 2000
            });
        }

        // Score
        this.add.text(w / 2, 160, `FINAL SCORE`, {
            fontSize: '18px', fontFamily: 'monospace', color: '#aaaaaa', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
        }).setOrigin(0.5);

        // Animated score counter
        const scoreObj = { value: 0 };
        const scoreText = this.add.text(w / 2, 200, '0', {
            fontSize: '48px', fontFamily: 'monospace', color: '#ffff00', fontStyle: 'bold',
            stroke: '#664400', strokeThickness: 8,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 10, fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: scoreObj,
            value: this.finalScore,
            duration: 2000,
            ease: 'Power2',
            onUpdate: () => {
                scoreText.setText(Math.floor(scoreObj.value).toString());
            }
        });

        // Rank based on score
        let rank, rankColor;
        if (this.finalScore >= 100000) { rank = 'S'; rankColor = '#ff00ff'; }
        else if (this.finalScore >= 70000) { rank = 'A'; rankColor = '#00ffff'; }
        else if (this.finalScore >= 50000) { rank = 'B'; rankColor = '#00ff00'; }
        else if (this.finalScore >= 30000) { rank = 'C'; rankColor = '#ffff00'; }
        else { rank = 'D'; rankColor = '#ff6600'; }

        this.time.delayedCall(2500, () => {
            this.add.text(w / 2, 260, `RANK: ${rank}`, {
                fontSize: '32px', fontFamily: 'monospace', color: rankColor, fontStyle: 'bold',
                stroke: '#222222', strokeThickness: 4,
                shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 6, fill: true }
            }).setOrigin(0.5);
        });

        // Credits
        const credits = [
            'A OUTMANUEVER PRODUCTION',
            '',
            'THANK YOU FOR PLAYING'
        ];
        credits.forEach((text, i) => {
            this.add.text(w / 2, 310 + i * 22, text, {
                fontSize: '12px', fontFamily: 'monospace', color: '#555555'
            }).setOrigin(0.5);
        });

        // Gamepad polling
        this._gp = new GamepadControls(this);
        this._menuReady = false;
        this._transitioning = false;
        this._initialsActive = false;

        // After rank shows, load scores, show leaderboard, check for high score
        this.time.delayedCall(3000, () => {
            Leaderboard.loadScores().then(() => {
                this._createLeaderboard(w, h);
                if (Leaderboard.isHighScore(this.finalScore)) {
                    this._showInitialsEntry(w, h);
                } else {
                    this._showMenuPrompt(w, h);
                }
            });
        });

        // Music
        this.sound.stopAll();
        this.sound.play('music-intro', { loop: true, volume: 0.5 });

        this.cameras.main.fadeIn(1000, 0, 0, 0);
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

    _showInitialsEntry(w, y) {
        this._initialsActive = true;
        this._initials = ['A', 'A', 'A'];
        this._initialSlot = 0;

        // "NEW HIGH SCORE!" label
        this.add.text(w / 2, 370, 'NEW HIGH SCORE!', {
            fontSize: '16px', fontFamily: 'monospace', color: '#ffcc00', fontStyle: 'bold',
            stroke: '#332200', strokeThickness: 3
        }).setOrigin(0.5);

        // 3-letter display
        this._initialTexts = [];
        for (let i = 0; i < 3; i++) {
            const t = this.add.text(w / 2 - 30 + i * 30, 400, 'A', {
                fontSize: '24px', fontFamily: 'monospace', color: '#888888', fontStyle: 'bold'
            }).setOrigin(0.5);
            this._initialTexts.push(t);
        }
        this._updateInitialsDisplay();

        // Keyboard: A-Z direct type, backspace, enter
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

        // Gamepad state tracking
        this._gpRepeatTimer = 0;
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

        Leaderboard.addScore(name, this.finalScore, 5).then(() => {
            this._showMenuPrompt(GAME_WIDTH, GAME_HEIGHT);
        });
    }

    _showMenuPrompt(w, h) {
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const menuText = this.add.text(w / 2, 430,
            isTouchDevice ? 'TAP FOR MENU' : 'PRESS ENTER FOR MENU', {
            fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: menuText,
            alpha: 0.3,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        const goToMenu = () => {
            if (this._transitioning) return;
            this._transitioning = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MenuScene');
            });
        };
        this.input.keyboard.once('keydown-ENTER', goToMenu);
        this.input.once('pointerdown', goToMenu);
        this._goToMenu = goToMenu;
        this._menuReady = true;
    }

    update() {
        this._gp.update();

        // Gamepad initials entry
        if (this._initialsActive && this._gp.enabled) {
            const pad = navigator.getGamepads()[0];
            if (pad) {
                // D-pad up/down to cycle letter
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

                // A button to confirm
                if (this._gp.confirm) this._confirmInitials();
            }
        }

        if (this._menuReady && this._gp.confirm) this._goToMenu();
    }
}
