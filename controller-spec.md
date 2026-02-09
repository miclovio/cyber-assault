# CYBER ASSAULT — Controller (Gamepad) Support Specification

## Overview
Add gamepad/controller support using the browser Gamepad API via Phaser's built-in `input.gamepad` module. Controller input is OR'd into the existing input system alongside keyboard, mouse, and touch — all three work simultaneously.

## Milestone 1: Foundation - DONE
- [x] Add `input: { gamepad: true }` to Phaser config in `main.js` (merge with existing `activePointers: 3`)
- [x] Create `js/systems/GamepadControls.js` — polls connected gamepad each frame, exposes boolean flags
- [x] Add script tag to `index.html`

## Milestone 2: Player Integration - DONE
- [x] Lazy-init gamepad controls reference in `Player.update()` (same pattern as touch controls)
- [x] OR gamepad flags into existing input reading (left, right, up, down, jumpPressed, fire)
- [x] Left stick AND d-pad both work for movement/aiming
- [x] Edge-detect jump button (true for 1 frame per press, supports double jump)

## Milestone 3: Menu & Scene Support - DONE
- [x] MenuScene: A button / Start button triggers start
- [x] GameOverScene: A button triggers continue, B button triggers menu
- [x] VictoryScene: A button triggers menu return

## Button Mapping (Xbox / Standard Gamepad)
```
+-------------------------------------------------------+
|  Movement / Aim          |  Actions                    |
|                          |                             |
|  Left Stick  - Move/Aim  |  A (button 0) - Jump        |
|  D-Pad       - Move/Aim  |  X (button 2) - Fire        |
|                          |  RT (button 7) - Fire (alt)  |
|                          |  Start (button 9) - Confirm  |
|                          |  B (button 1) - Back/Menu    |
+-------------------------------------------------------+
```

### Standard Gamepad Mapping (W3C)
| Input | Index/Axis | Usage |
|-------|-----------|-------|
| Left Stick X | `axes[0]` | Move left/right (deadzone 0.3) |
| Left Stick Y | `axes[1]` | Aim up/down (deadzone 0.3) |
| D-Pad Up | `buttons[12]` | Aim up |
| D-Pad Down | `buttons[13]` | Aim down / Crouch |
| D-Pad Left | `buttons[14]` | Move left |
| D-Pad Right | `buttons[15]` | Move right |
| A | `buttons[0]` | Jump |
| X | `buttons[2]` | Fire |
| RT | `buttons[7]` | Fire (alternative) |
| Start | `buttons[9]` | Confirm / Start |
| B | `buttons[1]` | Back / Menu |

## GamepadControls.js Design (~80 lines)
```
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
        this.jumpPressed = false;  // edge-detected
        this.confirm = false;      // edge-detected (A or Start)
        this.back = false;         // edge-detected (B)
        // Internal
        this._prevJump = false;
        this._prevConfirm = false;
        this._prevBack = false;
    }

    update() {
        // Get first connected gamepad
        // Read axes + buttons
        // Apply deadzone to stick
        // Set directional flags from stick OR d-pad
        // Edge-detect jump, confirm, back
        // Set fire as held (continuous)
    }
}
```

## Files to Change
| File | Change | Description |
|------|--------|-------------|
| `js/systems/GamepadControls.js` | DONE | Gamepad polling system (~85 lines) |
| `js/main.js` | DONE | Add `gamepad: true` to input config |
| `index.html` | DONE | Add script tag |
| `js/entities/Player.js` | DONE | OR gamepad flags into input reading |
| `js/scenes/HUDScene.js` | DONE | Instantiate + update GamepadControls |
| `js/scenes/MenuScene.js` | DONE | Gamepad A/Start to start game |
| `js/scenes/GameOverScene.js` | DONE | Gamepad A to continue, B for menu |
| `js/scenes/VictoryScene.js` | DONE | Gamepad A for menu |

## Key Technical Details
- Phaser's `this.input.gamepad` provides access to connected gamepads
- `gamepad.axes[0/1]` for left stick (-1 to 1), needs deadzone (~0.3)
- `gamepad.buttons[n].pressed` for button state
- Jump/confirm/back are edge-detected (trigger once per press)
- Fire is continuous (held = firing)
- No visual UI needed — controllers are invisible input
- Works simultaneously with keyboard/mouse/touch (all OR'd together)
- Gamepad auto-detected on connection — no setup needed by player

## Verification
1. Connect Xbox/PlayStation/generic USB controller
2. Verify left stick moves player in all 8 directions
3. Verify d-pad also works for movement
4. Verify A button jumps (including double jump on second press)
5. Verify X button and RT fire continuously while held
6. Verify Menu/GameOver/Victory respond to A/Start buttons
7. Verify keyboard + mouse still work simultaneously
8. Verify no issues when no controller is connected
