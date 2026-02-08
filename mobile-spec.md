# CYBER ASSAULT — Mobile Touch Controls Specification

## Milestone 1: Foundation - DONE
- [x] Add `touch-action: none` to canvas CSS and `user-scalable=no` to viewport meta
- [x] Add `input: { activePointers: 3 }` to Phaser config in `main.js`
- [x] Create `js/systems/TouchControls.js` with touch detection (`'ontouchstart' in window`)
- [x] Add script tag to `index.html`
- [x] Instantiate in `HUDScene.create()`, add `HUDScene.update()` to poll each frame
- [x] Load Style C assets in PreloadScene (joystick_circle_pad_a, joystick_circle_nub_a, button_circle)

## Milestone 2: D-Pad (Movement & Aiming) - DONE
- [x] Draw semi-transparent d-pad using Style C `joystick_circle_pad_a.png` at bottom-left (center: 90, 360)
- [x] Cyan tinted, alpha 0.25
- [x] Implement zone-based 8-way direction detection using angle-from-center math (45-degree sectors)
- [x] Add thumb nub (`joystick_circle_nub_a.png`) that follows touch position within the d-pad
- [x] Set boolean flags: `left`, `right`, `up`, `down`

## Milestone 3: Action Buttons (Jump & Fire) - DONE
- [x] Draw Fire button using Style C `button_circle.png` at bottom-right (center: 745, 395) — red tint
- [x] Draw Jump button above-left of fire (center: 670, 370) — green tint
- [x] Fire button: continuous hold = continuous fire
- [x] Jump button: edge-detected tap (true for 1 frame per press, supports double jump)
- [x] Multi-touch support: move + fire + jump simultaneously via pointer iteration
- [x] Visual feedback: buttons brighten when pressed (alpha 0.25 -> 0.5)

## Milestone 4: Player Integration - DONE
- [x] Lazy-init touch controls reference in `Player.update()` from HUDScene
- [x] OR touch flags into existing input reading (left, right, up, down, jumpPressed, fire)
- [x] Disable `mousePointer.isDown` for fire when touch is enabled (prevents any-touch-fires)

## Milestone 5: Menu & Scene Support - DONE
- [x] MenuScene: Add tap-to-start, show "TAP TO START" text on touch devices
- [x] MenuScene: Show touch control descriptions instead of keyboard ones
- [x] GameOverScene: Add tap-to-continue
- [x] VictoryScene: Add tap-for-menu

## Visual Layout (800x450 logical resolution)
```
+--------------------------------------------------+
|  SCORE/HP/LIVES                        WEAPON     |
|                                                    |
|                  GAMEPLAY AREA                     |
|                                                    |
|   [  D-PAD  ]                     [JUMP]  [FIRE]  |
|   90,360                          670,370  745,395 |
+--------------------------------------------------+
```

## Assets Used (Style C/Default)
| Asset | Key | Usage |
|-------|-----|-------|
| `joystick_circle_pad_a.png` | `touch-pad` | D-pad base circle |
| `joystick_circle_nub_a.png` | `touch-nub` | D-pad thumb indicator |
| `button_circle.png` | `touch-btn` | Jump and Fire buttons |

## Key Technical Details
- Touch controls only appear on touch-capable devices
- All controls semi-transparent (alpha 0.25) with cyan/red/green tints
- D-pad uses angle math with 45-degree sectors for 8-way input
- Phaser's Scale.FIT auto-transforms pointer coords to logical 800x450 space
- Controls live in HUDScene (fixed screen position, no camera scroll)
- `input.activePointers: 3` enables simultaneous d-pad + fire + jump
- Buttons brighten on press for visual feedback

## Files
| File | Status | Description |
|------|--------|-------------|
| `js/systems/TouchControls.js` | DONE | Touch control system with d-pad + buttons (~160 lines) |
| `js/scenes/PreloadScene.js` | DONE | Load Style C touch control sprites |
| `index.html` | DONE | Script tag, CSS touch-action, viewport |
| `js/main.js` | DONE | activePointers config |
| `js/scenes/HUDScene.js` | DONE | Instantiate + update TouchControls |
| `js/entities/Player.js` | DONE | OR touch flags into input reading |
| `js/scenes/MenuScene.js` | DONE | Tap-to-start, touch text |
| `js/scenes/GameOverScene.js` | DONE | Tap-to-continue |
| `js/scenes/VictoryScene.js` | DONE | Tap-for-menu |
