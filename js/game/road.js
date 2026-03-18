/**
 * Road rendering and 3-lane layout
 * Subway Surfers-inspired: third-person rear view, perspective road
 */

/** @typedef {0|1|2} Lane */

/** Perspective: horizon scale (0.15 = road narrows to 15% at top) */
const HORIZON_SCALE = 0.15;

/**
 * Get perspective scale at a given screen Y (0=horizon, 1=bottom)
 * @param {number} screenY - Y position on canvas (0 = top)
 * @param {number} height
 * @returns {number} Scale 0-1
 */
function getPerspectiveScale(screenY, height) {
  const t = screenY / height;
  return HORIZON_SCALE + (1 - HORIZON_SCALE) * t;
}

/**
 * Project world X (lane-based) to screen X with perspective
 * @param {number} width
 * @param {number} height
 * @param {number} laneCenterWorld - Center X in 0..width (lane-based)
 * @param {number} screenY
 * @returns {number}
 */
export function projectX(width, height, laneCenterWorld, screenY) {
  const scale = getPerspectiveScale(screenY, height);
  return width / 2 + (laneCenterWorld - width / 2) * scale;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} scrollOffset - Vertical scroll offset for endless road
 */
export function renderRoad(ctx, width, height, scrollOffset) {
  // Sky - Subway Surfers style: bright cyan to deep blue gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#6AEEFD');
  skyGrad.addColorStop(0.25, '#5dd4e8');
  skyGrad.addColorStop(0.5, '#354093');
  skyGrad.addColorStop(0.85, '#252d6b');
  skyGrad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Perspective road - trapezoid (narrow at horizon, wide at bottom)
  const topScale = HORIZON_SCALE;
  const topWidth = width * topScale;
  const topLeft = (width - topWidth) / 2;
  const topRight = (width + topWidth) / 2;

  // Grass / urban shoulders - trapezoids
  ctx.fillStyle = '#2d5a3d';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(topLeft, 0);
  ctx.lineTo(width * 0.15, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(topRight, 0);
  ctx.lineTo(width * 0.85, height);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Road surface - trapezoid
  ctx.fillStyle = '#2a2a3a';
  ctx.beginPath();
  ctx.moveTo(topLeft, 0);
  ctx.lineTo(topRight, 0);
  ctx.lineTo(width * 0.85, height);
  ctx.lineTo(width * 0.15, height);
  ctx.closePath();
  ctx.fill();

  // Road edge lines
  ctx.strokeStyle = '#FFED6D';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 237, 109, 0.6)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(topLeft, 0);
  ctx.lineTo(width * 0.15, height);
  ctx.moveTo(topRight, 0);
  ctx.lineTo(width * 0.85, height);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Lane dividers - dashed yellow, perspective
  ctx.strokeStyle = '#FFED6D';
  ctx.lineWidth = 3;
  const dashLen = 18;
  const gapLen = 14;
  const segmentHeight = dashLen + gapLen;
  const dashOffset = scrollOffset % segmentHeight;

  for (let i = 1; i < 3; i++) {
    const laneT = i / 3;
    const topX = topLeft + topWidth * laneT;
    const bottomX = width * 0.15 + (width * 0.7) * laneT;
    ctx.setLineDash([dashLen, gapLen]);
    ctx.lineDashOffset = -dashOffset;
    ctx.beginPath();
    ctx.moveTo(topX, 0);
    ctx.lineTo(bottomX, height + segmentHeight);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;
}

/**
 * @param {number} width
 * @param {Lane} lane
 * @returns {number} Center x of lane
 */
export function laneCenterX(width, lane) {
  const laneWidth = width / 3;
  return (lane + 0.5) * laneWidth;
}

/**
 * @param {number} width
 * @returns {number} Width of each lane
 */
export function getLaneWidth(width) {
  return width / 3;
}
