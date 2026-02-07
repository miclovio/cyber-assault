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
        this.activatedTriggers.clear();
        this.activatedCheckpoints.clear();
    }

    update() {
        const camRight = this.scene.cameras.main.scrollX + GAME_WIDTH;

        // Check enemy spawn triggers
        this.triggers.forEach((trigger, index) => {
            if (!this.activatedTriggers.has(index) && camRight >= trigger.x) {
                this.activatedTriggers.add(index);
                this.spawnEnemyGroup(trigger);
            }
        });

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
            default:
                console.warn('Unknown enemy type:', type);
                return;
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
