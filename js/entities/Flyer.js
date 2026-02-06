// ============================================================================
// Flyer - Sine-wave + dive AI (Alien Flying / Eye Demon)
// ============================================================================

class Flyer extends EnemyBase {
    constructor(scene, x, y, config) {
        const variant = config && config.variant === 'eye' ? 'eye' : 'alien';
        const defaults = variant === 'eye' ? ENEMY_CONFIG.FLYING_EYE : ENEMY_CONFIG.FLYER;
        const cfg = { ...defaults, ...config, gravity: false };

        const texture = variant === 'eye' ? 'eye-demon1' : 'flyer1';
        super(scene, x, y, texture, cfg);

        this.variant = variant;
        this.setScale(1.5);
        this.body.setSize(24, 20);
        this.body.allowGravity = false;

        this.startY = y;
        this.amplitude = cfg.amplitude;
        this.frequency = cfg.frequency;
        this.moveDir = config && config.moveDir || -1;
        this.isDiving = false;
        this.diveSpeed = cfg.diveSpeed;
        this.spawnTime = scene.time.now;

        const animKey = variant === 'eye' ? 'eye-demon-fly' : 'flyer-fly';
        this.play(animKey);
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) return;

        if (this.isDiving) {
            // Dive toward player
            return;
        }

        // Sine wave movement
        const elapsed = time - this.spawnTime;
        this.setVelocityX(this.speed * this.moveDir);
        this.y = this.startY + Math.sin(elapsed * this.frequency) * this.amplitude;

        this.setFlipX(this.moveDir > 0);

        // Chance to dive when near player
        if (this.canSeePlayer() && Math.random() < 0.005) {
            this.startDive();
        }
    }

    startDive() {
        this.isDiving = true;
        const player = this.scene.player;
        if (!player) return;

        const angle = this.getAngleToPlayer();
        this.setVelocity(
            Math.cos(angle) * this.diveSpeed,
            Math.sin(angle) * this.diveSpeed
        );

        // Return to sine wave after dive
        this.scene.time.delayedCall(1500, () => {
            if (this.active) {
                this.isDiving = false;
                this.startY = this.y;
                this.spawnTime = this.scene.time.now;
            }
        });
    }
}
