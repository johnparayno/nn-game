/**
 * Canvas rendering - 80's OVERDRIVE pixel-art style
 * Blocky shapes, neon palette, crisp edges
 */

import { laneCenterX, projectX } from './road.js';

/** Round to pixel grid for crisp rendering */
function px(v) {
  return Math.round(v);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawCar(ctx, x, y, width, height) {
  const pad = Math.max(2, width * 0.1);
  // Body - hot pink (80s neon)
  ctx.fillStyle = '#ff0052';
  ctx.fillRect(px(x + pad), px(y + pad), px(width - pad * 2), px(height - pad * 2));
  ctx.strokeStyle = '#ffef00';
  ctx.lineWidth = 2;
  ctx.strokeRect(px(x + pad), px(y + pad), px(width - pad * 2), px(height - pad * 2));
  // Windshield - cyan
  ctx.fillStyle = '#00f3ff';
  ctx.fillRect(px(x + width * 0.25), px(y + height * 0.2), px(width * 0.5), px(height * 0.35));
  ctx.strokeStyle = '#9e00ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(px(x + width * 0.25), px(y + height * 0.2), px(width * 0.5), px(height * 0.35));
  // Wheels - dark
  ctx.fillStyle = '#1a0a2e';
  ctx.fillRect(px(x + width * 0.1), px(y + height - pad - 8), px(width * 0.25), 8);
  ctx.fillRect(px(x + width * 0.65), px(y + height - pad - 8), px(width * 0.25), 8);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawRoadblock(ctx, x, y, width, height) {
  // Traffic cone - neon yellow
  ctx.fillStyle = '#ffef00';
  ctx.beginPath();
  ctx.moveTo(px(x + width / 2), px(y + height));
  ctx.lineTo(px(x), px(y + height * 0.3));
  ctx.lineTo(px(x + width * 0.3), px(y));
  ctx.lineTo(px(x + width * 0.7), px(y));
  ctx.lineTo(px(x + width), px(y + height * 0.3));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Stripe - hot pink
  ctx.fillStyle = '#ff0052';
  ctx.fillRect(px(x + width * 0.35), px(y + height * 0.15), px(width * 0.3), 4);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawOil(ctx, x, y, width, height) {
  // Dark puddle with cyan highlight (80s neon)
  ctx.save();
  ctx.translate(px(x + width / 2), px(y + height / 2));
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2 - 2, height / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1a0a2e';
  ctx.fill();
  ctx.strokeStyle = '#9e00ff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-width * 0.15, -height * 0.2, width * 0.2, height * 0.15, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
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
  // Gold coin - neon yellow (flat pixel style)
  ctx.fillStyle = '#ffef00';
  ctx.beginPath();
  ctx.arc(px(cx), px(cy), px(r), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff6b35';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px(cx), px(cy), px(r * 0.6), 0, Math.PI * 2);
  ctx.strokeStyle = '#ff0052';
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
  // Gas can - cyan neon
  ctx.fillStyle = '#00f3ff';
  ctx.fillRect(px(x + width * 0.2), px(y + height * 0.1), px(width * 0.6), px(height * 0.7));
  ctx.strokeStyle = '#9e00ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(px(x + width * 0.2), px(y + height * 0.1), px(width * 0.6), px(height * 0.7));
  ctx.fillStyle = '#1a0a2e';
  ctx.fillRect(px(x + width * 0.35), px(y), px(width * 0.3), px(height * 0.2));
  ctx.fillStyle = '#ffef00';
  ctx.fillRect(px(x + width * 0.25), px(y + height * 0.2), px(width * 0.5), px(height * 0.5));
}

/**
 * Retro sport bike - 80's OVERDRIVE pixel-art style
 * Neon cyan/pink palette, blocky shapes
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center x of motorcycle
 * @param {number} y - Bottom y (ground level)
 * @param {boolean} isSliding
 * @param {boolean} isBoosting
 * @param {number} laneTilt - Slight tilt when changing lanes (-1 to 1)
 */
function drawMotorcycle(ctx, x, y, isSliding, isBoosting, laneTilt) {
  const w = 44;
  const h = 52;
  const left = px(x - w / 2);
  const top = px(y - h);

  let tilt = laneTilt * 0.08;
  if (isSliding) tilt = 0.3;

  if (tilt !== 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.translate(-x, -y);
  }

  // Nitro flames when boosting - neon orange/pink
  if (isBoosting) {
    const flameCount = 3;
    for (let i = 0; i < flameCount; i++) {
      const fx = left + w * 0.25 + (i * w * 0.25);
      const fy = y - 5;
      const flicker = Math.sin(Date.now() * 0.02 + i) * 4;
      const flH = 18 + flicker;
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.moveTo(px(fx - 4), px(fy + flH));
      ctx.lineTo(px(fx), px(fy));
      ctx.lineTo(px(fx + 4), px(fy + flH));
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff0052';
      ctx.beginPath();
      ctx.moveTo(px(fx - 2), px(fy + flH * 0.6));
      ctx.lineTo(px(fx), px(fy + flH * 0.2));
      ctx.lineTo(px(fx + 2), px(fy + flH * 0.6));
      ctx.closePath();
      ctx.fill();
    }
  }

  // Wheels - dark with cyan rim
  ctx.fillStyle = '#1a0a2e';
  ctx.fillRect(left + 2, px(y - 10), 14, 10);
  ctx.fillRect(left + w - 16, px(y - 10), 14, 10);
  ctx.fillStyle = '#00f3ff';
  ctx.fillRect(left + 4, px(y - 9), 10, 6);
  ctx.fillRect(left + w - 14, px(y - 9), 10, 6);

  // Main frame - hot pink when normal, purple when sliding
  ctx.fillStyle = isSliding ? '#2d1b4e' : '#1a0a2e';
  ctx.fillRect(left + 4, top + 18, w - 8, h - 32);
  ctx.strokeStyle = isSliding ? '#00f3ff' : '#ff0052';
  ctx.lineWidth = 2;
  ctx.strokeRect(left + 4, top + 18, w - 8, h - 32);

  // Engine block - cyan accent
  ctx.fillStyle = isSliding ? '#2d1b4e' : '#00f3ff';
  ctx.fillRect(left + 10, top + 22, 10, 14);
  ctx.fillRect(left + w - 20, top + 22, 10, 14);
  ctx.strokeStyle = '#9e00ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 10, top + 22, 10, 14);
  ctx.strokeRect(left + w - 20, top + 22, 10, 14);

  // Fuel tank - dark with neon stripe
  ctx.fillStyle = isSliding ? '#1a0a2e' : '#1a0a2e';
  ctx.fillRect(left + 6, top + 10, w - 12, 14);
  ctx.strokeStyle = '#ff0052';
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 6, top + 10, w - 12, 14);
  ctx.fillStyle = isSliding ? '#00f3ff' : '#ffef00';
  ctx.fillRect(left + w / 2 - 4, top + 12, 8, 10);

  // Seat
  ctx.fillStyle = isSliding ? '#2d1b4e' : '#9e00ff';
  ctx.fillRect(left + 6, top + 6, w - 12, 10);
  ctx.strokeStyle = '#00f3ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 6, top + 6, w - 12, 10);

  // Handlebars - cyan
  ctx.strokeStyle = isSliding ? '#2d1b4e' : '#00f3ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left + 4, top + 12);
  ctx.lineTo(left - 4, top + 10);
  ctx.moveTo(left + w - 4, top + 12);
  ctx.lineTo(left + w + 4, top + 10);
  ctx.stroke();

  // Taillight - hot pink
  ctx.fillStyle = '#ff0052';
  ctx.beginPath();
  ctx.arc(left + w / 2, top + 4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffef00';
  ctx.beginPath();
  ctx.arc(left + w / 2, top + 4, 3, 0, Math.PI * 2);
  ctx.fill();

  if (tilt !== 0) ctx.restore();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 * @param {Array} obstacles
 * @param {Array} collectibles
 * @param {{ lane: number, displayX: number, isSliding: boolean, isBoosting: boolean, laneTilt: number }} motorcycle
 */
export function renderEntities(ctx, canvasWidth, canvasHeight, obstacles, collectibles, motorcycle) {
  const motorcycleY = canvasHeight - 30;

  for (const obs of obstacles) {
    const centerWorld = laneCenterX(canvasWidth, obs.lane);
    const screenX = projectX(canvasWidth, canvasHeight, centerWorld, obs.y + obs.height / 2);
    const scale = Math.max(0.15, Math.min(1, (obs.y + obs.height) / canvasHeight));
    const w = obs.width * scale;
    const h = obs.height * scale;
    const x = screenX - w / 2;
    if (obs.type === 'car') drawCar(ctx, x, obs.y, w, h);
    else if (obs.type === 'roadblock') drawRoadblock(ctx, x, obs.y, w, h);
    else if (obs.type === 'oil') drawOil(ctx, x, obs.y, w, h);
  }

  for (const col of collectibles) {
    if (col._collected) continue;
    const centerWorld = laneCenterX(canvasWidth, col.lane);
    const screenX = projectX(canvasWidth, canvasHeight, centerWorld, col.y + col.height / 2);
    const scale = Math.max(0.15, Math.min(1, (col.y + col.height) / canvasHeight));
    const w = col.width * scale;
    const h = col.height * scale;
    const x = screenX - w / 2;
    if (col.type === 'coin') drawCoin(ctx, x, col.y, w, h);
    else drawFuel(ctx, x, col.y, w, h);
  }

  const mcX = motorcycle.displayX ?? laneCenterX(canvasWidth, motorcycle.lane);
  drawMotorcycle(ctx, mcX, motorcycleY, motorcycle.isSliding, motorcycle.isBoosting ?? false, motorcycle.laneTilt ?? 0);
}
