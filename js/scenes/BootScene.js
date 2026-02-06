// ============================================================================
// Boot Scene - Loading bar setup
// ============================================================================

class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Create a simple loading bar graphic
        this.createLoadingBar();
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

        // Title text
        this.add.text(width / 2, height / 2 - 60, 'CYBER ASSAULT', {
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Loading text
        this.add.text(width / 2, height / 2 + 40, 'INITIALIZING...', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#888888'
        }).setOrigin(0.5);
    }

    create() {
        this.scene.start('PreloadScene');
    }
}
