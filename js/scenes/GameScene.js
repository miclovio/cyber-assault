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

        // Create platforms (staticGroup for proper collider support)
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

        // Scene transition state (driven by update loop for reliability)
        this.sceneTransition = null; // { phase, timer, data, target }

        // Level events
        this.events.on('player-game-over', this.onGameOver, this);

        // Debug: B = skip to boss, N = skip to next level
        this.input.keyboard.on('keydown-B', () => {
            if (!this.bossActive && this.bossData) {
                this.player.setPosition(this.bossData.arenaStart + 50, 350);
            }
        });
        this.input.keyboard.on('keydown-N', () => {
            if (!this.sceneTransition) {
                const next = this.currentLevel < 4 ? this.currentLevel + 1 : 1;
                this.sceneTransition = {
                    phase: 2, timer: 100, target: 'GameScene',
                    data: { level: next, score: this.player.score, lives: this.player.lives, weapon: this.player.currentWeapon }
                };
            }
        });

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

        // Music
        this.sound.stopAll();
        this.sound.play(`music-level${this.currentLevel}`, { loop: true, volume: 0.4 });

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createPlatforms(levelData) {
        const tileKey = levelData.platformTile;
        const tileTint = levelData.platformTint;
        const texH = this.textures.get(tileKey).getSourceImage().height;

        levelData.platforms.forEach(p => {
            // Visual tileSprite (centered)
            const visual = this.add.tileSprite(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, tileKey);
            visual.setDepth(1);
            if (tileTint) visual.setTint(tileTint);
            // Scale texture to fit platform height (prevent vertical tiling)
            if (texH < p.h) visual.setTileScale(1, p.h / texH);

            // Invisible physics rectangle (origin 0.5 properly initialized unlike Zone)
            const rect = this.add.rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
            rect.setVisible(false);
            this.platforms.add(rect);
        });
    }

    update(time, delta) {
        if (!this.player) return;

        // Handle scene transitions (reliable delta-timer, no camera events)
        if (this.sceneTransition) {
            this.updateSceneTransition(delta);
            return;
        }

        // Update player
        this.player.update(time, delta);

        // Update parallax
        this.parallaxManager.update();

        // Update level manager (enemy spawning)
        this.levelManager.update();

        // Update boss
        if (this.boss) {
            this.boss.update(time, delta);

            // Detect boss defeat directly (no events/callbacks needed)
            if (this.boss.isDefeated && !this.boss.active && !this.sceneTransition) {
                this.onBossDefeated();
            }
        }

        // Check boss trigger
        if (!this.bossActive && this.bossData) {
            if (this.player.x >= this.bossData.arenaStart) {
                this.startBossFight();
            }
        }
    }

    updateSceneTransition(delta) {
        const t = this.sceneTransition;
        t.timer -= delta;

        if (t.phase === 1 && t.timer <= 0) {
            // Phase 1 done: start fadeout
            this.cameras.main.fadeOut(1000, t.fadeR || 0, t.fadeG || 0, t.fadeB || 0);
            t.phase = 2;
            t.timer = 1200; // slightly longer than fade duration
        } else if (t.phase === 2 && t.timer <= 0) {
            // Phase 2 done: execute transition
            this.sceneTransition = null; // prevent re-entry
            this.scene.stop('HUDScene');
            if (t.target === 'GameScene') {
                // Must use restart() for the current scene - start() is a no-op
                this.scene.restart(t.data);
            } else {
                this.scene.start(t.target, t.data);
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

        // Set checkpoint inside arena so respawn works with locked camera
        this.player.setCheckpoint(arenaStart + 60, 380);

        // Add boss platform if needed
        if (this.bossData.type !== 'FIRESKULL' && this.bossData.type !== 'SENTINEL') {
            const arenaW = arenaEnd - arenaStart;
            this.add.tileSprite(arenaStart + arenaW / 2, 420, arenaW, 30,
                LEVEL_DATA[this.currentLevel].platformTile).setDepth(1);
            const floor = this.add.rectangle(arenaStart + arenaW / 2, 420, arenaW, 30);
            floor.setVisible(false);
            this.platforms.add(floor);
        }

        // Emit boss warning event (HUD shows WARNING!)
        this.events.emit('boss-start', this.bossData.name);

        // Delay boss spawn so player has time to prepare
        this.time.delayedCall(2500, () => {
            if (!this.bossActive) return; // scene may have changed

            // Spawn boss
            this.boss = new Boss(this, this.bossData.x, this.bossData.y, this.bossData.type);
            this.boss.setCollideWorldBounds(true);
            this.boss.arenaStart = this.bossData.arenaStart;
            this.boss.arenaEnd = this.bossData.arenaEnd;

            // Boss vs platforms collider
            if (this.bossData.type !== 'FIRESKULL' && this.bossData.type !== 'SENTINEL') {
                this.physics.add.collider(this.boss, this.platforms);
            }

            // Setup boss collision
            this.collisionManager.setupBossCollision(this.boss);
        });
    }

    onBossDefeated() {
        // Null out bossData to prevent re-triggering startBossFight
        this.bossData = null;

        // Notify HUD to hide boss HP bar
        this.events.emit('boss-defeated');

        // Victory music
        this.sound.stopAll();
        this.sound.play('music-victory', { loop: false, volume: 0.5 });

        // Player celebration - stop input, make invulnerable, victory jump
        this.player.isInvulnerable = true;
        this.player.invulnTimer = 10000;
        this.player.setVelocityX(0);
        this.player.setVelocityY(-500);
        this.player.play('player-jump-gun');
        this.player.facingRight = true;
        this.player.setFlipX(false);

        // Freeze player at peak of jump
        this.time.delayedCall(350, () => {
            this.player.setVelocity(0, 0);
            this.player.body.allowGravity = false;
        });

        // Speech bubble with random quip pops in at peak of jump
        this.time.delayedCall(400, () => {
            const quips = ['Yes!', 'Too EZ', 'Excellent', 'Away with\nyou Demon!'];
            const quip = quips[Math.floor(Math.random() * quips.length)];
            const fontSize = '16px';
            const bw = 120;
            const bh = 50;

            const bx = this.player.x + 30;
            const by = this.player.y - 40;

            // Speech bubble background (drawn centered on origin so scale works)
            const bubble = this.add.graphics().setDepth(49).setPosition(bx, by).setScale(0);
            bubble.fillStyle(0xffffff, 1);
            bubble.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 12);
            // Tail pointing down-left toward player
            bubble.fillTriangle(-20, bh / 2 - 4, -30, bh / 2 + 18, -5, bh / 2 - 4);

            // Text inside bubble
            const yesText = this.add.text(bx, by, quip, {
                fontSize: fontSize,
                fontFamily: 'Arial Black, Arial',
                color: '#000000',
                align: 'center'
            }).setOrigin(0.5).setDepth(50).setScale(0);

            this.tweens.add({
                targets: [bubble, yesText],
                scaleX: 1,
                scaleY: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });
        });

        // "LEVEL COMPLETE" text drops in after celebration
        this.time.delayedCall(1200, () => {
            const cam = this.cameras.main;
            const cx = cam.scrollX + GAME_WIDTH / 2;
            const cy = cam.scrollY + GAME_HEIGHT / 2 - 40;

            const completeText = this.add.text(cx, cy - 100, 'LEVEL COMPLETE', {
                fontSize: '48px',
                fontFamily: 'monospace',
                color: '#00ffff',
                fontStyle: 'bold',
                stroke: '#003333',
                strokeThickness: 6
            }).setOrigin(0.5).setDepth(50).setAlpha(0);

            this.tweens.add({
                targets: completeText,
                y: cy,
                alpha: 1,
                duration: 800,
                ease: 'Bounce.easeOut'
            });
        });

        // Start transition via update loop (3s wait, then fadeout, then switch scene)
        if (this.currentLevel < 4) {
            this.sceneTransition = {
                phase: 1,
                timer: 3000,
                target: 'GameScene',
                data: {
                    level: this.currentLevel + 1,
                    score: this.player.score,
                    lives: this.player.lives,
                    weapon: this.player.currentWeapon
                }
            };
        } else {
            this.sceneTransition = {
                phase: 1,
                timer: 3000,
                target: 'VictoryScene',
                data: { score: this.player.score },
                fadeR: 255, fadeG: 255, fadeB: 255
            };
        }
    }

    onGameOver() {
        this.sceneTransition = {
            phase: 1,
            timer: 2000,
            target: 'GameOverScene',
            data: {
                score: this.player.score,
                level: this.currentLevel
            }
        };
    }

}
