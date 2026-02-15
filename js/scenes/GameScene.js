// ============================================================================
// Game Scene - Core gameplay (reused for all 5 levels)
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

        // Create L5 interactive elements (destructible walls, ladders, crawl zones, laser gates, barrels, lock doors)
        this.destructibleWalls = this.physics.add.staticGroup();
        this.ladderZones = [];
        this.crawlZones = [];
        this.laserGates = [];
        this.explosiveBarrels = this.physics.add.staticGroup();
        this.lockDoors = this.physics.add.staticGroup();
        this.grenades = this.physics.add.group({ maxSize: GRENADE.POOL_SIZE });
        this.createDestructibleWalls(levelData);
        this.createLadders(levelData);
        this.createCrawlZones(levelData);
        this.createLaserGates(levelData);
        this.createExplosiveBarrels(levelData);
        this.createLockDoors(levelData);
        this.firePits = [];
        this.createFirePits(levelData);

        // Create player
        this.player = new Player(this, levelData.playerStart.x, levelData.playerStart.y);
        this.player.score = this.playerScore;
        this.player.lives = this.playerLives;
        this.player.currentWeapon = this.playerWeapon;
        this.player.grenadeEnabled = (this.currentLevel === 5);

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

        // Setup L5 collisions for new elements
        this.collisionManager.setupDestructibleWalls();
        this.collisionManager.setupExplosiveBarrels();
        this.collisionManager.setupLaserGates();
        this.collisionManager.setupFirePits();
        this.collisionManager.setupLockDoors();
        this.collisionManager.setupGrenades();

        // Boss state
        this.boss = null;
        this.bossActive = false;
        this.bossData = levelData.boss;

        // Scene transition state (driven by update loop for reliability)
        this.sceneTransition = null; // { phase, timer, data, target }

        // Level events
        this.events.on('player-game-over', this.onGameOver, this);

        // Debug: Room labels for L5 testing
        if (this.currentLevel === 5) {
            const rooms = [
                { x: 600,  label: 'ROOM 1: Entry Hall' },
                { x: 1800, label: 'ROOM 2: First Arena' },
                { x: 2800, label: 'ROOM 3: Crawl Tunnel' },
                { x: 3700, label: 'ROOM 4: Vertical Shaft' },
                { x: 4800, label: 'ROOM 5: Crawl & Climb' },
                { x: 5900, label: 'ROOM 6: Heavy Combat' },
                { x: 7100, label: 'ROOM 7: Final Gauntlet' },
                { x: 7950, label: 'ROOM 8: Boss Arena' }
            ];
            rooms.forEach(r => {
                this.add.text(r.x, 408, r.label, {
                    fontSize: '10px', fontFamily: 'monospace',
                    color: '#ffff00', backgroundColor: '#00000088'
                }).setOrigin(0.5, 0.5).setDepth(200);
            });
        }

        // Debug: T = cycle through L5 rooms
        if (this.currentLevel === 5) {
            this.debugRoomIndex = 0;
            const roomStarts = [50, 1250, 2450, 3250, 4250, 5450, 6450, 7650];
            const roomNames = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7', 'Room 8'];
            this.input.keyboard.on('keydown-T', () => {
                this.debugRoomIndex = (this.debugRoomIndex + 1) % 8;
                const x = roomStarts[this.debugRoomIndex];
                this.player.setPosition(x, 380);
                if (this.player.body) this.player.body.reset(x, 380);
            });
        }

        // Debug: B = skip to boss, N = skip to next level, M = mission complete, F5 = jump to Level 5
        this.input.keyboard.on('keydown-B', () => {
            if (!this.bossActive && this.bossData) {
                this.player.setPosition(this.bossData.arenaStart + 50, 350);
            }
        });
        this.input.keyboard.on('keydown-N', () => {
            if (!this.sceneTransition) {
                const next = this.currentLevel < 5 ? this.currentLevel + 1 : 1;
                this.sceneTransition = {
                    phase: 2, timer: 100, target: 'GameScene',
                    data: { level: next, score: this.player.score, lives: this.player.lives, weapon: this.player.currentWeapon }
                };
            }
        });
        this.input.keyboard.on('keydown-M', () => {
            if (!this.sceneTransition && this.boss) {
                this.boss.hp = 0;
                this.boss.defeat();
            } else if (!this.sceneTransition && !this.boss) {
                this.onBossDefeated();
            }
        });
        this.input.keyboard.on('keydown-F5', () => {
            if (!this.sceneTransition) {
                this.sound.stopAll();
                this.scene.stop('HUDScene');
                this.scene.start('GameScene', { level: 5, score: this.player ? this.player.score : 0, lives: this.player ? this.player.lives : 3, weapon: this.player ? this.player.currentWeapon : 'PULSE' });
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

        // Pause system
        this.isPaused = false;
        this.pauseOverlay = null;
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Listen for touch pause button from HUDScene
        this.events.on('toggle-pause', this.togglePause, this);

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createPlatforms(levelData) {
        const tileKey = levelData.platformTile;
        const tileTint = levelData.platformTint;
        const texH = this.textures.get(tileKey).getSourceImage().height;

        const roundCaps = levelData.platformCaps || false;
        const capRadius = 12;

        const allPlats = levelData.platforms;
        allPlats.forEach(p => {
            // Visual tileSprite (centered)
            const visual = this.add.tileSprite(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, tileKey);
            visual.setDepth(1);
            if (tileTint) visual.setTint(tileTint);
            // Scale texture to fit platform height (prevent vertical tiling)
            if (texH < p.h) visual.setTileScale(1, p.h / texH);

            // Round top corners with a geometry mask
            // Skip cap on sides that connect to an adjacent platform at the same y
            if (roundCaps) {
                const tolerance = 5;
                let capLeft = true;
                let capRight = true;
                for (const other of allPlats) {
                    if (other === p || other.y !== p.y) continue;
                    if (Math.abs((other.x + other.w) - p.x) < tolerance) capLeft = false;
                    if (Math.abs(other.x - (p.x + p.w)) < tolerance) capRight = false;
                }

                const gfx = this.make.graphics({ x: 0, y: 0, add: false });
                const r = capRadius;
                const left = p.x;
                const top = p.y;
                const right = p.x + p.w;
                const bottom = p.y + p.h;
                gfx.fillStyle(0xffffff);
                gfx.beginPath();
                if (capLeft) {
                    gfx.moveTo(left, top + r);
                    gfx.arc(left + r, top + r, r, Math.PI, Math.PI * 1.5);
                } else {
                    gfx.moveTo(left, top);
                }
                if (capRight) {
                    gfx.lineTo(right - r, top);
                    gfx.arc(right - r, top + r, r, Math.PI * 1.5, 0);
                } else {
                    gfx.lineTo(right, top);
                }
                gfx.lineTo(right, bottom);
                gfx.lineTo(left, bottom);
                gfx.closePath();
                gfx.fillPath();
                visual.setMask(gfx.createGeometryMask());
            }

            // Invisible physics rectangle (origin 0.5 properly initialized unlike Zone)
            const rect = this.add.rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h);
            rect.setVisible(false);
            if (p.h <= 20) rect.isOneWay = true;
            this.platforms.add(rect);
        });

    }

    update(time, delta) {
        if (!this.player) return;

        // Pause toggle (ESC or gamepad Start)
        const hudScene = this.scene.get('HUDScene');
        const gamepadStart = hudScene && hudScene.gamepadControls && hudScene.gamepadControls.startPressed;
        if (Phaser.Input.Keyboard.JustDown(this.escKey) || gamepadStart) {
            if (!this.sceneTransition && (!this.boss || !this.boss.isDefeated)) {
                this.togglePause(gamepadStart ? 'gamepad' : 'keyboard');
            }
        }
        if (this.isPaused) return;

        // Handle scene transitions (reliable delta-timer, no camera events)
        if (this.sceneTransition) {
            this.updateSceneTransition(delta);
            return;
        }

        // Update player
        this.player.update(time, delta);

        // Pit death - kill player if they fall below the screen
        if (this.player.y > GAME_HEIGHT + 50 && !this.player.isDead) {
            this.player.die();
        }

        // Update parallax
        this.parallaxManager.update();

        // Update level manager (enemy spawning)
        this.levelManager.update();

        // Update laser gates (toggle on/off)
        this.updateLaserGates(time);

        // Update fire pits (toggle on/off)
        this.updateFirePits(time);

        // Update ladder/crawl zone overlaps for player
        this.updatePlayerZones();

        // Update boss
        if (this.boss) {
            this.boss.update(time, delta);

            // FAILSAFE: Direct inline player-bullet vs boss hit check
            if (this.boss.active && !this.boss.isDefeated && this.weaponSystem) {
                const bullets = this.weaponSystem.playerBullets.getChildren();
                for (let i = 0; i < bullets.length; i++) {
                    const b = bullets[i];
                    if (!b.active) continue;
                    const dx = b.x - this.boss.x;
                    const dy = b.y - this.boss.y;
                    const distSq = dx * dx + dy * dy;
                    const hr = this.boss.hitRadius || 75;
                    if (distSq < hr * hr) {
                        b.setActive(false);
                        b.setVisible(false);
                        if (b.body) { b.body.stop(); b.body.enable = false; }
                        this.effectsManager.playHitEffect(b.x, b.y, b.rotation);
                        this.boss.takeDamage(b.damage || 1);
                    }
                }
            }

        // FAILSAFE: Direct inline enemy-bullet vs player hit check (skip if boss defeated)
        if (this.weaponSystem && this.player && !this.player.isDead && !this.player.isInvulnerable && (!this.boss || !this.boss.isDefeated)) {
            const px = this.player.x;
            const py = this.player.y;
            const hitW = 20; // half-width of player hit area
            const hitH = 30; // half-height of player hit area
            const eBullets = this.weaponSystem.enemyBullets.getChildren();
            for (let i = 0; i < eBullets.length; i++) {
                const b = eBullets[i];
                if (!b.active) continue;
                if (Math.abs(b.x - px) < hitW && Math.abs(b.y - py) < hitH) {
                    b.setActive(false);
                    b.setVisible(false);
                    if (b.body) { b.body.stop(); b.body.enable = false; }
                    this.player.takeDamage(1);
                    break; // only one hit per frame
                }
            }
        }

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

        // Bossless level completion: reach end zone to trigger victory
        if (!this.bossData && !this.bossActive && !this.sceneTransition) {
            const levelData = LEVEL_DATA[this.currentLevel];
            if (levelData && levelData.endZoneX && this.player.x >= levelData.endZoneX) {
                this.onBossDefeated();
            }
        }
    }

    updateSceneTransition(delta) {
        const t = this.sceneTransition;
        t.timer -= delta;

        if (t.phase === 1 && t.timer <= 0) {
            // Phase 1 done: start fadeout
            this.cameras.main.fadeOut(1500, t.fadeR || 0, t.fadeG || 0, t.fadeB || 0);
            t.phase = 2;
            t.timer = 4500; // 1.5s fade + 3s hold on black
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

        // Clear remaining enemies and any in-flight enemy bullets
        this.levelManager.clearEnemies();
        this.weaponSystem.enemyBullets.getChildren().forEach(b => {
            if (b.active) b.deactivate();
        });

        // Set checkpoint inside arena so respawn works with locked camera
        this.player.setCheckpoint(arenaStart + 60, 380);

        // Arena floor comes from level platform data (ground must cover arena range)

        // Dark backdrop to make boss pop against the background
        this.bossBackdrop = this.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            GAME_WIDTH, GAME_HEIGHT,
            0x000000, 0
        ).setDepth(1).setScrollFactor(0);
        this.tweens.add({
            targets: this.bossBackdrop,
            fillAlpha: 0.4,
            duration: 1500,
            ease: 'Sine.easeIn'
        });

        // Emit boss warning event (HUD shows WARNING!)
        this.events.emit('boss-start', this.bossData.name);

        // Play warning SFX 3 times
        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 1200, () => {
                this.audioManager.playSound('sfx-warning', 0.5);
            });
        }

        // Delay boss spawn so player has time to prepare
        this.time.delayedCall(4500, () => {
            if (!this.bossActive) return; // scene may have changed

            // Spawn boss
            this.boss = new Boss(this, this.bossData.x, this.bossData.y, this.bossData.type);
            this.boss.setCollideWorldBounds(true);
            this.boss.arenaStart = this.bossData.arenaStart;
            this.boss.arenaEnd = this.bossData.arenaEnd;

            // Boss vs platforms collider
            if (this.bossData.type !== 'FIRESKULL' && this.bossData.type !== 'SENTINEL' && this.bossData.type !== 'COREGUARDIAN') {
                this.physics.add.collider(this.boss, this.platforms);
            }

            // Setup boss collision
            this.collisionManager.setupBossCollision(this.boss);
        });
    }

    onBossDefeated() {
        // Null out bossData to prevent re-triggering startBossFight
        this.bossData = null;

        // Fade out boss backdrop
        if (this.bossBackdrop) {
            this.tweens.add({
                targets: this.bossBackdrop,
                fillAlpha: 0,
                duration: 2000,
                onComplete: () => { this.bossBackdrop.destroy(); this.bossBackdrop = null; }
            });
        }

        // Clear all in-flight enemy bullets
        this.weaponSystem.enemyBullets.getChildren().forEach(b => {
            if (b.active) b.deactivate();
        });

        // Revive player if dead
        if (this.player.isDead) {
            this.player.isDead = false;
            this.player.deathPhase = 0;
            this.player.deathTimer = 0;
            this.player.hp = 1;
            this.player.setActive(true);
            this.player.setVisible(true);
            this.player.setAlpha(1);
            if (this.player.body) {
                this.player.body.enable = true;
                this.player.body.allowGravity = true;
            }
        }

        // Notify HUD to hide boss HP bar
        this.events.emit('boss-defeated');

        // Stop level music, delay victory music so boss defeat SFX can finish
        this.sound.stopByKey('music-level1');
        this.sound.stopByKey('music-level2');
        this.sound.stopByKey('music-level3');
        this.sound.stopByKey('music-level4');
        this.sound.stopByKey('music-level5');
        this.time.delayedCall(1500, () => {
            this.sound.play('music-victory', { loop: false, volume: 0.5 });
        });

        // Remove shield for victory celebration
        this.player.shieldHits = 0;
        this.player.hideShieldBubble();
        this.events.emit('player-shield-changed', 0);

        // Player celebration - stop input, make invulnerable, victory jump
        this.player.isInvulnerable = true;
        this.player.invulnTimer = 10000;
        this.player.setVelocityX(0);
        this.player.setVelocityY(-500);
        this.player.play('player-jump');
        this.player.facingRight = true;
        this.player.setFlipX(false);

        // Freeze player at peak of jump in idle pose
        this.time.delayedCall(350, () => {
            this.player.setVelocity(0, 0);
            this.player.body.allowGravity = false;
            this.player.play('player-idle');
        });

        // Speech bubble with random quip pops in at peak of jump
        this.time.delayedCall(400, () => {
            const quips = ['Yes!', 'Too EZ', 'Excellent', 'Away with\nyou Demon!'];
            const quip = quips[Math.floor(Math.random() * quips.length)];
            const bw = 130;
            const bh = 52;

            const bx = this.player.x + 35;
            const by = this.player.y - 45;

            // Speech bubble background
            const bubble = this.add.graphics().setDepth(49).setPosition(bx, by).setScale(0);
            // Shadow
            bubble.fillStyle(0x000000, 0.25);
            bubble.fillRoundedRect(-bw / 2 + 3, -bh / 2 + 3, bw, bh, 14);
            // Border
            bubble.fillStyle(0x333333, 1);
            bubble.fillRoundedRect(-bw / 2 - 2, -bh / 2 - 2, bw + 4, bh + 4, 14);
            // Fill
            bubble.fillStyle(0xffffff, 1);
            bubble.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 12);
            // Tail pointing down-left toward player
            bubble.fillStyle(0x333333, 1);
            bubble.fillTriangle(-18, bh / 2, -34, bh / 2 + 20, -3, bh / 2);
            bubble.fillStyle(0xffffff, 1);
            bubble.fillTriangle(-16, bh / 2 - 2, -30, bh / 2 + 16, -5, bh / 2 - 2);

            // Text inside bubble
            const quipText = this.add.text(bx, by, quip, {
                fontSize: '15px',
                fontFamily: 'monospace',
                color: '#222222',
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5).setDepth(50).setScale(0);

            this.tweens.add({
                targets: [bubble, quipText],
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

        // Start transition via update loop (6s celebration, then fade to black, hold, then switch)
        if (this.currentLevel < 4) {
            this.sceneTransition = {
                phase: 1,
                timer: 6000,
                target: 'GameScene',
                data: {
                    level: this.currentLevel + 1,
                    score: this.player.score,
                    lives: this.player.lives,
                    weapon: 'PULSE'
                }
            };
        } else {
            this.sceneTransition = {
                phase: 1,
                timer: 6000,
                target: 'VictoryScene',
                data: { score: this.player.score },
                fadeR: 0, fadeG: 0, fadeB: 0
            };
        }
    }

    // ====================================================================
    // Destructible Walls
    // ====================================================================
    createDestructibleWalls(levelData) {
        if (!levelData.destructibleWalls) return;
        const tileKey = levelData.platformTile;

        levelData.destructibleWalls.forEach(w => {
            // Visual tileSprite
            const visual = this.add.tileSprite(w.x + w.w / 2, w.y + w.h / 2, w.w, w.h, tileKey);
            visual.setDepth(2);
            visual.setTint(0x661122);

            // Physics body
            const rect = this.add.rectangle(w.x + w.w / 2, w.y + w.h / 2, w.w, w.h);
            rect.setVisible(false);
            this.destructibleWalls.add(rect);

            rect.wallHP = w.hp;
            rect.wallMaxHP = w.hp;
            rect.wallVisual = visual;
            rect.isDestructibleWall = true;
        });
    }

    damageWall(wall, damage) {
        if (!wall.wallHP) return;
        wall.wallHP -= damage;
        this.audioManager.playSound('sfx-enemy-hit', 0.2);

        // Flash white
        if (wall.wallVisual) {
            wall.wallVisual.setTintFill(0xffffff);
            this.time.delayedCall(80, () => {
                if (wall.wallVisual && wall.wallHP > 0) {
                    // Tint redder as HP drops
                    const ratio = wall.wallHP / wall.wallMaxHP;
                    const r = Math.floor(0x66 + (0xff - 0x66) * (1 - ratio));
                    wall.wallVisual.setTint((r << 16) | 0x001122);
                }
            });
        }

        if (wall.wallHP <= 0) {
            this.destroyWall(wall);
        }
    }

    destroyWall(wall) {
        // Explosion effect + camera shake + debris
        this.effectsManager.playMediumExplosion(wall.x, wall.y);
        this.cameras.main.shake(150, 0.008);
        this.audioManager.playSound('sfx-fireball', 0.3);

        // Destroy visual
        if (wall.wallVisual) {
            wall.wallVisual.destroy();
        }

        // Remove physics body
        wall.destroy();
    }

    // ====================================================================
    // Ladders
    // ====================================================================
    createLadders(levelData) {
        if (!levelData.ladders) return;

        levelData.ladders.forEach(l => {
            // Draw ladder rungs procedurally
            const gfx = this.add.graphics();
            gfx.setDepth(0);
            const rungSpacing = 20;
            const cx = l.x + l.w / 2;
            gfx.lineStyle(3, 0x888899, 0.8);
            // Side rails
            gfx.strokeRect(l.x, l.y, l.w, l.h);
            // Rungs
            for (let ry = l.y + rungSpacing; ry < l.y + l.h; ry += rungSpacing) {
                gfx.beginPath();
                gfx.moveTo(l.x, ry);
                gfx.lineTo(l.x + l.w, ry);
                gfx.strokePath();
            }

            // Store zone bounds for overlap checks
            this.ladderZones.push({
                x: l.x, y: l.y, w: l.w, h: l.h,
                graphics: gfx
            });
        });
    }

    // ====================================================================
    // Crawl Zones
    // ====================================================================
    createCrawlZones(levelData) {
        if (!levelData.crawlZones) return;
        levelData.crawlZones.forEach(cz => {
            this.crawlZones.push({ x: cz.x, y: cz.y, w: cz.w, h: cz.h });
        });
    }

    // ====================================================================
    // Laser Gates
    // ====================================================================
    createLaserGates(levelData) {
        if (!levelData.laserGates) return;

        levelData.laserGates.forEach(lg => {
            // Lightning visual (ADD blend forces separate WebGL batch, renders over masked TileSprites)
            const sprite = this.add.sprite(lg.x, lg.y + lg.h / 2, 'lightning1');
            sprite.play('lightning-gate');
            sprite.setScale(1, lg.h / 193);  // 193 = native sprite height
            sprite.setDepth(10);
            sprite.setBlendMode(Phaser.BlendModes.ADD);

            // Physics overlap zone
            const zone = this.add.rectangle(lg.x, lg.y + lg.h / 2, 40, lg.h);
            zone.setVisible(false);
            this.physics.add.existing(zone, true); // static body

            const gate = {
                sprite: sprite,
                zone: zone,
                onTime: lg.onTime || 2000,
                offTime: lg.offTime || 2000,
                isOn: !lg.startOff,
                timer: lg.startOff ? (lg.offTime || 2000) : (lg.onTime || 2000)
            };

            // Set initial state
            if (lg.startOff) {
                sprite.setVisible(false);
                sprite.setActive(false);
                if (zone.body) zone.body.enable = false;
            }

            this.laserGates.push(gate);
        });
    }

    updateLaserGates(time) {
        if (!this.laserGates.length) return;

        const delta = this.game.loop.delta;
        this.laserGates.forEach(gate => {
            gate.timer -= delta;
            if (gate.timer <= 0) {
                gate.isOn = !gate.isOn;
                gate.timer = gate.isOn ? gate.onTime : gate.offTime;

                if (gate.isOn) {
                    gate.sprite.setVisible(true);
                    gate.sprite.setActive(true);
                    if (gate.zone.body) gate.zone.body.enable = true;
                } else {
                    gate.sprite.setVisible(false);
                    gate.sprite.setActive(false);
                    if (gate.zone.body) gate.zone.body.enable = false;
                }
            }
        });
    }

    // ====================================================================
    // Fire Pits
    // ====================================================================
    createFirePits(levelData) {
        if (!levelData.firePits) return;

        levelData.firePits.forEach(fp => {
            // Fire-ball sprite — manual velocity/gravity (no physics body issues)
            const launchY = fp.y + 30;  // start below floor level
            const sprite = this.add.sprite(fp.x, launchY, 'fire-ball0');
            sprite.play('fire-ball');
            sprite.setAngle(-90);  // rotate to point upward
            sprite.setScale(3);
            sprite.setDepth(10);
            sprite.setVisible(false);

            // Overlap zone for collision — stays at sprite position
            const zone = this.add.rectangle(fp.x, launchY, 40, 40);
            zone.setVisible(false);
            this.physics.add.existing(zone, true);
            zone.body.enable = false;

            const pit = {
                sprite: sprite,
                zone: zone,
                launchX: fp.x,
                launchY: launchY,
                launchVelocity: -350,
                gravity: 400,
                vy: 0,
                offTime: fp.offTime || 2000,
                state: 'waiting',
                timer: fp.startOff ? (fp.offTime || 2000) : 500,
                isOn: false
            };

            this.firePits.push(pit);
        });
    }

    updateFirePits(time) {
        if (!this.firePits.length) return;

        const dt = this.game.loop.delta / 1000;  // seconds
        this.firePits.forEach(pit => {
            if (pit.state === 'waiting') {
                pit.timer -= this.game.loop.delta;
                if (pit.timer <= 0) {
                    // Launch fire upward
                    pit.state = 'firing';
                    pit.isOn = true;
                    pit.vy = pit.launchVelocity;
                    pit.sprite.setPosition(pit.launchX, pit.launchY);
                    pit.sprite.setAngle(-90);  // face upward on launch
                    pit.sprite.setVisible(true);
                    pit.zone.body.enable = true;
                    this.audioManager.playSound('sfx-fireball', 0.25);
                }
            } else if (pit.state === 'firing' || pit.state === 'falling') {
                // Apply gravity and move sprite
                pit.vy += pit.gravity * dt;
                pit.sprite.y += pit.vy * dt;

                // Move overlap zone to match sprite
                pit.zone.setPosition(pit.sprite.x, pit.sprite.y);
                pit.zone.body.reset(pit.sprite.x, pit.sprite.y);

                // Transition from firing to falling when velocity flips
                if (pit.state === 'firing' && pit.vy > 0) {
                    pit.state = 'falling';
                    pit.sprite.setAngle(90);  // flip to face downward
                }

                // Fire has fallen back below floor level — reset
                if (pit.state === 'falling' && pit.sprite.y > pit.launchY) {
                    pit.state = 'waiting';
                    pit.isOn = false;
                    pit.timer = pit.offTime;
                    pit.sprite.setVisible(false);
                    pit.zone.body.enable = false;
                }
            }
        });
    }

    // ====================================================================
    // Explosive Barrels
    // ====================================================================
    createExplosiveBarrels(levelData) {
        if (!levelData.explosiveBarrels) return;

        levelData.explosiveBarrels.forEach(b => {
            // Procedural barrel visual
            const gfx = this.add.graphics();
            gfx.setDepth(2);
            gfx.fillStyle(0xdd8800, 1);
            gfx.fillRoundedRect(-12, -18, 24, 36, 4);
            gfx.lineStyle(2, 0xffaa00, 1);
            gfx.strokeRoundedRect(-12, -18, 24, 36, 4);
            // Hazard stripe
            gfx.fillStyle(0x222222, 1);
            gfx.fillRect(-10, -4, 20, 8);
            gfx.fillStyle(0xffcc00, 1);
            gfx.fillTriangle(0, -12, -6, -2, 6, -2);
            gfx.setPosition(b.x, b.y);

            // Physics body (static)
            const barrel = this.add.rectangle(b.x, b.y, 24, 36);
            barrel.setVisible(false);
            this.explosiveBarrels.add(barrel);

            barrel.barrelHP = b.hp;
            barrel.barrelGraphics = gfx;
            barrel.isExplosiveBarrel = true;
        });
    }

    damageBarrel(barrel, damage) {
        if (!barrel.barrelHP) return;
        barrel.barrelHP -= damage;
        this.audioManager.playSound('sfx-enemy-hit', 0.2);

        // Flash white
        if (barrel.barrelGraphics) {
            barrel.barrelGraphics.setAlpha(0.5);
            this.time.delayedCall(80, () => {
                if (barrel.barrelGraphics) barrel.barrelGraphics.setAlpha(1);
            });
        }

        if (barrel.barrelHP <= 0) {
            this.explodeBarrel(barrel);
        }
    }

    explodeBarrel(barrel) {
        const bx = barrel.x;
        const by = barrel.y;

        // Big explosion
        this.effectsManager.playLargeExplosion(bx, by);
        this.cameras.main.shake(200, 0.012);
        this.audioManager.playSound('sfx-fireball', 0.5);

        // Damage all enemies within 200px radius
        const radius = 200;
        if (this.levelManager) {
            this.levelManager.enemies.getChildren().forEach(enemy => {
                if (!enemy.active) return;
                const dist = Phaser.Math.Distance.Between(bx, by, enemy.x, enemy.y);
                if (dist < radius && enemy.takeDamage) {
                    enemy.takeDamage(3);
                }
            });
        }

        // Damage player if too close
        if (this.player && !this.player.isDead && !this.player.isInvulnerable) {
            const playerDist = Phaser.Math.Distance.Between(bx, by, this.player.x, this.player.y);
            if (playerDist < 100) {
                this.player.takeDamage(1);
            }
        }

        // Destroy barrel
        if (barrel.barrelGraphics) barrel.barrelGraphics.destroy();
        barrel.destroy();
    }

    // ====================================================================
    // Grenades
    // ====================================================================
    spawnGrenade(x, y, aimX, aimY) {
        // Create or reuse grenade sprite
        let grenade = this.grenades.getFirstDead(false);
        if (!grenade) {
            grenade = this.add.circle(0, 0, 5, 0x44cc44);
            grenade.setDepth(8);
            this.physics.add.existing(grenade, false);
            this.grenades.add(grenade);
        }

        grenade.setPosition(x, y);
        grenade.setActive(true);
        grenade.setVisible(true);
        grenade.body.enable = true;
        grenade.body.reset(x, y);
        grenade.body.allowGravity = true;
        grenade.body.setGravityY(GRENADE.GRAVITY);
        grenade.body.setCircle(5);

        // Launch in aim direction
        const len = Math.sqrt(aimX * aimX + aimY * aimY) || 1;
        const nx = aimX / len;
        const ny = aimY / len;
        grenade.body.setVelocity(nx * GRENADE.SPEED, ny * GRENADE.SPEED - 80);

        // Fuse timer — explode after timeout if it hasn't hit anything
        grenade.fuseTimer = this.time.delayedCall(GRENADE.FUSE_TIME, () => {
            if (grenade.active) this.explodeGrenade(grenade);
        });
    }

    explodeGrenade(grenade) {
        if (!grenade.active) return;
        const gx = grenade.x;
        const gy = grenade.y;

        // Deactivate
        grenade.setActive(false);
        grenade.setVisible(false);
        if (grenade.body) { grenade.body.stop(); grenade.body.enable = false; }
        if (grenade.fuseTimer) { grenade.fuseTimer.remove(false); grenade.fuseTimer = null; }

        // Explosion FX
        this.effectsManager.playLargeExplosion(gx, gy);
        this.cameras.main.shake(200, 0.015);
        this.audioManager.playSound('sfx-fireball', 0.5);

        // AoE damage to enemies
        if (this.levelManager) {
            this.levelManager.enemies.getChildren().forEach(enemy => {
                if (!enemy.active) return;
                const dist = Phaser.Math.Distance.Between(gx, gy, enemy.x, enemy.y);
                if (dist < GRENADE.ENEMY_RADIUS && enemy.takeDamage) {
                    enemy.takeDamage(GRENADE.ENEMY_DAMAGE);
                }
            });
        }

        // AoE damage to player
        if (this.player && !this.player.isDead && !this.player.isInvulnerable) {
            const playerDist = Phaser.Math.Distance.Between(gx, gy, this.player.x, this.player.y);
            if (playerDist < GRENADE.PLAYER_RADIUS) {
                this.player.takeDamage(GRENADE.PLAYER_DAMAGE);
            }
        }

        // Also detonate nearby explosive barrels
        if (this.explosiveBarrels) {
            this.explosiveBarrels.getChildren().forEach(barrel => {
                if (!barrel.active || !barrel.isExplosiveBarrel) return;
                const dist = Phaser.Math.Distance.Between(gx, gy, barrel.x, barrel.y);
                if (dist < GRENADE.ENEMY_RADIUS) {
                    this.explodeBarrel(barrel);
                }
            });
        }
    }

    // ====================================================================
    // Lock Doors
    // ====================================================================
    createLockDoors(levelData) {
        if (!levelData.lockDoors) return;

        levelData.lockDoors.forEach(ld => {
            // Visual: red barrier
            const gfx = this.add.graphics();
            gfx.setDepth(3);
            gfx.fillStyle(0xcc0000, 0.8);
            gfx.fillRect(-ld.w / 2, -ld.h / 2, ld.w, ld.h);
            gfx.lineStyle(2, 0xff4444, 1);
            gfx.strokeRect(-ld.w / 2, -ld.h / 2, ld.w, ld.h);
            gfx.setPosition(ld.x + ld.w / 2, ld.y + ld.h / 2);

            // LOCKED text
            const lockText = this.add.text(ld.x + ld.w / 2, ld.y + ld.h / 2, 'LOCKED', {
                fontSize: '8px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(4);

            // Pulsing animation for the lock indicator
            this.tweens.add({
                targets: lockText,
                alpha: 0.3,
                duration: 800,
                yoyo: true,
                repeat: -1
            });

            // Physics body
            const door = this.add.rectangle(ld.x + ld.w / 2, ld.y + ld.h / 2, ld.w, ld.h);
            door.setVisible(false);
            this.lockDoors.add(door);

            door.isLockDoor = true;
            door.doorGraphics = gfx;
            door.doorText = lockText;
            door.triggerIndex = ld.triggerIndex;
            door.isOpen = false;
        });
    }

    checkLockDoors() {
        this.lockDoors.getChildren().forEach(door => {
            if (door.isOpen) return;

            // Check if all enemies from the linked trigger are dead
            const triggerIndex = door.triggerIndex;
            if (triggerIndex === undefined) return;

            // Only check if trigger has been activated
            if (!this.levelManager.activatedTriggers.has(triggerIndex)) return;

            // Check if all enemies from THIS trigger are dead
            const allDead = this.levelManager.enemies.getChildren()
                .filter(e => e.triggerIndex === triggerIndex)
                .every(e => !e.active);

            if (allDead) {
                this.openLockDoor(door);
            }
        });
    }

    openLockDoor(door) {
        door.isOpen = true;
        this.audioManager.playSound('sfx-fireball', 0.4);
        this.cameras.main.shake(150, 0.008);

        // Flash green then slide up
        if (door.doorGraphics) {
            // Green flash
            const flash = this.add.rectangle(
                door.doorGraphics.x, door.doorGraphics.y,
                50, 90, 0x00ff44, 0.8
            ).setDepth(door.doorGraphics.depth + 1);

            this.tweens.add({
                targets: flash,
                alpha: 0,
                duration: 300,
                onComplete: () => flash.destroy()
            });

            // Slide door up and fade out
            this.tweens.add({
                targets: door.doorGraphics,
                y: door.doorGraphics.y - 80,
                alpha: 0,
                duration: 600,
                ease: 'Power2',
                onComplete: () => door.doorGraphics.destroy()
            });
        }
        if (door.doorText) {
            this.tweens.add({
                targets: door.doorText,
                y: door.doorText.y - 80,
                alpha: 0,
                duration: 400,
                onComplete: () => door.doorText.destroy()
            });
        }

        // Remove physics body
        door.destroy();
    }

    // ====================================================================
    // Player Zone Checks (Ladders + Crawl Zones)
    // ====================================================================
    updatePlayerZones() {
        if (!this.player || this.player.isDead) return;

        const px = this.player.x;
        const py = this.player.y;
        const pw = 10; // half player width
        const ph = 18; // half player height

        // Check ladder overlap (extra 20px margin at top so player can descend from platforms above)
        let onLadder = false;
        for (const lz of this.ladderZones) {
            if (px + pw > lz.x && px - pw < lz.x + lz.w &&
                py + ph >= lz.y - 20 && py - ph < lz.y + lz.h) {
                onLadder = true;
                this.player.currentLadder = lz;
                break;
            }
        }
        if (!onLadder) {
            this.player.currentLadder = null;
        }
        this.player.nearLadder = onLadder;

        // Check crawl zone overlap
        let inCrawlZone = false;
        for (const cz of this.crawlZones) {
            if (px + pw > cz.x && px - pw < cz.x + cz.w &&
                py + ph > cz.y && py - ph < cz.y + cz.h) {
                inCrawlZone = true;
                break;
            }
        }
        this.player.inCrawlZone = inCrawlZone;

        // Check lock doors
        this.checkLockDoors();
    }

    togglePause(inputMode) {
        if (!this.isPaused && (this.sceneTransition || (this.boss && this.boss.isDefeated))) return;

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            // Freeze physics, tweens, timers, and pause music
            this.physics.world.pause();
            this.tweens.pauseAll();
            this.time.paused = true;
            this.sound.pauseAll();
            // Play pause sound after pauseAll so it doesn't get paused
            this.sound.play('sfx-pause', { volume: 0.4 });

            // Dynamic resume hint based on input mode
            let hintText = 'PRESS ESC TO RESUME';
            if (inputMode === 'gamepad') hintText = 'PRESS START TO RESUME';
            else if (inputMode === 'touch') hintText = 'TAP TO RESUME';

            // Dark overlay + text (fixed to camera)
            this.pauseOverlay = this.add.container(0, 0).setDepth(200).setScrollFactor(0);

            const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
            const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'PAUSED', {
                fontSize: '48px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold',
                stroke: '#003333', strokeThickness: 6
            }).setOrigin(0.5);
            const hint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, hintText, {
                fontSize: '16px', fontFamily: 'monospace', color: '#aaaaaa'
            }).setOrigin(0.5);

            this.pauseOverlay.add([bg, title, hint]);

            // If touch mode, allow tapping the overlay to resume
            if (inputMode === 'touch') {
                bg.setInteractive();
                bg.on('pointerdown', () => this.togglePause('touch'));
            }
        } else {
            // Resume physics, tweens, timers, and music
            this.sound.play('sfx-pause', { volume: 0.4 });
            this.physics.world.resume();
            this.tweens.resumeAll();
            this.time.paused = false;
            this.sound.resumeAll();

            // Remove overlay
            if (this.pauseOverlay) {
                this.pauseOverlay.destroy();
                this.pauseOverlay = null;
            }
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
