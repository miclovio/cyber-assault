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
        } catch (e) {
            console.warn('Audio not available:', e);
            this.enabled = false;
        }
    }

    playSound(key, volume) {
        if (!this.enabled) return;
        const sound = this.sounds[key];
        if (sound) {
            // Pitch variation for variety
            const rate = 0.9 + Math.random() * 0.2;
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
