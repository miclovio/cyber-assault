// ============================================================================
// PowerUp System - Drops, collection, weapon switching
// ============================================================================

class PowerUpSystem {
    constructor(scene) {
        this.scene = scene;
        this.powerUps = scene.physics.add.group();
    }

    spawnDrop(x, y) {
        const roll = Math.random();
        let cumulative = 0;
        let selectedType = null;

        for (const [key, def] of Object.entries(POWERUP_TYPES)) {
            cumulative += def.dropRate;
            if (roll < cumulative) {
                selectedType = key;
                break;
            }
        }

        if (!selectedType) return;
        this.createPowerUp(x, y, selectedType);
    }

    createPowerUp(x, y, type) {
        const def = POWERUP_TYPES[type];

        // Use a simple graphics-based sprite (generate texture once per type)
        const texKey = 'powerup-' + type;
        if (!this.scene.textures.exists(texKey)) {
            const gfx = this.scene.add.graphics();
            gfx.fillStyle(def.color, 0.8);
            gfx.fillCircle(12, 12, 12);
            gfx.generateTexture(texKey, 24, 24);
            gfx.destroy();
        }

        // Snap x to nearest platform if spawning over a gap
        x = this.findSafeX(x, y);

        const powerUp = this.scene.physics.add.sprite(x, y - 10, 'powerup-' + type);
        powerUp.setDepth(5);
        powerUp.body.allowGravity = true;
        powerUp.body.setBounce(0.3);
        powerUp.powerUpType = type;

        // Add label on top
        const label = this.scene.add.text(x, y - 10, def.label, {
            fontSize: '10px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 3,
            shadow: { offsetX: 1, offsetY: 1, color: '#000000', blur: 2, fill: true }
        }).setOrigin(0.5).setDepth(6);
        powerUp.label = label;

        // Keep label position synced
        powerUp.preUpdate = function(time, delta) {
            Phaser.Physics.Arcade.Sprite.prototype.preUpdate.call(this, time, delta);
            if (this.label) {
                this.label.setPosition(this.x, this.y);
            }
        };

        this.powerUps.add(powerUp);

        // Auto-destroy after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            if (powerUp && powerUp.active) {
                this.destroyPowerUp(powerUp);
            }
        });
    }

    findSafeX(x, y) {
        const platforms = this.scene.platforms;
        if (!platforms) return x;

        let bestX = x;
        let bestDist = Infinity;

        platforms.getChildren().forEach(plat => {
            if (!plat.body) return;
            const pLeft = plat.body.x;
            const pRight = plat.body.x + plat.body.width;
            const pTop = plat.body.y;

            // Only consider platforms below or at spawn height
            if (pTop < y - 50) return;

            if (x >= pLeft && x <= pRight) {
                // Already over this platform
                bestX = x;
                bestDist = 0;
            } else if (bestDist > 0) {
                // Find nearest edge
                const distLeft = Math.abs(x - pLeft);
                const distRight = Math.abs(x - pRight);
                const nearest = distLeft < distRight ? pLeft + 20 : pRight - 20;
                const dist = Math.min(distLeft, distRight);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestX = nearest;
                }
            }
        });

        return bestX;
    }

    destroyPowerUp(powerUp) {
        if (powerUp.label) {
            powerUp.label.destroy();
            powerUp.label = null;
        }
        powerUp.destroy();
    }

    collectPowerUp(player, powerUp) {
        const type = powerUp.powerUpType;
        const def = POWERUP_TYPES[type];

        if (def.weapon) {
            player.switchWeapon(def.weapon);
        } else if (type === 'SHIELD') {
            player.shieldHits = 2;
            player.showShieldBubble();
            this.scene.events.emit('player-shield-changed', 2);
        } else if (type === 'HEALTH') {
            player.hp = Math.min(player.hp + 1, PLAYER_CONFIG.MAX_HP);
            this.scene.events.emit('player-hp-changed', player.hp);
        } else if (type === 'LIFE') {
            player.lives++;
            this.scene.events.emit('player-lives-changed', player.lives);
            this.scene.events.emit('extra-life');
            this.scene.audioManager.playSound('sfx-1up');
        } else if (type === 'DOUBLE_JUMP') {
            player.maxJumps = 2;
            player.jumpsLeft = Math.max(player.jumpsLeft, 2);
            this.scene.events.emit('player-doublejump-changed', true);
        }

        this.scene.audioManager.playSound('sfx-pickup');
        this.scene.effectsManager.playHitEffect(powerUp.x, powerUp.y);
        this.destroyPowerUp(powerUp);
    }

    destroy() {
        this.powerUps.getChildren().forEach(p => {
            if (p.label) p.label.destroy();
        });
        this.powerUps.destroy(true);
    }
}
