/**
 * Game entities: Motorcycle, Obstacle, Collectible
 * Per data-model.md
 */

/** @typedef {0|1|2} Lane */
/** @typedef {1|2|3} RiderId */
/** @typedef {'car'|'roadblock'|'oil'} ObstacleType */
/** @typedef {'coin'|'fuel'} CollectibleType */

/**
 * @returns {{ lane: Lane, targetLane: Lane, riderId: RiderId, isSliding: boolean, slideEndTime: number }}
 */
export function createMotorcycle(riderId = 1) {
  return {
    lane: 1,
    targetLane: 1,
    riderId: [1, 2, 3].includes(riderId) ? riderId : 1,
    isSliding: false,
    slideEndTime: 0
  };
}

/**
 * @param {{ lane: Lane, targetLane: Lane, isSliding: boolean, slideEndTime: number }} motorcycle
 * @param {number} now
 */
export function updateMotorcycle(motorcycle, now) {
  if (motorcycle.isSliding && now >= motorcycle.slideEndTime) {
    motorcycle.isSliding = false;
  }
  motorcycle.lane = motorcycle.targetLane;
}

/**
 * @param {{ isSliding: boolean, slideEndTime: number }} motorcycle
 * @param {number} durationMs
 * @param {number} now
 */
export function applyOilSlide(motorcycle, durationMs, now) {
  motorcycle.isSliding = true;
  motorcycle.slideEndTime = now + durationMs;
}

/**
 * @param {ObstacleType} type
 * @param {Lane} lane
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {{ id: string, type: ObstacleType, lane: Lane, y: number, width: number, height: number }}
 */
export function createObstacle(type, lane, y, width, height) {
  return {
    id: `obs-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    lane,
    y,
    width,
    height
  };
}

/**
 * @param {CollectibleType} type
 * @param {Lane} lane
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} value
 * @returns {{ id: string, type: CollectibleType, lane: Lane, y: number, width: number, height: number, value: number }}
 */
export function createCollectible(type, lane, y, width, height, value) {
  return {
    id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    lane,
    y,
    width,
    height,
    value
  };
}
