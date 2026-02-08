// ============================================================================
// CYBER ASSAULT - Weapon Definitions
// ============================================================================

const WEAPONS = {
    PULSE: {
        name: 'Pulse Rifle',
        key: 'P',
        fireRate: 300,
        bulletCount: 1,
        spread: 0,
        damage: 1,
        bulletSpeed: 500,
        bulletKey: 'bullet1',
        color: 0xffff00
    },
    SPREAD: {
        name: 'Spread Shot',
        key: 'S',
        fireRate: 400,
        bulletCount: 5,
        spread: 30,
        damage: 1,
        bulletSpeed: 450,
        bulletKey: 'bullet2',
        color: 0xff6600
    },
    LASER: {
        name: 'Laser',
        key: 'L',
        fireRate: 20,
        bulletCount: 1,
        spread: 0,
        damage: 2,
        bulletSpeed: 700,
        bulletKey: 'bullet1',
        color: 0x00ffff
    },
    RAPID: {
        name: 'Rapid Fire',
        key: 'R',
        fireRate: 100,
        bulletCount: 1,
        spread: 5,
        damage: 1,
        bulletSpeed: 550,
        bulletKey: 'bullet2',
        color: 0xffff00
    }
};

const POWERUP_TYPES = {
    SPREAD: { weapon: 'SPREAD', label: 'S', color: 0xff6600, dropRate: 0.30 },
    LASER:  { weapon: 'LASER',  label: 'L', color: 0x00ffff, dropRate: 0.20 },
    RAPID:  { weapon: 'RAPID',  label: 'R', color: 0xffff00, dropRate: 0.25 },
    SHIELD: { weapon: null,     label: 'B', color: 0x0088ff, dropRate: 0.10 },
    HEALTH: { weapon: null,     label: '+', color: 0x00ff00, dropRate: 0.10 },
    LIFE:   { weapon: null,     label: '1UP', color: 0xff00ff, dropRate: 0.05 }
};
