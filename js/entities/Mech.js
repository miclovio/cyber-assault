// ============================================================================
// Mech - Grey Mech miniboss: charger + phase shift
// ============================================================================

class Mech extends EnemyBase {
    constructor(scene, x, y, config) {
        const cfg = { ...ENEMY_CONFIG.GREY_MECH, ...config };
        super(scene, x, y, 'grey-mech-idle', cfg);

        this.setScale(1.8);
        this.body.setSize(28, 36);
        this.body.setOffset(26, 8);

        this.patrolDir = config && config.patrolDir || 1;
        this.patrolRange = config && config.patrolRange || 200;
        this.startX = x;
        this.maxHp = this.hp;

        // States: 'patrol', 'follow', 'windup', 'charge', 'recover'
        this.state = 'patrol';
        this.enraged = false;
        this.aggro = false;
        this.chargeSpeed = 280;
        this.chargeCooldown = 3000;
        this.lastChargeTime = 0;
        this.windupTimer = 0;
        this.recoverTimer = 0;

        this.play('grey-mech-walk');
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) return;

        // Phase shift: transform when below half HP
        if (!this.enraged && this.hp <= this.maxHp / 2) {
            this.enrage();
        }

        // Aggro when player is spotted
        if (!this.aggro && this.canSeePlayer()) {
            this.aggro = true;
            this.state = 'follow';
        }

        switch (this.state) {
            case 'patrol':
                this.updatePatrol(time);
                break;
            case 'follow':
                this.updateFollow(time);
                break;
            case 'windup':
                this.updateWindup(time);
                break;
            case 'charge':
                this.updateCharge(time);
                break;
            case 'recover':
                this.updateRecover(time);
                break;
        }
    }

    updatePatrol(time) {
        this.setVelocityX(this.speed * this.patrolDir);
        this.setFlipX(this.patrolDir < 0);

        if (this.x > this.startX + this.patrolRange) this.patrolDir = -1;
        else if (this.x < this.startX - this.patrolRange) this.patrolDir = 1;

        if (this.body.blocked.left) this.patrolDir = 1;
        if (this.body.blocked.right) this.patrolDir = -1;
        if (this.isNearEdge()) this.patrolDir *= -1;
    }

    updateFollow(time) {
        if (!this.scene.player || this.scene.player.isDead) return;

        // Walk toward player
        const dx = this.scene.player.x - this.x;
        this.patrolDir = dx > 0 ? 1 : -1;
        this.setFlipX(this.patrolDir < 0);

        // Don't walk off edges
        if (this.isNearEdge()) {
            this.setVelocityX(0);
        } else {
            const spd = this.enraged ? this.speed * 1.5 : this.speed;
            this.setVelocityX(spd * this.patrolDir);
        }

        // Start charge when close enough and cooldown elapsed
        const cooldown = this.enraged ? this.chargeCooldown * 0.6 : this.chargeCooldown;
        if (Math.abs(dx) < 500 && time - this.lastChargeTime > cooldown) {
            this.startWindup(time);
        }
    }

    startWindup(time) {
        this.state = 'windup';
        this.setVelocityX(0);
        this.windupTimer = this.enraged ? 350 : 500;

        // Face player
        if (this.scene.player) {
            this.chargeDir = this.scene.player.x > this.x ? 1 : -1;
            this.setFlipX(this.chargeDir < 0);
        }

        // Visual cue: flash tint
        this.setTint(this.enraged ? 0xff4444 : 0xffff44);
    }

    updateWindup(time) {
        this.windupTimer -= 16;
        if (this.windupTimer <= 0) {
            this.startCharge(time);
        }
    }

    startCharge(time) {
        this.state = 'charge';
        this.lastChargeTime = time;
        this.chargeStartX = this.x;
        this.clearTint();
        if (this.enraged) this.setTint(0xff6666);

        const spd = this.enraged ? this.chargeSpeed * 1.4 : this.chargeSpeed;
        this.setVelocityX(spd * this.chargeDir);

        this.scene.cameras.main.shake(80, 0.005);
    }

    updateCharge(time) {
        // Fire bullets while charging in enraged mode
        if (this.enraged && time - this.lastFireTime > 300) {
            this.lastFireTime = time;
            if (this.scene.player) {
                this.scene.weaponSystem.fireEnemyBullet(
                    this.x, this.y,
                    this.scene.player.x, this.scene.player.y,
                    200, 1
                );
            }
        }

        // Stop charge at walls, edges, or after traveling far enough
        const distFromChargeStart = Math.abs(this.x - this.chargeStartX);
        if (this.body.blocked.left || this.body.blocked.right ||
            this.isNearEdge() || distFromChargeStart > 400) {
            this.startRecover();
        }
    }

    startRecover() {
        this.state = 'recover';
        this.setVelocityX(0);
        this.recoverTimer = this.enraged ? 400 : 700;
    }

    updateRecover() {
        this.recoverTimer -= 16;
        if (this.recoverTimer <= 0) {
            // Return to following player
            this.state = this.aggro ? 'follow' : 'patrol';
        }
    }

    enrage() {
        this.enraged = true;
        this.play('grey-mech-attack');
        this.setTint(0xff6666);
        this.scene.cameras.main.shake(150, 0.008);
    }

    takeDamage(amount) {
        // Getting hit also aggros the mech
        if (!this.aggro) {
            this.aggro = true;
            this.state = 'follow';
        }
        super.takeDamage(amount);
        if (this.enraged && this.active) {
            this.scene.time.delayedCall(100, () => {
                if (this.active && this.enraged) this.setTint(0xff6666);
            });
        }
    }

    die() {
        this.scene.cameras.main.shake(200, 0.01);
        super.die();
    }
}
