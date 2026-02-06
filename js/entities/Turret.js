// ============================================================================
// Turret - Static, aims at player (Metal-Slug)
// ============================================================================

class Turret extends EnemyBase {
    constructor(scene, x, y, config) {
        const cfg = { ...ENEMY_CONFIG.TURRET, ...config };
        super(scene, x, y, 'turret', cfg);

        this.setScale(1.2);
        this.body.setSize(40, 40);
        this.body.setImmovable(true);
        this.body.allowGravity = false;

        this.detectionRange = cfg.detectionRange;
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) return;

        // Aim at player (rotate sprite slightly)
        if (this.scene.player && !this.scene.player.isDead) {
            const angle = this.getAngleToPlayer();
            // Subtle rotation to indicate aiming
            this.setRotation(Phaser.Math.Clamp(angle, -0.3, 0.3));
            this.setFlipX(this.scene.player.x < this.x);
        }

        // Shoot at player
        this.shootAtPlayer(time);
    }
}
