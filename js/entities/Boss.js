// ============================================================================
// Boss - Phase-based boss fights (Tank, Mech, FireSkull, Sentinel, CoreGuardian)
// ============================================================================

class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, bossType, config) {
        const textureMap = {
            TANK: 'tank1',
            MECH: 'mech1',
            FIRESKULL: 'fireskull1',
            SENTINEL: 'sentinel-body',
            COREGUARDIAN: 'warped-torso1'
        };

        super(scene, x, y, textureMap[bossType] || 'tank1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.bossType = bossType;
        this.config = { ...BOSS_CONFIG[bossType], ...config };
        this.maxHp = this.config.hp;
        this.hp = this.maxHp;
        this.scoreValue = this.config.score;
        this.speed = this.config.speed;
        this.phase = 1;
        this.isDefeated = false;
        this.lastAttackTime = 0;
        this.moveDir = -1;

        this.setScale(2);
        this.setDepth(8);

        // Boss-specific setup
        this.setupBoss();
    }

    setupBoss() {
        switch (this.bossType) {
            case 'TANK':
                this.body.setSize(48, 32);
                this.body.setOffset(8, 16);
                this.setScale(2.5);
                this.hitRadius = 70;
                this.play('tank-move');
                this.attackPatterns = [
                    this.tankShoot.bind(this),
                    this.tankSpread.bind(this),
                    this.tankBarrage.bind(this)
                ];
                break;
            case 'MECH':
                this.body.setSize(40, 50);
                this.body.setOffset(28, 30);
                this.setScale(2);
                this.hitRadius = 60;
                this.play('mech-walk');
                this.attackPatterns = [
                    this.mechShoot.bind(this),
                    this.mechStomp.bind(this),
                    this.mechMissile.bind(this)
                ];
                break;
            case 'FIRESKULL':
                this.body.setSize(48, 48);
                this.body.allowGravity = false;
                this.setScale(2.5);
                this.hitRadius = 75;
                this.play('fireskull-fly');
                this.startY = this.y;
                this.attackPatterns = [
                    this.skullFireball.bind(this),
                    this.skullRing.bind(this),
                    this.skullCharge.bind(this)
                ];
                break;
            case 'SENTINEL':
                this.body.setSize(130, 112);
                this.body.setOffset(31, 16);
                this.body.allowGravity = false;
                this.setScale(1.2);
                this.hitRadius = 90;
                this.play('sentinel-idle');
                this.startY = this.y;
                // Thrust sprite below boss
                this.thrustSprite = this.scene.add.sprite(this.x, this.y + 60, 'sentinel-thrust');
                this.thrustSprite.setScale(1.5);
                this.thrustSprite.setDepth(7);
                this.thrustSprite.play('sentinel-thrust-anim');
                this.attackPatterns = [
                    this.sentinelLaser.bind(this),
                    this.sentinelSpread.bind(this),
                    this.sentinelBarrage.bind(this)
                ];
                break;

            case 'COREGUARDIAN':
                this.body.setSize(50, 55);
                this.body.setOffset(19, 20);
                this.body.allowGravity = false;
                this.setScale(1.2);
                this.hitRadius = 55;
                this.setTexture('warped-torso1');
                this.startY = this.y;

                // Back arm chain: shoulder joint → elbow joint → forearm (behind torso)
                this.armBack1 = this.scene.add.sprite(this.x, this.y, 'warped-arm-back');
                this.armBack1.setScale(1.2);
                this.armBack1.setDepth(6);
                this.armBack2 = this.scene.add.sprite(this.x, this.y, 'warped-arm-back');
                this.armBack2.setScale(1.2);
                this.armBack2.setDepth(6);
                this.forearmBack = this.scene.add.sprite(this.x, this.y, 'warped-forearm-back');
                this.forearmBack.setScale(1.2);
                this.forearmBack.setDepth(6);

                // Lower torso segments (stacked, each behind the one above)
                this.lowerTorso1 = this.scene.add.sprite(this.x, this.y, 'warped-lower1');
                this.lowerTorso1.setScale(1.2);
                this.lowerTorso1.setDepth(7);
                this.lowerTorso2 = this.scene.add.sprite(this.x, this.y, 'warped-lower2');
                this.lowerTorso2.setScale(1.0);
                this.lowerTorso2.setDepth(6);
                this.lowerTorso3 = this.scene.add.sprite(this.x, this.y, 'warped-lower3');
                this.lowerTorso3.setScale(0.8);
                this.lowerTorso3.setDepth(5);

                // Front arm chain: shoulder joint → forearm (in front of torso)
                this.armFront1 = this.scene.add.sprite(this.x, this.y, 'warped-arm');
                this.armFront1.setScale(1.2);
                this.armFront1.setDepth(9);
                this.forearmFront = this.scene.add.sprite(this.x, this.y, 'warped-forearm-front');
                this.forearmFront.setScale(1.2);
                this.forearmFront.setDepth(9);

                this.attackPatterns = [
                    this.guardianLaserSweep.bind(this),
                    this.guardianLockdown.bind(this),
                    this.guardianMeltdown.bind(this)
                ];
                break;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        // Always sync child sprites to torso position
        if (this.bossType === 'COREGUARDIAN') {
            this.updateGuardianArms();
        }
    }

    update(time, delta) {
        // Handle defeat animation countdown
        if (this.isDefeated) {
            if (this.defeatTimer > 0) {
                this.defeatTimer -= delta || 16;
                if (this.defeatTimer <= 0) {
                    this.setActive(false);
                    this.setVisible(false);
                    if (this.thrustSprite) this.thrustSprite.destroy();
                    if (this.coreGlow) this.coreGlow.destroy();
                    if (this.armFront1) this.armFront1.destroy();
                    if (this.armBack1) this.armBack1.destroy();
                    if (this.armBack2) this.armBack2.destroy();
                    if (this.forearmFront) this.forearmFront.destroy();
                    if (this.forearmBack) this.forearmBack.destroy();
                    if (this.lowerTorso1) this.lowerTorso1.destroy();
                    if (this.lowerTorso2) this.lowerTorso2.destroy();
                    if (this.lowerTorso3) this.lowerTorso3.destroy();
                }
            }
            return;
        }
        if (!this.active) return;

        // Update phase based on HP
        const hpPercent = this.hp / this.maxHp;
        if (hpPercent <= 0.30) this.phase = 3;
        else if (hpPercent <= 0.60) this.phase = 2;
        else this.phase = 1;

        // Boss-specific movement (before attack so direction is current)
        this.updateMovement(time);

        // Attack rate increases with phase
        let attackRate;
        if (this.bossType === 'COREGUARDIAN') {
            attackRate = this.phase === 3 ? 1000 : this.phase === 2 ? 1500 : 2000;
        } else {
            attackRate = Math.max(800, 2000 - (this.phase - 1) * 500);
        }

        if (time - this.lastAttackTime > attackRate) {
            this.lastAttackTime = time;
            this.executeAttack();
        }

        // Manual bullet hit detection (physics overlap unreliable for aerial bosses)
        this.checkPlayerBulletHits();

        // Flash on phase transition
        this.updateVisual();
    }

    checkPlayerBulletHits() {
        if (!this.scene || !this.scene.weaponSystem) return;
        const children = this.scene.weaponSystem.playerBullets.getChildren();

        // Build hit zones: main body + child parts for Core Guardian
        const zones = [{ x: this.x, y: this.y, r: this.hitRadius || 75 }];
        if (this.bossType === 'COREGUARDIAN') {
            // Arms and lower torso are all hittable
            const parts = [this.armFront1, this.forearmFront, this.armBack1, this.armBack2, this.forearmBack, this.lowerTorso1, this.lowerTorso2, this.lowerTorso3];
            for (const p of parts) {
                if (p && p.active !== false) zones.push({ x: p.x, y: p.y, r: 25 });
            }
        }

        for (let i = 0; i < children.length; i++) {
            const b = children[i];
            if (!b.active) continue;
            let hit = false;
            for (const z of zones) {
                const dx = b.x - z.x;
                const dy = b.y - z.y;
                if (dx * dx + dy * dy < z.r * z.r) { hit = true; break; }
            }
            if (hit) {
                // Inline deactivation to avoid any method issues
                b.setActive(false);
                b.setVisible(false);
                if (b.body) { b.body.stop(); b.body.enable = false; }
                if (this.scene.effectsManager) {
                    this.scene.effectsManager.playHitEffect(b.x, b.y, b.rotation);
                }
                this.takeDamage(b.damage || 1);
                // Boost player fire rate while landing hits
                if (this.scene.player) {
                    this.scene.player.bossHitTimer = 300;
                }
            }
        }
    }

    updateMovement(time) {
        switch (this.bossType) {
            case 'TANK':
                // Patrol back and forth
                this.setVelocityX(this.speed * this.moveDir);
                if (this.arenaStart && this.x <= this.arenaStart + 40) this.moveDir = 1;
                if (this.arenaEnd && this.x >= this.arenaEnd - 40) this.moveDir = -1;
                if (this.body.blocked.left) this.moveDir = 1;
                if (this.body.blocked.right) this.moveDir = -1;
                // Periodically turn cannon to face player (separate from movement)
                if (!this.cannonDir) this.cannonDir = this.moveDir;
                if (this.scene.player && (!this.lastTurnTime || time - this.lastTurnTime > 3000)) {
                    const playerDir = this.scene.player.x < this.x ? -1 : 1;
                    if (playerDir === this.cannonDir) {
                        this.cannonDir = -playerDir;
                        this.lastTurnTime = time;
                    }
                }
                this.setFlipX(this.cannonDir > 0);
                break;

            case 'MECH':
                // Walk toward player, but keep distance and stay in arena
                if (this.scene.player) {
                    const dist = Math.abs(this.scene.player.x - this.x);
                    if (dist > 120) {
                        this.moveDir = this.scene.player.x < this.x ? -1 : 1;
                        this.setVelocityX(this.speed * this.moveDir);
                    } else {
                        this.setVelocityX(0);
                        this.moveDir = this.scene.player.x < this.x ? -1 : 1;
                    }
                }
                // Clamp to arena
                if (this.arenaStart && this.x < this.arenaStart + 40) this.x = this.arenaStart + 40;
                if (this.arenaEnd && this.x > this.arenaEnd - 40) this.x = this.arenaEnd - 40;
                this.setFlipX(this.moveDir < 0);
                break;

            case 'FIRESKULL': {
                // Float and bob via velocity so physics body stays in sync
                const skullTargetY = this.startY + Math.sin(time * 0.002) * 40;
                this.setVelocityY((skullTargetY - this.y) * 8);
                // Slowly chase player
                if (this.scene.player) {
                    const dx = this.scene.player.x - this.x;
                    this.setVelocityX(Math.sign(dx) * this.speed * 0.5);
                    this.setFlipX(dx < 0);
                }
                // Clamp to arena
                if (this.arenaStart && this.x < this.arenaStart + 40) this.x = this.arenaStart + 40;
                if (this.arenaEnd && this.x > this.arenaEnd - 40) this.x = this.arenaEnd - 40;
                break;
            }

            case 'SENTINEL': {
                // Float and bob via velocity so physics body stays in sync
                const sentTargetY = this.startY + Math.sin(time * 0.0015) * 30;
                this.setVelocityY((sentTargetY - this.y) * 8);
                // Chase player horizontally
                if (this.scene.player) {
                    const dx = this.scene.player.x - this.x;
                    this.setVelocityX(Math.sign(dx) * this.speed * 0.6);
                    this.setFlipX(dx < 0);
                }
                // Clamp to arena
                if (this.arenaStart && this.x < this.arenaStart + 60) this.x = this.arenaStart + 60;
                if (this.arenaEnd && this.x > this.arenaEnd - 60) this.x = this.arenaEnd - 60;
                // Update thrust position
                if (this.thrustSprite) {
                    this.thrustSprite.setPosition(this.x, this.y + 65);
                    this.thrustSprite.setFlipX(this.flipX);
                }
                break;
            }

            case 'COREGUARDIAN': {
                // Float and bob
                const guardTargetY = this.startY + Math.sin(time * 0.0012) * 25;
                this.setVelocityY((guardTargetY - this.y) * 6);
                // Chase player but strafe away if player is directly underneath
                if (this.scene.player) {
                    const dx = this.scene.player.x - this.x;
                    const absDx = Math.abs(dx);
                    if (this.laserSweeping) {
                        // Don't change direction or move horizontally during laser
                        this.setVelocityX(0);
                    } else if (absDx < 60) {
                        // Player is underneath - strafe sideways to get a clear shot
                        const strafeDir = this.x < (this.arenaStart + this.arenaEnd) / 2 ? -1 : 1;
                        this.setVelocityX(strafeDir * this.speed * 1.2);
                        this.setFlipX(dx > 0);
                    } else {
                        this.setVelocityX(Math.sign(dx) * this.speed * 0.5);
                        this.setFlipX(dx > 0);
                    }
                }
                // Phase speed increase
                if (this.phase === 2) this.speed = 45;
                else if (this.phase === 3) this.speed = 60;
                // Clamp to arena
                if (this.arenaStart && this.x < this.arenaStart + 80) this.x = this.arenaStart + 80;
                if (this.arenaEnd && this.x > this.arenaEnd - 80) this.x = this.arenaEnd - 80;

                // Position arm parts relative to torso
                this.updateGuardianArms();
                break;
            }
        }
    }

    updateVisual() {
        // Phase indicator tint
        if (this.bossType === 'COREGUARDIAN') {
            // Torso texture shows damage state
            const torsoKey = this.phase === 3 ? 'warped-torso3' : this.phase === 2 ? 'warped-torso2' : 'warped-torso1';
            this.setTexture(torsoKey);
            this.clearTint();
        } else if (this.phase === 3) {
            this.setTint(0xff4444);
        } else if (this.phase === 2) {
            this.setTint(0xffaa44);
        } else {
            this.clearTint();
        }
    }

    executeAttack() {
        // Don't attack if player is dead
        if (!this.scene.player || this.scene.player.isDead) return;

        const patternIndex = Math.min(this.phase - 1, this.attackPatterns.length - 1);

        // In higher phases, mix in more patterns
        if (this.phase >= 2 && Math.random() < 0.3) {
            const randomIndex = Math.floor(Math.random() * this.attackPatterns.length);
            this.attackPatterns[randomIndex]();
        } else {
            this.attackPatterns[patternIndex]();
        }
    }

    takeDamage(amount) {
        if (this.isDefeated) return;
        this.hp -= amount;
        this.scene.audioManager.playSound('sfx-enemy-hit', 0.15);
        this.setTintFill(0xffffff);
        this.scene.time.delayedCall(80, () => {
            if (this.active) this.updateVisual();
        });

        this.scene.events.emit('boss-hp-changed', this.hp, this.maxHp);

        // Hit freeze on boss hits for impact feel
        this.scene.effectsManager.hitFreeze(30);

        if (this.hp <= 0) {
            this.defeat();
        }
    }

    defeat() {
        if (this.isDefeated) return;
        this.isDefeated = true;
        this.setVelocity(0, 0);
        this.body.allowGravity = false;
        if (this.body) this.body.enable = false;

        // Hide child sprites
        if (this.thrustSprite) this.thrustSprite.setVisible(false);
        if (this.coreGlow) this.coreGlow.setVisible(false);
        if (this.armFront1) this.armFront1.setVisible(false);
        if (this.armBack1) this.armBack1.setVisible(false);
        if (this.armBack2) this.armBack2.setVisible(false);
        if (this.forearmFront) this.forearmFront.setVisible(false);
        if (this.forearmBack) this.forearmBack.setVisible(false);
        if (this.lowerTorso1) this.lowerTorso1.setVisible(false);
        if (this.lowerTorso2) this.lowerTorso2.setVisible(false);
        if (this.lowerTorso3) this.lowerTorso3.setVisible(false);

        // Award score immediately
        if (this.scene.player) {
            this.scene.player.addScore(this.scoreValue);
        }

        this.scene.audioManager.playSound('sfx-boss-defeat');

        // Visual explosions (fire and forget - no callback dependency)
        this.scene.effectsManager.playBossExplosionChain(this.x, this.y, 100, 80);
        this.scene.effectsManager.screenFlash(500);
        this.scene.cameras.main.shake(500, 0.015);

        // Hide boss after brief delay via defeatTimer (managed in update)
        this.defeatTimer = 2000;
    }

    // === TANK ATTACKS ===
    tankShoot() {
        // Fire from cannon (front of tank)
        const dir = this.cannonDir || this.moveDir;
        const cannonX = this.x - 40 * dir;
        this.scene.weaponSystem.fireBossBulletAngle(
            cannonX, this.y, dir < 0 ? 0 : Math.PI, 250, 1
        );
        this.scene.audioManager.playSound('sfx-tank-fire', 0.4, 2.0);
    }

    tankSpread() {
        // Spread from cannon direction
        const dir = this.cannonDir || this.moveDir;
        const baseAngle = dir < 0 ? 0 : Math.PI;
        for (let i = -2; i <= 2; i++) {
            this.scene.weaponSystem.fireBossBulletAngle(
                this.x - 30 * dir, this.y, baseAngle + i * 0.2, 200, 1
            );
        }
        this.scene.audioManager.playSound('sfx-tank-fire', 0.4, 2.0);
    }

    tankBarrage() {
        const dir = this.cannonDir || this.moveDir;
        this.scene.time.addEvent({
            delay: 150,
            repeat: 5,
            callback: () => {
                if (!this.active) return;
                // Fire forward from cannon with slight random spread
                const d = this.cannonDir || this.moveDir;
                const baseAngle = d < 0 ? 0 : Math.PI;
                this.scene.weaponSystem.fireBossBulletAngle(
                    this.x - 30 * d, this.y,
                    baseAngle + (Math.random() - 0.5) * 0.4,
                    280, 1
                );
                this.scene.audioManager.playSound('sfx-tank-fire', 0.3, 2.0);
            }
        });
    }

    // === MECH ATTACKS ===
    mechShoot() {
        // Fire from chest level
        this.scene.weaponSystem.fireBossBullet(
            this.x, this.y - 10,
            this.scene.player.x, this.scene.player.y,
            300, 1, 'bolt'
        );
        this.scene.audioManager.playSound('sfx-mech-laser', 0.4);
    }

    mechStomp() {
        // Ground shockwave - shoot bullets along ground at feet level
        for (let i = 0; i < 4; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                if (!this.active) return;
                this.scene.weaponSystem.fireBossBulletAngle(
                    this.x - 20 - i * 40, this.y + 70, Math.PI, 150, 1, 'bolt'
                );
                this.scene.weaponSystem.fireBossBulletAngle(
                    this.x + 20 + i * 40, this.y + 70, 0, 150, 1, 'bolt'
                );
            });
        }
        this.scene.cameras.main.shake(200, 0.01);
        this.scene.audioManager.playSound('sfx-mech-laser', 0.35);
    }

    mechMissile() {
        // Fire bolts in all directions
        const count = 8;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            this.scene.weaponSystem.fireBossBulletAngle(
                this.x, this.y,
                angle, 200, 1, 'bolt'
            );
        }
        this.scene.audioManager.playSound('sfx-mech-laser', 0.4);
    }

    // === FIRE SKULL ATTACKS ===
    skullFireball() {
        this.scene.weaponSystem.fireBossBullet(
            this.x, this.y,
            this.scene.player.x, this.scene.player.y,
            300, 1
        );
        this.scene.audioManager.playSound('sfx-skull-fire', 0.4, 2.0);
    }

    skullRing() {
        const count = 8 + this.phase * 2;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            this.scene.weaponSystem.fireBossBulletAngle(
                this.x, this.y, angle, 180, 1
            );
        }
        this.scene.cameras.main.shake(150, 0.008);
        this.scene.audioManager.playSound('sfx-skull-fire', 0.4, 2.0);
    }

    skullCharge() {
        // Quick charge toward player
        if (!this.scene.player) return;
        this.scene.audioManager.playSound('sfx-skull-fire', 0.35, 2.0);
        const angle = this.getAngleToPlayer();
        this.setVelocity(
            Math.cos(angle) * 300,
            Math.sin(angle) * 300
        );
        this.scene.time.delayedCall(800, () => {
            if (this.active) {
                this.setVelocity(0, 0);
                this.startY = this.y;
            }
        });
    }

    // === SENTINEL ATTACKS ===
    sentinelLaser() {
        // Rapid-fire laser stream
        let count = 0;
        this.scene.time.addEvent({
            delay: 80,
            repeat: 7,
            callback: () => {
                if (!this.active) return;
                this.scene.weaponSystem.fireBossBullet(
                    this.x, this.y + 30,
                    this.scene.player.x, this.scene.player.y,
                    400, 1
                );
                this.scene.audioManager.playSound('sfx-fireball', 0.4, 2.0);
            }
        });
    }

    sentinelSpread() {
        const count = 12 + this.phase * 4;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            this.scene.weaponSystem.fireBossBulletAngle(
                this.x, this.y, angle, 150, 1
            );
        }
        this.scene.cameras.main.shake(200, 0.01);
        this.scene.audioManager.playSound('sfx-fireball', 0.4, 2.0);
    }

    sentinelBarrage() {
        // Multi-wave barrage
        for (let wave = 0; wave < 3; wave++) {
            this.scene.time.delayedCall(wave * 400, () => {
                if (!this.active) return;
                for (let i = -3; i <= 3; i++) {
                    this.scene.weaponSystem.fireBossBulletAngle(
                        this.x, this.y,
                        Math.PI / 2 + i * 0.15 + wave * 0.1,
                        200, 1
                    );
                }
                this.scene.audioManager.playSound('sfx-fireball', 0.4, 2.0);
            });
        }
    }

    // === CORE GUARDIAN (WARPED BOSS) ATTACKS ===

    getArmTip() {
        // Fire position = eye on the torso
        const eye = this.getEyePosition();
        if (!this.scene.player) return { x: eye.x, y: eye.y, angle: 0 };
        const angle = Phaser.Math.Angle.Between(eye.x, eye.y, this.scene.player.x, this.scene.player.y);
        return { x: eye.x, y: eye.y, angle };
    }

    guardianLaserSweep() {
        // Laser beam from eye: rapid bullet stream with laser visual
        if (!this.scene.player) return;

        // Lock facing direction for entire sweep
        this.laserSweeping = true;

        const eye = this.getEyePosition();
        // Start ~5° from floor, sweep upward
        const facingLeft = this.scene.player.x < this.x;
        const startAngle = facingLeft ? Math.PI + 0.087 : 0.087;
        const sweepDir = facingLeft ? 1 : -1;

        // Laser base - shifted 10px toward facing direction for visor alignment
        const dir = this.flipX ? 1 : -1;
        const burstX = eye.x + 10 * dir;
        const laserBase = this.scene.add.sprite(burstX, eye.y, 'warped-laser-base1');
        laserBase.play('warped-laser-base');
        laserBase.setScale(0.5);
        laserBase.setDepth(8);
        laserBase.setBlendMode(Phaser.BlendModes.ADD);

        // Laser beam - starts at same point as burst so they connect
        const beam = this.scene.add.sprite(burstX, eye.y, 'warped-laser-beam1');
        beam.play('warped-laser-beam');
        beam.setScale(12, 0.3);
        beam.setDepth(12);
        beam.setOrigin(0, 0.5);
        beam.setBlendMode(Phaser.BlendModes.ADD);

        // Track current angle for beam damage check
        let currentAngle = startAngle;

        this.scene.time.addEvent({
            delay: 100,
            repeat: 11,
            callback: () => {
                if (!this.active) return;
                const i = this._sweepCount || 0;
                this._sweepCount = i + 1;
                currentAngle = startAngle - sweepDir * i * 0.131;

                // Update laser visuals to follow eye
                const eyePos = this.getEyePosition();
                const d = this.flipX ? 1 : -1;

                const bx = eyePos.x + 10 * d;
                if (laserBase.active) {
                    laserBase.setPosition(bx, eyePos.y);
                    laserBase.setRotation(currentAngle - Math.PI);
                }
                if (beam.active) {
                    beam.setPosition(bx, eyePos.y);
                    beam.setRotation(currentAngle);
                }

                this.scene.weaponSystem.fireBossBulletAngle(
                    eyePos.x, eyePos.y, currentAngle, 300, 1, 'bolt'
                );
                this.scene.audioManager.playSound('sfx-mech-laser', 0.25);
            }
        });
        this._sweepCount = 0;

        // Beam damage check every frame during sweep
        const beamDamage = this.scene.time.addEvent({
            delay: 50,
            repeat: 29,
            callback: () => {
                if (!this.active || !this.scene.player) return;
                const p = this.scene.player;
                if (p.isDead || p.isInvulnerable) return;
                const eyePos = this.getEyePosition();
                // Check if player is along the beam line
                const dx = p.x - eyePos.x;
                const dy = p.y - eyePos.y;
                const beamDirX = Math.cos(currentAngle);
                const beamDirY = Math.sin(currentAngle);
                // Project player onto beam direction
                const dot = dx * beamDirX + dy * beamDirY;
                if (dot < 0) return; // player is behind the beam
                // Perpendicular distance from beam line
                const perpDist = Math.abs(dx * beamDirY - dy * beamDirX);
                if (perpDist < 25) {
                    p.takeDamage(1);
                }
            }
        });

        // Clean up laser visuals and unlock facing
        this.scene.time.delayedCall(1500, () => {
            if (laserBase) laserBase.destroy();
            if (beam) beam.destroy();
            this.laserSweeping = false;
        });

        this.scene.cameras.main.shake(150, 0.006);
    }

    guardianLockdown() {
        // Place electro-shock hazards on the ground, then fire aimed shots
        if (!this.scene.player) return;

        const arenaCenter = (this.arenaStart + this.arenaEnd) / 2;
        const positions = [
            arenaCenter - 250, arenaCenter - 80,
            arenaCenter + 80, arenaCenter + 250
        ];

        positions.forEach((px, i) => {
            this.scene.time.delayedCall(i * 200, () => {
                if (!this.active) return;
                const field = this.scene.add.sprite(px, 390, 'electro-shock0');
                field.play('electro-shock');
                field.setTint(0xff4444);
                field.setScale(1.2);
                field.setDepth(3);
                field.setAlpha(0.8);

                const zone = this.scene.add.rectangle(px, 390, 50, 50);
                zone.setVisible(false);
                this.scene.physics.add.existing(zone, true);

                this.scene.physics.add.overlap(this.scene.player, zone, () => {
                    if (this.scene.player.isDead || this.scene.player.isInvulnerable) return;
                    this.scene.player.takeDamage(1);
                });

                this.scene.time.delayedCall(3000, () => {
                    field.destroy();
                    zone.destroy();
                });
            });
        });

        // Fire aimed shots from eye
        this.scene.time.delayedCall(1000, () => {
            if (!this.active) return;
            for (let i = 0; i < 3; i++) {
                this.scene.time.delayedCall(i * 300, () => {
                    if (!this.active || !this.scene.player) return;
                    const eye = this.getEyePosition();
                    this.scene.weaponSystem.fireBossBullet(
                        eye.x, eye.y,
                        this.scene.player.x, this.scene.player.y,
                        350, 1, 'bolt'
                    );
                    this.scene.audioManager.playSound('sfx-mech-laser', 0.3);
                });
            }
        });

        this.scene.cameras.main.shake(200, 0.008);
        this.scene.audioManager.playSound('sfx-mech-laser', 0.4);
    }

    guardianMeltdown() {
        // Descend to ground, windup, emit 16-bullet ring + floor shockwave
        if (!this.active) return;

        this.setVelocityY(150);
        this.scene.time.delayedCall(600, () => {
            if (!this.active) return;
            this.setVelocityY(0);
            this.setVelocityX(0);

            this.scene.cameras.main.shake(1000, 0.012);
            this.setTintFill(0xff0000);
            this.scene.time.delayedCall(300, () => {
                if (this.active) this.updateVisual();
            });

            this.scene.time.delayedCall(1000, () => {
                if (!this.active) return;

                // 16-bullet ring
                const count = 16;
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2;
                    this.scene.weaponSystem.fireBossBulletAngle(
                        this.x, this.y, angle, 200, 1
                    );
                }

                // Floor shockwave
                for (let i = 0; i < 6; i++) {
                    this.scene.time.delayedCall(i * 80, () => {
                        if (!this.active) return;
                        this.scene.weaponSystem.fireBossBulletAngle(
                            this.x - 20 - i * 50, 400, Math.PI, 180, 1
                        );
                        this.scene.weaponSystem.fireBossBulletAngle(
                            this.x + 20 + i * 50, 400, 0, 180, 1
                        );
                    });
                }

                this.scene.audioManager.playSound('sfx-mech-laser', 0.5);
                this.scene.cameras.main.shake(300, 0.015);

                this.scene.time.delayedCall(500, () => {
                    if (this.active) this.startY = this.y;
                });
            });
        });
    }

    updateGuardianArms() {
        // dir: -1 when facing left (natural), +1 when facing right (flipped)
        const dir = this.flipX ? 1 : -1;
        const flip = this.flipX;

        // Dark circle is on the BACK of the torso (opposite face direction)
        const shoulderX = this.x - 15 * dir;
        const shoulderY = this.y + 12;

        // Chain goes diagonally down toward the facing direction
        const jx = 12 * dir;
        const jy = 12;

        // Front arm chain: shoulder → joint1 → joint2 → forearm
        if (this.armFront1) {
            this.armFront1.setPosition(shoulderX - 25 * dir, shoulderY);
            this.armFront1.setFlipX(flip);
        }
        if (this.forearmFront) {
            this.forearmFront.setPosition(shoulderX + jx - 15 * dir, shoulderY + jy + 10);
            this.forearmFront.setFlipX(flip);
        }

        // Back arm chain: same shoulder, slightly offset
        const backShift = 20 * dir;
        if (this.armBack1) {
            this.armBack1.setPosition(shoulderX - 4 * dir + backShift, shoulderY - 4);
            this.armBack1.setFlipX(flip);
        }
        if (this.armBack2) {
            this.armBack2.setPosition(shoulderX + jx * 0.8 + backShift, shoulderY + jy - 4);
            this.armBack2.setFlipX(flip);
        }
        if (this.forearmBack) {
            this.forearmBack.setPosition(shoulderX + jx * 1.6 + backShift, shoulderY + jy * 2 - 4);
            this.forearmBack.setFlipX(flip);
        }

        // Lower torso segments stacked below main torso
        if (this.lowerTorso1) {
            this.lowerTorso1.setPosition(this.x - 20 * dir, this.y + 55);
            this.lowerTorso1.setFlipX(flip);
        }
        if (this.lowerTorso2) {
            this.lowerTorso2.setPosition(this.x - 20 * dir, this.y + 80);
            this.lowerTorso2.setFlipX(flip);
        }
        if (this.lowerTorso3) {
            this.lowerTorso3.setPosition(this.x - 20 * dir, this.y + 102);
            this.lowerTorso3.setFlipX(flip);
        }
    }

    getEyePosition() {
        // Sprite naturally faces LEFT, so eye is on LEFT when not flipped
        const dir = this.flipX ? 1 : -1;
        return { x: this.x + 15 * dir, y: this.y - 12 };
    }

    getAngleToPlayer() {
        if (!this.scene.player) return 0;
        return Phaser.Math.Angle.Between(
            this.x, this.y, this.scene.player.x, this.scene.player.y
        );
    }
}
