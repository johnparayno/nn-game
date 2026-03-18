/**
 * Collision detection: motorcycle vs obstacles and collectibles
 * Per data-model.md: car/roadblock = game over; oil = slip penalty; collectibles = collect
 */

import { laneCenterX } from './road.js';

/** @typedef {0|1|2} Lane */

const MOTORCYCLE_WIDTH = 40;
const MOTORCYCLE_HEIGHT = 50;

/**
 * Check if motorcycle collides with obstacle (AABB)
 * @param {{ lane: Lane, targetLane: Lane }} motorcycle
 * @param {{ lane: Lane, y: number, width: number, height: number }} obstacle
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} motorcycleY - Y position of motorcycle (bottom of screen)
 * @returns {boolean}
 */
export function checkObstacleCollision(motorcycle, obstacle, canvasWidth, canvasHeight, motorcycleY) {
  const mcX = laneCenterX(canvasWidth, motorcycle.lane) - MOTORCYCLE_WIDTH / 2;
  const mcY = motorcycleY - MOTORCYCLE_HEIGHT;
  const obsX = laneCenterX(canvasWidth, obstacle.lane) - obstacle.width / 2;
  return (
    mcX + MOTORCYCLE_WIDTH > obsX &&
    mcX < obsX + obstacle.width &&
    mcY + MOTORCYCLE_HEIGHT > obstacle.y &&
    mcY < obstacle.y + obstacle.height
  );
}

/**
 * Check if motorcycle collects collectible
 * @param {{ lane: Lane }} motorcycle
 * @param {{ lane: Lane, y: number, width: number, height: number }} collectible
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {number} motorcycleY
 * @returns {boolean}
 */
export function checkCollectibleCollision(motorcycle, collectible, canvasWidth, canvasHeight, motorcycleY) {
  const mcX = laneCenterX(canvasWidth, motorcycle.lane) - MOTORCYCLE_WIDTH / 2;
  const mcY = motorcycleY - MOTORCYCLE_HEIGHT;
  const colX = laneCenterX(canvasWidth, collectible.lane) - collectible.width / 2;
  return (
    mcX + MOTORCYCLE_WIDTH > colX &&
    mcX < colX + collectible.width &&
    mcY + MOTORCYCLE_HEIGHT > collectible.y &&
    mcY < collectible.y + collectible.height
  );
}

/**
 * Check if entity is off-screen (above top)
 * @param {{ y: number, height: number }} entity
 * @returns {boolean}
 */
export function isOffScreen(entity) {
  return entity.y + entity.height < 0;
}
