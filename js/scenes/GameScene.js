// ============================================================================
// Game Scene - Core gameplay (reused for all 4 levels)
// ============================================================================

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.currentLevel = data.level || 1;
        this.playerScore = data.score || 0;
        this.playerLives = data.lives || PLAYER_CONFIG.MAX_LIVES;
        this.playerWeapon = data.weapon || 'PULSE';
    }

    create() {
        const levelData = LEVEL_DATA[this.currentLevel];
        if (!levelData) {
            console.error('No level data for level', this.currentLevel);
            return;
        }

        // Set world bounds
        this.physics.world.setBounds(0, 0, levelData.width, levelData.height);

        // Initialize systems
        this.audioManager = new AudioManager(this);
        this.audioManager.init();
        this.effectsManager = new EffectsManager(this);
        this.parallaxManager = new ParallaxManager(this);
        this.weaponSystem = new WeaponSystem(this);
        this.powerUpSystem = new PowerUpSystem(this);
        this.levelManager = new LevelManager(this);

        // Setup parallax backgrounds
        this.parallaxManager.setup(levelData);

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.createPlatforms(levelData);

        // Create player
        this.player = new Player(this, levelData.playerStart.x, levelData.playerStart.y);
        this.player.score = this.playerScore;
        this.player.lives = this.playerLives;
        this.player.currentWeapon = this.playerWeapon;

        // Setup camera
        this.cameras.main.setBounds(0, 0, levelData.width, levelData.height);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setDeadzone(100, 50);

        // Setup collisions
        this.collisionManager = new CollisionManager(this);
        this.collisionManager.setup(this.platforms);

        // Setup level manager (enemy triggers + checkpoints)
        this.levelManager.setup(levelData);
        this.collisionManager.setupEnemyCollisions();

        // Boss state
        this.boss = null;
        this.bossActive = false;
        this.bossData = levelData.boss;

        // Level events
        this.events.on('player-game-over', this.onGameOver, this);
        this.events.on('boss-defeated', this.onBossDefeated, this);

        // Launch HUD (stop first in case of restart)
        this.scene.stop('HUDScene');
        this.scene.launch('HUDScene');

        // Emit initial state after HUD has time to set up listeners
        this.time.delayedCall(100, () => {
            this.events.emit('level-changed', this.currentLevel);
            this.events.emit('player-score-changed', this.player.score);
            this.events.emit('player-hp-changed', this.player.hp);
            this.events.emit('player-lives-changed', this.player.lives);
            this.events.emit('player-weapon-changed', this.player.currentWeapon);
        });

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createPlatforms(levelData) {
        const tileKey = levelData.platformTile;

        levelData.platforms.forEach(p => {
            // Visual tileSprite
            const visual = this.add.tileSprite(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, tileKey);
            visual.setDepth(1);

            // Physics collision rectangle (add to static group)
            const block = this.add.rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
            block.setVisible(false);
            this.physics.add.existing(block, true);
            this.platforms.add(block);
        });
    }

    update(time, delta) {
        if (!this.player) return;

        // Update player
        this.player.update(time, delta);

        // Update parallax
        this.parallaxManager.update();

        // Update level manager (enemy spawning)
        this.levelManager.update();

        // Update boss
        if (this.boss && this.boss.active) {
            this.boss.update(time);
        }

        // Check boss trigger
        if (!this.bossActive && this.bossData) {
            if (this.player.x >= this.bossData.arenaStart) {
                this.startBossFight();
            }
        }
    }

    startBossFight() {
        this.bossActive = true;

        // Lock camera to arena
        const arenaStart = this.bossData.arenaStart;
        const arenaEnd = this.bossData.arenaEnd;
        this.cameras.main.stopFollow();
        this.cameras.main.pan(
            arenaStart + (arenaEnd - arenaStart) / 2,
            GAME_HEIGHT / 2,
            1000, 'Power2'
        );
        this.cameras.main.setBounds(arenaStart, 0, arenaEnd - arenaStart, GAME_HEIGHT);

        // Set player bounds to arena
        this.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(arenaStart, 0, arenaEnd - arenaStart, GAME_HEIGHT);

        // Clear remaining enemies
        this.levelManager.clearEnemies();

        // Spawn boss (Boss constructor already adds physics)
        this.boss = new Boss(this, this.bossData.x, this.bossData.y, this.bossData.type);
        this.boss.setCollideWorldBounds(true);
        this.boss.arenaStart = this.bossData.arenaStart;
        this.boss.arenaEnd = this.bossData.arenaEnd;

        // Add boss platform if needed
        if (this.bossData.type !== 'FIRESKULL' && this.bossData.type !== 'SENTINEL') {
            const arenaW = arenaEnd - arenaStart;
            // Visual floor
            this.add.tileSprite(arenaStart + arenaW / 2, 435, arenaW, 30,
                LEVEL_DATA[this.currentLevel].platformTile).setDepth(1);
            // Collision floor
            const floor = this.add.rectangle(arenaStart + arenaW / 2, 435, arenaW, 30);
            floor.setVisible(false);
            this.physics.add.existing(floor, true);
            this.platforms.add(floor);
            this.physics.add.collider(this.boss, this.platforms);
        }

        // Setup boss collision
        this.collisionManager.setupBossCollision(this.boss);

        // Emit boss start event
        this.events.emit('boss-start', this.bossData.name);
    }

    onBossDefeated() {
        this.bossActive = false;

        // Delay before transition
        this.time.delayedCall(3000, () => {
            if (this.currentLevel < 4) {
                this.transitionToNextLevel();
            } else {
                this.victory();
            }
        });
    }

    transitionToNextLevel() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.cleanup();
            this.scene.restart({
                level: this.currentLevel + 1,
                score: this.player.score,
                lives: this.player.lives,
                weapon: this.player.currentWeapon
            });
        });
    }

    victory() {
        this.cameras.main.fadeOut(1000, 255, 255, 255);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.cleanup();
            this.scene.stop('HUDScene');
            this.scene.start('VictoryScene', { score: this.player.score });
        });
    }

    onGameOver() {
        this.time.delayedCall(2000, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.cleanup();
                this.scene.start('GameOverScene', {
                    score: this.player.score,
                    level: this.currentLevel
                });
            });
        });
    }

    cleanup() {
        this.parallaxManager.destroy();
        this.weaponSystem.destroy();
        this.effectsManager.destroy();
        this.powerUpSystem.destroy();
        this.levelManager.destroy();
        this.audioManager.destroy();

        if (this.boss) {
            this.boss.destroy();
            this.boss = null;
        }
    }
}
