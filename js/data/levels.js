// ============================================================================
// CYBER ASSAULT - Level Definitions (All 4 Levels)
// ============================================================================

const LEVEL_DATA = {
    // ========================================================================
    // LEVEL 1 - Industrial Base
    // ========================================================================
    1: {
        name: 'Industrial Base',
        width: 8000,
        height: GAME_HEIGHT,
        playerStart: { x: 100, y: 350 },
        backgrounds: [
            { gradient: ['#0d1f14', '#1a3d28', '#2a6b45'], speed: 0 },
            { key: 'l1-far',  speed: 0.15, tileScale: 2, alignBottom: true },
            { key: 'l1-mid',  speed: 0.3,  tileScale: 2, alignBottom: true },
            { key: 'l1-fore', speed: 0.55, tileScale: 1.5, alignBottom: true }
        ],
        platformTile: 'l1-floor',
        platformCaps: true,
        platformTint: 0x88ccbb,
        platforms: [
            // Ground floor - continuous with small gaps (all jumpable)
            // Gaps are only 100px wide - easy to jump over
            { x: 0,    y: 420, w: 1400, h: 30 },
            { x: 1500, y: 420, w: 1000, h: 30 },
            { x: 2600, y: 420, w: 1200, h: 30 },
            { x: 3900, y: 420, w: 1400, h: 30 },
            { x: 5400, y: 420, w: 800,  h: 30 },
            { x: 6300, y: 420, w: 1700, h: 30 },

            // Elevated platforms (all positioned OVER solid ground)
            { x: 300,  y: 330, w: 200, h: 20 },
            { x: 650,  y: 270, w: 150, h: 20 },
            { x: 1000, y: 310, w: 180, h: 20 },
            { x: 1600, y: 330, w: 200, h: 20 },
            { x: 1900, y: 270, w: 150, h: 20 },
            { x: 2700, y: 320, w: 200, h: 20 },
            { x: 3000, y: 260, w: 180, h: 20 },
            { x: 3400, y: 330, w: 150, h: 20 },
            { x: 4100, y: 300, w: 200, h: 20 },
            { x: 4400, y: 330, w: 150, h: 20 },
            { x: 4700, y: 270, w: 200, h: 20 },
            { x: 5000, y: 320, w: 180, h: 20 },
            { x: 5500, y: 290, w: 200, h: 20 },
            { x: 5800, y: 330, w: 150, h: 20 },
            { x: 6500, y: 300, w: 180, h: 20 },

            // High platforms (over solid ground for bonus/powerups)
            { x: 700,  y: 190, w: 120, h: 20 },
            { x: 2800, y: 180, w: 120, h: 20 },
            { x: 4600, y: 190, w: 120, h: 20 }
        ],
        enemyTriggers: [
            { x: 300, enemies: [
                { type: 'grunt', x: 500, y: 380, config: { patrolDir: -1, patrolRange: 150 } },
                { type: 'grunt', x: 600, y: 380, config: { patrolDir: 1, patrolRange: 100 } }
            ]},
            { x: 700, enemies: [
                { type: 'grunt', x: 720, y: 240, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'grunt', x: 1000, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 1200, enemies: [
                { type: 'grunt', x: 1400, y: 380, config: { patrolDir: 1 } },
                { type: 'grunt', x: 1500, y: 280, config: { patrolDir: -1, patrolRange: 80 } }
            ]},
            { x: 1800, enemies: [
                { type: 'grunt', x: 1940, y: 240, config: { patrolDir: -1, patrolRange: 50 } },
                { type: 'grunt', x: 2000, y: 380, config: {} }
            ]},
            { x: 2400, enemies: [
                { type: 'grunt', x: 2600, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 2800, y: 380, config: {} },
                { type: 'grunt', x: 2700, y: 210, config: { patrolDir: 1, patrolRange: 60 } }
            ]},
            { x: 3000, enemies: [
                { type: 'grunt', x: 3050, y: 230, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'heavy', x: 3200, y: 370, config: { patrolDir: -1 } }
            ]},
            { x: 3500, enemies: [
                { type: 'grunt', x: 3440, y: 300, config: { patrolDir: -1, patrolRange: 50 } },
                { type: 'grunt', x: 3700, y: 380, config: {} },
                { type: 'grunt', x: 3800, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 3900, enemies: [
                { type: 'grey_mech', x: 4100, y: 350, config: { patrolDir: -1, patrolRange: 180 } }
            ]},
            { x: 4200, enemies: [
                { type: 'heavy', x: 4400, y: 370, config: { patrolRange: 200 } },
                { type: 'grunt', x: 4500, y: 380, config: {} },
                { type: 'grunt', x: 4600, y: 260, config: { patrolDir: -1, patrolRange: 60 } }
            ]},
            { x: 4800, enemies: [
                { type: 'grunt', x: 5050, y: 290, config: { patrolDir: -1, patrolRange: 60 } },
                { type: 'grunt', x: 5000, y: 380, config: { patrolDir: 1 } }
            ]},
            { x: 5400, enemies: [
                { type: 'heavy', x: 5600, y: 370, config: {} },
                { type: 'grunt', x: 5700, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 5800, y: 280, config: { patrolRange: 60 } }
            ]},
            { x: 6000, enemies: [
                { type: 'grunt', x: 6200, y: 380, config: {} },
                { type: 'grunt', x: 6300, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 6540, y: 270, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'heavy', x: 6500, y: 370, config: { patrolDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
        ],
        fixedDrops: [
            { x: 3000, y: 380, type: 'SHIELD' }
        ],
        boss: {
            type: 'TANK',
            x: 7500,
            y: 370,
            arenaStart: 7000,
            arenaEnd: 7900,
            name: 'SIEGE TANK'
        }
    },

    // ========================================================================
    // LEVEL 2 - Underground Caverns
    // ========================================================================
    2: {
        name: 'Underground Caverns',
        width: 8000,
        height: GAME_HEIGHT,
        playerStart: { x: 100, y: 350 },
        backgrounds: [
            { key: 'l2-bg',   speed: 0.05, tint: 0x8877bb },
            { key: 'l2-mid',  speed: 0.15, tint: 0x7766aa },
            { key: 'l2-fore', speed: 0.35, tint: 0x665599 }
        ],
        platformTile: 'l2-platform',
        platformCaps: true,
        enemyTint: 0x9977dd,
        platforms: [
            // Ground sections with 150px pits
            { x: 0,    y: 420, w: 700,  h: 30 },
            { x: 850,  y: 420, w: 400,  h: 30 },
            { x: 1400, y: 420, w: 550,  h: 30 },
            { x: 2100, y: 420, w: 450,  h: 30 },
            { x: 2700, y: 420, w: 750,  h: 30 },
            { x: 3600, y: 420, w: 350,  h: 30 },
            { x: 4100, y: 420, w: 550,  h: 30 },
            { x: 4800, y: 420, w: 450,  h: 30 },
            { x: 5400, y: 420, w: 750,  h: 30 },
            { x: 6300, y: 420, w: 350,  h: 30 },
            { x: 6800, y: 420, w: 1200, h: 30 },

            // Vertical platforming sections (staircase patterns)
            { x: 300,  y: 340, w: 120, h: 20 },
            { x: 500,  y: 260, w: 120, h: 20 },
            { x: 300,  y: 180, w: 120, h: 20 },
            { x: 600,  y: 140, w: 150, h: 20 },

            { x: 950,  y: 320, w: 100, h: 20 },
            { x: 1100, y: 240, w: 120, h: 20 },
            { x: 1150, y: 180, w: 100, h: 20 },
            { x: 1500, y: 320, w: 150, h: 20 },

            { x: 1700, y: 260, w: 120, h: 20 },
            { x: 1900, y: 200, w: 100, h: 20 },
            { x: 2100, y: 300, w: 150, h: 20 },
            { x: 2300, y: 220, w: 120, h: 20 },

            { x: 2800, y: 320, w: 120, h: 20 },
            { x: 3000, y: 240, w: 150, h: 20 },
            { x: 3200, y: 180, w: 120, h: 20 },
            { x: 3400, y: 300, w: 100, h: 20 },

            { x: 3700, y: 320, w: 120, h: 20 },
            { x: 3800, y: 250, w: 150, h: 20 },
            { x: 4200, y: 300, w: 120, h: 20 },
            { x: 4400, y: 220, w: 100, h: 20 },

            { x: 4900, y: 340, w: 120, h: 20 },
            { x: 5100, y: 260, w: 150, h: 20 },
            { x: 5150, y: 180, w: 120, h: 20 },
            { x: 5500, y: 300, w: 100, h: 20 },

            { x: 5700, y: 240, w: 120, h: 20 },
            { x: 5900, y: 320, w: 150, h: 20 },
            { x: 6000, y: 200, w: 120, h: 20 },

            // High secret area
            { x: 3000, y: 120, w: 200, h: 20 }
        ],
        enemyTriggers: [
            { x: 300, enemies: [
                { type: 'grunt', x: 500, y: 380, config: {} }
            ]},
            { x: 800, enemies: [
                { type: 'heavy', x: 1000, y: 370, config: { patrolDir: -1 } },
                { type: 'grunt', x: 980, y: 290, config: { patrolDir: 1, patrolRange: 40 } }
            ]},
            { x: 1300, enemies: [
                { type: 'grunt', x: 1500, y: 380, config: {} },
                { type: 'grunt', x: 1600, y: 280, config: { patrolDir: -1, patrolRange: 60 } }
            ]},
            { x: 1900, enemies: [
                { type: 'heavy', x: 2100, y: 370, config: {} },
                { type: 'grunt', x: 2340, y: 190, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'flyer', x: 2300, y: 180, config: { moveDir: -1 } }
            ]},
            { x: 2500, enemies: [
                { type: 'grunt', x: 2800, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 3050, y: 210, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'heavy', x: 2900, y: 370, config: {} }
            ]},
            { x: 3200, enemies: [
                { type: 'heavy', x: 3400, y: 370, config: { patrolDir: -1 } },
                { type: 'grunt', x: 3500, y: 380, config: {} }
            ]},
            { x: 3900, enemies: [
                { type: 'cyan_mech', x: 4200, y: 350, config: { patrolDir: -1, patrolRange: 200 } }
            ]},
            { x: 3800, enemies: [
                { type: 'grunt', x: 3850, y: 220, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'grunt', x: 4240, y: 270, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'grunt', x: 4000, y: 380, config: {} },
                { type: 'heavy', x: 4100, y: 370, config: { patrolDir: -1 } },
                { type: 'flyer', x: 4300, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 4400, enemies: [
                { type: 'heavy', x: 4900, y: 370, config: {} },
                { type: 'grunt', x: 4600, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 5000, enemies: [
                { type: 'grunt', x: 5150, y: 230, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'grunt', x: 5200, y: 380, config: {} },
                { type: 'grunt', x: 5300, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 5600, y: 180, config: { moveDir: -1 } }
            ]},
            { x: 5800, enemies: [
                { type: 'grunt', x: 5950, y: 290, config: { patrolDir: -1, patrolRange: 50 } },
                { type: 'heavy', x: 6000, y: 370, config: { patrolDir: -1 } },
                { type: 'grunt', x: 5600, y: 380, config: {} }
            ]},
            { x: 6400, enemies: [
                { type: 'heavy', x: 6500, y: 370, config: {} },
                { type: 'grunt', x: 6600, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 6800, y: 160, config: { moveDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 1800, y: 380 },
            { x: 3800, y: 380 },
            { x: 5800, y: 380 }
        ],
        fixedDrops: [
            { x: 3000, y: 380, type: 'SHIELD' }
        ],
        boss: {
            type: 'MECH',
            x: 7500,
            y: 360,
            arenaStart: 7000,
            arenaEnd: 7900,
            name: 'ASSAULT MECH'
        }
    },

    // ========================================================================
    // LEVEL 3 - Lava Pit
    // ========================================================================
    3: {
        name: 'Rocky Ridge',
        width: 8000,
        height: GAME_HEIGHT,
        playerStart: { x: 100, y: 350 },
        backgrounds: [
            { key: 'l3-back', speed: 0.05, tileScale: 2 },
            { key: 'l3-mid',  speed: 0.15, tileScale: 2, alignBottom: true },
            { key: 'l3-near', speed: 0.3,  tileScale: 2, alignBottom: true }
        ],
        platformTile: 'l3-platform',
        platformCaps: true,
        platformTint: 0x995544,
        enemyTint: 0xcc8855,
        platforms: [
            // Organic ground - irregular layout
            { x: 0,    y: 420, w: 600,  h: 30 },
            { x: 700,  y: 420, w: 500,  h: 30 },
            { x: 1300, y: 420, w: 400,  h: 30 },
            { x: 1800, y: 420, w: 600,  h: 30 },
            { x: 2500, y: 420, w: 400,  h: 30 },
            { x: 3000, y: 420, w: 700,  h: 30 },
            { x: 3800, y: 420, w: 500,  h: 30 },
            { x: 4400, y: 420, w: 400,  h: 30 },
            { x: 4900, y: 420, w: 600,  h: 30 },
            { x: 5600, y: 420, w: 500,  h: 30 },
            { x: 6200, y: 420, w: 400,  h: 30 },
            { x: 6700, y: 420, w: 1300, h: 30 },

            // Organic platforms at various heights
            { x: 200,  y: 330, w: 130, h: 18 },
            { x: 450,  y: 260, w: 100, h: 18 },
            { x: 750,  y: 300, w: 140, h: 18 },
            { x: 1000, y: 230, w: 110, h: 18 },
            { x: 1350, y: 310, w: 130, h: 18 },
            { x: 1550, y: 240, w: 100, h: 18 },
            { x: 1850, y: 320, w: 150, h: 18 },
            { x: 2100, y: 250, w: 120, h: 18 },
            { x: 2250, y: 180, w: 100, h: 18 },
            { x: 2600, y: 300, w: 130, h: 18 },
            { x: 2700, y: 220, w: 110, h: 18 },
            { x: 3100, y: 310, w: 140, h: 18 },
            { x: 3350, y: 240, w: 100, h: 18 },
            { x: 3500, y: 330, w: 130, h: 18 },
            { x: 3900, y: 260, w: 120, h: 18 },
            { x: 4150, y: 190, w: 100, h: 18 },
            { x: 4450, y: 310, w: 130, h: 18 },
            { x: 4550, y: 240, w: 110, h: 18 },
            { x: 5000, y: 320, w: 140, h: 18 },
            { x: 5250, y: 250, w: 100, h: 18 },
            { x: 5350, y: 180, w: 120, h: 18 },
            { x: 5750, y: 300, w: 130, h: 18 },
            { x: 6000, y: 230, w: 100, h: 18 },
            { x: 6300, y: 310, w: 140, h: 18 },
            { x: 6400, y: 250, w: 120, h: 18 }
        ],
        enemyTriggers: [
            { x: 300, enemies: [
                { type: 'flying_eye', x: 500, y: 180, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 550, y: 220, config: { moveDir: 1 } },
                { type: 'grunt', x: 600, y: 380, config: {} }
            ]},
            { x: 800, enemies: [
                { type: 'flying_eye', x: 1000, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 1050, y: 200, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 1100, y: 240, config: { moveDir: 1 } }
            ]},
            { x: 1200, enemies: [
                { type: 'grunt', x: 1400, y: 380, config: {} },
                { type: 'grunt', x: 1500, y: 380, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 1600, y: 180, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 1650, y: 220, config: { moveDir: 1 } }
            ]},
            { x: 1700, enemies: [
                { type: 'heavy', x: 1900, y: 370, config: {} },
                { type: 'flying_eye', x: 2000, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 2050, y: 200, config: { moveDir: -1 } }
            ]},
            { x: 2300, enemies: [
                { type: 'flying_eye', x: 2500, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 2550, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 2600, y: 230, config: { moveDir: -1 } },
                { type: 'grunt', x: 2700, y: 380, config: {} }
            ]},
            { x: 2900, enemies: [
                { type: 'heavy', x: 2700, y: 370, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 3300, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 3350, y: 200, config: { moveDir: 1 } }
            ]},
            { x: 3400, enemies: [
                { type: 'orange_mech', x: 3600, y: 350, config: { patrolDir: -1, patrolRange: 200 } }
            ]},
            { x: 3500, enemies: [
                { type: 'flying_eye', x: 3700, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 3750, y: 190, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 3800, y: 230, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 3850, y: 170, config: { moveDir: 1 } },
                { type: 'grunt', x: 3900, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 4200, enemies: [
                { type: 'heavy', x: 4400, y: 370, config: {} },
                { type: 'grunt', x: 4500, y: 380, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 4600, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 4800, enemies: [
                { type: 'flying_eye', x: 5000, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 5050, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 5100, y: 140, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 5150, y: 210, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 5200, y: 170, config: { moveDir: -1 } }
            ]},
            { x: 5400, enemies: [
                { type: 'heavy', x: 5600, y: 370, config: {} },
                { type: 'grunt', x: 5700, y: 380, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 5900, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 6000, enemies: [
                { type: 'flying_eye', x: 6200, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 6250, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 6300, y: 230, config: { moveDir: -1 } },
                { type: 'heavy', x: 6400, y: 370, config: { patrolDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
        ],
        fixedDrops: [
            { x: 3000, y: 380, type: 'SHIELD' }
        ],
        boss: {
            type: 'FIRESKULL',
            x: 7500,
            y: 250,
            arenaStart: 7000,
            arenaEnd: 7900,
            name: 'INFERNAL SKULL'
        }
    },

    // ========================================================================
    // LEVEL 4 - Space Station (Final Level)
    // ========================================================================
    4: {
        name: 'Space Station',
        width: 8000,
        height: GAME_HEIGHT,
        playerStart: { x: 100, y: 350 },
        backgrounds: [
            { key: 'l4-bg',    speed: 0.02, tileScale: 3 },
            { key: 'l4-stars', speed: 0.15 },
            { key: 'l4-planet-big',   prop: true, x: 650, y: 130, scale: 3,   speed: 0.05, alpha: 0.6 },
            { key: 'l4-asteroid1',    prop: true, x: 350, y: 220, scale: 2.5, speed: 0.12 },
            { key: 'l4-planet-small', prop: true, x: 500, y: 90,  scale: 2.5, speed: 0.08, alpha: 0.5 },
            { key: 'l4-asteroid2',    prop: true, x: 200, y: 170, scale: 2,   speed: 0.1 },
            { key: 'l4-asteroid1',    prop: true, x: 700, y: 300, scale: 1.8, speed: 0.18, alpha: 0.8 },
            { key: 'l4-planet-small', prop: true, x: 100, y: 110, scale: 3.5, speed: 0.04, alpha: 0.4 }
        ],
        platformTile: 'l1-floor',
        platformCaps: true,
        platformTint: 0x4466dd,
        platforms: [
            // Space station structure - mix of all platform styles
            { x: 0,    y: 420, w: 700,  h: 30 },
            { x: 800,  y: 420, w: 500,  h: 30 },
            { x: 1400, y: 420, w: 400,  h: 30 },
            { x: 1900, y: 420, w: 600,  h: 30 },
            { x: 2600, y: 420, w: 500,  h: 30 },
            { x: 3200, y: 420, w: 600,  h: 30 },
            { x: 3900, y: 420, w: 400,  h: 30 },
            { x: 4400, y: 420, w: 500,  h: 30 },
            { x: 5000, y: 420, w: 600,  h: 30 },
            { x: 5700, y: 420, w: 400,  h: 30 },
            { x: 6200, y: 420, w: 500,  h: 30 },
            { x: 6800, y: 420, w: 1200, h: 30 },

            // Platforms at various heights
            { x: 200,  y: 320, w: 150, h: 20 },
            { x: 500,  y: 240, w: 120, h: 20 },
            { x: 350,  y: 160, w: 100, h: 20 },
            { x: 900,  y: 300, w: 140, h: 20 },
            { x: 1100, y: 220, w: 120, h: 20 },
            { x: 1500, y: 320, w: 130, h: 20 },
            { x: 1700, y: 240, w: 100, h: 20 },
            { x: 1950, y: 300, w: 150, h: 20 },
            { x: 2200, y: 220, w: 120, h: 20 },
            { x: 2350, y: 160, w: 100, h: 20 },
            { x: 2700, y: 320, w: 130, h: 20 },
            { x: 2950, y: 240, w: 140, h: 20 },
            { x: 3250, y: 300, w: 120, h: 20 },
            { x: 3500, y: 220, w: 100, h: 20 },
            { x: 3600, y: 320, w: 130, h: 20 },
            { x: 4000, y: 240, w: 120, h: 20 },
            { x: 4100, y: 160, w: 100, h: 20 },
            { x: 4500, y: 300, w: 140, h: 20 },
            { x: 4750, y: 220, w: 120, h: 20 },
            { x: 5050, y: 320, w: 130, h: 20 },
            { x: 5300, y: 240, w: 100, h: 20 },
            { x: 5400, y: 180, w: 120, h: 20 },
            { x: 5800, y: 300, w: 130, h: 20 },
            { x: 5900, y: 220, w: 120, h: 20 },
            { x: 6300, y: 320, w: 140, h: 20 },
            { x: 6550, y: 240, w: 100, h: 20 }
        ],
        enemyTint: 0x6688ee,
        enemyTriggers: [
            // Floor 0-700 (easy intro)
            { x: 300, enemies: [
                { type: 'grunt', x: 500, y: 380, config: {} },
                { type: 'flyer', x: 550, y: 180, config: { moveDir: -1 } }
            ]},
            // Floor 800-1300
            { x: 700, enemies: [
                { type: 'heavy', x: 1000, y: 370, config: { patrolRange: 120 } },
                { type: 'grunt', x: 1130, y: 190, config: { patrolDir: -1, patrolRange: 40 } }
            ]},
            // Floor 1400-1800
            { x: 1200, enemies: [
                { type: 'heavy', x: 1500, y: 370, config: {} },
                { type: 'slime', x: 1700, y: 400, config: {} },
                { type: 'flyer', x: 1550, y: 150, config: { moveDir: -1 } }
            ]},
            // Floor 1900-2500
            { x: 1700, enemies: [
                { type: 'grunt', x: 1900, y: 380, config: {} },
                { type: 'heavy', x: 2100, y: 370, config: { patrolDir: -1 } },
                { type: 'flyer', x: 2200, y: 160, config: { moveDir: -1 } }
            ]},
            // Floor 2600-3100
            { x: 2300, enemies: [
                { type: 'heavy', x: 2800, y: 370, config: {} },
                { type: 'slime', x: 2700, y: 400, config: {} },
                { type: 'grunt', x: 2730, y: 290, config: { patrolDir: -1, patrolRange: 40 } }
            ]},
            // Floor 3200-3800
            { x: 3000, enemies: [
                { type: 'heavy', x: 3400, y: 370, config: { patrolDir: -1 } },
                { type: 'flyer', x: 3600, y: 160, config: { moveDir: -1 } },
                { type: 'slime', x: 3500, y: 400, config: {} }
            ]},
            // Floor 3900-4300 + Blue Mech
            { x: 3700, enemies: [
                { type: 'blue_mech', x: 4000, y: 350, config: { patrolDir: -1, patrolRange: 200 } }
            ]},
            // Floor 4400-4900
            { x: 4200, enemies: [
                { type: 'heavy', x: 4600, y: 370, config: {} },
                { type: 'grunt', x: 4530, y: 270, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'flyer', x: 4950, y: 150, config: { moveDir: -1 } }
            ]},
            // Floor 5000-5600
            { x: 5000, enemies: [
                { type: 'heavy', x: 5400, y: 370, config: {} },
                { type: 'slime', x: 5300, y: 400, config: {} },
                { type: 'grunt', x: 5080, y: 290, config: { patrolDir: 1, patrolRange: 40 } }
            ]},
            // Floor 5700-6100
            { x: 5700, enemies: [
                { type: 'heavy', x: 5900, y: 370, config: { patrolDir: -1 } },
                { type: 'flyer', x: 6050, y: 190, config: { moveDir: 1 } }
            ]},
            // Floor 6200-6700
            { x: 6100, enemies: [
                { type: 'heavy', x: 6400, y: 370, config: {} },
                { type: 'grunt', x: 6330, y: 290, config: { patrolDir: 1, patrolRange: 50 } }
            ]},
            // Floor 6800-8000 (pre-boss)
            { x: 6600, enemies: [
                { type: 'heavy', x: 6900, y: 370, config: { patrolDir: -1 } },
                { type: 'slime', x: 6850, y: 400, config: {} }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
        ],
        fixedDrops: [
            { x: 3000, y: 380, type: 'SHIELD' }
        ],
        boss: {
            type: 'SENTINEL',
            x: 7500,
            y: 220,
            arenaStart: 7000,
            arenaEnd: 7900,
            name: 'OMEGA SENTINEL'
        }
    }
};
