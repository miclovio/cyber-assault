# CYBER ASSAULT

A retro-style 2D side-scrolling action platformer built with Phaser 3. Run, jump, shoot, and blast your way through 5 levels of enemies, hazards, and epic boss fights.

This is a personal project I built to learn game development. Level 5 is still a work in progress!

[Play it here](https://cyber-assault.vercel.app)

![Title Screen](Assets/Screenshots/screenshot%20Intro.JPG)
![Gameplay](Assets/Screenshots/screenshot%20action.JPG)
![Boss Fight](Assets/Screenshots/screenshot%20Boss.JPG)

## Overview

You play as a space marine fighting through increasingly dangerous environments — from industrial bases to underground caverns to deep space. Each level ends with a unique boss encounter. Collect weapons, power-ups, and fight through waves of enemies to reach the end.

## Levels

| Level | Name | Setting | Boss |
|-------|------|---------|------|
| 1 | Industrial Base | Green industrial facility | Siege Tank |
| 2 | Underground Caverns | Purple cavern network | Assault Mech |
| 3 | Rocky Ridge | Lava pit with rocky outcrops | Infernal Skull |
| 4 | Space Station | Deep space with asteroids | Omega Sentinel |
| 5 | Core Breach (WIP) | Red fortress infiltration | Core Guardian |

## Weapons

| Weapon | Description |
|--------|-------------|
| Pulse Rifle | Standard rapid-fire single shot |
| Spread Shot | 5-bullet fan pattern |
| Laser | Fast continuous beam |
| Rapid Fire | High-speed bullet stream |

## Enemies

The game features 13+ enemy types across all levels:

- **Ground units** — Grunts, Heavies, Sentinels
- **Flying units** — Flyers, Flying Eyes, Octopuses
- **Stationary** — Turrets, Slimes
- **Mini-bosses** — 5 Mech variants (Grey, Cyan, Orange, Blue, Green)

## Features

- 5 levels with unique themes, enemies, and boss fights
- 4 collectible weapons with different fire patterns
- Power-ups: Shield, Health, 1UP, Double Jump
- Grenades with area-of-effect damage
- Environmental hazards: fire pits, laser gates, explosive barrels
- Checkpoint system throughout each level
- Firebase-powered online leaderboard
- Mobile/touch controls and gamepad support
- Volume control with persistence

## Controls

| Action | Keyboard | Gamepad |
|--------|----------|---------|
| Move | Arrow Keys / WASD | Left Stick / D-Pad |
| Jump | Space / Up | A |
| Shoot | Z / J | X |
| Crouch | Down | Down |
| Grenade | X / K | B |
| Pause | Escape | Start |

## Tech Stack

- **Engine**: [Phaser 3](https://phaser.io/)
- **Backend**: Firebase Realtime Database (leaderboard)
- **Hosting**: Vercel
- **Art**: Pixel art sprite assets
- **Audio**: Custom SFX and music tracks

## Running Locally

Just serve the project directory with any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node
npx serve .
```

Then open `http://localhost:8000` in your browser.
