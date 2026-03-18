/**
 * Road rendering and 3-lane layout
 * Per data-model.md and spec FR-001
 */

/** @typedef {0|1|2} Lane */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} scrollOffset - Vertical scroll offset for endless road
 */
export function renderRoad(ctx, width, height, scrollOffset) {
  const laneCount = 3;
  const shoulderWidth = 24;
  const roadWidth = width - shoulderWidth * 2;

  // Sky / background gradient (dark blue-gray)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#1e2a3a');
  skyGrad.addColorStop(1, '#0f1419');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Grass shoulders (left and right)
  ctx.fillStyle = '#2d4a2d';
  ctx.fillRect(0, 0, shoulderWidth, height);
  ctx.fillRect(width - shoulderWidth, 0, shoulderWidth, height);

  // Road surface (asphalt gray)
  ctx.fillStyle = '#3d3d3d';
  ctx.fillRect(shoulderWidth, 0, roadWidth, height);

  // Road edge lines (white)
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(shoulderWidth, 0);
  ctx.lineTo(shoulderWidth, height);
  ctx.moveTo(width - shoulderWidth, 0);
  ctx.lineTo(width - shoulderWidth, height);
  ctx.stroke();

  // Lane dividers (dashed white, scroll with road)
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  const dashLen = 16;
  const gapLen = 12;
  const segmentHeight = dashLen + gapLen;
  const dashOffset = scrollOffset % segmentHeight;

  for (let i = 1; i < laneCount; i++) {
    const x = (i / laneCount) * width;
    ctx.setLineDash([dashLen, gapLen]);
    ctx.lineDashOffset = -dashOffset;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height + segmentHeight);
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
