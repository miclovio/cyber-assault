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
            { key: 'l1-bg',   speed: 0.05 },
            { key: 'l1-far',  speed: 0.15 },
            { key: 'l1-mid',  speed: 0.3 },
            { key: 'l1-wall', speed: 0.4, alpha: 0.6 }
        ],
        platformTile: 'l1-floor',
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
                { type: 'flyer', x: 900, y: 200, config: { moveDir: -1 } },
                { type: 'grunt', x: 1000, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 1200, enemies: [
                { type: 'grunt', x: 1400, y: 380, config: { patrolDir: 1 } },
                { type: 'grunt', x: 1500, y: 280, config: { patrolDir: -1, patrolRange: 80 } },
                { type: 'flyer', x: 1600, y: 180, config: { moveDir: -1 } }
            ]},
            { x: 1800, enemies: [
                { type: 'grunt', x: 2000, y: 380, config: {} },
                { type: 'flyer', x: 2100, y: 150, config: { moveDir: -1 } },
                { type: 'flyer', x: 2200, y: 220, config: { moveDir: 1 } }
            ]},
            { x: 2400, enemies: [
                { type: 'grunt', x: 2600, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 2800, y: 380, config: {} },
                { type: 'grunt', x: 2700, y: 210, config: { patrolDir: 1, patrolRange: 60 } }
            ]},
            { x: 3000, enemies: [
                { type: 'heavy', x: 3200, y: 370, config: { patrolDir: -1 } },
                { type: 'flyer', x: 3300, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 3500, enemies: [
                { type: 'grunt', x: 3700, y: 380, config: {} },
                { type: 'grunt', x: 3800, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 3900, y: 200, config: { moveDir: 1 } },
                { type: 'flyer', x: 3950, y: 250, config: { moveDir: -1 } }
            ]},
            { x: 4200, enemies: [
                { type: 'heavy', x: 4400, y: 370, config: { patrolRange: 200 } },
                { type: 'grunt', x: 4500, y: 380, config: {} },
                { type: 'grunt', x: 4600, y: 260, config: { patrolDir: -1, patrolRange: 60 } }
            ]},
            { x: 4800, enemies: [
                { type: 'grunt', x: 5000, y: 380, config: { patrolDir: 1 } },
                { type: 'flyer', x: 5100, y: 180, config: { moveDir: -1 } },
                { type: 'flyer', x: 5200, y: 230, config: { moveDir: 1 } }
            ]},
            { x: 5400, enemies: [
                { type: 'heavy', x: 5600, y: 370, config: {} },
                { type: 'grunt', x: 5700, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 5800, y: 280, config: { patrolRange: 60 } }
            ]},
            { x: 6000, enemies: [
                { type: 'grunt', x: 6200, y: 380, config: {} },
                { type: 'grunt', x: 6300, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 6400, y: 170, config: { moveDir: -1 } },
                { type: 'heavy', x: 6500, y: 370, config: { patrolDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
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
            { key: 'l2-bg',    speed: 0.05 },
            { key: 'l2-walls', speed: 0.2 },
            { key: 'l2-tiles', speed: 0.35, alpha: 0.4 }
        ],
        platformTile: 'l2-tiles',
        platforms: [
            // Ground sections with gaps for vertical challenge
            { x: 0,    y: 420, w: 800,  h: 30 },
            { x: 900,  y: 420, w: 400,  h: 30 },
            { x: 1400, y: 420, w: 600,  h: 30 },
            { x: 2100, y: 420, w: 500,  h: 30 },
            { x: 2700, y: 420, w: 800,  h: 30 },
            { x: 3600, y: 420, w: 400,  h: 30 },
            { x: 4100, y: 420, w: 600,  h: 30 },
            { x: 4800, y: 420, w: 500,  h: 30 },
            { x: 5400, y: 420, w: 800,  h: 30 },
            { x: 6300, y: 420, w: 400,  h: 30 },
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
                { type: 'heavy', x: 1000, y: 370, config: { patrolDir: -1 } }
            ]},
            { x: 1300, enemies: [
                { type: 'grunt', x: 1500, y: 380, config: {} },
                { type: 'grunt', x: 1600, y: 280, config: { patrolDir: -1, patrolRange: 60 } },
                { type: 'ghost', x: 1700, y: 200, config: {} }
            ]},
            { x: 1900, enemies: [
                { type: 'heavy', x: 2100, y: 370, config: {} },
                { type: 'flyer', x: 2300, y: 180, config: { moveDir: -1 } }
            ]},
            { x: 2500, enemies: [
                { type: 'grunt', x: 2800, y: 380, config: { patrolDir: -1 } },
                { type: 'heavy', x: 2900, y: 370, config: {} }
            ]},
            { x: 3200, enemies: [
                { type: 'heavy', x: 3400, y: 370, config: { patrolDir: -1 } },
                { type: 'grunt', x: 3500, y: 380, config: {} }
            ]},
            { x: 3800, enemies: [
                { type: 'grunt', x: 4000, y: 380, config: {} },
                { type: 'heavy', x: 4100, y: 370, config: { patrolDir: -1 } },
                { type: 'ghost', x: 4200, y: 200, config: {} },
                { type: 'flyer', x: 4300, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 4400, enemies: [
                { type: 'heavy', x: 4600, y: 370, config: {} },
                { type: 'heavy', x: 4700, y: 370, config: { patrolDir: -1 } }
            ]},
            { x: 5000, enemies: [
                { type: 'grunt', x: 5200, y: 380, config: {} },
                { type: 'grunt', x: 5300, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 5600, y: 180, config: { moveDir: -1 } }
            ]},
            { x: 5800, enemies: [
                { type: 'heavy', x: 6000, y: 370, config: { patrolDir: -1 } },
                { type: 'heavy', x: 6100, y: 370, config: {} },
                { type: 'ghost', x: 6200, y: 150, config: {} }
            ]},
            { x: 6400, enemies: [
                { type: 'heavy', x: 6500, y: 370, config: {} },
                { type: 'grunt', x: 6600, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 6800, y: 160, config: { moveDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
        ],
        boss: {
            type: 'MECH',
            x: 7500,
            y: 300,
            arenaStart: 7000,
            arenaEnd: 7900,
            name: 'ASSAULT MECH'
        }
    },

    // ========================================================================
    // LEVEL 3 - Bio-Organic Lab
    // ========================================================================
    3: {
        name: 'Bio-Organic Lab',
        width: 8000,
        height: GAME_HEIGHT,
        playerStart: { x: 100, y: 350 },
        backgrounds: [
            { key: 'l3-bg', speed: 0.05 }
        ],
        platformTile: 'l3-platform',
        platformTint: 0xcc55aa,
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
                { type: 'flying_eye', x: 2050, y: 200, config: { moveDir: -1 } },
                { type: 'ghost', x: 2100, y: 200, config: {} }
            ]},
            { x: 2300, enemies: [
                { type: 'flying_eye', x: 2500, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 2550, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 2600, y: 230, config: { moveDir: -1 } },
                { type: 'grunt', x: 2700, y: 380, config: {} }
            ]},
            { x: 2900, enemies: [
                { type: 'heavy', x: 3100, y: 370, config: { patrolDir: -1 } },
                { type: 'ghost', x: 3200, y: 180, config: {} },
                { type: 'flying_eye', x: 3300, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 3350, y: 200, config: { moveDir: 1 } }
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
                { type: 'heavy', x: 4500, y: 370, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 4600, y: 160, config: { moveDir: -1 } },
                { type: 'ghost', x: 4700, y: 200, config: {} }
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
                { type: 'ghost', x: 5800, y: 180, config: {} },
                { type: 'flying_eye', x: 5900, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 6000, enemies: [
                { type: 'flying_eye', x: 6200, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 6250, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 6300, y: 230, config: { moveDir: -1 } },
                { type: 'heavy', x: 6400, y: 370, config: { patrolDir: -1 } },
                { type: 'ghost', x: 6500, y: 200, config: {} }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
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
            { key: 'l4-bg',      speed: 0.03 },
            { key: 'l4-stars',   speed: 0.08 },
            { key: 'l4-planets', speed: 0.12, alpha: 0.7 },
            { key: 'l4-ring',    speed: 0.18, alpha: 0.6 }
        ],
        platformTile: 'l1-floor',
        platformTint: 0x6688cc,
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
        enemyTriggers: [
            { x: 300, enemies: [
                { type: 'grunt', x: 500, y: 380, config: {} },
                { type: 'flyer', x: 550, y: 180, config: { moveDir: -1 } },
                { type: 'slime', x: 600, y: 300, config: {} }
            ]},
            { x: 700, enemies: [
                { type: 'grunt', x: 900, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 1000, y: 260, config: { patrolRange: 60 } },
                { type: 'flyer', x: 1050, y: 160, config: { moveDir: -1 } },
                { type: 'slime', x: 1100, y: 380, config: {} }
            ]},
            { x: 1200, enemies: [
                { type: 'heavy', x: 1400, y: 370, config: {} },
                { type: 'flyer', x: 1550, y: 150, config: { moveDir: -1 } },
                { type: 'slime', x: 1600, y: 280, config: {} }
            ]},
            { x: 1700, enemies: [
                { type: 'grunt', x: 1900, y: 380, config: {} },
                { type: 'heavy', x: 2000, y: 370, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 2100, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 2150, y: 200, config: { moveDir: 1 } }
            ]},
            { x: 2300, enemies: [
                { type: 'heavy', x: 2500, y: 370, config: {} },
                { type: 'slime', x: 2600, y: 280, config: {} },
                { type: 'flyer', x: 2700, y: 160, config: { moveDir: -1 } },
                { type: 'grunt', x: 2900, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 3000, enemies: [
                { type: 'heavy', x: 3200, y: 370, config: { patrolDir: -1 } },
                { type: 'heavy', x: 3300, y: 370, config: {} },
                { type: 'slime', x: 3400, y: 260, config: {} },
                { type: 'flying_eye', x: 3500, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 3700, enemies: [
                { type: 'grunt', x: 3900, y: 380, config: {} },
                { type: 'grunt', x: 4000, y: 380, config: { patrolDir: -1 } },
                { type: 'heavy', x: 4100, y: 370, config: {} },
                { type: 'slime', x: 4200, y: 300, config: {} },
                { type: 'flyer', x: 4250, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 4300, y: 200, config: { moveDir: 1 } }
            ]},
            { x: 4400, enemies: [
                { type: 'heavy', x: 4600, y: 370, config: {} },
                { type: 'heavy', x: 4700, y: 370, config: { patrolDir: -1 } },
                { type: 'slime', x: 4900, y: 280, config: {} },
                { type: 'flyer', x: 4950, y: 150, config: { moveDir: -1 } }
            ]},
            { x: 5000, enemies: [
                { type: 'grunt', x: 5200, y: 380, config: {} },
                { type: 'grunt', x: 5300, y: 380, config: { patrolDir: -1 } },
                { type: 'heavy', x: 5400, y: 370, config: {} },
                { type: 'flying_eye', x: 5500, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 5550, y: 200, config: { moveDir: 1 } },
                { type: 'slime', x: 5600, y: 300, config: {} }
            ]},
            { x: 5700, enemies: [
                { type: 'heavy', x: 5900, y: 370, config: { patrolDir: -1 } },
                { type: 'heavy', x: 6000, y: 370, config: {} },
                { type: 'slime', x: 6200, y: 280, config: {} },
                { type: 'flying_eye', x: 6300, y: 150, config: { moveDir: -1 } },
                { type: 'flyer', x: 6350, y: 190, config: { moveDir: 1 } }
            ]},
            { x: 6400, enemies: [
                { type: 'heavy', x: 6600, y: 370, config: {} },
                { type: 'heavy', x: 6700, y: 370, config: { patrolDir: -1 } },
                { type: 'grunt', x: 6800, y: 380, config: {} },
                { type: 'slime', x: 6850, y: 260, config: {} },
                { type: 'flying_eye', x: 6950, y: 160, config: { moveDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
        ],
        boss: {
            type: 'SENTINEL',
            x: 7500,
            y: 200,
            arenaStart: 7000,
            arenaEnd: 7900,
            name: 'OMEGA SENTINEL'
        }
    }
};
