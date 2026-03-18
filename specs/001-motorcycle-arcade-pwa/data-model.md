# Data Model: Motorcycle Arcade PWA Game

**Feature**: 001-motorcycle-arcade-pwa  
**Date**: 2025-03-18

## Entities

### Motorcycle

| Field | Type | Description |
|-------|------|-------------|
| lane | 0 \| 1 \| 2 | Current lane (0=left, 1=center, 2=right) |
| targetLane | 0 \| 1 \| 2 | Lane being moved toward (for animation) |
| riderId | 1 \| 2 \| 3 | Selected rider skin |
| isSliding | boolean | True when oil penalty active |
| slideEndTime | number | Timestamp when slide ends |

**Validation**: lane ∈ {0,1,2}; riderId ∈ {1,2,3}

---

### Obstacle

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| type | "car" \| "roadblock" \| "oil" | Obstacle type |
| lane | 0 \| 1 \| 2 | Lane position |
| y | number | Vertical position (road-relative) |
| width | number | Collision width |
| height | number | Collision height |

**Behavior**:
- car, roadblock: instant game over on collision
- oil: applies slip penalty; no game over

---

### Collectible

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| type | "coin" \| "fuel" | Collectible type |
| lane | 0 \| 1 \| 2 | Lane position |
| y | number | Vertical position |
| width | number | Collision width |
| height | number | Collision height |
| value | number | Coin: score points; Fuel: fuel amount |

---

### Game Session

| Field | Type | Description |
|-------|------|-------------|
| startTime | number | Timestamp when play started |
| endTime | number \| null | Timestamp when game over (null if playing) |
| score | number | Distance + coins |
| highScore | number | Best score this session |
| fuel | number | Current fuel (0–max) |
| fuelMax | number | Maximum fuel |
| fuelDepleteRate | number | Fuel lost per second |

**State transitions**: loading → start → playing → (paused) → game-over → start

---

### Game State (State Machine)

| State | Description |
|-------|-------------|
| loading | Splash screen; assets loading |
| start | Start screen; rider selection; high score |
| playing | Core gameplay active |
| paused | Playing but paused (backgrounded) |
| game-over | Final score; restart option |

---

### Persisted (sessionStorage)

| Key | Type | Description |
|-----|------|-------------|
| highScore | number | Session high score (resets on tab close) |
| mute | boolean | Sound muted |
| selectedRider | 1 \| 2 \| 3 | Last selected rider |

---

## Relationships

- **Motorcycle** has one **riderId** (1 of 3)
- **Obstacles** and **Collectibles** spawn in **lanes**; removed when off-screen or collected
- **Game Session** tracks **score**, **highScore**, **fuel**
- **Score** = distance survived + coins collected (single combined value)

---

## Validation Rules

1. Lane indices: 0, 1, 2 only
2. Fuel: 0 ≤ fuel ≤ fuelMax; game over when fuel = 0
3. Score: non-negative integer
4. Spawn rate: increases over time (spawner logic)
