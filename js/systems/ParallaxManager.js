// ============================================================================
// Parallax Manager - Multi-layer parallax scrolling
// ============================================================================

class ParallaxManager {
    constructor(scene) {
        this.scene = scene;
        this.layers = [];
    }

    setup(levelData) {
        this.clear();

        const bgLayers = levelData.backgrounds;
        bgLayers.forEach((layerDef, index) => {
            const layer = this.scene.add.tileSprite(
                0, 0, GAME_WIDTH, GAME_HEIGHT, layerDef.key
            );
            layer.setOrigin(0, 0);
            layer.setScrollFactor(0);
            layer.setDepth(-10 + index);

            if (layerDef.tint) layer.setTint(layerDef.tint);
            if (layerDef.alpha !== undefined) layer.setAlpha(layerDef.alpha);

            this.layers.push({
                sprite: layer,
                speed: layerDef.speed || (0.1 * (index + 1))
            });
        });
    }

    update() {
        const camX = this.scene.cameras.main.scrollX;
        this.layers.forEach(layer => {
            layer.sprite.tilePositionX = camX * layer.speed;
        });
    }

    clear() {
        this.layers.forEach(l => l.sprite.destroy());
        this.layers = [];
    }

    destroy() {
        this.clear();
    }
}
