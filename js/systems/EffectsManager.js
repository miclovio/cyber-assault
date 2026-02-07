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

    // Brief freeze-frame for impactful hits
    hitFreeze(duration) {
        this.scene.physics.world.timeScale = 10; // slow to 1/10 speed
        this.scene.time.delayedCall(duration || 50, () => {
            this.scene.physics.world.timeScale = 1;
        });
    }

    playBossExplosionChain(x, y, width, height) {
        const total = 10;
        for (let i = 0; i < total; i++) {
            const delay = i * 200;
            const rx = x + (Math.random() - 0.5) * width;
            const ry = y + (Math.random() - 0.5) * height;
            this.scene.time.delayedCall(delay, () => {
                this.playLargeExplosion(rx, ry);
                this.scene.cameras.main.shake(100, 0.005);
            });
        }
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
