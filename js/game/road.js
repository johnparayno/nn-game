/**
 * Road rendering - 80's OVERDRIVE map
 * Pseudo-3D perspective, cityscape parallax, palm trees, buildings, streetlights
 */

/** @typedef {0|1|2} Lane */

/** Perspective: road narrows to 8% at horizon (sharp taper like Out Run) */
const HORIZON_SCALE = 0.08;

/**
 * Get perspective scale at screen Y (0=horizon, 1=bottom)
 */
function getPerspectiveScale(screenY, height) {
  const t = screenY / height;
  return HORIZON_SCALE + (1 - HORIZON_SCALE) * t;
}

/**
 * Project world X to screen X with perspective
 */
export function projectX(width, height, laneCenterWorld, screenY) {
  const scale = getPerspectiveScale(screenY, height);
  return width / 2 + (laneCenterWorld - width / 2) * scale;
}

/** Road bounds (trapezoid) - left/right at top and bottom */
function getRoadBounds(width, _height) {
  const topWidth = width * HORIZON_SCALE;
  return {
    topLeft: (width - topWidth) / 2,
    topRight: (width + topWidth) / 2,
    bottomLeft: width * 0.08,
    bottomRight: width * 0.92
  };
}

/** Get X at a given Y for left/right road edge (linear interpolate) */
function roadEdgeX(width, height, screenY, side) {
  const b = getRoadBounds(width, height);
  const t = screenY / height;
  if (side === 'left') return b.topLeft + (b.bottomLeft - b.topLeft) * t;
  return b.topRight + (b.bottomRight - b.topRight) * t;
}

/**
 * Draw parallax cityscape - pink/magenta/orange buildings with window lines
 */
function drawCityscape(ctx, width, height, scrollOffset) {
  const parallax = 0.12;
  const offset = (scrollOffset * parallax) % 120;
  const horizonY = height * 0.42;

  ctx.save();
  ctx.globalAlpha = 0.95;

  const buildingColors = ['#ff0052', '#ff6b35', '#9e00ff', '#e91e63', '#ff9800', '#9c27b0'];
  const buildingWidth = 28;
  const numBuildings = Math.ceil(width / buildingWidth) + 6;

  for (let i = -3; i < numBuildings; i++) {
    const x = i * buildingWidth - offset;
    if (x + buildingWidth < 0 || x > width) continue;
    const color = buildingColors[Math.abs(i) % buildingColors.length];
    const h = 50 + (i * 13) % 100;
    const top = horizonY - h;

    ctx.fillStyle = color;
    ctx.fillRect(x, top, buildingWidth + 1, h);

    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    for (let w = 3; w < buildingWidth; w += 6) {
      ctx.beginPath();
      ctx.moveTo(x + w, top + 2);
      ctx.lineTo(x + w, horizonY);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draw layered wavy clouds in deep purple/magenta
 */
function drawClouds(ctx, width, height, scrollOffset) {
  const parallax = 0.06;
  const offset = (scrollOffset * parallax) % 300;

  ctx.save();
  ctx.globalAlpha = 0.65;

  const cloudBands = [
    { y: height * 0.12, color: '#2d1b4e' },
    { y: height * 0.2, color: '#4a148c' },
    { y: height * 0.27, color: '#6a1b9a' },
    { y: height * 0.33, color: '#9e00ff' }
  ];

  for (const band of cloudBands) {
    ctx.fillStyle = band.color;
    ctx.beginPath();
    ctx.moveTo(-20, height + 20);
    for (let x = -20; x < width + 50; x += 25) {
      const wx = x + (offset * (1 + cloudBands.indexOf(band) * 0.2)) % 150;
      const wy = band.y + Math.sin((wx + scrollOffset * 0.015) * 0.08) * 12;
      ctx.lineTo(wx, wy);
    }
    ctx.lineTo(width + 50, height + 20);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw sun and horizon glow band
 */
function drawSunAndHorizon(ctx, width, height) {
  const sunY = height * 0.38;
  const sunX = width * 0.55;

  // Horizon glow band - bright yellow/orange
  const glowGrad = ctx.createLinearGradient(0, sunY - 30, 0, sunY + 80);
  glowGrad.addColorStop(0, 'rgba(255, 107, 53, 0)');
  glowGrad.addColorStop(0.3, 'rgba(255, 239, 0, 0.4)');
  glowGrad.addColorStop(0.5, 'rgba(255, 239, 0, 0.8)');
  glowGrad.addColorStop(0.7, 'rgba(255, 107, 53, 0.5)');
  glowGrad.addColorStop(1, 'rgba(255, 0, 82, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, sunY - 40, width, 120);

  // Sun disc
  const sunR = width * 0.18;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 1.5);
  sunGrad.addColorStop(0, 'rgba(255, 239, 0, 1)');
  sunGrad.addColorStop(0.4, 'rgba(255, 107, 53, 0.8)');
  sunGrad.addColorStop(0.7, 'rgba(255, 0, 82, 0.3)');
  sunGrad.addColorStop(1, 'rgba(158, 0, 255, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR * 1.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw palm tree at screen position (perspective scaled)
 */
function drawPalmTree(ctx, screenX, screenY, scale) {
  const w = 12 * scale;
  const h = 35 * scale;
  const left = screenX - w / 2;
  const top = screenY - h;

  // Trunk - brown
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(left + w * 0.35, top + h * 0.5, w * 0.3, h * 0.5);

  // Fronds - vibrant green with yellow highlights
  ctx.fillStyle = '#2e7d32';
  ctx.beginPath();
  ctx.moveTo(left + w / 2, top);
  ctx.lineTo(left, top + h * 0.4);
  ctx.lineTo(left + w * 0.3, top + h * 0.25);
  ctx.lineTo(left + w / 2, top + h * 0.35);
  ctx.lineTo(left + w * 0.7, top + h * 0.25);
  ctx.lineTo(left + w, top + h * 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffef00';
  ctx.fillRect(left + w * 0.4, top + h * 0.1, w * 0.2, h * 0.15);
}

/**
 * Draw building at screen position
 */
function drawBuilding(ctx, screenX, screenY, scale) {
  const w = 20 * scale;
  const h = 45 * scale;
  const left = screenX - w / 2;
  const top = screenY - h;

  ctx.fillStyle = '#1a237e';
  ctx.fillRect(left, top, w, h);
  ctx.strokeStyle = '#455a64';
  ctx.lineWidth = 1;
  ctx.strokeRect(left, top, w, h);

  // Window lines
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.strokeRect(left + 2 + col * (w / 2 - 2), top + 5 + row * (h / 4 - 2), w / 2 - 4, h / 4 - 4);
    }
  }
}

/**
 * Draw streetlight
 */
function drawStreetlight(ctx, screenX, screenY, scale) {
  const w = 6 * scale;
  const h = 30 * scale;
  const left = screenX - w / 2;
  const top = screenY - h;

  ctx.fillStyle = '#455a64';
  ctx.fillRect(left + w * 0.3, top + h * 0.3, w * 0.4, h * 0.7);

  ctx.fillStyle = '#00f3ff';
  ctx.shadowColor = '#00f3ff';
  ctx.shadowBlur = 8;
  ctx.fillRect(left, top, w, h * 0.35);
  ctx.shadowBlur = 0;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} scrollOffset
 */
export function renderRoad(ctx, width, height, scrollOffset) {
  const b = getRoadBounds(width, height);

  // 1. Sky - dark purple gradient (distinct bands, pixel-art)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0d0221');
  skyGrad.addColorStop(0.2, '#1a0a2e');
  skyGrad.addColorStop(0.4, '#2d1b4e');
  skyGrad.addColorStop(0.55, '#4a148c');
  skyGrad.addColorStop(0.7, '#6a1b9a');
  skyGrad.addColorStop(0.85, '#9e00ff');
  skyGrad.addColorStop(1, '#1a0a2e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Cityscape (parallax, behind clouds)
  drawCityscape(ctx, width, height, scrollOffset);

  // 3. Clouds
  drawClouds(ctx, width, height, scrollOffset);

  // 4. Sun and horizon glow
  drawSunAndHorizon(ctx, width, height);

  // 5. Ground - flat cyan/turquoise on both sides
  ctx.fillStyle = '#00acc1';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(b.topLeft, 0);
  ctx.lineTo(b.bottomLeft, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(b.topRight, 0);
  ctx.lineTo(b.bottomRight, height);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // 6. Road surface - dark purple/black
  ctx.fillStyle = '#1a0a2e';
  ctx.beginPath();
  ctx.moveTo(b.topLeft, 0);
  ctx.lineTo(b.topRight, 0);
  ctx.lineTo(b.bottomRight, height);
  ctx.lineTo(b.bottomLeft, height);
  ctx.closePath();
  ctx.fill();

  // 7. Road edge lines - cyan
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(b.topLeft, 0);
  ctx.lineTo(b.bottomLeft, height);
  ctx.moveTo(b.topRight, 0);
  ctx.lineTo(b.bottomRight, height);
  ctx.stroke();

  // 8. Six-lane dividers - yellow dashed
  ctx.strokeStyle = '#ffef00';
  ctx.lineWidth = 2;
  const dashLen = 18;
  const gapLen = 14;
  const segmentHeight = dashLen + gapLen;
  const dashOffset = scrollOffset % segmentHeight;

  for (let i = 1; i < 6; i++) {
    const laneT = i / 6;
    const topX = b.topLeft + (b.topRight - b.topLeft) * laneT;
    const bottomX = b.bottomLeft + (b.bottomRight - b.bottomLeft) * laneT;
    ctx.setLineDash([dashLen, gapLen]);
    ctx.lineDashOffset = -dashOffset;
    ctx.beginPath();
    ctx.moveTo(topX, 0);
    ctx.lineTo(bottomX, height + segmentHeight);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;

  // 9. Roadside objects - palms, buildings, streetlights (scroll with road)
  const objectSpacing = 100;
  const offset = scrollOffset % objectSpacing;
  const numObjects = Math.ceil(height / objectSpacing) + 2;

  for (let i = 0; i < numObjects; i++) {
    const screenY = i * objectSpacing - offset;
    const scale = Math.max(0.2, Math.min(1.2, (screenY + 50) / height));

    const leftX = roadEdgeX(width, height, screenY, 'left') - 25;
    const rightX = roadEdgeX(width, height, screenY, 'right') + 25;

    if (i % 3 === 0) {
      drawPalmTree(ctx, leftX, screenY, scale);
      drawPalmTree(ctx, rightX, screenY, scale);
    } else if (i % 3 === 1) {
      drawBuilding(ctx, leftX, screenY, scale);
      drawBuilding(ctx, rightX, screenY, scale);
    } else {
      drawStreetlight(ctx, leftX - 10, screenY, scale);
      drawStreetlight(ctx, rightX + 10, screenY, scale);
    }
  }
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
