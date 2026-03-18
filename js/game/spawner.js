/**
 * Spawn logic for obstacles and collectibles
 * Per data-model.md; spawn rate increases over time (Phase 5)
 */

import { createObstacle } from './entities.js';
import { createCollectible } from './entities.js';

/** @typedef {0|1|2} Lane */

const OBSTACLE_TYPES = ['car', 'roadblock', 'oil'];
const COLLECTIBLE_TYPES = ['coin'];

const OBSTACLE_SIZES = {
  car: { width: 45, height: 60 },
  roadblock: { width: 50, height: 40 },
  oil: { width: 55, height: 25 }
};

const COLLECTIBLE_SIZES = {
  coin: { width: 30, height: 30, value: 10 }
};

const BASE_SPAWN_INTERVAL_OBSTACLE = 1.8;
const BASE_SPAWN_INTERVAL_COLLECTIBLE = 2.5;
const MIN_SPAWN_INTERVAL = 0.4;

/**
 * @param {number} elapsedTime - Seconds since game start
 * @returns {number} Spawn interval in seconds
 */
function getObstacleSpawnInterval(elapsedTime) {
  const decay = Math.max(0, 1 - elapsedTime / 60);
  return Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL_OBSTACLE * decay);
}

/**
 * @param {number} elapsedTime
 * @returns {number}
 */
function getCollectibleSpawnInterval(elapsedTime) {
  const decay = Math.max(0, 1 - elapsedTime / 90);
  return Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL_COLLECTIBLE * decay);
}

/**
 * @returns {Lane}
 */
function randomLane() {
  return /** @type {Lane} */ (Math.floor(Math.random() * 3));
}

/**
 * @param {number} scrollSpeed - Pixels per second
 * @param {number} dt - Delta time
 * @returns {void}
 */
export function updateObstacles(obstacles, scrollSpeed, dt) {
  for (const o of obstacles) {
    o.y += scrollSpeed * dt;
  }
}

/**
 * @param {number} scrollSpeed
 * @param {number} dt
 * @returns {void}
 */
export function updateCollectibles(collectibles, scrollSpeed, dt) {
  for (const c of collectibles) {
    c.y += scrollSpeed * dt;
  }
}

/**
 * @param {Array} obstacles
 * @param {number} elapsedTime
 * @param {number} lastSpawnTime
 * @returns {{ spawned: boolean, lastSpawnTime: number }}
 */
export function trySpawnObstacle(obstacles, elapsedTime, lastSpawnTime) {
  const interval = getObstacleSpawnInterval(elapsedTime);
  if (elapsedTime - lastSpawnTime >= interval) {
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    const size = OBSTACLE_SIZES[type];
    const obs = createObstacle(type, randomLane(), -size.height, size.width, size.height);
    obstacles.push(obs);
    return { spawned: true, lastSpawnTime: elapsedTime };
  }
  return { spawned: false, lastSpawnTime };
}

/**
 * @param {Array} collectibles
 * @param {number} elapsedTime
 * @param {number} lastCollectibleSpawnTime
 * @returns {{ spawned: boolean, lastSpawnTime: number }}
 */
export function trySpawnCollectible(collectibles, elapsedTime, lastCollectibleSpawnTime) {
  const interval = getCollectibleSpawnInterval(elapsedTime);
  if (elapsedTime - lastCollectibleSpawnTime >= interval) {
    const type = COLLECTIBLE_TYPES[Math.floor(Math.random() * COLLECTIBLE_TYPES.length)];
    const size = COLLECTIBLE_SIZES[type];
    const col = createCollectible(type, randomLane(), -size.height, size.width, size.height, size.value);
    collectibles.push(col);
    return { spawned: true, lastSpawnTime: elapsedTime };
  }
  return { spawned: false, lastSpawnTime: lastCollectibleSpawnTime };
}
