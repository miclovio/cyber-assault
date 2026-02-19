// ============================================================================
// Sentinel - Low-hovering stalker + laser beam
// ============================================================================

class Sentinel extends EnemyBase {
    constructor(scene, x, y, config) {
        const cfg = { ...ENEMY_CONFIG.SENTINEL, ...config };
        super(scene, x, y, 'sentinel-eye1', cfg);

        this.setScale(1.8);
        this.body.setSize(22, 24);
        this.body.setOffset(5, 6);
        this.body.allowGravity = false;

        this.chargeTime = cfg.chargeTime;
        this.beamDuration = cfg.beamDuration;
        this.beamRange = cfg.beamRange;

        // Hover height (lower than flyers which sit at y=160-180)
        this.hoverY = y - 80;
        this.y = this.hoverY;
        this.bobOffset = 0;

        // State: 'follow', 'charge', 'fire', 'cooldown'
        this.state = 'follow';
        this.stateTimer = 0;
        this.beamAngle = 0;

        // Laser beam graphics
        this.telegraphLine = scene.add.graphics();
        this.telegraphLine.setDepth(4);
        this.beamGraphics = scene.add.graphics();
        this.beamGraphics.setDepth(6);

        this.play('sentinel-patrol');
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) {
            this.telegraphLine.clear();
            this.beamGraphics.clear();
            return;
        }

        // Gentle bob
        this.bobOffset += 0.003 * (time - (this._lastTime || time));
        this._lastTime = time;

        switch (this.state) {
            case 'follow':
                this.updateFollow(time);
                break;
            case 'charge':
                this.updateCharge(time);
                break;
            case 'fire':
                this.updateFire(time);
                break;
            case 'cooldown':
                this.updateCooldown(time);
                break;
        }
    }

    updateFollow(time) {
        this.telegraphLine.clear();
        this.beamGraphics.clear();

        const player = this.scene.player;
        if (player && !player.isDead) {
            // Drift toward player horizontally
            const dx = player.x - this.x;
            if (Math.abs(dx) > 20) {
                this.setVelocityX(dx > 0 ? this.speed : -this.speed);
            } else {
                this.setVelocityX(0);
            }
            this.setFlipX(dx < 0);

            // Hover at consistent low height with bob
            const targetY = this.hoverY + Math.sin(this.bobOffset) * 12;
            const dy = targetY - this.y;
            this.setVelocityY(dy * 3);
        } else {
            this.setVelocity(0, 0);
        }

        // Start charging when in range
        if (this.canSeePlayer() && time - this.lastFireTime > this.fireRate) {
            this.state = 'charge';
            this.stateTimer = time;
        }
    }

    updateCharge(time) {
        // Slow down while charging
        this.setVelocityX(this.body.velocity.x * 0.95);
        const bobY = this.hoverY + Math.sin(this.bobOffset) * 12;
        this.setVelocityY((bobY - this.y) * 3);

        const elapsed = time - this.stateTimer;

        // Track player for first half of charge, then lock angle so player can dodge
        if (elapsed < this.chargeTime * 0.5 && this.scene.player) {
            this.beamAngle = Phaser.Math.Angle.Between(
                this.x, this.y, this.scene.player.x, this.scene.player.y
            );
            this.setFlipX(this.scene.player.x < this.x);
        }

        // Draw telegraph line (thin red, pulsing)
        const alpha = 0.3 + 0.4 * Math.sin(elapsed * 0.015);
        this.telegraphLine.clear();
        this.telegraphLine.lineStyle(1, 0xff0000, alpha);
        this.telegraphLine.beginPath();
        this.telegraphLine.moveTo(this.x, this.y);
        this.telegraphLine.lineTo(
            this.x + Math.cos(this.beamAngle) * this.beamRange,
            this.y + Math.sin(this.beamAngle) * this.beamRange
        );
        this.telegraphLine.strokePath();

        this.setTint(0xff6666);

        if (elapsed >= this.chargeTime) {
            this.state = 'fire';
            this.stateTimer = time;
            this.telegraphLine.clear();
            this.scene.audioManager.playSound('sfx-mech-laser', 0.4);
        }
    }

    updateFire(time) {
        // Hold still while firing
        this.setVelocity(0, 0);
        const elapsed = time - this.stateTimer;

        const beamEndX = this.x + Math.cos(this.beamAngle) * this.beamRange;
        const beamEndY = this.y + Math.sin(this.beamAngle) * this.beamRange;

        this.beamGraphics.clear();
        // Glow
        this.beamGraphics.lineStyle(16, 0xff4400, 0.25);
        this.beamGraphics.beginPath();
        this.beamGraphics.moveTo(this.x, this.y);
        this.beamGraphics.lineTo(beamEndX, beamEndY);
        this.beamGraphics.strokePath();
        // Core
        this.beamGraphics.lineStyle(8, 0xff8800, 0.8);
        this.beamGraphics.beginPath();
        this.beamGraphics.moveTo(this.x, this.y);
        this.beamGraphics.lineTo(beamEndX, beamEndY);
        this.beamGraphics.strokePath();
        // Center
        this.beamGraphics.lineStyle(3, 0xffff00, 1);
        this.beamGraphics.beginPath();
        this.beamGraphics.moveTo(this.x, this.y);
        this.beamGraphics.lineTo(beamEndX, beamEndY);
        this.beamGraphics.strokePath();

        this.checkBeamHit(beamEndX, beamEndY);

        if (elapsed >= this.beamDuration) {
            this.state = 'cooldown';
            this.stateTimer = time;
            this.lastFireTime = time;
            this.beamGraphics.clear();
            if (this.baseTint) this.setTint(this.baseTint);
            else this.clearTint();
        }
    }

    updateCooldown(time) {
        this.beamGraphics.clear();
        this.telegraphLine.clear();

        // Drift back into follow
        const bobY = this.hoverY + Math.sin(this.bobOffset) * 12;
        this.setVelocityY((bobY - this.y) * 3);

        if (time - this.stateTimer > 600) {
            this.state = 'follow';
        }
    }

    checkBeamHit(endX, endY) {
        const player = this.scene.player;
        if (!player || player.isDead || player.isInvulnerable) return;

        const pb = player.body;
        const px = pb.x;
        const py = pb.y;
        const pw = pb.width;
        const ph = pb.height;

        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const sx = this.x + (endX - this.x) * t;
            const sy = this.y + (endY - this.y) * t;
            if (sx >= px && sx <= px + pw && sy >= py && sy <= py + ph) {
                player.takeDamage(1);
                return;
            }
        }
    }

    die() {
        this.telegraphLine.clear();
        this.beamGraphics.clear();
        this.telegraphLine.destroy();
        this.beamGraphics.destroy();
        super.die();
    }
}
