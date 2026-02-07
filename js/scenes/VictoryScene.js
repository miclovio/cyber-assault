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
            fontSize: '16px', fontFamily: 'monospace', color: '#888888'
        }).setOrigin(0.5);

        // Animated score counter
        const scoreObj = { value: 0 };
        const scoreText = this.add.text(w / 2, 195, '0', {
            fontSize: '36px', fontFamily: 'monospace', color: '#ffff00', fontStyle: 'bold'
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
                fontSize: '32px', fontFamily: 'monospace', color: rankColor, fontStyle: 'bold'
            }).setOrigin(0.5);
        });

        // Credits
        const credits = [
            'A CYBER ASSAULT PRODUCTION',
            '',
            'THANK YOU FOR PLAYING'
        ];
        credits.forEach((text, i) => {
            this.add.text(w / 2, 310 + i * 22, text, {
                fontSize: '12px', fontFamily: 'monospace', color: '#555555'
            }).setOrigin(0.5);
        });

        // Return to menu
        this.time.delayedCall(3000, () => {
            const menuText = this.add.text(w / 2, 400, 'PRESS ENTER FOR MENU', {
                fontSize: '16px', fontFamily: 'monospace', color: '#ffffff'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: menuText,
                alpha: 0.3,
                duration: 600,
                yoyo: true,
                repeat: -1
            });

            this.input.keyboard.once('keydown-ENTER', () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MenuScene');
                });
            });
        });

        // Music (may already be playing from boss defeat - restart it looping)
        this.sound.stopAll();
        this.sound.play('music-victory', { loop: true, volume: 0.5 });

        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
}
