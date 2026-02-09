// ============================================================================
// Audio Manager - Sound effects with pitch variation
// ============================================================================

class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.enabled = true;
    }

    init() {
        try {
            this.sounds['sfx-jump'] = this.scene.sound.add('sfx-jump', { volume: 0.4 });
            this.sounds['sfx-laser'] = this.scene.sound.add('sfx-laser', { volume: 0.3 });
            this.sounds['sfx-pickup'] = this.scene.sound.add('sfx-pickup', { volume: 0.5 });
            this.sounds['sfx-hit'] = this.scene.sound.add('sfx-hit', { volume: 0.15 });
            this.sounds['sfx-1up'] = this.scene.sound.add('sfx-1up', { volume: 0.4 });
            this.sounds['sfx-boss-defeat'] = this.scene.sound.add('sfx-boss-defeat', { volume: 0.5 });
            this.sounds['sfx-enemy-hit'] = this.scene.sound.add('sfx-enemy-hit', { volume: 0.2 });
            this.sounds['sfx-spread'] = this.scene.sound.add('sfx-spread', { volume: 0.3 });
            this.sounds['sfx-pause'] = this.scene.sound.add('sfx-pause', { volume: 0.4 });
            this.sounds['sfx-fireball'] = this.scene.sound.add('sfx-fireball', { volume: 0.2 });
            this.sounds['sfx-mech-laser'] = this.scene.sound.add('sfx-mech-laser', { volume: 0.3 });
            this.sounds['sfx-enemy-gun'] = this.scene.sound.add('sfx-enemy-gun', { volume: 0.3 });
            this.sounds['sfx-tank-fire'] = this.scene.sound.add('sfx-tank-fire', { volume: 0.4 });
            this.sounds['sfx-skull-fire'] = this.scene.sound.add('sfx-skull-fire', { volume: 0.4 });
        } catch (e) {
            console.warn('Audio not available:', e);
            this.enabled = false;
        }
    }

    playSound(key, volume, baseRate) {
        if (!this.enabled) return;
        const sound = this.sounds[key];
        if (sound) {
            // Pitch variation for variety
            const r = baseRate || 1.0;
            const rate = r * (0.9 + Math.random() * 0.2);
            sound.play({
                volume: volume !== undefined ? volume : sound.volume,
                rate: rate
            });
        }
    }

    destroy() {
        Object.values(this.sounds).forEach(s => s.destroy());
        this.sounds = {};
    }
}
