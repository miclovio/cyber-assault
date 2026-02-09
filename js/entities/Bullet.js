// ============================================================================
// Bullet - Object-pooled projectile
// ============================================================================

class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet1');
        this.damage = 1;
        this.isPlayerBullet = true;
    }

    fire(x, y, dirX, dirY, speed, damage, textureKey, isPlayerBullet, tintColor, isBoss) {
        this.isBoss = isBoss;
        this.body.enable = true;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.damage = damage || 1;
        this.isPlayerBullet = isPlayerBullet !== false;
        this.body.allowGravity = false;

        // Boss bullets use animated fire-ball, others use static texture
        if (isBoss) {
            this.setTexture('fire-ball0');
            this.play('fire-ball');
        } else {
            this.stop();
            this.setTexture(textureKey || 'bullet1');
        }

        // Normalize direction
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        const nx = dirX / len;
        const ny = dirY / len;

        this.setVelocity(nx * speed, ny * speed);
        this.setRotation(Math.atan2(ny, nx));

        // Scale: player=1, enemy=1.8, boss=2
        if (isPlayerBullet) {
            this.setScale(1);
        } else if (isBoss) {
            this.setScale(2);
        } else {
            this.setScale(1.8);
        }

        // Tint: player=weapon color, enemy=orange, boss=no tint (fire-ball has own colors)
        if (isBoss) {
            this.clearTint();
        } else if (!isPlayerBullet) {
            this.setTint(0xff6600);
        } else if (tintColor) {
            this.setTint(tintColor);
        } else {
            this.clearTint();
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.active) return;

        // Player bullet vs boss hit check (runs every frame per bullet)
        if (this.isPlayerBullet) {
            const boss = this.scene.boss;
            if (boss && boss.active && !boss.isDefeated) {
                const dx = this.x - boss.x;
                const dy = this.y - boss.y;
                const hr = boss.hitRadius || 75;
                if (dx * dx + dy * dy < hr * hr) {
                    this.scene.effectsManager.playHitEffect(this.x, this.y, this.rotation);
                    boss.takeDamage(this.damage || 1);
                    this.deactivate();
                    return;
                }
            }
        }

        // Deactivate if off-camera
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

    fireBullet(x, y, dirX, dirY, speed, damage, textureKey, tintColor, isBoss) {
        const bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.fire(x, y, dirX, dirY, speed, damage, textureKey, this.isPlayerPool, tintColor, isBoss);
        }
        return bullet;
    }
}
