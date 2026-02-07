// ============================================================================
// Player - State machine, 8-dir aiming, animations
// ============================================================================

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'idle-gun1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.body.setSize(20, 36);
        this.body.setOffset(6, 4);
        this.setCollideWorldBounds(false);
        this.setDepth(10);

        // State
        this.hp = PLAYER_CONFIG.MAX_HP;
        this.lives = PLAYER_CONFIG.MAX_LIVES;
        this.score = 0;
        this.currentWeapon = 'PULSE';
        this.hasShield = false;
        this.isInvulnerable = false;
        this.invulnTimer = 0;
        this.isDead = false;
        this.isCrouching = false;
        this.facingRight = true;
        this.lastFireTime = 0;

        // Double jump
        this.jumpsLeft = 2;
        this.maxJumps = 2;

        // Death timer (driven by update loop, not delayed calls)
        this.deathTimer = 0;
        this.deathPhase = 0; // 0=alive, 1=dying, 2=waiting to respawn

        // Aim direction
        this.aimX = 1;
        this.aimY = 0;

        // State machine
        this.state = 'idle';

        // Input - WASD + arrow keys, Space/Z=jump, X/Click=fire
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.jumpKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.jumpKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.fireKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.mousePointer = scene.input.activePointer;

        // Checkpoint tracking
        this.lastCheckpointX = x;
        this.lastCheckpointY = y;
    }

    update(time, delta) {
        // Handle death sequence via update loop (reliable, no delayed calls)
        if (this.isDead) {
            this.updateDeathSequence(time, delta);
            return;
        }

        // Handle invulnerability timer
        if (this.isInvulnerable) {
            this.invulnTimer -= delta;
            if (this.invulnTimer <= 0) {
                this.isInvulnerable = false;
                this.setAlpha(1);
            } else {
                this.setAlpha(Math.floor(time / PLAYER_CONFIG.BLINK_RATE) % 2 === 0 ? 0.3 : 1);
            }
        }

        const onGround = this.body.blocked.down || this.body.touching.down;
        const left = this.cursors.left.isDown || this.keyA.isDown;
        const right = this.cursors.right.isDown || this.keyD.isDown;
        const up = this.cursors.up.isDown || this.keyW.isDown;
        const down = this.cursors.down.isDown || this.keyS.isDown;
        const jumpPressed = Phaser.Input.Keyboard.JustDown(this.jumpKey) || Phaser.Input.Keyboard.JustDown(this.jumpKey2);
        const fire = this.fireKey.isDown || this.mousePointer.isDown;

        // Reset jumps when on ground
        if (onGround) {
            this.jumpsLeft = this.maxJumps;
        }

        // Update aim direction
        this.updateAim(left, right, up, down, onGround);

        // Movement
        if (left) {
            this.setVelocityX(this.isCrouching ? -PHYSICS.PLAYER_CROUCH_SPEED : -PHYSICS.PLAYER_SPEED);
            this.facingRight = false;
        } else if (right) {
            this.setVelocityX(this.isCrouching ? PHYSICS.PLAYER_CROUCH_SPEED : PHYSICS.PLAYER_SPEED);
            this.facingRight = true;
        } else {
            this.setVelocityX(0);
        }

        this.setFlipX(!this.facingRight);

        // Crouch
        if (down && onGround && !left && !right) {
            this.isCrouching = true;
            this.body.setSize(20, 24);
            this.body.setOffset(6, 16);
        } else if (this.isCrouching && !down) {
            this.isCrouching = false;
            this.body.setSize(20, 36);
            this.body.setOffset(6, 4);
        }

        // Jump (double jump supported)
        if (jumpPressed && this.jumpsLeft > 0) {
            this.setVelocityY(PHYSICS.PLAYER_JUMP);
            this.jumpsLeft--;
            this.isCrouching = false;
            this.body.setSize(20, 36);
            this.body.setOffset(6, 4);
            this.scene.audioManager.playSound('sfx-jump');
        }

        // Cap fall speed
        if (this.body.velocity.y > PHYSICS.MAX_FALL_SPEED) {
            this.setVelocityY(PHYSICS.MAX_FALL_SPEED);
        }

        // Shooting
        if (fire) {
            this.shoot(time);
        }

        // Update animation state
        this.updateAnimationState(onGround, fire, left || right);

        // Fall death
        if (this.y > GAME_HEIGHT + 100) {
            this.die();
        }
    }

    updateDeathSequence(time, delta) {
        this.deathTimer -= delta;

        if (this.deathPhase === 1) {
            // Phase 1: death animation playing, wait 1.5s
            if (this.deathTimer <= 0) {
                this.deathPhase = 2;
                this.setVisible(false);
                this.setVelocity(0, 0);
                this.body.allowGravity = false;

                // Decrement lives
                this.lives--;
                this.scene.events.emit('player-lives-changed', this.lives);

                if (this.lives <= 0) {
                    this.deathPhase = 3; // game over phase
                    this.scene.events.emit('player-game-over');
                } else {
                    this.deathTimer = 500; // brief pause before respawn
                }
            }
        } else if (this.deathPhase === 2) {
            // Phase 2: brief pause, then respawn
            if (this.deathTimer <= 0) {
                this.respawn();
            }
        }
        // Phase 3: game over, do nothing (scene will handle it)
    }

    updateAim(left, right, up, down, onGround) {
        this.aimX = this.facingRight ? 1 : -1;
        this.aimY = 0;

        if (up) {
            if (left) { this.aimX = -0.707; this.aimY = -0.707; }
            else if (right) { this.aimX = 0.707; this.aimY = -0.707; }
            else { this.aimX = 0; this.aimY = -1; }
        } else if (down && !onGround) {
            if (left) { this.aimX = -0.707; this.aimY = 0.707; }
            else if (right) { this.aimX = 0.707; this.aimY = 0.707; }
            else { this.aimX = 0; this.aimY = 1; }
        }
    }

    updateAnimationState(onGround, firing, moving) {
        let newState;

        if (!onGround) {
            newState = 'jump';
        } else if (this.isCrouching) {
            newState = firing ? 'crouch-shoot' : 'crouch';
        } else if (firing && !moving) {
            newState = 'shoot';
        } else if (moving) {
            newState = 'run';
        } else {
            newState = 'idle';
        }

        if (newState !== this.state) {
            this.state = newState;
            this.playAnimation();
        }
    }

    playAnimation() {
        switch (this.state) {
            case 'idle': this.play('player-idle-gun', true); break;
            case 'run': this.play('player-run-gun', true); break;
            case 'jump': this.play('player-jump-gun', true); break;
            case 'crouch': this.play('player-crouch-gun', true); break;
            case 'crouch-shoot': this.play('player-crouch-shoot', true); break;
            case 'shoot': this.play('player-shoot', true); break;
            case 'die': this.play('player-die', true); break;
        }
    }

    shoot(time) {
        const weapon = WEAPONS[this.currentWeapon];
        if (time - this.lastFireTime < weapon.fireRate) return;
        this.lastFireTime = time;

        this.scene.weaponSystem.fire(this, weapon);
        this.scene.audioManager.playSound('sfx-laser', 0.3);
    }

    takeDamage(amount) {
        if (this.isInvulnerable || this.isDead) return;

        if (this.hasShield) {
            this.hasShield = false;
            this.startInvulnerability();
            this.scene.events.emit('player-shield-break');
            return;
        }

        this.hp -= amount;
        this.scene.events.emit('player-hp-changed', this.hp);
        this.scene.cameras.main.shake(100, 0.01);

        if (this.hp <= 0) {
            this.die();
        } else {
            this.startInvulnerability();
        }
    }

    startInvulnerability() {
        this.isInvulnerable = true;
        this.invulnTimer = PLAYER_CONFIG.INVULN_DURATION;
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.isInvulnerable = true;
        this.state = 'die';
        this.play('player-die');

        // Screen shake + flash on death
        this.scene.cameras.main.shake(300, 0.015);
        this.scene.effectsManager.screenFlash(200);

        // Lose weapon upgrade
        this.currentWeapon = 'PULSE';

        // Pop up
        this.setVelocityX(0);
        this.setVelocityY(-250);

        // Start death timer (managed in update loop)
        this.deathPhase = 1;
        this.deathTimer = 1500;
    }

    respawn() {
        // Move to checkpoint
        this.setPosition(this.lastCheckpointX, this.lastCheckpointY);
        if (this.body) {
            this.body.reset(this.lastCheckpointX, this.lastCheckpointY);
            this.body.allowGravity = true;
            this.body.enable = true;
            this.body.setSize(20, 36);
            this.body.setOffset(6, 4);
        }

        // Reset state
        this.isDead = false;
        this.deathPhase = 0;
        this.deathTimer = 0;
        this.hp = PLAYER_CONFIG.MAX_HP;
        this.isCrouching = false;
        this.jumpsLeft = this.maxJumps;
        this.setActive(true);
        this.setVisible(true);
        this.setAlpha(1);
        this.setVelocity(0, 0);
        this.state = 'idle';
        this.play('player-idle-gun');
        this.startInvulnerability();

        // Snap camera back
        const cam = this.scene.cameras.main;
        cam.stopFollow();
        cam.startFollow(this, true, 0.08, 0.08);
        cam.setDeadzone(100, 50);

        // Update HUD
        this.scene.events.emit('player-hp-changed', this.hp);
        this.scene.events.emit('player-weapon-changed', this.currentWeapon);
    }

    addScore(points) {
        const oldScore = this.score;
        this.score += points;
        this.scene.events.emit('player-score-changed', this.score);

        if (Math.floor(this.score / EXTRA_LIFE_THRESHOLD) > Math.floor(oldScore / EXTRA_LIFE_THRESHOLD)) {
            this.lives++;
            this.scene.events.emit('player-lives-changed', this.lives);
            this.scene.events.emit('extra-life');
        }
    }

    setCheckpoint(x, y) {
        this.lastCheckpointX = x;
        this.lastCheckpointY = y;
    }

    switchWeapon(weaponKey) {
        this.currentWeapon = weaponKey;
        this.scene.events.emit('player-weapon-changed', this.currentWeapon);
    }
}
