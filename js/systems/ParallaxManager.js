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
            const scale = layerDef.tileScale || 1;

            // For bottom-aligned layers, size to scaled texture height
            let layerY = 0;
            let layerH = GAME_HEIGHT;
            if (layerDef.alignBottom) {
                const tex = this.scene.textures.get(layerDef.key);
                const texH = tex.getSourceImage().height * scale;
                layerH = texH;
                layerY = GAME_HEIGHT - texH;
            }

            const layer = this.scene.add.tileSprite(
                0, layerY, GAME_WIDTH, layerH, layerDef.key
            );
            layer.setOrigin(0, 0);
            layer.setScrollFactor(0);
            layer.setDepth(-10 + index);

            if (layerDef.tint) layer.setTint(layerDef.tint);
            if (layerDef.alpha !== undefined) layer.setAlpha(layerDef.alpha);
            if (scale !== 1) {
                layer.setTileScale(scale, scale);
            }

            this.layers.push({
                sprite: layer,
                speed: layerDef.speed || (0.1 * (index + 1)),
                tileScale: scale
            });
        });
    }

    update() {
        const camX = this.scene.cameras.main.scrollX;
        this.layers.forEach(layer => {
            layer.sprite.tilePositionX = camX * layer.speed / layer.tileScale;
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
