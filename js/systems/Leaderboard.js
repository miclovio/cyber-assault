// ============================================================================
// Leaderboard - Top 10 high scores (Firebase Realtime Database)
// ============================================================================
// FIREBASE_CONFIG is defined in js/data/firebase-config.js (gitignored)

const Leaderboard = {
    _cache: [],
    _db: null,
    _ready: false,

    init() {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
            }
            this._db = firebase.database();
            this._ready = true;
        } catch (e) {
            console.error('Leaderboard init failed:', e);
            this._ready = false;
        }
    },

    async loadScores() {
        if (!this._ready) return this._cache;
        try {
            const snapshot = await this._db.ref('scores')
                .orderByChild('score')
                .limitToLast(10)
                .once('value');
            const scores = [];
            snapshot.forEach(child => {
                const val = child.val();
                scores.push({ key: child.key, name: val.name, score: val.score, level: val.level });
            });
            scores.sort((a, b) => b.score - a.score);
            this._cache = scores;
        } catch (e) {
            // Network error — use cached data
        }
        return this._cache;
    },

    getScores() {
        return this._cache;
    },

    isHighScore(score) {
        if (score <= 0) return false;
        return this._cache.length < 10 || score > this._cache[this._cache.length - 1].score;
    },

    async addScore(name, score, level) {
        if (!this._ready) return null;
        try {
            await this._db.ref('scores').push({
                name: name.toUpperCase().slice(0, 3),
                score,
                level,
                timestamp: Date.now()
            });
            // Reload all, trim to top 10
            const snapshot = await this._db.ref('scores')
                .orderByChild('score')
                .once('value');
            const all = [];
            snapshot.forEach(child => {
                all.push({ key: child.key, score: child.val().score });
            });
            all.sort((a, b) => b.score - a.score);
            const toRemove = all.slice(10);
            if (toRemove.length > 0) {
                const updates = {};
                toRemove.forEach(entry => { updates[entry.key] = null; });
                await this._db.ref('scores').update(updates);
            }
            await this.loadScores();
        } catch (e) {
            // Network error — score not saved
        }
        return this._cache.findIndex(s => s.name === name && s.score === score) + 1;
    },

    clear() {
        if (this._db) this._db.ref('scores').remove();
        this._cache = [];
    }
};

// Initialize on load
Leaderboard.init();
