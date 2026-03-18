/**
 * Road rendering and 3-lane layout
 * Subway Surfers-inspired: vibrant sky, urban subway track aesthetic
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

  // Sky - Subway Surfers style: bright cyan to deep blue gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#6AEEFD');
  skyGrad.addColorStop(0.25, '#5dd4e8');
  skyGrad.addColorStop(0.5, '#354093');
  skyGrad.addColorStop(0.85, '#252d6b');
  skyGrad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Urban buildings / walls (stylized stripes - subway tunnel feel)
  ctx.fillStyle = 'rgba(53, 64, 147, 0.15)';
  for (let i = 0; i < 8; i++) {
    const stripeY = (i * 80 - scrollOffset % 80) % (height + 80) - 40;
    ctx.fillRect(0, stripeY, shoulderWidth, 40);
    ctx.fillRect(width - shoulderWidth, stripeY, shoulderWidth, 40);
  }

  // Grass / urban shoulders - vibrant green (Subway Surfers palette)
  ctx.fillStyle = '#2d5a3d';
  ctx.fillRect(0, 0, shoulderWidth, height);
  ctx.fillRect(width - shoulderWidth, 0, shoulderWidth, height);
  // Highlight edge
  ctx.strokeStyle = '#3d7a4d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shoulderWidth, 0);
  ctx.lineTo(shoulderWidth, height);
  ctx.moveTo(width - shoulderWidth, 0);
  ctx.lineTo(width - shoulderWidth, height);
  ctx.stroke();

  // Road surface - darker asphalt with slight blue tint (subway track bed)
  ctx.fillStyle = '#2a2a3a';
  ctx.fillRect(shoulderWidth, 0, roadWidth, height);

  // Road edge lines - bright yellow (Subway Surfers style)
  ctx.strokeStyle = '#FFED6D';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 237, 109, 0.6)';
  ctx.shadowBlur = 8;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(shoulderWidth, 0);
  ctx.lineTo(shoulderWidth, height);
  ctx.moveTo(width - shoulderWidth, 0);
  ctx.lineTo(width - shoulderWidth, height);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Lane dividers - dashed yellow, scroll with road
  ctx.strokeStyle = '#FFED6D';
  ctx.lineWidth = 3;
  const dashLen = 18;
  const gapLen = 14;
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
