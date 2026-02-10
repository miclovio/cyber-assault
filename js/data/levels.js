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
                { type: 'flyer', x: 1550, y: 150, config: { moveDir: -1 } }
            ]},
            { x: 1500, enemies: [
                { type: 'slime', x: 1730, y: 210, config: {} }
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
                { type: 'grunt', x: 2730, y: 290, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'slime', x: 2980, y: 210, config: {} }
            ]},
            // Floor 3200-3800
            { x: 3000, enemies: [
                { type: 'heavy', x: 3400, y: 370, config: { patrolDir: -1 } },
                { type: 'flyer', x: 3600, y: 160, config: { moveDir: -1 } },
                { type: 'slime', x: 3630, y: 290, config: {} }
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
                { type: 'grunt', x: 5080, y: 290, config: { patrolDir: 1, patrolRange: 40 } },
                { type: 'slime', x: 5330, y: 210, config: {} }
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
                { type: 'heavy', x: 6900, y: 370, config: { patrolDir: -1 } }
            ]},
            { x: 6700, enemies: [
                { type: 'slime', x: 7200, y: 380, config: {} }
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
    },

    // ========================================================================
    // LEVEL 5 - Core Breach (Fortress Infiltration)
    // ========================================================================
    5: {
        name: 'Core Breach',
        width: 8000,
        height: GAME_HEIGHT,
        playerStart: { x: 100, y: 350 },
        backgrounds: [
            { key: 'l5-back',  speed: 0.05, tileScale: 2 },
            { key: 'l5-mid',   speed: 0.15, tileScale: 2, alignBottom: true },
            { key: 'l5-front', speed: 0.3,  tileScale: 1.5, alignBottom: true }
        ],
        platformTile: 'l1-floor',
        platformCaps: true,
        platformTint: 0xcc2233,
        enemyTint: 0xcc4444,
        endZoneX: 7800,
        platforms: [
            // ============================================================
            // ROOM 1: Entry Hall (0-1200)
            // ============================================================
            { x: 0,    y: 420, w: 1200, h: 30 },   // floor
            { x: 0,    y: 100, w: 1200, h: 30 },   // ceiling
            { x: 400,  y: 320, w: 150,  h: 20 },   // power-up platform (single-jump reachable)

            // ============================================================
            // ROOM 2: First Arena (1200-2400)
            // ============================================================
            { x: 1200, y: 420, w: 1200, h: 30 },   // floor
            { x: 1200, y: 100, w: 1200, h: 30 },   // ceiling
            { x: 1400, y: 300, w: 200,  h: 20 },   // left upper platform
            { x: 1800, y: 300, w: 200,  h: 20 },   // right upper platform

            // ============================================================
            // ROOM 3: Crawl Tunnel Passage (2400-3200)
            // ============================================================
            { x: 2400, y: 420, w: 800,  h: 30 },   // floor
            { x: 2400, y: 100, w: 800,  h: 30 },   // ceiling
            // Full-height wall blocking path — crawl tunnel is the only way through
            { x: 2600, y: 130, w: 250,  h: 205 },  // wall above crawl (y=130 to y=335)
            { x: 2600, y: 335, w: 250,  h: 30 },   // crawl tunnel ceiling (bottom at 365, gap=55px)

            // ============================================================
            // ROOM 4: Vertical Shaft (3200-4200)
            // ============================================================
            { x: 3200, y: 420, w: 1000, h: 30 },   // floor
            { x: 3200, y: 100, w: 1000, h: 30 },   // ceiling
            { x: 3400, y: 300, w: 300,  h: 20 },   // mid platform (needs ladder)
            { x: 3400, y: 180, w: 300,  h: 20 },   // upper platform (needs ladder)
            // ============================================================
            // ROOM 5: Crawl-and-Climb Maze (4200-5400)
            // ============================================================
            { x: 4200, y: 420, w: 1200, h: 30 },   // floor
            { x: 4200, y: 100, w: 1200, h: 30 },   // ceiling
            // Crawl tunnel section (4200-4800)
            { x: 4200, y: 130, w: 600,  h: 205 },  // wall above crawl
            { x: 4200, y: 335, w: 600,  h: 30 },   // crawl tunnel ceiling (bottom at 365, gap=55px)
            // Platforms after crawl exit
            { x: 4800, y: 300, w: 300,  h: 20 },   // mid platform
            { x: 4500, y: 180, w: 300,  h: 20 },   // upper platform (reachable via ladder from mid)

            // ============================================================
            // ROOM 6: Heavy Combat Arena (5400-6400)
            // ============================================================
            { x: 5400, y: 420, w: 1000, h: 30 },   // floor
            { x: 5400, y: 100, w: 1000, h: 30 },   // ceiling
            { x: 5500, y: 300, w: 200,  h: 20 },   // left platform
            { x: 5900, y: 300, w: 200,  h: 20 },   // right platform
            { x: 5700, y: 180, w: 200,  h: 20 },   // center high platform (needs ladder)

            // ============================================================
            // ROOM 7: Final Gauntlet (6400-7200)
            // ============================================================
            { x: 6400, y: 420, w: 800,  h: 30 },   // floor
            // Crawl section (6400-6800)
            { x: 6400, y: 130, w: 400,  h: 205 },  // wall above crawl
            { x: 6400, y: 335, w: 400,  h: 30 },   // crawl tunnel ceiling (bottom at 365, gap=55px)
            // Open section (6800-7200)
            { x: 6800, y: 100, w: 400,  h: 30 },   // ceiling for open area
            { x: 6900, y: 280, w: 200,  h: 20 },   // upper platform

            // ============================================================
            // ROOM 8: Boss Arena (7200-7900)
            // ============================================================
            { x: 7200, y: 420, w: 700,  h: 30 },    // floor
            { x: 7200, y: 100, w: 700,  h: 30 }     // ceiling
        ],

        // Destructible walls
        destructibleWalls: [
            // Room 1: blocks exit to Room 2 (floor-to-ceiling)
            { x: 900, y: 130, w: 40, h: 290, hp: 3 },
            // Room 7: at end of crawl tunnel (shoot while crawling)
            { x: 6780, y: 365, w: 40, h: 55, hp: 3 }
        ],

        // Ladders
        ladders: [
            // Room 4: full-height ladder for vertical shaft
            { x: 3500, y: 180, w: 30, h: 240 },
            // Room 5: climb from crawl exit to mid level
            { x: 4850, y: 180, w: 30, h: 240 },
            // Room 5: reach upper platform from mid level
            { x: 4550, y: 180, w: 30, h: 120 },
            // Room 6: reach center high platform
            { x: 5750, y: 180, w: 30, h: 240 },
            // Room 7: reach upper platform in open area
            { x: 7000, y: 280, w: 30, h: 140 },
            // Room 8: center boss arena ladder for vertical dodging
            { x: 7535, y: 130, w: 30, h: 290 }
        ],

        // Crawl zones (55px gap between ceiling bottom at 365 and floor at 420)
        crawlZones: [
            // Room 3: through the wall
            { x: 2600, y: 365, w: 250, h: 55 },
            // Room 5: entry corridor
            { x: 4200, y: 365, w: 600, h: 55 },
            // Room 7: final crawl section
            { x: 6400, y: 365, w: 400, h: 55 }
        ],

        // Laser gates
        laserGates: [
            // Room 3: inside crawl tunnel area
            { x: 3000, y: 320, h: 100, onTime: 2000, offTime: 2000 },
            // Room 5: alternating pair inside crawl tunnel
            { x: 4400, y: 365, h: 55, onTime: 2000, offTime: 2000 },
            { x: 4600, y: 365, h: 55, onTime: 2000, offTime: 2000, startOff: true },
            // Room 7: inside crawl tunnel
            { x: 6600, y: 365, h: 55, onTime: 1500, offTime: 1500 }
        ],

        // Explosive barrels
        explosiveBarrels: [
            // Room 2: between upper platforms
            { x: 1700, y: 402, hp: 2 },
            // Room 4: on mid platform near enemies
            { x: 3550, y: 282, hp: 2 },
            { x: 3650, y: 282, hp: 2 },
            // Room 6: ground level near enemy clusters
            { x: 5650, y: 402, hp: 2 },
            { x: 5850, y: 402, hp: 2 },
            // Room 7: ground level
            { x: 6900, y: 402, hp: 2 },
            { x: 7050, y: 402, hp: 3 }
        ],

        // Lock doors (linked to enemy triggers by index)
        lockDoors: [
            // Room 2: seals exit until arena is cleared
            { x: 2350, y: 130, w: 40, h: 290, triggerIndex: 1 },
            // Room 4: right side exit
            { x: 4100, y: 130, w: 40, h: 290, triggerIndex: 3 },
            // Room 5: exit after maze
            { x: 5350, y: 130, w: 40, h: 290, triggerIndex: 5 },
            // Room 6: exit after heavy combat
            { x: 6350, y: 130, w: 40, h: 290, triggerIndex: 6 }
        ],

        enemyTriggers: [
            // === Room 1 (trigger 0) ===
            { x: 200, enemies: [
                { type: 'grunt', x: 400, y: 380, config: { patrolDir: 1, patrolRange: 200 } },
                { type: 'grunt', x: 600, y: 380, config: { patrolDir: -1, patrolRange: 150 } }
            ]},
            // === Room 2 (trigger 1 — linked to lock door) ===
            { x: 1250, enemies: [
                { type: 'grunt', x: 1500, y: 380, config: { patrolDir: 1, patrolRange: 100 } },
                { type: 'grunt', x: 1700, y: 380, config: { patrolDir: -1, patrolRange: 100 } },
                { type: 'grunt', x: 1900, y: 380, config: { patrolDir: 1, patrolRange: 80 } },
                { type: 'heavy', x: 2100, y: 370, config: { patrolDir: -1, patrolRange: 150 } }
            ]},
            // === Room 3 (trigger 2) ===
            { x: 2800, enemies: [
                { type: 'grunt', x: 2950, y: 380, config: { patrolDir: -1, patrolRange: 80 } },
                { type: 'turret', x: 2750, y: 362, config: { ceiling: true } }
            ]},
            // === Room 4 (trigger 3 — linked to lock door) ===
            { x: 3250, enemies: [
                { type: 'grunt', x: 3500, y: 270, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'grunt', x: 3600, y: 270, config: { patrolDir: -1, patrolRange: 60 } },
                { type: 'turret', x: 3550, y: 190, config: {} },
                { type: 'grunt', x: 3800, y: 380, config: { patrolDir: -1, patrolRange: 100 } }
            ]},
            // === Room 5 mid/upper (trigger 4) ===
            { x: 4800, enemies: [
                { type: 'grunt', x: 4900, y: 270, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'grunt', x: 5000, y: 270, config: { patrolDir: -1, patrolRange: 60 } }
            ]},
            // === Room 5 exit (trigger 5 — linked to lock door) ===
            { x: 4500, enemies: [
                { type: 'grunt', x: 4600, y: 150, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'heavy', x: 5100, y: 370, config: { patrolDir: -1, patrolRange: 100 } }
            ]},
            // === Room 6 (trigger 6 — linked to lock door) ===
            { x: 5450, enemies: [
                { type: 'heavy', x: 5600, y: 370, config: { patrolDir: 1, patrolRange: 100 } },
                { type: 'heavy', x: 5900, y: 370, config: { patrolDir: -1, patrolRange: 100 } },
                { type: 'grunt', x: 5550, y: 270, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'grunt', x: 5950, y: 270, config: { patrolDir: -1, patrolRange: 50 } },
                { type: 'turret', x: 5800, y: 190, config: {} }
            ]},
            // === Room 7 (trigger 7) ===
            { x: 6800, enemies: [
                { type: 'grunt', x: 6900, y: 380, config: { patrolDir: 1, patrolRange: 80 } },
                { type: 'grunt', x: 7050, y: 380, config: { patrolDir: -1, patrolRange: 80 } },
                { type: 'heavy', x: 7100, y: 370, config: { patrolDir: -1, patrolRange: 60 } }
            ]}
        ],

        checkpoints: [
            // After Room 2
            { x: 2380, y: 380 },
            // After Room 4
            { x: 4180, y: 380 },
            // After Room 6
            { x: 6380, y: 380 }
        ],
        fixedDrops: [
            { x: 430, y: 290, type: 'SPREAD' },
            { x: 4180, y: 380, type: 'SHIELD' }
        ],
        boss: {
            type: 'COREGUARDIAN',
            x: 7550,
            y: 220,
            arenaStart: 7200,
            arenaEnd: 7900,
            name: 'CORE GUARDIAN'
        }
    }
};
