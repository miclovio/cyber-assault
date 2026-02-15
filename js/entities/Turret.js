// ============================================================================
// Turret - Static, aims at player (Metal-Slug)
// ============================================================================

class Turret extends EnemyBase {
    constructor(scene, x, y, config) {
        const isSlime = config && config.variant === 'slime';
        const isV1 = config && config.variant === 'v1';
        const isCeiling = config && config.ceiling;
        const cfg = { ...ENEMY_CONFIG.TURRET, ...config };
        const texture = isSlime ? 'slime1' : isV1 ? 'v1-turret1' : 'turret';
        super(scene, x, y, texture, cfg);

        this.isSlime = isSlime;
        this.isV1 = isV1;
        this.isCeiling = isCeiling;

        if (isSlime) {
            this.setScale(1);
            this.body.setSize(24, 22);
            this.play('slime-idle');
        } else if (isV1) {
            this.setScale(1.5);
            this.body.setSize(20, 28);
            this.play('v1-turret-idle');
        } else {
            this.setScale(1.2);
            this.body.setSize(40, 40);
        }

        // Ceiling turret: flip vertically
        if (this.isCeiling) {
            this.setFlipY(true);
        }

        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.detectionRange = cfg.detectionRange;
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) return;

        if (this.scene.player && !this.scene.player.isDead) {
            if (!this.isSlime && !this.isV1) {
                // Metal-Slug turret aims with rotation
                const angle = this.getAngleToPlayer();
                this.setRotation(Phaser.Math.Clamp(angle, -0.3, 0.3));
            }
            this.setFlipX(this.scene.player.x < this.x);
        }

        // Shoot at player
        if (this.isSlime) {
            this.shootSlime(time);
        } else if (this.isV1) {
            this.shootV1(time);
        } else if (this.isCeiling) {
            this.shootCeiling(time);
        } else {
            this.shootAtPlayer(time);
        }
    }

    shootCeiling(time) {
        if (time - this.lastFireTime < this.fireRate) return;
        if (!this.canSeePlayer()) return;

        this.lastFireTime = time;
        // Fire downward from ceiling mount
        const fireY = this.y + 20;
        this.scene.weaponSystem.fireEnemyBullet(
            this.x, fireY,
            this.scene.player.x, this.scene.player.y,
            200, 1
        );
    }

    shootV1(time) {
        if (time - this.lastFireTime < this.fireRate) return;
        if (!this.canSeePlayer()) return;

        this.lastFireTime = time;
        // Fire horizontally toward player
        const dir = this.scene.player.x < this.x ? -1 : 1;
        const bulletY = this.y - 5;
        this.scene.weaponSystem.fireEnemyBullet(
            this.x + dir * 15, bulletY,
            this.x + dir * 500, bulletY,
            220, 1
        );
        this.scene.audioManager.playSound('sfx-enemy-gun', 0.3);
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
