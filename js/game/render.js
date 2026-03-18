/**
 * Canvas rendering for game entities
 * Draws motorcycle, obstacles, collectibles with visible designs
 */

import { laneCenterX } from './road.js';

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawCar(ctx, x, y, width, height) {
  const pad = width * 0.1;
  // Body (red sedan)
  ctx.fillStyle = '#c33';
  ctx.fillRect(x + pad, y + pad, width - pad * 2, height - pad * 2);
  ctx.strokeStyle = '#a22';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + pad, y + pad, width - pad * 2, height - pad * 2);
  // Windshield
  ctx.fillStyle = '#5a9fd4';
  ctx.fillRect(x + width * 0.25, y + height * 0.2, width * 0.5, height * 0.35);
  // Wheels
  ctx.fillStyle = '#222';
  ctx.fillRect(x + width * 0.1, y + height - pad - 8, width * 0.25, 8);
  ctx.fillRect(x + width * 0.65, y + height - pad - 8, width * 0.25, 8);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawRoadblock(ctx, x, y, width, height) {
  // Orange traffic cone / barrier
  ctx.fillStyle = '#f80';
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + height);
  ctx.lineTo(x, y + height * 0.3);
  ctx.lineTo(x + width * 0.3, y);
  ctx.lineTo(x + width * 0.7, y);
  ctx.lineTo(x + width, y + height * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c60';
  ctx.lineWidth = 2;
  ctx.stroke();
  // White stripe
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + width * 0.35, y + height * 0.15, width * 0.3, 4);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawOil(ctx, x, y, width, height) {
  // Dark shiny puddle (ellipse)
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2 - 2, height / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Highlight
  ctx.beginPath();
  ctx.ellipse(-width * 0.15, -height * 0.2, width * 0.2, height * 0.15, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(80,80,90,0.5)';
  ctx.fill();
  ctx.restore();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawCoin(ctx, x, y, width, height) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = Math.min(width, height) / 2 - 2;
  // Gold coin
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  grad.addColorStop(0, '#ffd700');
  grad.addColorStop(0.5, '#f0c040');
  grad.addColorStop(1, '#c9a227');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Inner circle (coin face)
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawFuel(ctx, x, y, width, height) {
  // Gas can shape
  ctx.fillStyle = '#2a7a4a';
  ctx.fillRect(x + width * 0.2, y + height * 0.1, width * 0.6, height * 0.7);
  ctx.strokeStyle = '#1a5a3a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + width * 0.2, y + height * 0.1, width * 0.6, height * 0.7);
  // Nozzle
  ctx.fillStyle = '#444';
  ctx.fillRect(x + width * 0.35, y, width * 0.3, height * 0.2);
  // Fuel level indicator (green)
  ctx.fillStyle = '#4a9';
  ctx.fillRect(x + width * 0.25, y + height * 0.2, width * 0.5, height * 0.5);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center x of motorcycle
 * @param {number} y - Bottom y (ground level)
 * @param {boolean} isSliding
 */
function drawMotorcycle(ctx, x, y, isSliding) {
  const w = 40;
  const h = 50;
  const left = x - w / 2;
  const top = y - h;

  if (isSliding) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.3);
    ctx.translate(-x, -y);
  }

  // Body (main frame)
  ctx.fillStyle = isSliding ? '#666' : '#2a7a9a';
  ctx.fillRect(left + 5, top + 15, w - 10, h - 25);
  ctx.strokeStyle = isSliding ? '#555' : '#1a5a7a';
  ctx.lineWidth = 2;
  ctx.strokeRect(left + 5, top + 15, w - 10, h - 25);

  // Seat
  ctx.fillStyle = isSliding ? '#555' : '#1a1a1a';
  ctx.fillRect(left + 8, top + 8, w - 16, 12);

  // Front wheel
  ctx.fillStyle = '#222';
  ctx.fillRect(left, y - 8, 12, 8);
  ctx.fillRect(left + w - 12, y - 8, 12, 8);

  // Headlight
  ctx.fillStyle = '#ffeb99';
  ctx.beginPath();
  ctx.arc(left + w / 2, top + 5, 4, 0, Math.PI * 2);
  ctx.fill();

  if (isSliding) ctx.restore();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {Array} obstacles
 * @param {Array} collectibles
 * @param {{ lane: Lane, isSliding: boolean }} motorcycle
 */
export function renderEntities(ctx, canvasWidth, canvasHeight, obstacles, collectibles, motorcycle) {
  const motorcycleY = canvasHeight - 30;

  for (const obs of obstacles) {
    const x = laneCenterX(canvasWidth, obs.lane) - obs.width / 2;
    if (obs.type === 'car') drawCar(ctx, x, obs.y, obs.width, obs.height);
    else if (obs.type === 'roadblock') drawRoadblock(ctx, x, obs.y, obs.width, obs.height);
    else if (obs.type === 'oil') drawOil(ctx, x, obs.y, obs.width, obs.height);
  }

  for (const col of collectibles) {
    if (col._collected) continue;
    const x = laneCenterX(canvasWidth, col.lane) - col.width / 2;
    if (col.type === 'coin') drawCoin(ctx, x, col.y, col.width, col.height);
    else drawFuel(ctx, x, col.y, col.width, col.height);
  }

  const mcX = laneCenterX(canvasWidth, motorcycle.lane);
  drawMotorcycle(ctx, mcX, motorcycleY, motorcycle.isSliding);
}
