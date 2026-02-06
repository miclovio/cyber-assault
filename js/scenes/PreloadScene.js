// ============================================================================
// Preload Scene - Load ALL assets and create animations
// ============================================================================

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.createLoadingUI();
        this.loadPlayerAssets();
        this.loadEnemyAssets();
        this.loadBossAssets();
        this.loadEnvironmentAssets();
        this.loadEffectsAssets();
        this.loadUIAssets();
        this.loadAudio();
    }

    createLoadingUI() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(w / 2, h / 2, w, h, 0x000000);

        this.add.text(w / 2, h / 2 - 60, 'CYBER ASSAULT', {
            fontSize: '32px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        const barBg = this.add.rectangle(w / 2, h / 2, 400, 20, 0x333333);
        const bar = this.add.rectangle(w / 2 - 198, h / 2, 0, 16, 0x00ffff);
        bar.setOrigin(0, 0.5);

        const loadText = this.add.text(w / 2, h / 2 + 30, 'Loading... 0%', {
            fontSize: '14px', fontFamily: 'monospace', color: '#888888'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            bar.width = 396 * value;
            loadText.setText(`Loading... ${Math.floor(value * 100)}%`);
        });
    }

    loadPlayerAssets() {
        const base = 'Assets/Characters/space-marine/Sprites';

        // Idle
        for (let i = 1; i <= 4; i++) this.load.image(`idle${i}`, `${base}/Idle/sprites/idle${i}.png`);
        // Idle Gun
        for (let i = 1; i <= 4; i++) this.load.image(`idle-gun${i}`, `${base}/Idle Gun/sprites/idle-gun${i}.png`);
        // Run
        for (let i = 1; i <= 10; i++) this.load.image(`run${i}`, `${base}/Run/sprites/run${i}.png`);
        // Run with Gun
        for (let i = 1; i <= 10; i++) this.load.image(`run-gun${i}`, `${base}/Run with Gun/sprites/run-with-gun${i}.png`);
        // Jump with Gun
        for (let i = 1; i <= 5; i++) this.load.image(`jump-gun${i}`, `${base}/Jump with Gun/sprites/jump-with-gun${i}.png`);
        // Jump no Gun
        for (let i = 1; i <= 6; i++) this.load.image(`jump${i}`, `${base}/Jump no Gun/sprites/jump-no-gun${i}.png`);
        // Crouch
        for (let i = 1; i <= 3; i++) this.load.image(`crouch${i}`, `${base}/Crouch/sprites/crouch${i}.png`);
        // Crouch Gun
        for (let i = 1; i <= 3; i++) this.load.image(`crouch-gun${i}`, `${base}/Crouch Gun/sprites/crouch-gun${i}.png`);
        // Crouch Shoot
        for (let i = 1; i <= 2; i++) this.load.image(`crouch-shoot${i}`, `${base}/Crouch Shoot/sprites/crouch-shoot${i}.png`);
        // Shoot
        for (let i = 1; i <= 2; i++) this.load.image(`shoot${i}`, `${base}/Shoot/sprites/shoot${i}.png`);
        // Die
        for (let i = 1; i <= 3; i++) this.load.image(`die${i}`, `${base}/Die/sprites/die${i}.png`);
        // Climb
        for (let i = 1; i <= 6; i++) this.load.image(`climb${i}`, `${base}/Climb/sprites/climb${i}.png`);
        // Crawl
        for (let i = 1; i <= 6; i++) this.load.image(`crawl${i}`, `${base}/Crawl/sprites/crawl${i}.png`);
        // Throw
        for (let i = 1; i <= 8; i++) this.load.image(`throw${i}`, `${base}/Throw/sprites/throw${i}.png`);
        // Bullets
        this.load.image('bullet1', `${base}/Misc/bullet1.png`);
        this.load.image('bullet2', `${base}/Misc/bullet2.png`);
        this.load.image('wall-impact1', `${base}/Misc/wall-impact-blast1.png`);
        this.load.image('wall-impact2', `${base}/Misc/wall-impact-blast2.png`);
    }

    loadEnemyAssets() {
        // Alien Walker (Grunt)
        const gruntBase = 'Assets/Characters/alien-walking-enemy/Sprites';
        for (let i = 1; i <= 4; i++) this.load.image(`grunt-idle${i}`, `${gruntBase}/Idle/frame${i}.png`);
        for (let i = 1; i <= 6; i++) this.load.image(`grunt-walk${i}`, `${gruntBase}/walk/frame${i}.png`);

        // Alien Flying (Flyer)
        const flyerBase = 'Assets/Characters/alien-flying-enemy/sprites';
        for (let i = 1; i <= 8; i++) this.load.image(`flyer${i}`, `${flyerBase}/alien-enemy-flying${i}.png`);

        // Flying Eye Demon
        const eyeBase = 'Assets/Characters/flying-eye-demon/Sprites';
        for (let i = 1; i <= 8; i++) this.load.image(`eye-demon${i}`, `${eyeBase}/flying-eye-demon${i}.png`);

        // Bipedal Unit (Heavy)
        const heavyBase = 'Assets/Characters/bipedal-Unit/sprites';
        for (let i = 1; i <= 7; i++) this.load.image(`heavy${i}`, `${heavyBase}/bipedal-unit${i}.png`);

        // Ghost
        const ghostBase = 'Assets/Characters/enemy-ghost/Sprites/Particles';
        for (let i = 1; i <= 6; i++) this.load.image(`ghost${i}`, `${ghostBase}/frame${i}.png`);

        // Turret (Metal-Slug single sprite)
        this.load.image('turret', 'Assets/Characters/Battle Sprites/Mechanic/Metal-Slug.png');
    }

    loadBossAssets() {
        // Tank
        const tankBase = 'Assets/Misc/tank-unit/Sprites';
        for (let i = 1; i <= 4; i++) this.load.image(`tank${i}`, `${tankBase}/frame${i}.png`);

        // Mech Unit
        const mechBase = 'Assets/Characters/mech-unit/sprites';
        for (let i = 1; i <= 10; i++) this.load.image(`mech${i}`, `${mechBase}/mech-unit-export${i}.png`);

        // Fire Skull
        const skullBase = 'Assets/Characters/Fire-Skull-Files/Sprites/Fire';
        for (let i = 1; i <= 8; i++) this.load.image(`fireskull${i}`, `${skullBase}/frame${i}.png`);

        // Sentinel (single sprite)
        this.load.image('sentinel', 'Assets/Characters/Battle Sprites/Mechanic/Sentinel.png');
    }

    loadEnvironmentAssets() {
        // Level 1 - Industrial
        const ind = 'Assets/Environments/parallax-industrial-web/Layers';
        this.load.image('l1-bg', `${ind}/bg.png`);
        this.load.image('l1-far', `${ind}/far-buildings.png`);
        this.load.image('l1-mid', `${ind}/buildings.png`);
        this.load.image('l1-fore', `${ind}/skill-foreground.png`);

        // Level 1 - Platforms
        const bulk = 'Assets/Environments/bulkhead-walls/v2/PNG';
        this.load.image('l1-floor', `${bulk}/floor.png`);
        this.load.image('l1-wall', `${bulk}/bg-wall.png`);
        this.load.image('l1-wall-support', `${bulk}/bg-wall-with-supports.png`);
        this.load.image('l1-foreground', `${bulk}/foreground.png`);

        // Level 2 - Caverns
        const cav = 'Assets/Environments/caverns-files-web/layers';
        this.load.image('l2-bg', `${cav}/background.png`);
        this.load.image('l2-walls', `${cav}/back-walls.png`);
        this.load.image('l2-tiles', `${cav}/tiles.png`);

        // Level 3 - Living Tissue
        const tissue = 'Assets/Environments/Living-Tissue-Platform-Files/PNG/layers';
        this.load.image('l3-bg', `${tissue}/bakground.png`);
        this.load.image('l3-tiles', `${tissue}/tileset.png`);

        // Level 4 - Space
        const space = 'Assets/Environments/space_background_pack/Blue Version/layered';
        this.load.image('l4-bg', `${space}/blue-back.png`);
        this.load.image('l4-stars', `${space}/blue-stars.png`);
        this.load.image('l4-planet', `${space}/prop-planet-big.png`);
    }

    loadEffectsAssets() {
        // Explosion A (8 frames)
        const expA = 'Assets/Misc/Explosions pack/explosion-1-a/Sprites';
        for (let i = 1; i <= 8; i++) this.load.image(`exp-a${i}`, `${expA}/explosion-${i}.png`);

        // Explosion B (8 frames)
        const expB = 'Assets/Misc/Explosions pack/explosion-1-b/Sprites';
        for (let i = 1; i <= 8; i++) this.load.image(`exp-b${i}`, `${expB}/explosion-1-b-${i}.png`);

        // Explosion G (7 frames)
        const expG = 'Assets/Misc/Explosions pack/explosion-1-g/Sprites';
        for (let i = 1; i <= 7; i++) this.load.image(`exp-g${i}`, `${expG}/frame${i}.png`);

        // Grotto FX
        const fx = 'Assets/Misc/Grotto-escape-2-FX/sprites';
        // Enemy death
        for (let i = 0; i <= 7; i++) {
            const pad = String(i).padStart(4, '0');
            this.load.image(`enemy-death${i}`, `${fx}/enemy-death/_${pad}_Layer-${i + 1}.png`);
        }
        // Fire ball
        for (let i = 0; i <= 2; i++) {
            const pad = String(i).padStart(4, '0');
            this.load.image(`fire-ball${i}`, `${fx}/fire-ball/_${pad}_Layer-${i + 1}.png`);
        }
        // Energy field
        for (let i = 0; i <= 7; i++) {
            const pad = String(i).padStart(4, '0');
            this.load.image(`energy-field${i}`, `${fx}/energy-field/_${pad}_Layer-${i + 1}.png`);
        }
    }

    loadUIAssets() {
        const hud = 'Assets/Packs/Beach Area/Sprites/HUD';
        this.load.image('hud-bg', `${hud}/hud-bg.png`);
        this.load.image('stamina-bar', `${hud}/stamina-bar.png`);
        this.load.image('stamina-cell', `${hud}/stamina-cell.png`);

        // Gems spritesheet (for collectibles we'll use individual color tints)
        this.load.image('gem', 'Assets/Misc/gems/spritesheets/gems-spritesheet.png');

        // Weapon icons
        for (let i = 1; i <= 4; i++) {
            this.load.image(`weapon-icon${i}`, `Assets/Misc/fantasy weapons set/PNG/${i}.png`);
        }
    }

    loadAudio() {
        const snd = 'Assets/Packs/grotto_escape_pack/Base pack/sounds';
        this.load.audio('sfx-jump', `${snd}/jump.wav`);
        this.load.audio('sfx-laser', `${snd}/laser.wav`);
        this.load.audio('sfx-pickup', `${snd}/pickup.wav`);
    }

    create() {
        this.createAnimations();
        this.scene.start('MenuScene');
    }

    createAnimations() {
        // Player animations
        this.anims.create({ key: 'player-idle', frames: this.frameKeys('idle', 1, 4), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'player-idle-gun', frames: this.frameKeys('idle-gun', 1, 4), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'player-run', frames: this.frameKeys('run', 1, 10), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'player-run-gun', frames: this.frameKeys('run-gun', 1, 10), frameRate: 12, repeat: -1 });
        this.anims.create({ key: 'player-jump', frames: this.frameKeys('jump', 1, 6), frameRate: 10, repeat: 0 });
        this.anims.create({ key: 'player-jump-gun', frames: this.frameKeys('jump-gun', 1, 5), frameRate: 10, repeat: 0 });
        this.anims.create({ key: 'player-crouch', frames: this.frameKeys('crouch', 1, 3), frameRate: 8, repeat: 0 });
        this.anims.create({ key: 'player-crouch-gun', frames: this.frameKeys('crouch-gun', 1, 3), frameRate: 8, repeat: 0 });
        this.anims.create({ key: 'player-crouch-shoot', frames: this.frameKeys('crouch-shoot', 1, 2), frameRate: 10, repeat: 0 });
        this.anims.create({ key: 'player-shoot', frames: this.frameKeys('shoot', 1, 2), frameRate: 10, repeat: 0 });
        this.anims.create({ key: 'player-die', frames: this.frameKeys('die', 1, 3), frameRate: 6, repeat: 0 });
        this.anims.create({ key: 'player-climb', frames: this.frameKeys('climb', 1, 6), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'player-crawl', frames: this.frameKeys('crawl', 1, 6), frameRate: 10, repeat: -1 });

        // Grunt animations
        this.anims.create({ key: 'grunt-idle', frames: this.frameKeys('grunt-idle', 1, 4), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'grunt-walk', frames: this.frameKeys('grunt-walk', 1, 6), frameRate: 8, repeat: -1 });

        // Flyer animation
        this.anims.create({ key: 'flyer-fly', frames: this.frameKeys('flyer', 1, 8), frameRate: 10, repeat: -1 });

        // Eye demon animation
        this.anims.create({ key: 'eye-demon-fly', frames: this.frameKeys('eye-demon', 1, 8), frameRate: 10, repeat: -1 });

        // Heavy animation
        this.anims.create({ key: 'heavy-walk', frames: this.frameKeys('heavy', 1, 7), frameRate: 6, repeat: -1 });

        // Ghost animation
        this.anims.create({ key: 'ghost-float', frames: this.frameKeys('ghost', 1, 6), frameRate: 8, repeat: -1 });

        // Boss animations
        this.anims.create({ key: 'tank-move', frames: this.frameKeys('tank', 1, 4), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'mech-walk', frames: this.frameKeys('mech', 1, 10), frameRate: 8, repeat: -1 });
        this.anims.create({ key: 'fireskull-fly', frames: this.frameKeys('fireskull', 1, 8), frameRate: 10, repeat: -1 });

        // Explosion animations
        this.anims.create({ key: 'explosion-a', frames: this.frameKeys('exp-a', 1, 8), frameRate: 15, repeat: 0 });
        this.anims.create({ key: 'explosion-b', frames: this.frameKeys('exp-b', 1, 8), frameRate: 15, repeat: 0 });
        this.anims.create({ key: 'explosion-g', frames: this.frameKeys('exp-g', 1, 7), frameRate: 15, repeat: 0 });

        // Enemy death FX
        this.anims.create({ key: 'enemy-death-fx', frames: this.frameKeys('enemy-death', 0, 7), frameRate: 12, repeat: 0 });

        // Energy field
        this.anims.create({ key: 'energy-field', frames: this.frameKeys('energy-field', 0, 7), frameRate: 10, repeat: -1 });

        // Fire ball
        this.anims.create({ key: 'fire-ball', frames: this.frameKeys('fire-ball', 0, 2), frameRate: 10, repeat: -1 });
    }

    frameKeys(prefix, start, end) {
        const frames = [];
        for (let i = start; i <= end; i++) {
            frames.push({ key: `${prefix}${i}` });
        }
        return frames;
    }
}
