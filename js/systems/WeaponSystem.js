// ============================================================================
// Weapon System - Firing patterns, bullet pools, 8-dir aim
// ============================================================================

class WeaponSystem {
    constructor(scene) {
        this.scene = scene;
        this.playerBullets = new BulletPool(scene, POOL_SIZES.PLAYER_BULLETS, true);
        this.enemyBullets = new BulletPool(scene, POOL_SIZES.ENEMY_BULLETS, false);
    }

    fire(player, weapon) {
        const bulletCount = weapon.bulletCount;
        const spreadAngle = weapon.spread * (Math.PI / 180);
        const baseAngle = Math.atan2(player.aimY, player.aimX);

        // Spawn point offset from player center
        const offsetX = player.facingRight ? 20 : -20;
        const isStanding = player.state === 'idle' || player.state === 'shoot';
        const offsetY = player.isCrouching ? 10 : isStanding ? 3 : 6;
        const spawnX = player.x + offsetX;
        const spawnY = player.y + offsetY;

        if (bulletCount === 1) {
            // Single shot (with possible random spread for rapid fire)
            const angle = baseAngle + (Math.random() - 0.5) * spreadAngle;
            this.playerBullets.fireBullet(
                spawnX, spawnY,
                Math.cos(angle), Math.sin(angle),
                weapon.bulletSpeed, weapon.damage, weapon.bulletKey, weapon.color
            );
        } else {
            // Spread shot
            const startAngle = baseAngle - spreadAngle / 2;
            const step = spreadAngle / (bulletCount - 1);

            for (let i = 0; i < bulletCount; i++) {
                const angle = startAngle + step * i;
                this.playerBullets.fireBullet(
                    spawnX, spawnY,
                    Math.cos(angle), Math.sin(angle),
                    weapon.bulletSpeed, weapon.damage, weapon.bulletKey, weapon.color
                );
            }
        }
    }

    fireEnemyBullet(x, y, targetX, targetY, speed, damage, tintColor) {
        const dx = targetX - x;
        const dy = targetY - y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        return this.enemyBullets.fireBullet(
            x, y,
            dx / len, dy / len,
            speed || 200, damage || 1, 'bullet2', tintColor, false
        );
    }

    fireEnemyBulletAngle(x, y, angle, speed, damage) {
        return this.enemyBullets.fireBullet(
            x, y,
            Math.cos(angle), Math.sin(angle),
            speed || 200, damage || 1, 'bullet2', null, false
        );
    }

    fireBossBullet(x, y, targetX, targetY, speed, damage, bossAnimKey) {
        const dx = targetX - x;
        const dy = targetY - y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        return this.enemyBullets.fireBullet(
            x, y,
            dx / len, dy / len,
            speed || 200, damage || 1, 'bullet2', null, true, bossAnimKey
        );
    }

    fireBossBulletAngle(x, y, angle, speed, damage, bossAnimKey) {
        return this.enemyBullets.fireBullet(
            x, y,
            Math.cos(angle), Math.sin(angle),
            speed || 200, damage || 1, 'bullet2', null, true, bossAnimKey
        );
    }

    destroy() {
        this.playerBullets.destroy(true);
        this.enemyBullets.destroy(true);
    }
}
