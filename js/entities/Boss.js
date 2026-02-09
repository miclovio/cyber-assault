// ============================================================================
// Boss - Phase-based boss fights (Tank, Mech, FireSkull, Sentinel)
// ============================================================================

class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, bossType, config) {
        const textureMap = {
            TANK: 'tank1',
            MECH: 'mech1',
            FIRESKULL: 'fireskull1',
            SENTINEL: 'sentinel-body'
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

        // Attack rate increases with phase
        const attackRate = Math.max(800, 2000 - (this.phase - 1) * 500);

        if (time - this.lastAttackTime > attackRate) {
            this.lastAttackTime = time;
            this.executeAttack();
        }

        // Boss-specific movement
        this.updateMovement(time);

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
                this.setVelocityX(this.speed * this.moveDir);
                // Reverse at arena edges
                if (this.arenaStart && this.x <= this.arenaStart + 40) this.moveDir = 1;
                if (this.arenaEnd && this.x >= this.arenaEnd - 40) this.moveDir = -1;
                if (this.body.blocked.left) this.moveDir = 1;
                if (this.body.blocked.right) this.moveDir = -1;
                this.setFlipX(this.moveDir > 0);
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
        }
    }

    updateVisual() {
        // Phase indicator tint
        if (this.phase === 3) {
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

        // Hide thrust sprite
        if (this.thrustSprite) this.thrustSprite.setVisible(false);

        // Award score immediately
        if (this.scene.player) {
            this.scene.player.addScore(this.scoreValue);
        }

        // Visual explosions (fire and forget - no callback dependency)
        this.scene.effectsManager.playBossExplosionChain(this.x, this.y, 100, 80);
        this.scene.effectsManager.screenFlash(500);
        this.scene.cameras.main.shake(500, 0.015);

        // Hide boss after brief delay via defeatTimer (managed in update)
        this.defeatTimer = 2000;
    }

    // === TANK ATTACKS ===
    tankShoot() {
        this.scene.weaponSystem.fireBossBullet(
            this.x - 30 * this.moveDir, this.y,
            this.scene.player.x, this.scene.player.y,
            250, 1
        );
    }

    tankSpread() {
        for (let i = -2; i <= 2; i++) {
            const angle = this.getAngleToPlayer() + i * 0.2;
            this.scene.weaponSystem.fireBossBulletAngle(
                this.x, this.y, angle, 200, 1
            );
        }
    }

    tankBarrage() {
        let count = 0;
        this.scene.time.addEvent({
            delay: 150,
            repeat: 5,
            callback: () => {
                if (!this.active) return;
                this.scene.weaponSystem.fireBossBullet(
                    this.x, this.y,
                    this.scene.player.x + (Math.random() - 0.5) * 100,
                    this.scene.player.y,
                    280, 1
                );
            }
        });
    }

    // === MECH ATTACKS ===
    mechShoot() {
        // Fire from chest level
        this.scene.weaponSystem.fireBossBullet(
            this.x, this.y - 10,
            this.scene.player.x, this.scene.player.y,
            300, 1
        );
    }

    mechStomp() {
        // Ground shockwave - shoot bullets along ground at feet level
        for (let i = 0; i < 4; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                if (!this.active) return;
                this.scene.weaponSystem.fireBossBulletAngle(
                    this.x - 20 - i * 40, this.y + 70, Math.PI, 150, 1
                );
                this.scene.weaponSystem.fireBossBulletAngle(
                    this.x + 20 + i * 40, this.y + 70, 0, 150, 1
                );
            });
        }
        this.scene.cameras.main.shake(200, 0.01);
    }

    mechMissile() {
        // Arc shots upward from shoulders
        for (let i = -1; i <= 1; i++) {
            this.scene.weaponSystem.fireBossBulletAngle(
                this.x, this.y,
                -Math.PI / 2 + i * 0.4,
                200, 1
            );
        }
    }

    // === FIRE SKULL ATTACKS ===
    skullFireball() {
        this.scene.weaponSystem.fireBossBullet(
            this.x, this.y,
            this.scene.player.x, this.scene.player.y,
            300, 1
        );
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
    }

    skullCharge() {
        // Quick charge toward player
        if (!this.scene.player) return;
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
            });
        }
    }

    getAngleToPlayer() {
        if (!this.scene.player) return 0;
        return Phaser.Math.Angle.Between(
            this.x, this.y, this.scene.player.x, this.scene.player.y
        );
    }
}
