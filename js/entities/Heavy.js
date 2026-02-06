// ============================================================================
// Heavy - Slow patrol + burst fire (Bipedal Unit)
// ============================================================================

class Heavy extends EnemyBase {
    constructor(scene, x, y, config) {
        const cfg = { ...ENEMY_CONFIG.HEAVY, ...config };
        super(scene, x, y, 'heavy1', cfg);

        this.setScale(1.5);
        this.body.setSize(28, 36);
        this.body.setOffset(4, 4);

        this.patrolDir = config && config.patrolDir || 1;
        this.patrolRange = config && config.patrolRange || 150;
        this.startX = x;
        this.burstCount = cfg.burstCount;
        this.burstDelay = cfg.burstDelay;
        this.isBursting = false;

        this.play('heavy-walk');
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) return;

        // Slow patrol
        if (!this.isBursting) {
            this.setVelocityX(this.speed * this.patrolDir);
            this.setFlipX(this.patrolDir < 0);

            if (this.x > this.startX + this.patrolRange) this.patrolDir = -1;
            else if (this.x < this.startX - this.patrolRange) this.patrolDir = 1;

            if (this.body.blocked.left) this.patrolDir = 1;
            if (this.body.blocked.right) this.patrolDir = -1;
        }

        // Burst fire
        if (this.canSeePlayer() && time - this.lastFireTime > this.fireRate && !this.isBursting) {
            this.startBurst(time);
        }
    }

    startBurst(time) {
        this.isBursting = true;
        this.setVelocityX(0);
        this.lastFireTime = time;

        // Face player
        if (this.scene.player) {
            this.setFlipX(this.scene.player.x < this.x);
        }

        let shotsRemaining = this.burstCount;
        const burstTimer = this.scene.time.addEvent({
            delay: this.burstDelay,
            repeat: shotsRemaining - 1,
            callback: () => {
                if (!this.active) return;
                this.scene.weaponSystem.fireEnemyBullet(
                    this.x, this.y,
                    this.scene.player.x, this.scene.player.y,
                    250, 1
                );
                shotsRemaining--;
                if (shotsRemaining <= 0) {
                    this.isBursting = false;
                }
            }
        });
    }
}
