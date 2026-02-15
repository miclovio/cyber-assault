# Leaderboard System Specification

## Overview
Top 10 high score leaderboard with 3-letter initials (classic arcade style). Scores persist in a Firebase Realtime Database. Players enter initials when they achieve a qualifying score.

## Storage
- **Backend**: Firebase Realtime Database
- **Node**: `scores/`
- **Config**: `js/data/firebase-config.js` (committed to repo — Firebase API keys are public by design; security comes from Firebase Security Rules)
- **Format**: Entries stored under `scores/` node, queried descending by score
- **Max entries**: 10 (top 10 retained)

### Entry Schema
```json
{ "name": "AAA", "score": 50000, "level": 3, "timestamp": 1700000000000 }
```
| Field       | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `name`      | string | 3-letter uppercase initials (A-Z)        |
| `score`     | number | Final score at end of run                |
| `level`     | number | Level reached (1-5), 5 = completed game  |
| `timestamp` | number | Unix timestamp (ms) when score was saved |

### Firebase Security Rules
The `scores` node should have `.indexOn: ["score"]` to allow efficient ordering queries.

## Files Modified

### New: `js/data/firebase-config.js`
Exports `FIREBASE_CONFIG`, an object containing the Firebase project configuration (apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId). This file is committed to the repo since Firebase API keys are safe to expose publicly — access control is enforced via Firebase Security Rules, not key secrecy.

### New: `js/systems/Leaderboard.js`
Utility object with async and sync methods:

| Method                         | Returns            | Async | Description                                                |
|--------------------------------|--------------------|-------|------------------------------------------------------------|
| `init()`                       | `Promise`          | Yes   | Initializes Firebase app and loads initial scores          |
| `loadScores()`                 | `Promise<Array>`   | Yes   | Fetches top 10 entries from Firebase, caches locally       |
| `addScore(name, score, level)` | `Promise<number>`  | Yes   | Writes entry to Firebase, returns rank                     |
| `isHighScore(score)`           | `boolean`          | No    | True if score > 0 and qualifies for top 10 (uses cache)   |
| `getScores()`                  | `Array`            | No    | Returns cached top 10 entries sorted descending            |

### Modified: `index.html`
Added Firebase CDN scripts (v10.8.0) and project files:
```html
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
<script src="js/data/firebase-config.js"></script>
<script src="js/systems/Leaderboard.js"></script>
```

### Loading Bar
A slim 4px rounded loading bar with a glow effect, 300px wide, rendered over a dark teal background track.

### Modified: `js/scenes/MenuScene.js`
Displays the leaderboard and an animated background element.

**Left side — Space Marine Silhouette**:
- Run-gun animation
- Scale: 10
- Alpha: 0.25

**Right side — HIGH SCORES Leaderboard**:
- Title "HIGH SCORES" centered at x:670
- Left-aligned entries at x:600

**Styling**:
- Title: 14px monospace, cyan (`#00ffff`), bold, stroke
- Top 3 entries: 12px monospace, yellow (`#ffff00`)
- Entries 4-10: 12px monospace, gray (`#888888`)
- Empty slots: 12px monospace, dark gray (`#444444`), shows `---`
- Score column right-padded to 7 characters

### Modified: `js/scenes/VictoryScene.js`
Displays the same background elements as MenuScene (space marine silhouette on the left, HIGH SCORES leaderboard on the right).

After the rank display appears (3 second delay):
1. Checks `Leaderboard.isHighScore(finalScore)`
2. **If qualifies**: Shows initials entry UI, then menu prompt after confirming
3. **If doesn't qualify**: Shows menu prompt immediately

Score is recorded with `level: 5` (completed the game).

### Modified: `js/scenes/GameOverScene.js`
Displays the same background elements as MenuScene (space marine silhouette on the left, HIGH SCORES leaderboard on the right).

Immediately after scene creates:
1. Checks `Leaderboard.isHighScore(finalScore)`
2. **If qualifies**: Shows initials entry UI, then continue/menu options after confirming
3. **If doesn't qualify**: Shows continue/menu options immediately

Score is recorded with `level: levelReached`.

## Shared Scene Elements (MenuScene, VictoryScene, GameOverScene)

All three scenes display:
- **Left side**: Animated space marine silhouette (run-gun animation, scale 10, alpha 0.25)
- **Right side**: HIGH SCORES leaderboard (title centered at x:670, left-aligned entries at x:600)

## Initials Entry UI

Arcade-style initials entry shared by both VictoryScene and GameOverScene.

### Display
- "NEW HIGH SCORE!" label — 16px monospace, gold (`#ffcc00`), bold
- "ENTER YOUR INITIALS" instruction (GameOverScene only) — 12px gray
- 3 letter slots — 24px monospace, bold, spaced 30px apart
- Active slot: cyan (`#00ffff`), inactive slots: gray (`#888888`)
- Default value: `A A A`

### Keyboard Controls
| Key       | Action                                    |
|-----------|-------------------------------------------|
| A-Z       | Sets current slot to letter, advances next|
| Backspace | Moves back one slot                       |
| Enter     | Confirms initials                         |

### Gamepad Controls
| Button     | Action                        |
|------------|-------------------------------|
| D-pad Up   | Cycle letter backward (A<-Z)  |
| D-pad Down | Cycle letter forward (A->Z)   |
| D-pad Left | Move to previous slot         |
| D-pad Right| Move to next slot             |
| A (confirm)| Confirm initials              |

### On Confirm
1. Initials input deactivated
2. All 3 letters flash gold (`#ffcc00`)
3. Score saved via `Leaderboard.addScore(name, score, level)` (async — returns a Promise)
4. After 500ms delay, normal scene options appear (menu prompt or continue/menu)

## Flow Diagrams

### Victory Flow
```
Score counter animates (2s)
  -> Rank displays (2.5s)
    -> High score check (3s)
      -> [qualifies] "NEW HIGH SCORE!" + initials entry -> confirm -> addScore() -> "PRESS ENTER FOR MENU"
      -> [no]        "PRESS ENTER FOR MENU"
```

### Game Over Flow
```
Score + level displayed immediately
  -> High score check
    -> [qualifies] "NEW HIGH SCORE!" + initials entry -> confirm -> addScore() -> continue/menu options
    -> [no]        continue/menu options
```

### Menu Flow
```
Title screen loads
  -> Leaderboard.init() initializes Firebase and fetches scores (async)
  -> Displays top 10 on right side (always visible)
  -> Refreshes each time MenuScene is entered
```

## Edge Cases
- **First play**: Empty board — any score > 0 qualifies
- **Board full (10 entries)**: New score must be strictly greater than the 10th entry
- **Score of 0**: Never qualifies (`isHighScore` returns false for score <= 0)
- **Firebase unavailable**: `getScores()` returns empty array from cache, `addScore()` rejects the Promise
- **Network errors**: Handled gracefully — game remains playable, leaderboard shows cached or empty data
