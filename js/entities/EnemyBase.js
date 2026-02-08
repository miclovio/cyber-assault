// ============================================================================
// EnemyBase - Base enemy class
// ============================================================================

class EnemyBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.config = config || {};
        this.hp = this.config.hp || 1;
        this.speed = this.config.speed || 60;
        this.scoreValue = this.config.score || 100;
        this.damage = this.config.damage || 1;
        this.lastFireTime = 0;
        this.fireRate = this.config.fireRate || 2000;
        this.isHit = false;

        this.setDepth(5);
        this.body.allowGravity = this.config.gravity !== false;
        this.baseTint = null;
    }

    takeDamage(amount) {
        this.hp -= amount;

        // Flash white
        this.setTintFill(0xffffff);
        this.scene.time.delayedCall(80, () => {
            if (this.active) {
                if (this.baseTint) this.setTint(this.baseTint);
                else this.clearTint();
            }
        });

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        // Score
        if (this.scene.player) {
            this.scene.player.addScore(this.scoreValue);
        }

        // Death effect + small screen shake
        this.scene.effectsManager.playEnemyDeath(this.x, this.y);
        this.scene.cameras.main.shake(80, 0.004);

        // Chance to drop power-up
        if (Math.random() < 0.25) {
            this.scene.powerUpSystem.spawnDrop(this.x, this.y);
        }

        this.setActive(false);
        this.setVisible(false);
        if (this.body) {
            this.body.stop();
            this.body.enable = false;
        }
    }

    canSeePlayer() {
        if (!this.scene.player || this.scene.player.isDead) return false;
        const dist = Phaser.Math.Distance.Between(
            this.x, this.y, this.scene.player.x, this.scene.player.y
        );
        return dist < (this.config.detectionRange || 400);
    }

    getAngleToPlayer() {
        if (!this.scene.player) return 0;
        return Phaser.Math.Angle.Between(
            this.x, this.y, this.scene.player.x, this.scene.player.y
        );
    }

    shootAtPlayer(time) {
        if (time - this.lastFireTime < this.fireRate) return;
        if (!this.canSeePlayer()) return;

        this.lastFireTime = time;
        this.scene.weaponSystem.fireEnemyBullet(
            this.x, this.y,
            this.scene.player.x, this.scene.player.y,
            200, 1
        );
    }

    isNearEdge() {
        if (!this.body.blocked.down) return false;

        const checkX = this.x + (this.patrolDir * 24);
        const checkY = this.body.bottom + 8;
        const platforms = this.scene.platforms;
        if (!platforms) return false;

        const children = platforms.getChildren();
        for (let i = 0; i < children.length; i++) {
            const pb = children[i].body;
            if (pb && checkX >= pb.x && checkX <= pb.x + pb.width &&
                checkY >= pb.y && checkY <= pb.y + pb.height) {
                return false;
            }
        }
        return true;
    }

    isOnScreen() {
        const cam = this.scene.cameras.main;
        return this.x > cam.scrollX - 50 &&
               this.x < cam.scrollX + cam.width + 50 &&
               this.y > cam.scrollY - 50 &&
               this.y < cam.scrollY + cam.height + 50;
    }
}
