# CYBER ASSAULT - Game Specification

## Overview
4-level Contra-style run-and-gun platformer built with Phaser 3.80.1 (CDN), vanilla JS. Sci-fi/industrial theme with parallax scrolling, 8-directional aiming, and phase-based boss fights.

## Tech
- Phaser 3.80.1 via CDN, no build tools
- 27 JS files across `js/data/`, `js/scenes/`, `js/entities/`, `js/systems/`
- Served via local HTTP server (port 8081)

## Core Mechanics

| Feature | Detail |
|---------|--------|
| Movement | WASD / Arrows, crouch with S/Down |
| Jump | Space / Z, double jump |
| Fire | X / Left click, 8-directional aiming |
| Health | 3 HP per life, 3 lives |
| Weapons | Pulse Rifle, Spread Shot, Laser, Rapid Fire |
| Power-ups | Weapon drops, Shield, Health, Extra Life |
| Death | Invuln frames (2s blink), respawn at checkpoint, lose weapon upgrade |
| Score | Extra life every 50,000 points |

## Enemies

| Type | Behavior | HP | Score |
|------|----------|-----|-------|
| Grunt | Patrol + shoot | 1 | 100 |
| Flyer | Sine-wave + dive | 2 | 200 |
| Heavy | Slow patrol + burst | 3 | 300 |
| Ghost | Phase through platforms | 2 | 250 |
| Turret | Fixed, aims at player | 5 | 200 |

## Levels (8000px each)

1. **Industrial Base** - Grunts + Flyers, Boss: Siege Tank (30 HP)
2. **Underground Caverns** - Heavies + Ghosts, Boss: Assault Mech (40 HP)
3. **Bio-Organic Lab** - Eye Demon swarms, Boss: Infernal Skull (35 HP)
4. **Space Station** - All types + Turrets, Boss: Omega Sentinel (50 HP)

## Bosses

3 phases each (100-60%, 60-30%, 30-0%) with escalating attack patterns and increasing attack speed.

## Weapons

| Weapon | Fire Rate | Bullets | Spread | Damage | Drop Rate |
|--------|-----------|---------|--------|--------|-----------|
| Pulse Rifle (default) | 300ms | 1 | 0 | 1 | - |
| Spread Shot (S) | 400ms | 5 | 30deg | 1 | 30% |
| Laser (L) | 100ms | 1 | 0 | 2 | 20% |
| Rapid Fire (R) | 100ms | 1 | 5deg | 1 | 25% |

## File Structure

```
D:\Projects\Video Game\
├── index.html
├── spec.md
├── js/
│   ├── main.js                  # Game init + Phaser config
│   ├── data/
│   │   ├── constants.js         # Physics, speeds, damage values
│   │   ├── weapons.js           # Weapon definitions
│   │   └── levels.js            # All 4 levels: platforms, triggers, bosses, checkpoints
│   ├── scenes/
│   │   ├── BootScene.js         # Loading bar setup
│   │   ├── PreloadScene.js      # Load ALL assets, create animations
│   │   ├── MenuScene.js         # Title screen with parallax
│   │   ├── GameScene.js         # Core gameplay (reused for all 4 levels)
│   │   ├── HUDScene.js          # Overlay: lives, score, health, weapon
│   │   ├── GameOverScene.js     # Game over / continue
│   │   └── VictoryScene.js      # Win screen
│   ├── entities/
│   │   ├── Player.js            # State machine, 8-dir aiming, double jump
│   │   ├── Bullet.js            # Object-pooled projectile
│   │   ├── EnemyBase.js         # Base enemy class
│   │   ├── Grunt.js             # Patrol + shoot AI
│   │   ├── Flyer.js             # Sine-wave + dive AI
│   │   ├── Heavy.js             # Slow patrol + burst fire
│   │   ├── Ghost.js             # Phases through platforms
│   │   ├── Turret.js            # Static, aims at player
│   │   └── Boss.js              # Phase-based boss (Tank, Mech, FireSkull, Sentinel)
│   └── systems/
│       ├── ParallaxManager.js   # Multi-layer parallax scrolling
│       ├── WeaponSystem.js      # Firing patterns, bullet pools, 8-dir aim
│       ├── PowerUpSystem.js     # Drops, collection, weapon switching
│       ├── EffectsManager.js    # Explosions, hit FX, death anims
│       ├── CollisionManager.js  # All collision pairs
│       ├── LevelManager.js      # Trigger-based enemy spawning
│       └── AudioManager.js      # Sound effects with pitch variation
└── Assets/                      # Existing (unchanged)
```

## Architecture

- **Single GameScene** reused for all 4 levels, parameterized by level data
- **HUD as parallel scene** communicating via Phaser events
- **Object pooling** for bullets (30 player, 50 enemy)
- **Trigger-based spawning** - enemies spawn as camera reaches trigger X positions
- **Platforms** - separate visual tileSprite + invisible rectangle physics body
- **Death/respawn** - delta-timer state machine in update loop (not delayedCall)

---

# Milestones

## Milestone 1: Foundation - COMPLETE
- [x] Project structure, index.html, Phaser config
- [x] Asset loading (PreloadScene) with all sprites, backgrounds, audio
- [x] Animation definitions for all entities
- [x] Menu screen with parallax backdrop
- [x] Constants, weapon definitions, level data for all 4 levels

## Milestone 2: Player + Movement - COMPLETE
- [x] Player state machine (idle, run, jump, crouch, shoot, die)
- [x] WASD + Arrow key movement
- [x] Space/Z jump with double jump
- [x] X / mouse click firing
- [x] 8-directional aiming
- [x] Camera follow with deadzone

## Milestone 3: Combat System - COMPLETE
- [x] Bullet object pooling (30 player, 50 enemy)
- [x] 4 weapon types with different fire patterns
- [x] Hit effects and explosion animations
- [x] Collision system (bullets vs platforms, enemies, player, boss)

## Milestone 4: Enemies + Spawning - COMPLETE
- [x] 5 enemy types with AI (Grunt, Flyer, Heavy, Ghost, Turret)
- [x] Trigger-based spawning as camera scrolls
- [x] Enemy-to-player bullet firing
- [x] Enemy death effects + score

## Milestone 5: Level 1 Playable - COMPLETE
- [x] Platform layout (ground + elevated, no floaters over pits)
- [x] Parallax backgrounds
- [x] Power-up drops and collection
- [x] HUD (health, lives, score, weapon, boss HP bar)
- [x] Checkpoints and respawn system
- [x] Death/respawn cycle with lives

## Milestone 6: Boss Fights + Progression - COMPLETE
- [x] Boss phase system with escalating attacks
- [x] Tank boss (shoot, spread, barrage)
- [x] Mech boss (shoot, stomp, missile)
- [x] Fire Skull boss (fireball, ring, charge)
- [x] Sentinel boss (laser, spread, barrage)
- [x] Arena camera lock + world bounds
- [x] Boss defeat chain explosions

## Milestone 7: Full Game Loop - COMPLETE
- [x] Level transition (fade out -> next level with carried score/lives/weapon)
- [x] Game Over screen
- [x] Victory screen
- [x] All 4 levels defined with platforms, enemies, checkpoints

## Milestone 8: Bug Fixes Applied
- [x] Death/respawn system (delta-timer in update loop, not delayedCall)
- [x] Bullet crash (body.enable instead of body.reset)
- [x] Collision callback argument order (Phaser sprite-vs-group swap)
- [x] Boss arena bounds (position-based clamping)
- [x] Platform positioning (no floaters over gaps, all 4 levels)
- [x] Enemy body cleanup (body.enable = false, not body.reset)

## Milestone 9: Polish - NOT STARTED
- [ ] Full playthrough test (all 4 levels start to finish)
- [ ] Difficulty tuning (enemy fire rates, boss HP, attack speed)
- [ ] Score balancing
- [ ] Screen shake and juice effects
- [ ] Edge case testing (rapid death, boss phase transitions, level boundaries)
- [ ] Browser console error cleanup
