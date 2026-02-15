// ============================================================================
// CYBER ASSAULT - Level Definitions (All 5 Levels)
// ============================================================================

const LEVEL_DATA = {
    // ========================================================================
    // LEVEL 1 - Industrial Base
    // ========================================================================
    1: {
        name: 'Industrial Base',
        width: 13200,
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
            // ── Section 1: Intro (0-2000) ──
            { x: -200, y: 420, w: 1600, h: 30 },
            { x: 1500, y: 420, w: 500,  h: 30 },

            // Elevated platforms over ground
            { x: 300,  y: 330, w: 200, h: 20 },
            { x: 650,  y: 270, w: 150, h: 20 },
            { x: 1000, y: 310, w: 180, h: 20 },
            { x: 1600, y: 330, w: 200, h: 20 },
            // High bonus platform
            { x: 700,  y: 190, w: 120, h: 20 },

            // ── Parkour Section 1 (2000-2800) ──
            // Floor segments with gaps between them — fire in the gaps
            { x: 2000, y: 420, w: 200, h: 30 },
            { x: 2350, y: 420, w: 200, h: 30 },  // gap 150px, fire between
            { x: 2700, y: 420, w: 200, h: 30 },  // gap 150px, fire between

            // ── Section 2: Mid Combat (2900-5000) ──
            { x: 2900, y: 420, w: 1000, h: 30 },
            { x: 4000, y: 420, w: 1000, h: 30 },

            // Elevated platforms
            { x: 2950, y: 320, w: 200, h: 20 },
            { x: 3200, y: 260, w: 180, h: 20 },
            { x: 3500, y: 330, w: 150, h: 20 },
            { x: 4100, y: 330, w: 150, h: 20 },
            { x: 4400, y: 270, w: 200, h: 20 },
            { x: 4700, y: 320, w: 180, h: 20 },
            // High bonus platform
            { x: 3100, y: 180, w: 120, h: 20 },

            // ── Parkour Section 2 (5000-5800) ──
            // More gaps, faster fire timing
            { x: 5000, y: 420, w: 180, h: 30 },
            { x: 5320, y: 420, w: 160, h: 30 },  // gap 140px, fire
            { x: 5620, y: 420, w: 160, h: 30 },  // gap 140px, fire
            { x: 5920, y: 420, w: 180, h: 30 },  // gap 140px, fire

            // ── Section 3: Late Combat (6100-8000) ──
            { x: 6100, y: 420, w: 900, h: 30 },
            { x: 7100, y: 420, w: 900, h: 30 },

            // Elevated platforms
            { x: 6200, y: 290, w: 200, h: 20 },
            { x: 6450, y: 330, w: 150, h: 20 },
            { x: 6700, y: 270, w: 180, h: 20 },
            { x: 7200, y: 320, w: 150, h: 20 },
            { x: 7450, y: 270, w: 200, h: 20 },
            { x: 7700, y: 300, w: 150, h: 20 },
            // High bonus platform
            { x: 6600, y: 190, w: 120, h: 20 },

            // ── Parkour Section 3 (8000-8800) ──
            // Hardest — more gaps, tight fire timing
            { x: 8000, y: 420, w: 160, h: 30 },
            { x: 8300, y: 420, w: 140, h: 30 },  // gap 140px, fire
            { x: 8580, y: 420, w: 140, h: 30 },  // gap 140px, fire
            { x: 8860, y: 420, w: 140, h: 30 },  // gap 140px, fire
            { x: 9140, y: 420, w: 160, h: 30 },  // gap 140px, fire

            // ── Section 4: Final Push (9300-10100) ──
            { x: 9300, y: 420, w: 800, h: 30 },

            // Elevated platforms
            { x: 9400, y: 330, w: 200, h: 20 },
            { x: 9700, y: 270, w: 180, h: 20 },

            // ── Parkour Section 4 (10100-10800) ──
            // Pre-boss gauntlet — 3 fire gaps
            { x: 10100, y: 420, w: 160, h: 30 },
            { x: 10400, y: 420, w: 140, h: 30 },  // gap 140px, fire
            { x: 10680, y: 420, w: 140, h: 30 },  // gap 140px, fire
            { x: 10960, y: 420, w: 160, h: 30 },  // gap 140px, fire

            // ── Pre-Boss Combat (11120-12000) ──
            { x: 11120, y: 420, w: 880, h: 30 },

            // Elevated platforms
            { x: 11200, y: 330, w: 180, h: 20 },
            { x: 11500, y: 270, w: 150, h: 20 },

            // ── Empty Buffer → Boss Arena (12000-13200) ──
            { x: 12000, y: 420, w: 1200, h: 30 }
        ],
        firePits: [
            // Parkour 1 — fire in each gap between floor segments
            { x: 2275, y: 420, h: 80, onTime: 1200, offTime: 2200, startOff: true },
            { x: 2625, y: 420, h: 80, onTime: 1200, offTime: 2200 },

            // Parkour 2 — faster timing
            { x: 5240, y: 420, h: 80, onTime: 1400, offTime: 1800, startOff: true },
            { x: 5540, y: 420, h: 80, onTime: 1400, offTime: 1800 },
            { x: 5840, y: 420, h: 80, onTime: 1200, offTime: 1600, startOff: true },

            // Parkour 3 — tight timing
            { x: 8230, y: 420, h: 80, onTime: 1200, offTime: 1500, startOff: true },
            { x: 8510, y: 420, h: 80, onTime: 1200, offTime: 1500 },
            { x: 8790, y: 420, h: 80, onTime: 1000, offTime: 1400, startOff: true },
            { x: 9070, y: 420, h: 80, onTime: 1000, offTime: 1400 },

            // Parkour 4 — pre-boss gauntlet
            { x: 10330, y: 420, h: 80, onTime: 1200, offTime: 1400, startOff: true },
            { x: 10610, y: 420, h: 80, onTime: 1200, offTime: 1400 },
            { x: 10890, y: 420, h: 80, onTime: 1000, offTime: 1200, startOff: true }
        ],
        enemyTriggers: [
            // Section 1: Intro (0-2000)
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
            { x: 1700, enemies: [
                { type: 'grunt', x: 1800, y: 380, config: { patrolDir: -1, patrolRange: 50 } },
                { type: 'grunt', x: 1900, y: 380, config: {} }
            ]},

            // Section 2: Mid Combat (2900-5000)
            // Ground: 2900-3900, 4000-5000
            { x: 2950, enemies: [
                { type: 'grunt', x: 3050, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 3200, y: 380, config: {} },
                { type: 'grunt', x: 2950, y: 290, config: { patrolDir: 1, patrolRange: 60 } }
            ]},
            { x: 3300, enemies: [
                { type: 'grunt', x: 3350, y: 230, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'heavy', x: 3500, y: 370, config: { patrolDir: -1 } }
            ]},
            { x: 3700, enemies: [
                { type: 'grunt', x: 3750, y: 300, config: { patrolDir: -1, patrolRange: 50 } },
                { type: 'grunt', x: 4100, y: 380, config: {} },
                { type: 'grunt', x: 4200, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 4200, enemies: [
                { type: 'grey_mech', x: 4400, y: 350, config: { patrolDir: -1, patrolRange: 180 } }
            ]},
            { x: 4600, enemies: [
                { type: 'heavy', x: 4700, y: 370, config: { patrolRange: 200 } },
                { type: 'grunt', x: 4800, y: 380, config: {} },
                { type: 'grunt', x: 4700, y: 240, config: { patrolDir: -1, patrolRange: 60 } }
            ]},

            // Section 3: Late Combat (6100-8000)
            // Ground: 6100-7000, 7100-8000
            { x: 6200, enemies: [
                { type: 'heavy', x: 6300, y: 370, config: {} },
                { type: 'grunt', x: 6400, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 6200, y: 260, config: { patrolRange: 60 } }
            ]},
            { x: 6500, enemies: [
                { type: 'grunt', x: 6600, y: 380, config: {} },
                { type: 'grunt', x: 6700, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 6700, y: 240, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'heavy', x: 6800, y: 370, config: { patrolDir: -1 } }
            ]},
            { x: 6900, enemies: [
                { type: 'grey_mech', x: 7200, y: 350, config: { patrolDir: -1, patrolRange: 200 } }
            ]},
            { x: 7300, enemies: [
                { type: 'heavy', x: 7400, y: 370, config: {} },
                { type: 'grunt', x: 7500, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 7450, y: 240, config: { patrolDir: 1, patrolRange: 80 } }
            ]},
            { x: 7600, enemies: [
                { type: 'grunt', x: 7700, y: 380, config: {} },
                { type: 'heavy', x: 7800, y: 370, config: { patrolDir: -1 } }
            ]},

            // Section 4: Final Push (9300-10100) + Boss Approach (11120-12000)
            // Ground: 9300-10100, then parkour 4, then 11120-12000
            { x: 9400, enemies: [
                { type: 'grunt', x: 9500, y: 380, config: { patrolDir: -1 } },
                { type: 'grunt', x: 9600, y: 380, config: {} },
                { type: 'heavy', x: 9650, y: 370, config: { patrolDir: -1 } }
            ]},
            { x: 9700, enemies: [
                { type: 'grey_mech', x: 9900, y: 350, config: { patrolDir: -1, patrolRange: 150 } },
                { type: 'grunt', x: 9700, y: 240, config: { patrolDir: 1, patrolRange: 60 } }
            ]},
            // Pre-Boss Combat (11120-12000)
            { x: 11100, enemies: [
                { type: 'heavy', x: 11200, y: 370, config: {} },
                { type: 'grunt', x: 11300, y: 380, config: { patrolDir: -1 } },
                { type: 'heavy', x: 11400, y: 370, config: {} },
                { type: 'grunt', x: 11500, y: 240, config: { patrolDir: 1, patrolRange: 80 } }
            ]}
        ],
        checkpoints: [
            { x: 1000, y: 380 },   // mid intro
            { x: 1800, y: 380 },   // before parkour 1
            { x: 2900, y: 380 },   // after parkour 1
            { x: 3500, y: 380 },   // mid combat 2a
            { x: 4500, y: 380 },   // mid combat 2b
            { x: 5000, y: 380 },   // before parkour 2
            { x: 6100, y: 380 },   // after parkour 2
            { x: 7100, y: 380 },   // mid combat 3
            { x: 7800, y: 380 },   // before parkour 3
            { x: 9300, y: 380 },   // after parkour 3
            { x: 9900, y: 380 },   // before parkour 4
            { x: 11120, y: 380 },  // pre-boss combat
            { x: 12200, y: 380 }   // boss arena
        ],
        fixedDrops: [
            { x: 1800, y: 380, type: 'DOUBLE_JUMP' },  // before parkour 1
            { x: 3500, y: 380, type: 'SHIELD' },
            { x: 4900, y: 380, type: 'DOUBLE_JUMP' },   // before parkour 2
            { x: 7900, y: 380, type: 'DOUBLE_JUMP' },   // before parkour 3
            { x: 9900, y: 380, type: 'DOUBLE_JUMP' }    // before parkour 4
        ],
        boss: {
            type: 'TANK',
            x: 12900,
            y: 370,
            arenaStart: 12200,
            arenaEnd: 13100,
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
            // ── Section 1: Intro (0-1800) — easy gaps, learn the cavern ──
            { x: -200, y: 420, w: 900,  h: 30 },
            { x: 900,  y: 420, w: 500,  h: 30 },
            { x: 1600, y: 420, w: 500,  h: 30 },

            // Stepping stones over first gaps
            { x: 350,  y: 330, w: 120, h: 20 },
            { x: 550,  y: 250, w: 100, h: 20 },
            { x: 1000, y: 320, w: 110, h: 20 },
            { x: 1200, y: 240, w: 100, h: 20 },

            // ── Section 2: Wider gaps (1800-3500) — gaps need platforms ──
            { x: 2100, y: 420, w: 400,  h: 30 },   // 200px gap before
            { x: 2800, y: 420, w: 350,  h: 30 },   // 300px gap — need stepping stone
            { x: 3500, y: 420, w: 400,  h: 30 },   // 350px gap — need stepping stone

            // Bridge platforms over wide gaps
            { x: 1850, y: 350, w: 100, h: 20 },    // bridge: 1600 block → 2100 block
            { x: 2000, y: 300, w: 100, h: 20 },
            { x: 2550, y: 340, w: 100, h: 20 },    // bridge: 2500 → 2800
            { x: 2650, y: 270, w: 100, h: 20 },
            { x: 3200, y: 350, w: 110, h: 20 },    // bridge: 3150 → 3500
            { x: 3350, y: 280, w: 100, h: 20 },

            // High platforms (need double jump or chaining)
            { x: 2200, y: 240, w: 120, h: 20 },
            { x: 2400, y: 170, w: 100, h: 20 },
            { x: 3000, y: 200, w: 120, h: 20 },

            // ── Section 3: Vertical challenge (3500-5200) — mech territory ──
            { x: 4000, y: 420, w: 500,  h: 30 },   // 100px gap
            { x: 4800, y: 420, w: 400,  h: 30 },   // 300px gap — need platform

            // Stepping stones and elevated combat
            { x: 3600, y: 320, w: 110, h: 20 },
            { x: 3800, y: 240, w: 120, h: 20 },
            { x: 4100, y: 310, w: 120, h: 20 },
            { x: 4300, y: 230, w: 100, h: 20 },
            { x: 4550, y: 340, w: 110, h: 20 },    // bridge over 300px gap
            { x: 4680, y: 270, w: 100, h: 20 },

            // High secret area
            { x: 3900, y: 150, w: 150, h: 20 },

            // ── Section 4: Gauntlet (5200-6800) — hardest platforming ──
            { x: 5200, y: 420, w: 350,  h: 30 },
            { x: 5900, y: 420, w: 300,  h: 30 },   // 350px gap — need bridge
            { x: 6500, y: 420, w: 300,  h: 30 },   // 300px gap — need bridge

            // Bridge platforms over dangerous gaps
            { x: 5600, y: 350, w: 100, h: 20 },
            { x: 5750, y: 270, w: 100, h: 20 },
            { x: 5550, y: 190, w: 110, h: 20 },

            { x: 6250, y: 340, w: 100, h: 20 },
            { x: 6380, y: 260, w: 100, h: 20 },

            // High reward platforms
            { x: 5300, y: 250, w: 110, h: 20 },
            { x: 5100, y: 180, w: 100, h: 20 },
            { x: 6100, y: 200, w: 120, h: 20 },

            // ── Boss Arena (6800-8000) ──
            { x: 6800, y: 420, w: 1200, h: 30 }
        ],
        firePits: [
            // Section 1: Intro gaps
            { x: 800,  y: 420, h: 80, onTime: 1200, offTime: 2200, startOff: true },
            { x: 1500, y: 420, h: 80, onTime: 1200, offTime: 2200 },
            // Section 2: Wider gaps
            { x: 2650, y: 420, h: 80, onTime: 1400, offTime: 1800, startOff: true },
            { x: 3325, y: 420, h: 80, onTime: 1400, offTime: 1800 },
            // Section 3: Mech territory
            { x: 4650, y: 420, h: 80, onTime: 1200, offTime: 1600, startOff: true },
            // Section 4: Gauntlet
            { x: 5725, y: 420, h: 80, onTime: 1200, offTime: 1400, startOff: true },
            { x: 6350, y: 420, h: 80, onTime: 1000, offTime: 1400 }
        ],
        enemyTriggers: [
            // Section 1: Intro
            { x: 300, enemies: [
                { type: 'grunt', x: 500, y: 380, config: {} }
            ]},
            { x: 800, enemies: [
                { type: 'heavy', x: 1000, y: 370, config: { patrolDir: -1 } },
                { type: 'grunt', x: 1100, y: 290, config: { patrolDir: 1, patrolRange: 40 } }
            ]},
            { x: 1400, enemies: [
                { type: 'grunt', x: 1700, y: 380, config: {} },
                { type: 'flyer', x: 1800, y: 180, config: { moveDir: -1 } }
            ]},
            // Section 2: Wider gaps
            { x: 2000, enemies: [
                { type: 'heavy', x: 2200, y: 370, config: {} },
                { type: 'grunt', x: 2350, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 2600, enemies: [
                { type: 'grunt', x: 2900, y: 380, config: { patrolDir: -1 } },
                { type: 'heavy', x: 3000, y: 370, config: {} },
                { type: 'flyer', x: 2800, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 3200, enemies: [
                { type: 'grunt', x: 3400, y: 250, config: { patrolDir: 1, patrolRange: 40 } },
                { type: 'grunt', x: 3600, y: 380, config: {} }
            ]},
            // Section 3: Mech territory
            { x: 3800, enemies: [
                { type: 'cyan_mech', x: 4200, y: 350, config: { patrolDir: -1, patrolRange: 200 } }
            ]},
            { x: 3700, enemies: [
                { type: 'grunt', x: 3650, y: 290, config: { patrolDir: 1, patrolRange: 40 } },
                { type: 'heavy', x: 4150, y: 280, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'flyer', x: 4400, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 4500, enemies: [
                { type: 'heavy', x: 4900, y: 370, config: {} },
                { type: 'grunt', x: 5000, y: 380, config: { patrolDir: -1 } }
            ]},
            // Section 4: Gauntlet
            { x: 5000, enemies: [
                { type: 'grunt', x: 5300, y: 380, config: {} },
                { type: 'grunt', x: 5400, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 5500, y: 180, config: { moveDir: -1 } }
            ]},
            { x: 5600, enemies: [
                { type: 'heavy', x: 5950, y: 370, config: { patrolDir: -1 } },
                { type: 'grunt', x: 6050, y: 380, config: {} },
                { type: 'flyer', x: 6100, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 6300, enemies: [
                { type: 'heavy', x: 6550, y: 370, config: {} },
                { type: 'grunt', x: 6650, y: 380, config: { patrolDir: -1 } },
                { type: 'flyer', x: 6700, y: 160, config: { moveDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 2100, y: 380 },
            { x: 4000, y: 380 },
            { x: 5900, y: 380 }
        ],
        fixedDrops: [
            { x: 3900, y: 110, type: 'SHIELD' }
        ],
        boss: {
            type: 'MECH',
            x: 7700,
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
            // ── Ground — widened gaps, progressive difficulty ──
            { x: -200, y: 420, w: 700,  h: 30 },    // P1: -200 to 500
            { x: 650,  y: 420, w: 400,  h: 30 },    // P2: 650 to 1050
            { x: 1200, y: 420, w: 400,  h: 30 },    // P3: 1200 to 1600
            { x: 1750, y: 420, w: 550,  h: 30 },    // P4: 1750 to 2300
            { x: 2450, y: 420, w: 400,  h: 30 },    // P5: 2450 to 2850
            { x: 3100, y: 420, w: 500,  h: 30 },    // P6: 3100 to 3600
            { x: 3850, y: 420, w: 400,  h: 30 },    // P7: 3850 to 4250
            { x: 4500, y: 420, w: 350,  h: 30 },    // P8: 4500 to 4850
            { x: 5150, y: 420, w: 400,  h: 30 },    // P9: 5150 to 5550
            { x: 5850, y: 420, w: 350,  h: 30 },    // P10: 5850 to 6200
            { x: 6500, y: 420, w: 1500, h: 30 },    // P11: 6500 to 8000 (boss)

            // ── Rocky outcrop bridges over wide gaps (250-300px) ──
            { x: 2950, y: 395, w: 80, h: 18 },      // bridge: gap 2850-3100
            { x: 3700, y: 395, w: 80, h: 18 },      // bridge: gap 3600-3850
            { x: 4350, y: 395, w: 80, h: 18 },      // bridge: gap 4250-4500
            { x: 4970, y: 390, w: 80, h: 18 },      // bridge: gap 4850-5150
            { x: 5670, y: 390, w: 80, h: 18 },      // bridge: gap 5550-5850
            { x: 6320, y: 390, w: 80, h: 18 },      // bridge: gap 6200-6500

            // ── Elevated platforms at various heights ──
            { x: 200,  y: 330, w: 130, h: 18 },
            { x: 450,  y: 260, w: 100, h: 18 },
            { x: 750,  y: 300, w: 140, h: 18 },
            { x: 1000, y: 230, w: 110, h: 18 },
            { x: 1350, y: 310, w: 130, h: 18 },
            { x: 1500, y: 240, w: 100, h: 18 },
            { x: 1900, y: 320, w: 150, h: 18 },
            { x: 2100, y: 250, w: 120, h: 18 },
            { x: 2250, y: 180, w: 100, h: 18 },
            { x: 2600, y: 300, w: 130, h: 18 },
            { x: 2750, y: 220, w: 110, h: 18 },
            { x: 3200, y: 310, w: 140, h: 18 },
            { x: 3950, y: 260, w: 120, h: 18 },
            { x: 4200, y: 190, w: 100, h: 18 },
            { x: 4550, y: 310, w: 130, h: 18 },
            { x: 4700, y: 240, w: 110, h: 18 },
            { x: 5200, y: 320, w: 140, h: 18 },
            { x: 5400, y: 250, w: 100, h: 18 },
            { x: 5500, y: 180, w: 120, h: 18 },
            { x: 5900, y: 300, w: 130, h: 18 },
            { x: 6100, y: 230, w: 100, h: 18 },
            { x: 6550, y: 310, w: 140, h: 18 },
            { x: 6700, y: 250, w: 120, h: 18 }
        ],
        firePits: [
            // Early gaps (150-200px) — gentle timing
            { x: 575,  y: 420, h: 80, onTime: 1200, offTime: 2200, startOff: true },
            { x: 1125, y: 420, h: 80, onTime: 1200, offTime: 2200 },
            { x: 1675, y: 420, h: 80, onTime: 1200, offTime: 2000, startOff: true },
            // Mid gaps (150-250px) — moderate timing
            { x: 2375, y: 420, h: 80, onTime: 1400, offTime: 1800 },
            { x: 2975, y: 420, h: 80, onTime: 1400, offTime: 1800, startOff: true },
            { x: 3725, y: 420, h: 80, onTime: 1200, offTime: 1600 },
            // Late gaps (250-300px) — tighter timing
            { x: 4375, y: 420, h: 80, onTime: 1200, offTime: 1500, startOff: true },
            { x: 5000, y: 420, h: 80, onTime: 1200, offTime: 1500 },
            { x: 5700, y: 420, h: 80, onTime: 1000, offTime: 1400, startOff: true },
            { x: 6350, y: 420, h: 80, onTime: 1000, offTime: 1200 }
        ],
        enemyTriggers: [
            { x: 300, enemies: [
                { type: 'flying_eye', x: 500, y: 180, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 550, y: 220, config: { moveDir: 1 } },
                { type: 'grunt', x: 450, y: 380, config: {} }
            ]},
            { x: 800, enemies: [
                { type: 'flying_eye', x: 1000, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 1050, y: 200, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 1100, y: 240, config: { moveDir: 1 } }
            ]},
            { x: 1200, enemies: [
                { type: 'grunt', x: 1300, y: 380, config: {} },
                { type: 'grunt', x: 1400, y: 280, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 1600, y: 180, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 1650, y: 220, config: { moveDir: 1 } }
            ]},
            { x: 800, enemies: [
                { type: 'heavy', x: 1500, y: 370, config: {} },
                { type: 'flying_eye', x: 2000, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 2050, y: 200, config: { moveDir: -1 } }
            ]},
            { x: 1400, enemies: [
                { type: 'grunt', x: 1900, y: 380, config: {} },
                { type: 'grunt', x: 2150, y: 380, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 2100, y: 180, config: { moveDir: -1 } }
            ]},
            { x: 2300, enemies: [
                { type: 'flying_eye', x: 2500, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 2550, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 2600, y: 230, config: { moveDir: -1 } },
                { type: 'grunt', x: 2700, y: 380, config: {} }
            ]},
            { x: 1800, enemies: [
                { type: 'heavy', x: 2700, y: 370, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 3300, y: 160, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 3350, y: 200, config: { moveDir: 1 } }
            ]},
            { x: 2600, enemies: [
                { type: 'orange_mech', x: 3400, y: 350, config: { patrolDir: -1, patrolRange: 200 } }
            ]},
            { x: 3500, enemies: [
                { type: 'flying_eye', x: 3700, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 3750, y: 190, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 3800, y: 230, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 3850, y: 170, config: { moveDir: 1 } },
                { type: 'grunt', x: 3900, y: 380, config: { patrolDir: -1 } }
            ]},
            { x: 3800, enemies: [
                { type: 'heavy', x: 4550, y: 370, config: {} },
                { type: 'grunt', x: 4650, y: 380, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 4600, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 4800, enemies: [
                { type: 'flying_eye', x: 5000, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 5050, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 5100, y: 140, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 5150, y: 210, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 5200, y: 170, config: { moveDir: -1 } }
            ]},
            { x: 4200, enemies: [
                { type: 'heavy', x: 5300, y: 370, config: {} },
                { type: 'grunt', x: 5400, y: 220, config: { patrolDir: -1 } },
                { type: 'flying_eye', x: 5500, y: 160, config: { moveDir: -1 } }
            ]},
            { x: 6000, enemies: [
                { type: 'flying_eye', x: 6200, y: 150, config: { moveDir: -1 } },
                { type: 'flying_eye', x: 6250, y: 190, config: { moveDir: 1 } },
                { type: 'flying_eye', x: 6300, y: 230, config: { moveDir: -1 } },
                { type: 'heavy', x: 6600, y: 370, config: { patrolDir: -1 } }
            ]}
        ],
        checkpoints: [
            { x: 2000, y: 380 },
            { x: 4000, y: 380 },
            { x: 6000, y: 380 }
        ],
        fixedDrops: [
            { x: 2400, y: 380, type: 'DOUBLE_JUMP' },
            { x: 3200, y: 380, type: 'SHIELD' }
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
        firePits: [
            // Early gaps — gentle timing
            { x: 1350, y: 420, h: 80, onTime: 1200, offTime: 2200, startOff: true },
            { x: 1850, y: 420, h: 80, onTime: 1200, offTime: 2200 },
            // Mid gaps — moderate timing
            { x: 2550, y: 420, h: 80, onTime: 1400, offTime: 1800, startOff: true },
            { x: 3150, y: 420, h: 80, onTime: 1400, offTime: 1800 },
            // Post-mech gaps — tighter timing
            { x: 4350, y: 420, h: 80, onTime: 1200, offTime: 1600, startOff: true },
            { x: 4950, y: 420, h: 80, onTime: 1200, offTime: 1500 },
            // Late gaps — tight timing
            { x: 5650, y: 420, h: 80, onTime: 1000, offTime: 1400, startOff: true },
            { x: 6150, y: 420, h: 80, onTime: 1000, offTime: 1400 }
        ],
        enemyTint: 0x6688ee,
        enemyTriggers: [
            // Floor 0-700 (easy intro)
            { x: 300, enemies: [
                { type: 'grunt', x: 500, y: 380, config: {} },
                { type: 'octopus', x: 550, y: 180, config: { moveDir: -1 } }
            ]},
            // Floor 800-1300
            { x: 700, enemies: [
                { type: 'heavy', x: 1000, y: 370, config: { patrolRange: 120 } },
                { type: 'grunt', x: 1130, y: 190, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'v1_turret', x: 1020, y: 280, config: {} }
            ]},
            // Floor 1400-1800
            { x: 1200, enemies: [
                { type: 'heavy', x: 1500, y: 370, config: {} },
                { type: 'octopus', x: 1550, y: 150, config: { moveDir: -1 } },
                { type: 'v1_turret', x: 1780, y: 400, config: {} }
            ]},
            // Floor 1900-2500
            { x: 1700, enemies: [
                { type: 'grunt', x: 1900, y: 380, config: {} },
                { type: 'heavy', x: 2100, y: 370, config: { patrolDir: -1 } },
                { type: 'octopus', x: 2200, y: 160, config: { moveDir: -1 } },
                { type: 'slime', x: 2400, y: 380, config: {} }
            ]},
            // Floor 2600-3100
            { x: 2300, enemies: [
                { type: 'heavy', x: 2800, y: 370, config: {} },
                { type: 'grunt', x: 2730, y: 290, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'slime', x: 2980, y: 380, config: {} }
            ]},
            // Floor 3200-3800
            { x: 3000, enemies: [
                { type: 'heavy', x: 3400, y: 370, config: { patrolDir: -1 } },
                { type: 'octopus', x: 3600, y: 160, config: { moveDir: -1 } },
                { type: 'v1_turret', x: 3780, y: 400, config: {} }
            ]},
            // Floor 3900-4300 + Blue Mech
            { x: 3700, enemies: [
                { type: 'blue_mech', x: 4000, y: 350, config: { patrolDir: -1, patrolRange: 200 } }
            ]},
            // Floor 4400-4900
            { x: 4200, enemies: [
                { type: 'heavy', x: 4600, y: 370, config: {} },
                { type: 'grunt', x: 4530, y: 270, config: { patrolDir: -1, patrolRange: 40 } },
                { type: 'octopus', x: 4950, y: 150, config: { moveDir: -1 } },
                { type: 'slime', x: 4800, y: 380, config: {} }
            ]},
            // Floor 5000-5600
            { x: 5000, enemies: [
                { type: 'heavy', x: 5400, y: 370, config: {} },
                { type: 'grunt', x: 5080, y: 290, config: { patrolDir: 1, patrolRange: 40 } },
                { type: 'v1_turret', x: 5580, y: 400, config: {} }
            ]},
            // Floor 5700-6100
            { x: 5700, enemies: [
                { type: 'heavy', x: 5900, y: 370, config: { patrolDir: -1 } },
                { type: 'octopus', x: 6050, y: 190, config: { moveDir: 1 } },
                { type: 'slime', x: 6000, y: 380, config: {} }
            ]},
            // Floor 6200-6700
            { x: 6100, enemies: [
                { type: 'heavy', x: 6400, y: 370, config: {} },
                { type: 'grunt', x: 6330, y: 290, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'v1_turret', x: 6630, y: 220, config: {} }
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
            { x: 1200, y: 380 },   // Floor B
            { x: 2000, y: 380 },   // Floor D
            { x: 3000, y: 380 },   // Floor E
            { x: 4000, y: 380 },   // Floor G
            { x: 5000, y: 380 },   // Floor I
            { x: 6000, y: 380 },   // Floor K
            { x: 6800, y: 380 }    // Floor L (pre-boss)
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
        width: 8400,
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
        endZoneX: 8200,
        platforms: [
            // ============================================================
            // ROOM 1: Entry Hall (0-1200)
            // ============================================================
            { x: -30,  y: 0,   w: 30,   h: 450 },  // left wall (prevents falling off)
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
            { x: 2600, y: 100, w: 250,  h: 270 },  // wall above crawl (y=100 to y=370, flush with ceiling)
            { x: 2600, y: 370, w: 250,  h: 20 },   // crawl tunnel ceiling (bottom at 390, gap=30px)

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
            { x: 4200, y: 100, w: 600,  h: 270 },  // wall above crawl (y=100 to y=370, flush with ceiling)
            { x: 4200, y: 370, w: 600,  h: 20 },   // crawl tunnel ceiling (bottom at 390, gap=30px)
            // Platforms after crawl exit
            { x: 4800, y: 300, w: 300,  h: 20 },   // mid platform
            { x: 4800, y: 180, w: 300,  h: 20 },   // upper platform (above mid, reachable via ladder)

            // ============================================================
            // ROOM 6: Heavy Combat Arena (5400-6400)
            // ============================================================
            { x: 5400, y: 420, w: 1000, h: 30 },   // floor
            { x: 5400, y: 100, w: 1000, h: 30 },   // ceiling
            { x: 5500, y: 300, w: 200,  h: 20 },   // left platform
            { x: 5900, y: 300, w: 200,  h: 20 },   // right platform
            { x: 5700, y: 180, w: 200,  h: 20 },   // center high platform (needs ladder)

            // ============================================================
            // ROOM 7: Final Gauntlet (6400-7600)
            // ============================================================
            { x: 6400, y: 420, w: 1200, h: 30 },   // floor
            // Crawl section (6400-6800)
            { x: 6400, y: 100, w: 400,  h: 270 },  // wall above crawl (y=100 to y=370, flush with ceiling)
            { x: 6400, y: 370, w: 400,  h: 20 },   // crawl tunnel ceiling (bottom at 390, gap=30px)
            // Open section (6800-7600) — mech mini-boss arena
            { x: 6800, y: 100, w: 800,  h: 30 },   // ceiling for open area
            { x: 7000, y: 280, w: 200,  h: 20 },   // left platform
            { x: 7300, y: 280, w: 200,  h: 20 },   // right platform

            // ============================================================
            // ROOM 8: Boss Arena (7600-8300)
            // ============================================================
            { x: 7600, y: 420, w: 700,  h: 30 },    // floor
            { x: 7600, y: 100, w: 700,  h: 30 }     // ceiling
        ],

        // Destructible walls
        destructibleWalls: [
            // Room 2: splits arena between the two platforms
            { x: 1700, y: 130, w: 40, h: 290, hp: 8 },
            // Room 5: at crawl tunnel exit (floor-to-ceiling)
            { x: 4780, y: 130, w: 40, h: 290, hp: 8 },
            // Room 6: blocks center of arena (floor-to-ceiling)
            { x: 5750, y: 130, w: 40, h: 290, hp: 10 },
            // Room 7: at end of crawl tunnel (shoot while crawling)
            { x: 6780, y: 365, w: 40, h: 55, hp: 6 },
            // Room 7: blocks path to boss arena (floor-to-ceiling)
            { x: 7550, y: 130, w: 40, h: 290, hp: 10 }
        ],

        // Ladders
        ladders: [
            // Room 4: full-height ladder for vertical shaft
            { x: 3500, y: 180, w: 30, h: 240 },
            // Room 5: full-height ladder from floor to upper (serves mid + upper platforms)
            { x: 4850, y: 180, w: 30, h: 240 },
            // Room 6: reach center high platform
            { x: 5750, y: 180, w: 30, h: 240 },
            // Room 7: reach left platform in open area
            { x: 7050, y: 280, w: 30, h: 140 },
            // Room 7: reach right platform
            { x: 7350, y: 280, w: 30, h: 140 }
        ],

        // Crawl zones (30px gap between ceiling bottom at 390 and floor at 420)
        crawlZones: [
            // Room 3: through the wall
            { x: 2600, y: 390, w: 250, h: 30 },
            // Room 5: entry corridor
            { x: 4200, y: 390, w: 600, h: 30 },
            // Room 7: final crawl section
            { x: 6400, y: 390, w: 400, h: 30 }
        ],

        // Laser gates (floor-to-ceiling lightning barriers, extend into floor for depth)
        laserGates: [
            // Room 1: gauntlet of 5 laser gates with staggered timings
            { x: 475, y: 340, h: 100, onTime: 2000, offTime: 1500, startOff: true },
            { x: 650, y: 130, h: 310, onTime: 1800, offTime: 1800 },
            { x: 800, y: 130, h: 310, onTime: 2000, offTime: 2000, startOff: true },
            { x: 950, y: 130, h: 310, onTime: 1500, offTime: 1500 },
            { x: 1100, y: 130, h: 310, onTime: 2000, offTime: 1500, startOff: true },
            // Room 1-2 transition: between last gate and 2nd platform
            { x: 1250, y: 130, h: 310, onTime: 1800, offTime: 2000 },
            // Room 2: under left platform (x=1400-1600)
            { x: 1500, y: 320, h: 120, onTime: 2000, offTime: 1500, startOff: true },
            // Room 2: under right platform (x=1800-2000)
            { x: 1900, y: 320, h: 120, onTime: 1800, offTime: 1800 },
            // Room 2: floor-to-ceiling gauntlet before crawl tunnel
            { x: 2100, y: 130, h: 310, onTime: 1500, offTime: 2000 },
            { x: 2200, y: 130, h: 310, onTime: 2000, offTime: 1500, startOff: true },
            { x: 2300, y: 130, h: 310, onTime: 1800, offTime: 1800 },
            // Room 3: after crawl tunnel exit
            { x: 3050, y: 130, h: 310, onTime: 2000, offTime: 2000 },
            // Room 4: before Room 5 crawl space
            { x: 4100, y: 130, h: 310, onTime: 1800, offTime: 2000 },
            // Room 5: inside crawl tunnel (extend into floor for depth)
            { x: 4350, y: 390, h: 50, onTime: 1500, offTime: 2000 },
            { x: 4500, y: 390, h: 50, onTime: 2000, offTime: 1500, startOff: true },
            { x: 4650, y: 390, h: 50, onTime: 1800, offTime: 1800 },
            // Room 5: alternating pair in open area after crawl/climb
            { x: 5050, y: 130, h: 310, onTime: 2000, offTime: 2000 },
            { x: 5250, y: 130, h: 310, onTime: 2000, offTime: 2000, startOff: true },
            // Room 6: under left platform (x=5500-5700)
            { x: 5600, y: 320, h: 120, onTime: 1800, offTime: 2000 },
            // Room 6: under right platform (x=5900-6100)
            { x: 6000, y: 320, h: 120, onTime: 2000, offTime: 1800, startOff: true },
            // Room 7: corridor before boss
            { x: 7500, y: 130, h: 310, onTime: 1500, offTime: 1500 }
        ],

        // Explosive barrels
        explosiveBarrels: [
            // Room 2: between upper platforms
            { x: 1700, y: 402, hp: 2 },
            // Room 4: on mid platform
            { x: 3600, y: 282, hp: 2 },
            // Room 6: ground level near enemy clusters
            { x: 5650, y: 402, hp: 2 },
            { x: 5850, y: 402, hp: 2 },
            // Room 7: ground level
            { x: 7100, y: 402, hp: 2 },
            { x: 7350, y: 402, hp: 3 }
        ],

        // Lock doors (linked to enemy triggers by index)
        lockDoors: [
            // Room 7: blocks boss arena until green mech is defeated
            { x: 7580, y: 130, w: 40, h: 290, triggerIndex: 7 }
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
                { type: 'grunt', x: 2950, y: 380, config: { patrolDir: -1, patrolRange: 80 } }
            ]},
            // === Room 4 (trigger 3 — floor, upper, + flyers) ===
            { x: 3250, enemies: [
                { type: 'grunt', x: 3500, y: 380, config: { patrolDir: 1, patrolRange: 80 } },
                { type: 'grunt', x: 3700, y: 380, config: { patrolDir: -1, patrolRange: 80 } },
                { type: 'grunt', x: 3500, y: 150, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'flyer', x: 3400, y: 200, config: {} },
                { type: 'flyer', x: 3700, y: 250, config: {} },
                { type: 'flyer', x: 4000, y: 200, config: {} },
                { type: 'heavy', x: 3900, y: 370, config: { patrolDir: -1, patrolRange: 100 } }
            ]},
            // === Room 5 mid/upper (trigger 4) ===
            { x: 4800, enemies: [
                { type: 'grunt', x: 4900, y: 270, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'grunt', x: 5000, y: 270, config: { patrolDir: -1, patrolRange: 60 } }
            ]},
            // === Room 5 exit (trigger 5 — linked to lock door, all floor-level) ===
            { x: 4500, enemies: [
                { type: 'grunt', x: 4900, y: 380, config: { patrolDir: 1, patrolRange: 60 } },
                { type: 'heavy', x: 5100, y: 370, config: { patrolDir: -1, patrolRange: 100 } }
            ]},
            // === Room 6 (trigger 6 — linked to lock door, floor + platforms) ===
            { x: 5450, enemies: [
                { type: 'heavy', x: 5600, y: 370, config: { patrolDir: 1, patrolRange: 100 } },
                { type: 'heavy', x: 5900, y: 370, config: { patrolDir: -1, patrolRange: 100 } },
                { type: 'grunt', x: 5700, y: 380, config: { patrolDir: 1, patrolRange: 80 } },
                { type: 'grunt', x: 6100, y: 380, config: { patrolDir: -1, patrolRange: 80 } },
                { type: 'grunt', x: 5550, y: 270, config: { patrolDir: 1, patrolRange: 50 } },
                { type: 'grunt', x: 5950, y: 270, config: { patrolDir: -1, patrolRange: 50 } },
                { type: 'grunt', x: 5750, y: 150, config: { patrolDir: 1, patrolRange: 40 } }
            ]},
            // === Room 7 (trigger 7 — green mech mini-boss, linked to lock door) ===
            { x: 6800, enemies: [
                { type: 'green_mech', x: 7200, y: 370, config: { patrolDir: -1, patrolRange: 250 } }
            ]}
        ],

        checkpoints: [
            // After Room 1
            { x: 1180, y: 380 },
            // After Room 2
            { x: 2380, y: 380 },
            // After Room 3
            { x: 3180, y: 380 },
            // After Room 4
            { x: 4180, y: 380 },
            // After Room 5
            { x: 5380, y: 380 },
            // After Room 6
            { x: 6380, y: 380 },
            // After Room 7
            { x: 7580, y: 380 }
        ],
        fixedDrops: [
            { x: 430, y: 290, type: 'SPREAD' },
            { x: 4180, y: 380, type: 'SHIELD' }
        ],
        boss: {
            type: 'COREGUARDIAN',
            x: 7950,
            y: 220,
            arenaStart: 7600,
            arenaEnd: 8300,
            name: 'CORE GUARDIAN'
        }
    }
};
