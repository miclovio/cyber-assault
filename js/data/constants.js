// ============================================================================
// CYBER ASSAULT - Game Constants
// ============================================================================

const GAME_WIDTH = 800;
const GAME_HEIGHT = 450;
const LEVEL_WIDTH = 8000;

const PHYSICS = {
    GRAVITY: 800,
    PLAYER_SPEED: 200,
    PLAYER_JUMP: -380,
    PLAYER_CROUCH_SPEED: 80,
    MAX_FALL_SPEED: 500
};

const PLAYER_CONFIG = {
    MAX_HP: 3,
    MAX_LIVES: 3,
    INVULN_DURATION: 2000,
    BLINK_RATE: 100
};

const ENEMY_CONFIG = {
    GRUNT: { hp: 1, speed: 60, score: 100, fireRate: 2000, detectionRange: 400 },
    FLYER: { hp: 1, speed: 80, score: 150, amplitude: 50, frequency: 0.003, diveSpeed: 200 },
    FLYING_EYE: { hp: 2, speed: 100, score: 200, amplitude: 40, frequency: 0.004, diveSpeed: 250 },
    HEAVY: { hp: 3, speed: 40, score: 300, fireRate: 1500, burstCount: 3, burstDelay: 200 },
    GHOST: { hp: 2, speed: 50, score: 250, floatSpeed: 80 },
    TURRET: { hp: 5, speed: 0, score: 200, fireRate: 1200, detectionRange: 500 }
};

const BOSS_CONFIG = {
    TANK:     { hp: 30, score: 5000, speed: 60 },
    MECH:     { hp: 40, score: 7000, speed: 50 },
    FIRESKULL:{ hp: 35, score: 6000, speed: 80 },
    SENTINEL: { hp: 50, score: 10000, speed: 40 }
};

const POOL_SIZES = {
    PLAYER_BULLETS: 30,
    ENEMY_BULLETS: 50,
    ENEMIES_PER_TYPE: 15,
    EXPLOSIONS: 10,
    POWERUPS: 10
};

const COLORS = {
    HUD_BG: 0x000000,
    HEALTH_FULL: 0x00ff00,
    HEALTH_MED: 0xffff00,
    HEALTH_LOW: 0xff0000,
    SCORE_TEXT: '#ffffff',
    TITLE_TEXT: '#00ffff'
};

const EXTRA_LIFE_THRESHOLD = 50000;
