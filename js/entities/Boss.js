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
            COREGUARDIAN: 'sentinel-body'  // Reuse sentinel sprite until custom sprite provided
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
                this.body.setSize(130, 112);
                this.body.setOffset(31, 16);
                this.body.allowGravity = false;
                this.setScale(1.5);
                this.hitRadius = 100;
                this.play('sentinel-idle');
                this.startY = this.y;
                // Red energy glow underneath
                this.coreGlow = this.scene.add.sprite(this.x, this.y + 50, 'energy-field0');
                this.coreGlow.play('energy-field');
                this.coreGlow.setTint(0xff2222);
                this.coreGlow.setScale(2);
                this.coreGlow.setDepth(7);
                this.coreGlow.setAlpha(0.6);
                this.attackPatterns = [
                    this.guardianLaserSweep.bind(this),
                    this.guardianLockdown.bind(this),
                    this.guardianMeltdown.bind(this)
                ];
                break;
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
        const cx = this.x;
        const cy = this.y;
        const r = this.hitRadius || 75;
        const rSq = r * r;
        for (let i = 0; i < children.length; i++) {
            const b = children[i];
            if (!b.active) continue;
            const dx = b.x - cx;
            const dy = b.y - cy;
            if (dx * dx + dy * dy < rSq) {
                // Inline deactivation to avoid any method issues
                b.setActive(false);
                b.setVisible(false);
                if (b.body) { b.body.stop(); b.body.enable = false; }
                if (this.scene.effectsManager) {
                    this.scene.effectsManager.playHitEffect(b.x, b.y, b.rotation);
                }
                this.takeDamage(b.damage || 1);
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
                // Chase player slowly
                if (this.scene.player) {
                    const dx = this.scene.player.x - this.x;
                    this.setVelocityX(Math.sign(dx) * this.speed * 0.5);
                    this.setFlipX(dx < 0);
                }
                // Phase speed increase
                if (this.phase === 2) this.speed = 45;
                else if (this.phase === 3) this.speed = 60;
                // Clamp to arena
                if (this.arenaStart && this.x < this.arenaStart + 80) this.x = this.arenaStart + 80;
                if (this.arenaEnd && this.x > this.arenaEnd - 80) this.x = this.arenaEnd - 80;
                // Update core glow
                if (this.coreGlow) {
                    this.coreGlow.setPosition(this.x, this.y + 50);
                }
                break;
            }
        }
    }

    updateVisual() {
        // Phase indicator tint
        if (this.bossType === 'COREGUARDIAN') {
            if (this.phase === 3) this.setTint(0xff2222);
            else if (this.phase === 2) this.setTint(0xff6644);
            else this.setTint(0xcc4444);
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

        // Hide thrust sprite / core glow
        if (this.thrustSprite) this.thrustSprite.setVisible(false);
        if (this.coreGlow) this.coreGlow.setVisible(false);

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

    // === CORE GUARDIAN ATTACKS ===

    guardianLaserSweep() {
        // Rapid stream of 12 bullets in a sweeping arc
        if (!this.scene.player) return;
        const startAngle = this.scene.player.x < this.x ? Math.PI * 0.8 : Math.PI * 0.2;
        const sweepDir = this.scene.player.x < this.x ? -1 : 1;

        this.scene.time.addEvent({
            delay: 100,
            repeat: 11,
            callback: () => {
                if (!this.active) return;
                const i = this._sweepCount || 0;
                this._sweepCount = i + 1;
                const angle = startAngle - sweepDir * i * 0.12;
                this.scene.weaponSystem.fireBossBulletAngle(
                    this.x, this.y + 20,
                    angle, 300, 1
                );
                this.scene.audioManager.playSound('sfx-fireball', 0.25, 2.0);
            }
        });
        this._sweepCount = 0;
    }

    guardianLockdown() {
        // Place 4 energy fields on the ground as damage zones, then fire aimed shots
        if (!this.scene.player) return;

        const arenaCenter = (this.arenaStart + this.arenaEnd) / 2;
        const positions = [
            arenaCenter - 150, arenaCenter - 50,
            arenaCenter + 50, arenaCenter + 150
        ];

        positions.forEach((px, i) => {
            this.scene.time.delayedCall(i * 200, () => {
                if (!this.active) return;
                // Energy field zone on ground
                const field = this.scene.add.sprite(px, 400, 'energy-field0');
                field.play('energy-field');
                field.setTint(0xff2222);
                field.setScale(1.5);
                field.setDepth(3);
                field.setAlpha(0.7);

                // Damage zone
                const zone = this.scene.add.rectangle(px, 400, 40, 40);
                zone.setVisible(false);
                this.scene.physics.add.existing(zone, true);

                // Overlap with player
                this.scene.physics.add.overlap(this.scene.player, zone, () => {
                    if (this.scene.player.isDead || this.scene.player.isInvulnerable) return;
                    this.scene.player.takeDamage(1);
                });

                // Auto-destroy after 3s
                this.scene.time.delayedCall(3000, () => {
                    field.destroy();
                    zone.destroy();
                });
            });
        });

        // Fire aimed shots after placing fields
        this.scene.time.delayedCall(1000, () => {
            if (!this.active) return;
            for (let i = 0; i < 3; i++) {
                this.scene.time.delayedCall(i * 300, () => {
                    if (!this.active || !this.scene.player) return;
                    this.scene.weaponSystem.fireBossBullet(
                        this.x, this.y,
                        this.scene.player.x, this.scene.player.y,
                        350, 1
                    );
                    this.scene.audioManager.playSound('sfx-fireball', 0.3, 2.0);
                });
            }
        });

        this.scene.cameras.main.shake(200, 0.008);
        this.scene.audioManager.playSound('sfx-fireball', 0.4, 2.0);
    }

    guardianMeltdown() {
        // Descend to ground, windup, emit 16-bullet ring + floor shockwave
        if (!this.active) return;

        // Descend
        this.setVelocityY(150);
        this.scene.time.delayedCall(600, () => {
            if (!this.active) return;
            this.setVelocityY(0);
            this.setVelocityX(0);

            // 1s windup: shake + red flash
            this.scene.cameras.main.shake(1000, 0.012);
            this.setTintFill(0xff0000);
            this.scene.time.delayedCall(300, () => {
                if (this.active) this.updateVisual();
            });

            // After windup: emit ring + floor shockwave
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

                // Floor shockwave: bullets along ground in both directions
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

                this.scene.audioManager.playSound('sfx-fireball', 0.5, 2.0);
                this.scene.cameras.main.shake(300, 0.015);

                // Return to float height
                this.scene.time.delayedCall(500, () => {
                    if (this.active) {
                        this.startY = this.y;
                    }
                });
            });
        });
    }

    getAngleToPlayer() {
        if (!this.scene.player) return 0;
        return Phaser.Math.Angle.Between(
            this.x, this.y, this.scene.player.x, this.scene.player.y
        );
    }
}
