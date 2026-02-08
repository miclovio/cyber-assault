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
            // Gradient layers: smooth full-resolution background
            if (layerDef.gradient) {
                const texKey = `_gradient_${index}`;
                if (this.scene.textures.exists(texKey)) {
                    this.scene.textures.remove(texKey);
                }
                const canvas = this.scene.textures.createCanvas(texKey, GAME_WIDTH, GAME_HEIGHT);
                const ctx = canvas.getContext();
                const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
                const stops = layerDef.gradient;
                for (let i = 0; i < stops.length; i++) {
                    grad.addColorStop(i / (stops.length - 1), stops[i]);
                }
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                canvas.refresh();

                const layer = this.scene.add.image(0, 0, texKey).setOrigin(0, 0);
                layer.setScrollFactor(0);
                layer.setDepth(-10 + index);

                this.layers.push({ sprite: layer, speed: 0, tileScale: 1 });
                return;
            }

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
