// ============================================================================
// Bullet - Object-pooled projectile
// ============================================================================

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet1');
        this.damage = 1;
        this.isPlayerBullet = true;
    }

    fire(x, y, dirX, dirY, speed, damage, textureKey, isPlayerBullet) {
        this.setTexture(textureKey || 'bullet1');
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.damage = damage || 1;
        this.isPlayerBullet = isPlayerBullet !== false;
        this.body.allowGravity = false;

        // Normalize direction
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        const nx = dirX / len;
        const ny = dirY / len;

        this.setVelocity(nx * speed, ny * speed);
        this.setRotation(Math.atan2(ny, nx));
        this.setScale(isPlayerBullet ? 1 : 0.8);

        if (!isPlayerBullet) {
            this.setTint(0xff4444);
        } else {
            this.clearTint();
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Only check bounds for active bullets
        if (!this.active) return;

        const cam = this.scene.cameras.main;
        const margin = 100;
        if (this.x < cam.scrollX - margin || this.x > cam.scrollX + cam.width + margin ||
            this.y < cam.scrollY - margin || this.y > cam.scrollY + cam.height + margin) {
            this.deactivate();
        }
    }

    deactivate() {
        this.setActive(false);
        this.setVisible(false);
        if (this.body) {
            this.body.stop();
            this.body.enable = false;
        }
    }
}

// Bullet pool factory
class BulletPool extends Phaser.Physics.Arcade.Group {
    constructor(scene, count, isPlayerBullet) {
        super(scene.physics.world, scene, {
            classType: Bullet,
            maxSize: count,
            runChildUpdate: true
        });

        this.isPlayerPool = isPlayerBullet;

        for (let i = 0; i < count; i++) {
            const bullet = new Bullet(scene, 0, 0);
            this.add(bullet, true);
            bullet.setActive(false);
            bullet.setVisible(false);
            if (bullet.body) {
                bullet.body.allowGravity = false;
                bullet.body.enable = false;
            }
        }
    }

    fireBullet(x, y, dirX, dirY, speed, damage, textureKey) {
        const bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.fire(x, y, dirX, dirY, speed, damage, textureKey, this.isPlayerPool);
        }
        return bullet;
    }
}
