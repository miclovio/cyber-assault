# CYBER ASSAULT - Game Specification

## Overview
5-level Contra-style run-and-gun platformer built with Phaser 3.80.1 (CDN), vanilla JS. Sci-fi/industrial theme with parallax scrolling, 8-directional aiming, and phase-based boss fights.

## Tech
- Phaser 3.80.1 via CDN, no build tools
- 29 JS files across `js/data/`, `js/scenes/`, `js/entities/`, `js/systems/`
- Served via local HTTP server (port 8081)

## Core Mechanics

| Feature | Detail |
|---------|--------|
| Movement | WASD / Arrows, crouch with S/Down, climb ladders, crawl through tunnels, directional aim sprites |
| Jump | Space / Z, single jump (double jump via power-up) |
| Fire | X / Left click, 8-directional aiming (diagonal-up at 45°) |
| Health | 3 HP per life, 3 lives |
| Weapons | Pulse Rifle, Spread Shot, Laser, Rapid Fire |
| Power-ups | Weapon drops, Shield, Health, Extra Life, Double Jump |
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

1. **Industrial Base** - Grunts + Heavies + Mechs, Boss: Siege Tank (30 HP), 12000px
2. **Underground Caverns** - Heavies + Ghosts, Boss: Assault Mech (40 HP)
3. **Rocky Ridge** - Eye Demon swarms, Boss: Infernal Skull (35 HP)
4. **Space Station** - All types + Turrets, Boss: Omega Sentinel (50 HP)
5. **Core Breach** - Fortress infiltration with new mechanics, Boss: Core Guardian (60 HP)

### Level 1: Industrial Base

**Theme:** Industrial/military facility exterior with lush green parallax backgrounds. Extended 12000px level with parkour pit sections.

**Layout (8 sections):**
1. Intro (0-2000) — Ground floors with small gaps, basic grunt enemies. DOUBLE_JUMP fixed drop at x:1800
2. Parkour Section 1 (2000-2900) — Floor segments with gaps between them, fire shoots up from each gap (2 fire pits, gentle timing)
3. Mid Combat (2900-5000) — Ground floors, elevated platforms, heavies + grey mech encounter
4. Parkour Section 2 (5000-6100) — Floor segments with tighter gaps, 3 fire pits with faster timing
5. Late Combat (6100-8000) — Ground floors, grey mechs, heavy combat
6. Parkour Section 3 (8000-9300) — Floor segments with 4 fire pit gaps, tight timing
7. Final Push (9300-10100) — Ground floor, heavy enemies + mech
8. Parkour Section 4 (10100-10800) — Pre-boss gauntlet, 3 fire pit gaps
9. Boss Arena (11000-11900) — Siege Tank boss fight

**New Mechanics:**

| Mechanic | Description |
|----------|-------------|
| Fire Pits | Fireballs that launch upward from floor gaps with gravity arc (shoot up, fall back down). Timed cycle with SFX on launch. Player must time jumps between launches. Uses fire-ball animation rotated upward, full color (no additive blend). |
| Double Jump Perk | Earned from enemy drops (12% chance, orange "2J" orb) or fixed drops before parkour sections. Lost on damage (unless shield active). Player starts with single jump only. |
| Pit Death | Falling through any floor gap is instant death. Respawn at last checkpoint. |

### Level 5: Core Breach

**Theme:** Enemy command center interior — dark, claustrophobic, industrial-tech. Uses Scifi Lab backgrounds with red-tinted bulkhead platforms.

**New Mechanics (L5 only):**

| Mechanic | Description |
|----------|-------------|
| Destructible Walls | Shoot to destroy (3-5 HP), blocks paths until cleared. Flash white on hit, tint redder as HP drops. |
| Ladders | Press Up to climb, 140px/s vertical movement. Shoot while climbing. Dismount via jump, sideways, or reaching top/bottom. |
| Crawl Tunnels | Low-ceiling zones that force crouch. 80px/s crawl movement, can shoot while crawling. Cannot stand up until exiting zone. |
| Ceiling Turrets | Flipped turrets mounted on low ceilings, fire downward. Player must crouch/crawl to avoid. |
| Laser Gates | Energy barriers that toggle on/off on a timer (2s cycles). Damages player when active. Uses energy-field animation tinted red. |
| Explosive Barrels | 2-3 HP destructibles that explode when shot, dealing AoE damage (200px radius enemies, 100px radius player). |
| Lock Doors | Barriers that only open after all linked enemies in a section are killed. Creates arena encounters. |

**Layout (8 sections):**
1. Entry Corridor (0-1400) — Easy intro with first destructible wall teaching mechanic
2. First Crawl Tunnel + Ladder (1400-2200) — Teaches crawling and climbing
3. Low Ceiling Combat Zone (2200-3200) — Corridor combat with ceiling turrets + laser gate
4. Vertical Climb Section (3200-4200) — Ladder shafts with flyers and explosive barrels
5. Crawl-and-Shoot Gauntlet (4200-5200) — Extended crawl with alternating laser gates + lock door
6. Combined Assault (5200-6800) — All mechanics mixed, Orange Mech miniboss
7. Final Push (6800-7000) — 2 Blue Mechs behind destructible walls
8. Boss Arena (7000-7900) — Center ladder for vertical dodging

**Boss: Core Guardian** — Floating boss with red energy glow. 3 phases:
- Phase 1 (100-60%): Laser Sweep — 12-bullet sweeping arc, 2000ms rate
- Phase 2 (60-30%): + Lockdown Barrage — 4 ground energy fields + aimed shots, 1500ms rate, speed→45
- Phase 3 (30-0%): + Core Meltdown — descend, 16-bullet ring + floor shockwave, 1000ms rate, speed→60

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
│   │   └── levels.js            # All 5 levels: platforms, triggers, bosses, checkpoints, L5 mechanics
│   ├── scenes/
│   │   ├── BootScene.js         # Loading bar setup
│   │   ├── PreloadScene.js      # Load ALL assets, create animations
│   │   ├── MenuScene.js         # Title screen with parallax
│   │   ├── GameScene.js         # Core gameplay (reused for all 5 levels)
│   │   ├── HUDScene.js          # Overlay: lives, score, health, weapon
│   │   ├── GameOverScene.js     # Game over / continue
│   │   └── VictoryScene.js      # Win screen
│   ├── entities/
│   │   ├── Player.js            # State machine, 8-dir aiming, double jump, climb, crawl
│   │   ├── Bullet.js            # Object-pooled projectile
│   │   ├── EnemyBase.js         # Base enemy class
│   │   ├── Grunt.js             # Patrol + shoot AI
│   │   ├── Flyer.js             # Sine-wave + dive AI
│   │   ├── Heavy.js             # Slow patrol + burst fire
│   │   ├── Ghost.js             # Phases through platforms
│   │   ├── Turret.js            # Static, aims at player (+ ceiling variant)
│   │   └── Boss.js              # Phase-based boss (Tank, Mech, FireSkull, Sentinel, CoreGuardian)
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

- **Single GameScene** reused for all 5 levels, parameterized by level data
- **HUD as parallel scene** communicating via Phaser events
- **Object pooling** for bullets (30 player, 50 enemy)
- **Trigger-based spawning** - enemies spawn as camera reaches trigger X positions
- **Platforms** - separate visual tileSprite + invisible rectangle physics body
- **Death/respawn** - delta-timer state machine in update loop (not delayedCall)
- **Aim-aware animations** - player sprite changes based on aim direction and fire state:
  - Straight up: shoot_3.png (gun) when firing, shoot3nogun.png (no gun) when idle
  - Diagonal up: shoot5.png (gun) when firing, shoot3nogun.png (no gun) when idle
  - Running: separate gun/no-gun animations, diagonal-up run variants
  - Idle holster: after 2s of standing still, switches to no-gun idle animation
  - Bullet spawn offsets adjust per aim direction to match gun muzzle position

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
- [x] All 4 levels defined with platforms, enemies, checkpoints (expanded to 5 in M10)

## Milestone 8: Bug Fixes Applied
- [x] Death/respawn system (delta-timer in update loop, not delayedCall)
- [x] Bullet crash (body.enable instead of body.reset)
- [x] Collision callback argument order (Phaser sprite-vs-group swap)
- [x] Boss arena bounds (position-based clamping)
- [x] Platform positioning (no floaters over gaps, all 4 levels)
- [x] Enemy body cleanup (body.enable = false, not body.reset)

## Milestone 9: Polish - COMPLETE
- [ ] Full playthrough test (all 5 levels start to finish) - needs manual testing
- [x] Difficulty tuning (enemy fire rates, boss HP, attack speed)
- [x] Score balancing (bumped enemy scores for achievable ranks)
- [x] Screen shake and juice effects (hit freeze, death shake, boss attack shakes)
- [x] Edge case testing (boss respawn checkpoint, clearEnemies body disable, dead player checks)
- [x] Browser console error cleanup (boss-defeated event, duplicate textures, null checks)

## Milestone 10: Level 5 — Core Breach - COMPLETE
- [x] Level data: 8-section fortress layout (8000px), 16 enemy triggers, 3 checkpoints
- [x] Scifi Lab background assets loaded, L5 music placeholder (reuses L4)
- [x] Game flow updated: 4→5 levels, HUD level name, music stops, debug skip keys
- [x] **Destructible Walls:** Static bodies that block all, player bullets deal damage, flash/tint feedback, explosion on destroy
- [x] **Ladders:** Procedural steel-gray rung visuals, climbing state (gravity off, 140px/s vertical, climb animation), dismount via jump/sideways/top/bottom
- [x] **Crawl Tunnels:** Zones that force crouch, allow 80px/s crawl movement with crawl animation, block standing up
- [x] **Ceiling Turrets:** Turret.js ceiling variant — flipY sprite, fires downward from mount
- [x] **Laser Gates:** Energy-field animation tinted red, on/off timer toggling, damages player on overlap when active
- [x] **Explosive Barrels:** Procedural hazard barrel visuals, shoot to detonate, 200px AoE enemy damage, 100px player damage
- [x] **Lock Doors:** Red barrier with pulsing LOCKED text, opens when all linked trigger enemies killed, animate-out on open
- [x] **Core Guardian Boss:** Sentinel sprite (placeholder for custom), red energy glow, 3 phases with escalating speed
  - Laser Sweep: 12-bullet sweeping arc
  - Lockdown Barrage: 4 ground energy fields + aimed shots
  - Core Meltdown: descend, 16-bullet ring + floor shockwave
- [x] Collision pairs for all new elements (destructible walls, barrels, laser gates, lock doors)
- [x] Player state reset on die/respawn for climb/crawl states
- [ ] Custom boss sprite (currently reuses sentinel) — user must provide
- [ ] Level 5 music (`Assets/Music/Level 5.ogg`) — user must provide
- [ ] Full L1→L5→Victory playthrough test — needs manual testing
