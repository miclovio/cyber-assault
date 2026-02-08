// ============================================================================
// Touch Controls - Virtual d-pad and action buttons for mobile
// ============================================================================

class TouchControls {
    constructor(scene) {
        this.scene = scene;
        this.enabled = false;

        // State flags (read by Player each frame)
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.fire = false;
        this.jumpPressed = false;

        // Internal edge detection for jump
        this._jumpWasDown = false;

        // Visual elements
        this.elements = [];

        this.checkTouchSupport();
        if (this.enabled) {
            this.createControls();
        }
    }

    checkTouchSupport() {
        this.enabled = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    createControls() {
        // D-pad base (bottom-left)
        this.dpadX = 90;
        this.dpadY = GAME_HEIGHT - 90;
        this.dpadRadius = 70;
        this.dpadDeadZone = 15;

        this.dpadBase = this.scene.add.image(this.dpadX, this.dpadY, 'touch-pad');
        this.dpadBase.setScale(1.2);
        this.dpadBase.setAlpha(0.25);
        this.dpadBase.setTint(0x00ffff);
        this.elements.push(this.dpadBase);

        this.dpadNub = this.scene.add.image(this.dpadX, this.dpadY, 'touch-nub');
        this.dpadNub.setScale(0.8);
        this.dpadNub.setAlpha(0.35);
        this.dpadNub.setTint(0x00ffff);
        this.dpadNub.setVisible(false);
        this.elements.push(this.dpadNub);

        // Fire button (bottom-right)
        this.fireBtnX = GAME_WIDTH - 55;
        this.fireBtnY = GAME_HEIGHT - 55;
        this.btnRadius = 30;

        this.fireBtn = this.scene.add.image(this.fireBtnX, this.fireBtnY, 'touch-btn');
        this.fireBtn.setScale(1.1);
        this.fireBtn.setAlpha(0.25);
        this.fireBtn.setTint(0xff3333);
        this.elements.push(this.fireBtn);

        this.fireBtnLabel = this.scene.add.text(this.fireBtnX, this.fireBtnY, 'FIRE', {
            fontSize: '10px', fontFamily: 'monospace', color: '#ff6666', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.4);
        this.elements.push(this.fireBtnLabel);

        // Jump button (above-left of fire)
        this.jumpBtnX = GAME_WIDTH - 130;
        this.jumpBtnY = GAME_HEIGHT - 80;

        this.jumpBtn = this.scene.add.image(this.jumpBtnX, this.jumpBtnY, 'touch-btn');
        this.jumpBtn.setScale(1.1);
        this.jumpBtn.setAlpha(0.25);
        this.jumpBtn.setTint(0x33ff33);
        this.elements.push(this.jumpBtn);

        this.jumpBtnLabel = this.scene.add.text(this.jumpBtnX, this.jumpBtnY, 'JUMP', {
            fontSize: '10px', fontFamily: 'monospace', color: '#66ff66', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.4);
        this.elements.push(this.jumpBtnLabel);
    }

    update() {
        if (!this.enabled) return;

        // Reset flags
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.fire = false;
        let jumpDown = false;
        let dpadActive = false;

        const pointers = this.scene.input.manager.pointers;

        for (let i = 0; i < pointers.length; i++) {
            const p = pointers[i];
            if (!p.isDown) continue;

            const px = p.x;
            const py = p.y;

            // Check d-pad zone
            const ddx = px - this.dpadX;
            const ddy = py - this.dpadY;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);

            if (dist < this.dpadRadius + 20 && dist > this.dpadDeadZone) {
                dpadActive = true;
                const angle = Math.atan2(-ddy, ddx);
                const deg = angle * 180 / Math.PI;

                if (deg > -22.5 && deg <= 22.5) { this.right = true; }
                else if (deg > 22.5 && deg <= 67.5) { this.right = true; this.up = true; }
                else if (deg > 67.5 && deg <= 112.5) { this.up = true; }
                else if (deg > 112.5 && deg <= 157.5) { this.left = true; this.up = true; }
                else if (deg > 157.5 || deg <= -157.5) { this.left = true; }
                else if (deg > -157.5 && deg <= -112.5) { this.left = true; this.down = true; }
                else if (deg > -112.5 && deg <= -67.5) { this.down = true; }
                else if (deg > -67.5 && deg <= -22.5) { this.right = true; this.down = true; }

                // Move nub indicator
                const clampDist = Math.min(dist, 45);
                this.dpadNub.setPosition(
                    this.dpadX + Math.cos(angle) * clampDist,
                    this.dpadY - Math.sin(angle) * clampDist
                );
                continue;
            }

            // Check fire button
            const fdx = px - this.fireBtnX;
            const fdy = py - this.fireBtnY;
            if (fdx * fdx + fdy * fdy < (this.btnRadius + 20) * (this.btnRadius + 20)) {
                this.fire = true;
                continue;
            }

            // Check jump button
            const jdx = px - this.jumpBtnX;
            const jdy = py - this.jumpBtnY;
            if (jdx * jdx + jdy * jdy < (this.btnRadius + 20) * (this.btnRadius + 20)) {
                jumpDown = true;
            }
        }

        // Edge-detect jump (true for 1 frame per press)
        this.jumpPressed = jumpDown && !this._jumpWasDown;
        this._jumpWasDown = jumpDown;

        // Update visuals
        this.dpadNub.setVisible(dpadActive);
        this.fireBtn.setAlpha(this.fire ? 0.5 : 0.25);
        this.jumpBtn.setAlpha(jumpDown ? 0.5 : 0.25);
    }

    destroy() {
        this.elements.forEach(el => el.destroy());
        this.elements = [];
    }
}
