// ============================================================================
// Grunt - Patrol + shoot AI (Alien Walker)
// ============================================================================

class Grunt extends EnemyBase {
    constructor(scene, x, y, config) {
        const cfg = { ...ENEMY_CONFIG.GRUNT, ...config };
        super(scene, x, y, 'grunt-walk1', cfg);

        this.setScale(1.5);
        this.body.setSize(20, 28);
        this.body.setOffset(6, 4);

        this.patrolDir = config && config.patrolDir || 1;
        this.patrolRange = config && config.patrolRange || 200;
        this.startX = x;
        this.facingRight = this.patrolDir > 0;

        this.play('grunt-walk');
    }

    update(time) {
        if (!this.active || !this.isOnScreen()) return;

        // Patrol
        this.setVelocityX(this.speed * this.patrolDir);
        this.setFlipX(this.patrolDir < 0);

        // Reverse at patrol bounds
        if (this.x > this.startX + this.patrolRange) {
            this.patrolDir = -1;
        } else if (this.x < this.startX - this.patrolRange) {
            this.patrolDir = 1;
        }

        // Reverse at edges
        if (this.body.blocked.left) this.patrolDir = 1;
        if (this.body.blocked.right) this.patrolDir = -1;
        if (this.isNearEdge()) this.patrolDir *= -1;

        // Shoot at player
        this.shootAtPlayer(time);
    }
}
