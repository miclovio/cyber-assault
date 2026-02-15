// ============================================================================
// Leaderboard - Top 10 high scores (localStorage)
// ============================================================================

const Leaderboard = {
    KEY: 'cyber-assault-scores',

    getScores() {
        try {
            const data = localStorage.getItem(this.KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    isHighScore(score) {
        if (score <= 0) return false;
        const scores = this.getScores();
        return scores.length < 10 || score > scores[scores.length - 1].score;
    },

    addScore(name, score, level) {
        const scores = this.getScores();
        scores.push({ name: name.toUpperCase().slice(0, 3), score, level });
        scores.sort((a, b) => b.score - a.score);
        if (scores.length > 10) scores.length = 10;
        try {
            localStorage.setItem(this.KEY, JSON.stringify(scores));
        } catch (e) { /* storage full */ }
        return scores.findIndex(s => s.name === name && s.score === score && s.level === level) + 1;
    },

    clear() {
        localStorage.removeItem(this.KEY);
    }
};
