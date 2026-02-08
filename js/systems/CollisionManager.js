// ============================================================================
// Collision Manager - All collision pairs
// ============================================================================

class CollisionManager {
    constructor(scene) {
        this.scene = scene;
    }

    setup(platforms) {
        const scene = this.scene;
        const player = scene.player;

        // Player vs Platforms (one-way for thin platforms)
        scene.physics.add.collider(player, platforms, null, (player, platform) => {
            if (platform.isOneWay) {
                return player.body.velocity.y >= 0 && player.body.bottom <= platform.body.y + 10;
            }
            return true;
        });

        // Player bullets vs Platforms
        scene.physics.add.collider(scene.weaponSystem.playerBullets, platforms, (bullet) => {
            scene.effectsManager.playHitEffect(bullet.x, bullet.y, bullet.rotation);
            bullet.deactivate();
        });

        // Enemy bullets vs Platforms (disabled during boss fights so aerial boss bullets reach the player)
        scene.physics.add.collider(scene.weaponSystem.enemyBullets, platforms, (bullet) => {
            bullet.deactivate();
        }, (bullet, platform) => {
            return !scene.bossActive;
        });

        // Enemies vs Platforms (ghosts phase through, one-way platforms)
        if (scene.levelManager) {
            scene.physics.add.collider(scene.levelManager.enemies, platforms, null, (enemy, platform) => {
                if (enemy.isGhost) return false;
                if (platform.isOneWay) {
                    return enemy.body.velocity.y >= 0 && enemy.body.bottom <= platform.body.y + 10;
                }
                return true;
            });
        }

        // PowerUps vs Platforms
        if (scene.powerUpSystem) {
            scene.physics.add.collider(scene.powerUpSystem.powerUps, platforms);
        }
    }

    setupEnemyCollisions() {
        const scene = this.scene;
        const player = scene.player;

        // Player bullets vs Enemies
        if (scene.levelManager) {
            scene.physics.add.overlap(
                scene.weaponSystem.playerBullets,
                scene.levelManager.enemies,
                this.bulletHitEnemy.bind(this)
            );
        }

        // Player bullets vs Boss handled by Boss.checkPlayerBulletHits()

        // Enemy bullets vs Player
        scene.physics.add.overlap(
            scene.weaponSystem.enemyBullets,
            player,
            this.enemyBulletHitPlayer.bind(this)
        );

        // Enemy body vs Player
        if (scene.levelManager) {
            scene.physics.add.overlap(
                player,
                scene.levelManager.enemies,
                this.enemyTouchPlayer.bind(this)
            );
        }

        // PowerUp collection
        if (scene.powerUpSystem) {
            scene.physics.add.overlap(
                player,
                scene.powerUpSystem.powerUps,
                (playerObj, powerUp) => {
                    scene.powerUpSystem.collectPowerUp(playerObj, powerUp);
                }
            );
        }
    }

    bulletHitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;

        bullet.deactivate();
        this.scene.effectsManager.playHitEffect(bullet.x, bullet.y, bullet.rotation);

        if (enemy.takeDamage) {
            enemy.takeDamage(bullet.damage);
        }
    }

    bulletHitBoss(boss, bullet) {
        if (!bullet.active || !boss.active) return;

        bullet.deactivate();
        this.scene.effectsManager.playHitEffect(bullet.x, bullet.y, bullet.rotation);

        if (boss.takeDamage) {
            boss.takeDamage(bullet.damage || 1);
        }
    }

    enemyBulletHitPlayer(player, bullet) {
        if (!bullet.active || player.isDead || player.isInvulnerable) return;

        bullet.deactivate();
        player.takeDamage(1);
    }

    enemyTouchPlayer(player, enemy) {
        if (!enemy.active || player.isDead || player.isInvulnerable) return;
        player.takeDamage(1);
    }

    setupBossCollision(boss) {
        const scene = this.scene;

        // Player bullet vs boss (physics overlap as primary detection)
        scene.physics.add.overlap(
            scene.weaponSystem.playerBullets,
            boss,
            this.bulletHitBoss.bind(this)
        );

        // Boss body vs player
        scene.physics.add.overlap(
            scene.player,
            boss,
            this.enemyTouchPlayer.bind(this)
        );
    }
}
