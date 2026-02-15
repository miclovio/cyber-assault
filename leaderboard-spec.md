# Leaderboard System Specification

## Overview
Top 10 high score leaderboard with 3-letter initials (classic arcade style). Scores persist locally via `localStorage`. Players enter initials when they achieve a qualifying score.

## Storage
- **Key**: `cyber-assault-scores`
- **Backend**: `localStorage` (no server needed)
- **Format**: JSON array of entries, sorted descending by score
- **Max entries**: 10

### Entry Schema
```json
{ "name": "AAA", "score": 50000, "level": 3 }
```
| Field   | Type   | Description                              |
|---------|--------|------------------------------------------|
| `name`  | string | 3-letter uppercase initials (A-Z)        |
| `score` | number | Final score at end of run                |
| `level` | number | Level reached (1-5), 5 = completed game  |

## Files Modified

### New: `js/systems/Leaderboard.js`
Utility object with four methods:

| Method                        | Returns          | Description                                      |
|-------------------------------|------------------|--------------------------------------------------|
| `getScores()`                 | `Array`          | Returns top 10 entries sorted descending         |
| `isHighScore(score)`          | `boolean`        | True if score > 0 and qualifies for top 10       |
| `addScore(name, score, level)`| `number` (rank)  | Inserts entry, trims to 10, saves to localStorage|
| `clear()`                     | `void`           | Removes all scores (testing utility)             |

### Modified: `index.html`
Added script tag:
```html
<script src="js/systems/Leaderboard.js"></script>
```
Placed after `GamepadControls.js` in the Systems section.

### Modified: `js/scenes/MenuScene.js`
Added `_createLeaderboard()` method that displays the top 10 on the right side of the title screen.

**Layout** (positioned at x:670):
```
     HIGH SCORES
 1. AAA   50000  L5
 2. BOB   42000  L4
 3. CAT   38000  L3
 4. ---
 ...
10. ---
```

**Styling**:
- Title: 14px monospace, cyan (`#00ffff`), bold, stroke
- Top 3 entries: 12px monospace, yellow (`#ffff00`)
- Entries 4-10: 12px monospace, gray (`#888888`)
- Empty slots: 12px monospace, dark gray (`#444444`), shows `---`
- Score column right-padded to 7 characters

### Modified: `js/scenes/VictoryScene.js`
After the rank display appears (3 second delay):
1. Checks `Leaderboard.isHighScore(finalScore)`
2. **If qualifies**: Shows initials entry UI, then menu prompt after confirming
3. **If doesn't qualify**: Shows menu prompt immediately

Score is recorded with `level: 5` (completed the game).

### Modified: `js/scenes/GameOverScene.js`
Immediately after scene creates:
1. Checks `Leaderboard.isHighScore(finalScore)`
2. **If qualifies**: Shows initials entry UI, then continue/menu options after confirming
3. **If doesn't qualify**: Shows continue/menu options immediately

Score is recorded with `level: levelReached`.

## Initials Entry UI

Shared behavior in both VictoryScene and GameOverScene.

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
| Button    | Action                        |
|-----------|-------------------------------|
| D-pad Up  | Cycle letter backward (A←Z)   |
| D-pad Down| Cycle letter forward (A→Z)    |
| D-pad Left| Move to previous slot         |
| D-pad Right| Move to next slot            |
| A (confirm)| Confirm initials             |

### On Confirm
1. Initials input deactivated
2. All 3 letters flash gold (`#ffcc00`)
3. Score saved via `Leaderboard.addScore(name, score, level)`
4. After 500ms delay, normal scene options appear (menu prompt or continue/menu)

## Flow Diagrams

### Victory Flow
```
Score counter animates (2s)
  → Rank displays (2.5s)
    → High score check (3s)
      → [qualifies] "NEW HIGH SCORE!" + initials entry → confirm → "PRESS ENTER FOR MENU"
      → [no]        "PRESS ENTER FOR MENU"
```

### Game Over Flow
```
Score + level displayed immediately
  → High score check
    → [qualifies] "NEW HIGH SCORE!" + initials entry → confirm → continue/menu options
    → [no]        continue/menu options
```

### Menu Flow
```
Title screen loads
  → _createLeaderboard() reads from localStorage
  → Displays top 10 on right side (always visible)
  → Refreshes each time MenuScene is entered
```

## Edge Cases
- **First play**: Empty board — any score > 0 qualifies
- **Board full (10 entries)**: New score must be strictly greater than the 10th entry
- **Score of 0**: Never qualifies (`isHighScore` returns false for score <= 0)
- **localStorage unavailable**: `getScores()` returns empty array, `addScore()` silently fails
- **Storage full**: `addScore()` catches and ignores the error
