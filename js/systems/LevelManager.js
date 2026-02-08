// ============================================================================
// Level Manager - Trigger-based enemy spawning
// ============================================================================

class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.physics.add.group();
        this.triggers = [];
        this.activatedTriggers = new Set();
        this.checkpoints = [];
        this.activatedCheckpoints = new Set();
    }

    setup(levelData) {
        this.triggers = levelData.enemyTriggers || [];
        this.checkpoints = levelData.checkpoints || [];
        this.fixedDrops = levelData.fixedDrops || [];
        this.enemyTint = levelData.enemyTint || null;
        this.activatedTriggers.clear();
        this.activatedCheckpoints.clear();
        this.activatedDrops = new Set();
    }

    update() {
        if (this.scene.bossActive) return;
        const camRight = this.scene.cameras.main.scrollX + GAME_WIDTH;

        // Check enemy spawn triggers
        this.triggers.forEach((trigger, index) => {
            if (!this.activatedTriggers.has(index) && camRight >= trigger.x) {
                this.activatedTriggers.add(index);
                this.spawnEnemyGroup(trigger);
            }
        });

        // Check fixed drops
        if (this.scene.player && !this.scene.player.isDead) {
            const px = this.scene.player.x;
            this.fixedDrops.forEach((drop, index) => {
                if (!this.activatedDrops.has(index) && px >= drop.x) {
                    this.activatedDrops.add(index);
                    this.scene.powerUpSystem.createPowerUp(drop.x, drop.y, drop.type);
                }
            });
        }

        // Check checkpoints (only when player is alive)
        if (this.scene.player && !this.scene.player.isDead) {
            const playerX = this.scene.player.x;
            this.checkpoints.forEach((cp, index) => {
                if (!this.activatedCheckpoints.has(index) && playerX >= cp.x) {
                    this.activatedCheckpoints.add(index);
                    this.scene.player.setCheckpoint(cp.x, cp.y);
                }
            });
        }

        // Update active enemies
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active && enemy.update) {
                enemy.update(this.scene.time.now, 0);
            }

            // Deactivate enemies far behind camera
            const cam = this.scene.cameras.main;
            if (enemy.active && enemy.x < cam.scrollX - 200) {
                enemy.setActive(false);
                enemy.setVisible(false);
                if (enemy.body) {
                    enemy.body.stop();
                    enemy.body.enable = false;
                }
            }
        });
    }

    spawnEnemyGroup(trigger) {
        const enemies = trigger.enemies || [];
        enemies.forEach(def => {
            this.spawnEnemy(def.type, def.x, def.y, def.config);
        });
    }

    spawnEnemy(type, x, y, config) {
        let enemy;

        switch (type) {
            case 'grunt':
                enemy = new Grunt(this.scene, x, y, config);
                break;
            case 'flyer':
                enemy = new Flyer(this.scene, x, y, config);
                break;
            case 'flying_eye':
                enemy = new Flyer(this.scene, x, y, { ...config, variant: 'eye' });
                break;
            case 'heavy':
                enemy = new Heavy(this.scene, x, y, config);
                break;
            case 'slime':
                enemy = new Turret(this.scene, x, y, { ...config, variant: 'slime' });
                break;
            case 'ghost':
                enemy = new Ghost(this.scene, x, y, config);
                break;
            case 'turret':
                enemy = new Turret(this.scene, x, y, config);
                break;
            case 'grey_mech':
                enemy = new Mech(this.scene, x, y, config);
                break;
            case 'cyan_mech':
                enemy = new Mech(this.scene, x, y, { ...config, variant: 'cyan' });
                break;
            case 'orange_mech':
                enemy = new Mech(this.scene, x, y, { ...config, variant: 'orange' });
                break;
            case 'blue_mech':
                enemy = new Mech(this.scene, x, y, { ...config, variant: 'blue' });
                break;
            default:
                console.warn('Unknown enemy type:', type);
                return;
        }

        if (this.enemyTint) {
            enemy.baseTint = this.enemyTint;
            if (enemy.isSlime) {
                enemy.baseTint = 0x9966ff;
                enemy.setTint(0x9966ff);
            } else {
                enemy.setTint(this.enemyTint);
            }
        }
        this.enemies.add(enemy);
        return enemy;
    }

    clearEnemies() {
        this.enemies.getChildren().forEach(e => {
            if (e.active) {
                e.setActive(false);
                e.setVisible(false);
                if (e.body) {
                    e.body.stop();
                    e.body.enable = false;
                }
            }
        });
    }

    destroy() {
        this.enemies.destroy(true);
    }
}
