// ============================================================================
// Gamepad Controls - Controller input polling with edge detection
// ============================================================================

class GamepadControls {
    constructor(scene) {
        this.scene = scene;
        this.enabled = false;

        // Boolean flags (same interface as TouchControls)
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.fire = false;
        this.jumpPressed = false;
        this.confirm = false;
        this.back = false;
        this.startPressed = false;

        // Edge detection (previous frame state)
        this._prevJump = false;
        this._prevConfirm = false;
        this._prevBack = false;
        this._prevStart = false;

        this.DEADZONE = 0.3;
    }

    update() {
        // Reset edge-detected flags
        this.jumpPressed = false;
        this.confirm = false;
        this.back = false;
        this.startPressed = false;

        // Get first connected gamepad
        const pads = this.scene.input.gamepad;
        if (!pads || pads.total === 0) {
            this.enabled = false;
            return;
        }

        const pad = pads.pad1;
        if (!pad) {
            this.enabled = false;
            return;
        }

        this.enabled = true;

        // Left stick (with null safety for Edge browser)
        const axis0 = pad.axes.length > 0 ? pad.axes[0] : null;
        const axis1 = pad.axes.length > 1 ? pad.axes[1] : null;
        const stickX = axis0 ? (typeof axis0.getValue === 'function' ? axis0.getValue() : axis0.value || 0) : 0;
        const stickY = axis1 ? (typeof axis1.getValue === 'function' ? axis1.getValue() : axis1.value || 0) : 0;

        // D-pad buttons (with null safety)
        const dpadUp = pad.buttons.length > 12 && pad.buttons[12] && pad.buttons[12].pressed;
        const dpadDown = pad.buttons.length > 13 && pad.buttons[13] && pad.buttons[13].pressed;
        const dpadLeft = pad.buttons.length > 14 && pad.buttons[14] && pad.buttons[14].pressed;
        const dpadRight = pad.buttons.length > 15 && pad.buttons[15] && pad.buttons[15].pressed;

        // Directional flags (stick with deadzone OR d-pad)
        this.left = stickX < -this.DEADZONE || dpadLeft;
        this.right = stickX > this.DEADZONE || dpadRight;
        this.up = stickY < -this.DEADZONE || dpadUp;
        this.down = stickY > this.DEADZONE || dpadDown;

        // Action buttons (with null safety)
        const btn = (i) => pad.buttons.length > i && pad.buttons[i] && pad.buttons[i].pressed;
        const jumpNow = btn(0);       // A
        const fireX = btn(2);         // X
        const fireRT = btn(7);        // RT
        const confirmNow = jumpNow || btn(9); // A or Start
        const backNow = btn(1);       // B

        // Fire is continuous (held)
        this.fire = fireX || fireRT;

        // Edge-detect jump (true for 1 frame per press)
        this.jumpPressed = jumpNow && !this._prevJump;
        this._prevJump = jumpNow;

        // Edge-detect confirm
        this.confirm = confirmNow && !this._prevConfirm;
        this._prevConfirm = confirmNow;

        // Edge-detect back
        this.back = backNow && !this._prevBack;
        this._prevBack = backNow;

        // Edge-detect Start button (for pause)
        const startNow = btn(9);
        this.startPressed = startNow && !this._prevStart;
        this._prevStart = startNow;
    }
}
