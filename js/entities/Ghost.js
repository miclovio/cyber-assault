// ============================================================================
// Ghost - Phases through platforms, floats toward player
// ============================================================================

class Ghost extends EnemyBase {
    constructor(scene, x, y, config) {
        const cfg = { ...ENEMY_CONFIG.GHOST, ...config, gravity: false };
        super(scene, x, y, 'ghost1', cfg);

        this.setScale(1.5);
        this.body.setSize(20, 28);
        this.body.allowGravity = false;

        this.floatSpeed = cfg.floatSpeed;
        this.spawnTime = scene.time.now;

        // Mark as ghost so CollisionManager can skip platform collisions
        this.isGhost = true;

        this.play('ghost-float');
        this.setAlpha(0.7);
    }

    update(time) {
        if (!this.active) return;

        // Float toward player
        if (this.scene.player && !this.scene.player.isDead) {
            const angle = this.getAngleToPlayer();
            this.setVelocity(
                Math.cos(angle) * this.floatSpeed,
                Math.sin(angle) * this.floatSpeed
            );

            this.setFlipX(this.scene.player.x < this.x);
        } else {
            // Float in place with bobbing
            const elapsed = time - this.spawnTime;
            this.setVelocityX(0);
            this.setVelocityY(Math.sin(elapsed * 0.003) * 30);
        }

        // Phase effect
        this.setAlpha(0.5 + Math.sin(time * 0.005) * 0.3);
    }
}
