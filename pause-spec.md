# Pause Screen Feature

## Context
The game has no way to pause during gameplay. Adding a pause screen with ESC key (keyboard), Start button (gamepad), touch button (mobile), and a pause sound effect.

---

## Milestone 1: Core Pause (Keyboard) ✅ DONE
- [x] Load `sfx-pause` audio from `Assets/Music/pause.mp3` in PreloadScene
- [x] Register `sfx-pause` in AudioManager
- [x] Add `isPaused` flag and ESC key listener in GameScene `create()`
- [x] Add `togglePause()` method in GameScene:
  - Pause: `physics.world.pause()`, play sfx, show overlay
  - Resume: `physics.world.resume()`, play sfx, hide overlay
- [x] Early return in `update()` when paused (skip player/boss/level updates)
- [x] Pause overlay: dark semi-transparent backdrop + "PAUSED" text + "PRESS ESC TO RESUME"
- [x] Overlay uses `setScrollFactor(0)` and high depth
- [x] Prevent pause during scene transitions and boss defeat sequence

## Milestone 2: Gamepad & Touch Support ✅ DONE
- [x] Check gamepad Start button in GameScene `update()` to toggle pause
- [x] Add small pause button (top-right) for touch devices in HUDScene
- [x] Pause button emits event to GameScene to toggle pause
- [x] Dynamic resume text: "PRESS ESC" / "PRESS START" / "TAP TO RESUME" based on input mode

## Milestone 3: Polish ✅ DONE
- [x] Pause all scene tweens and time events while paused
- [x] Verify enemies/bullets/boss all freeze properly (physics.world.pause + tweens.pauseAll + time.paused)
- [x] Test across keyboard, gamepad, and touch inputs

---

## Key Design Decisions
- Pause lives in **GameScene** (it owns physics and game state)
- Uses `physics.world.pause/resume` to freeze all physics bodies
- Overlay uses `setScrollFactor(0)` + high depth so it renders above everything
- Same pause sound plays on both pause and resume
- Disabled during scene transitions and post-boss-defeat celebration
