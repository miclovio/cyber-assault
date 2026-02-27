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

        // Player vs Platforms (one-way for thin platforms, pass-through when climbing)
        scene.physics.add.collider(player, platforms, null, (player, platform) => {
            if (platform.isOneWay) {
                // Let climbing player pass through one-way platforms to descend ladders
                if (scene.player.isClimbing) return false;
                return player.body.velocity.y >= 0 && player.body.bottom <= platform.body.y + 10;
            }
            return true;
        });

        // Player bullets vs Platforms
        scene.physics.add.collider(scene.weaponSystem.playerBullets, platforms, (bullet) => {
            scene.effectsManager.playHitEffect(bullet.x, bullet.y, bullet.rotation);
            bullet.deactivate();
        });

        // Enemy bullets vs Platforms
        scene.physics.add.collider(scene.weaponSystem.enemyBullets, platforms, (bullet) => {
            bullet.deactivate();
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

        // Boost player fire rate while landing hits on boss (resets each hit, decays in 300ms)
        if (this.scene.player) {
            this.scene.player.bossHitTimer = 300;
        }
    }

    enemyBulletHitPlayer(player, bullet) {
        if (!bullet.active || player.isDead || player.isInvulnerable) return;

        // L5: crouching/crawling dodges enemy bullets (not boss bullets)
        if (this.scene.currentLevel === 5 && player.isCrouching && !bullet.isBoss) {
            return;
        }

        bullet.deactivate();
        player.takeDamage(1);
    }

    enemyTouchPlayer(player, enemy) {
        if (!enemy.active || player.isDead || player.isInvulnerable) return;
        player.takeDamage(1);
    }

    // === L5 Mechanics Collisions ===

    setupDestructibleWalls() {
        const scene = this.scene;
        if (!scene.destructibleWalls || scene.destructibleWalls.getLength() === 0) return;

        // Player vs destructible walls
        scene.physics.add.collider(scene.player, scene.destructibleWalls);

        // Player bullets vs destructible walls
        scene.physics.add.collider(scene.weaponSystem.playerBullets, scene.destructibleWalls, (bullet, wall) => {
            if (!wall.isDestructibleWall) return;
            scene.effectsManager.playHitEffect(bullet.x, bullet.y, bullet.rotation);
            bullet.deactivate();
            scene.damageWall(wall, bullet.damage || 1);
        });

        // Enemy bullets vs destructible walls
        scene.physics.add.collider(scene.weaponSystem.enemyBullets, scene.destructibleWalls, (bullet) => {
            bullet.deactivate();
        });

        // Enemies vs destructible walls
        if (scene.levelManager) {
            scene.physics.add.collider(scene.levelManager.enemies, scene.destructibleWalls);
        }
    }

    setupExplosiveBarrels() {
        const scene = this.scene;
        if (!scene.explosiveBarrels || scene.explosiveBarrels.getLength() === 0) return;

        // Player bullets vs explosive barrels
        scene.physics.add.collider(scene.weaponSystem.playerBullets, scene.explosiveBarrels, (bullet, barrel) => {
            if (!barrel.isExplosiveBarrel) return;
            scene.effectsManager.playHitEffect(bullet.x, bullet.y, bullet.rotation);
            bullet.deactivate();
            scene.damageBarrel(barrel, bullet.damage || 1);
        });

        // Enemy bullets vs explosive barrels (block bullets but no damage)
        scene.physics.add.collider(scene.weaponSystem.enemyBullets, scene.explosiveBarrels, (bullet, barrel) => {
            if (!barrel.isExplosiveBarrel) return;
            bullet.deactivate();
        });
    }

    setupGrenades() {
        const scene = this.scene;
        if (!scene.grenades) return;

        // Grenades vs platforms — explode on impact
        scene.physics.add.collider(scene.grenades, scene.platforms, (grenade) => {
            scene.explodeGrenade(grenade);
        });

        // Grenades vs destructible walls — explode on impact + damage wall
        if (scene.destructibleWalls && scene.destructibleWalls.getLength() > 0) {
            scene.physics.add.collider(scene.grenades, scene.destructibleWalls, (grenade, wall) => {
                if (wall.isDestructibleWall) {
                    scene.damageWall(wall, GRENADE.ENEMY_DAMAGE);
                }
                scene.explodeGrenade(grenade);
            });
        }
    }

    setupFirePits() {
        const scene = this.scene;
        if (!scene.firePits || scene.firePits.length === 0) return;

        scene.firePits.forEach(pit => {
            scene.physics.add.overlap(scene.player, pit.zone, () => {
                if (!pit.isOn) return;
                if (scene.player.isDead || scene.player.isInvulnerable) return;
                scene.player.takeDamage(1);
            });
        });
    }

    setupLaserGates() {
        const scene = this.scene;
        if (!scene.laserGates || scene.laserGates.length === 0) return;

        scene.laserGates.forEach(gate => {
            scene.physics.add.overlap(scene.player, gate.zone, () => {
                if (!gate.isOn) return;
                if (scene.player.isDead || scene.player.isInvulnerable) return;
                scene.player.takeDamage(1);
            });
        });
    }

    setupLockDoors() {
        const scene = this.scene;
        if (!scene.lockDoors || scene.lockDoors.getLength() === 0) return;

        // Player vs lock doors (solid collision)
        scene.physics.add.collider(scene.player, scene.lockDoors);

        // Bullets vs lock doors (block, no damage)
        scene.physics.add.collider(scene.weaponSystem.playerBullets, scene.lockDoors, (bullet) => {
            scene.effectsManager.playHitEffect(bullet.x, bullet.y, bullet.rotation);
            bullet.deactivate();
        });

        scene.physics.add.collider(scene.weaponSystem.enemyBullets, scene.lockDoors, (bullet) => {
            bullet.deactivate();
        });
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
