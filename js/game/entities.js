/**
 * Game entities: Motorcycle, Obstacle, Collectible
 * Per data-model.md
 */

/** @typedef {0|1|2} Lane */
/** @typedef {1|2|3} RiderId */
/** @typedef {'car'|'roadblock'|'oil'} ObstacleType */
/** @typedef {'coin'|'fuel'} CollectibleType */

const LANE_LERP_SPEED = 8;
const BOOST_DURATION_MS = 2500;
const BOOST_COOLDOWN_MS = 2500;

/**
 * @returns {{ lane: Lane, targetLane: Lane, displayX: number, laneTilt: number, riderId: RiderId, isSliding: boolean, slideEndTime: number, isBoosting: boolean, boostEndTime: number, boostCooldownEndTime: number }}
 */
export function createMotorcycle(riderId = 1) {
  return {
    lane: 1,
    targetLane: 1,
    displayX: 0,
    laneTilt: 0,
    riderId: [1, 2, 3].includes(riderId) ? riderId : 1,
    isSliding: false,
    slideEndTime: 0,
    isBoosting: false,
    boostEndTime: 0,
    boostCooldownEndTime: 0
  };
}

/**
 * @param {{ lane: Lane, targetLane: Lane, displayX: number, laneTilt: number, isSliding: boolean, slideEndTime: number, isBoosting: boolean, boostEndTime: number, boostCooldownEndTime: number }} motorcycle
 * @param {number} now
 * @param {number} canvasWidth
 * @param {(w: number, l: Lane) => number} laneCenterX
 */
export function updateMotorcycle(motorcycle, now, canvasWidth, laneCenterX) {
  if (motorcycle.isSliding && now >= motorcycle.slideEndTime) {
    motorcycle.isSliding = false;
  }

  if (motorcycle.isBoosting && now >= motorcycle.boostEndTime) {
    motorcycle.isBoosting = false;
    motorcycle.boostCooldownEndTime = now + BOOST_COOLDOWN_MS;
  }

  motorcycle.lane = motorcycle.targetLane;

  const targetX = laneCenterX(canvasWidth, motorcycle.targetLane);
  if (canvasWidth > 0 && (motorcycle.displayX === undefined || motorcycle.displayX === 0)) {
    motorcycle.displayX = targetX;
  }
  motorcycle.displayX += (targetX - motorcycle.displayX) * Math.min(1, LANE_LERP_SPEED * 0.016);

  const dx = targetX - motorcycle.displayX;
  const prevTilt = motorcycle.laneTilt ?? 0;
  const targetTilt = Math.abs(dx) > 2 ? (dx > 0 ? 1 : -1) : 0;
  motorcycle.laneTilt = prevTilt + (targetTilt - prevTilt) * 0.25;
  if (Math.abs(motorcycle.laneTilt) < 0.05) motorcycle.laneTilt = 0;
}

/**
 * @param {{ isBoosting: boolean, boostEndTime: number, boostCooldownEndTime: number }} motorcycle
 * @param {number} now
 * @returns {boolean} Whether boost was activated
 */
export function tryActivateBoost(motorcycle, now) {
  if (motorcycle.isBoosting) return false;
  if (now < motorcycle.boostCooldownEndTime) return false;
  motorcycle.isBoosting = true;
  motorcycle.boostEndTime = now + BOOST_DURATION_MS;
  return true;
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
