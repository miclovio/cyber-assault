// ============================================================================
// Turret - Static, aims at player (Metal-Slug)
// ============================================================================

class Turret extends EnemyBase {
    constructor(scene, x, y, config) {
        const isSlime = config && config.variant === 'slime';
        const cfg = { ...ENEMY_CONFIG.TURRET, ...config };
        super(scene, x, y, isSlime ? 'slime1' : 'turret', cfg);

        this.isSlime = isSlime;

        if (isSlime) {
            this.setScale(1);
            this.body.setSize(24, 22);
            this.play('slime-idle');
        } else {
            this.setScale(1.2);
            this.body.setSize(40, 40);
        }

        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.detectionRange = cfg.detectionRange;
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) return;

        if (this.scene.player && !this.scene.player.isDead) {
            if (!this.isSlime) {
                // Turret aims with rotation
                const angle = this.getAngleToPlayer();
                this.setRotation(Phaser.Math.Clamp(angle, -0.3, 0.3));
            }
            this.setFlipX(this.scene.player.x < this.x);
        }

        // Shoot at player
        if (this.isSlime) {
            this.shootSlime(time);
        } else {
            this.shootAtPlayer(time);
        }
    }

    shootSlime(time) {
        if (time - this.lastFireTime < this.fireRate) return;
        if (!this.canSeePlayer()) return;

        this.lastFireTime = time;
        // Fire horizontally at chest height — passes over crouching players
        const bulletY = this.y - 30;
        this.scene.weaponSystem.fireEnemyBullet(
            this.x, bulletY,
            this.scene.player.x, bulletY,
            200, 1
        );
    }
}
