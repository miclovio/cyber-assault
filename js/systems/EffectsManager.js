// ============================================================================
// Effects Manager - Explosions, hit FX, death anims
// ============================================================================

class EffectsManager {
    constructor(scene) {
        this.scene = scene;
        this.explosionPool = scene.add.group({
            maxSize: POOL_SIZES.EXPLOSIONS
        });

        // Pre-create explosion sprites
        for (let i = 0; i < POOL_SIZES.EXPLOSIONS; i++) {
            const exp = scene.add.sprite(0, 0, 'exp-a1');
            exp.setActive(false);
            exp.setVisible(false);
            exp.setDepth(20);
            this.explosionPool.add(exp);
        }
    }

    playExplosion(x, y, scale, animKey) {
        const exp = this.explosionPool.getFirstDead(false);
        if (!exp) return;

        exp.setPosition(x, y);
        exp.setScale(scale || 1);
        exp.setActive(true);
        exp.setVisible(true);
        exp.play(animKey || 'explosion-a');

        exp.once('animationcomplete', () => {
            exp.setActive(false);
            exp.setVisible(false);
        });
    }

    playSmallExplosion(x, y) {
        this.playExplosion(x, y, 0.5, 'explosion-g');
    }

    playMediumExplosion(x, y) {
        this.playExplosion(x, y, 1, 'explosion-a');
    }

    playLargeExplosion(x, y) {
        this.playExplosion(x, y, 1.5, 'explosion-b');
    }

    playEnemyDeath(x, y) {
        const exp = this.explosionPool.getFirstDead(false);
        if (!exp) return;

        exp.setPosition(x, y);
        exp.setScale(1);
        exp.setActive(true);
        exp.setVisible(true);
        exp.play('enemy-death-fx');

        exp.once('animationcomplete', () => {
            exp.setActive(false);
            exp.setVisible(false);
        });
    }

    playHitEffect(x, y) {
        // Simple flash effect using a rectangle
        const flash = this.scene.add.rectangle(x, y, 8, 8, 0xffffff);
        flash.setDepth(25);
        this.scene.tweens.add({
            targets: flash,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 150,
            onComplete: () => flash.destroy()
        });
    }

    playBossExplosionChain(x, y, width, height, callback) {
        let count = 0;
        const total = 10;
        const timer = this.scene.time.addEvent({
            delay: 200,
            repeat: total - 1,
            callback: () => {
                const rx = x + (Math.random() - 0.5) * width;
                const ry = y + (Math.random() - 0.5) * height;
                this.playLargeExplosion(rx, ry);
                this.scene.cameras.main.shake(100, 0.005);
                count++;
                if (count >= total && callback) {
                    callback();
                }
            }
        });
    }

    screenFlash(duration) {
        const flash = this.scene.add.rectangle(
            this.scene.cameras.main.scrollX + GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT, 0xffffff
        );
        flash.setScrollFactor(0);
        flash.setDepth(100);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: duration || 300,
            onComplete: () => flash.destroy()
        });
    }

    destroy() {
        this.explosionPool.destroy(true);
    }
}
