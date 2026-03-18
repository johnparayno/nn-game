/**
 * Canvas rendering for game entities
 * Subway Surfers-inspired: third-person rear view, perspective, saturated colors
 */

import { laneCenterX, projectX } from './road.js';

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} width
 * @param {number} height
 */
function drawCar(ctx, x, y, width, height) {
  const pad = width * 0.1;
  // Body - Electric Red (Subway Surfers)
  ctx.fillStyle = '#E31902';
  ctx.fillRect(x + pad, y + pad, width - pad * 2, height - pad * 2);
  ctx.strokeStyle = '#ff4422';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + pad, y + pad, width - pad * 2, height - pad * 2);
  // Windshield - Electric Blue
  ctx.fillStyle = '#6AEEFD';
  ctx.fillRect(x + width * 0.25, y + height * 0.2, width * 0.5, height * 0.35);
  ctx.strokeStyle = '#C6FEFE';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + width * 0.25, y + height * 0.2, width * 0.5, height * 0.35);
  // Wheels
  ctx.fillStyle = '#1a1a2e';
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
  // Traffic cone - Mellow Apricot / Shandy (Subway Surfers)
  ctx.fillStyle = '#F7BE76';
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + height);
  ctx.lineTo(x, y + height * 0.3);
  ctx.lineTo(x + width * 0.3, y);
  ctx.lineTo(x + width * 0.7, y);
  ctx.lineTo(x + width, y + height * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#FFED6D';
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
  // Dark shiny puddle - with cyan highlight (Subway Surfers style)
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2 - 2, height / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a2e';
  ctx.fill();
  ctx.strokeStyle = '#354093';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Highlight - Diamond cyan
  ctx.beginPath();
  ctx.ellipse(-width * 0.15, -height * 0.2, width * 0.2, height * 0.15, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(198, 254, 254, 0.5)';
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
  // Gold coin - Shandy / Mellow Apricot (Subway Surfers)
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
  grad.addColorStop(0, '#FFED6D');
  grad.addColorStop(0.4, '#F7BE76');
  grad.addColorStop(1, '#e6a830');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Inner circle (coin face)
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
  ctx.strokeStyle = '#e6a830';
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
  // Gas can - Electric Blue / Diamond (Subway Surfers)
  ctx.fillStyle = '#6AEEFD';
  ctx.fillRect(x + width * 0.2, y + height * 0.1, width * 0.6, height * 0.7);
  ctx.strokeStyle = '#C6FEFE';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + width * 0.2, y + height * 0.1, width * 0.6, height * 0.7);
  // Nozzle
  ctx.fillStyle = '#354093';
  ctx.fillRect(x + width * 0.35, y, width * 0.3, height * 0.2);
  // Fuel level indicator (yellow)
  ctx.fillStyle = '#FFED6D';
  ctx.fillRect(x + width * 0.25, y + height * 0.2, width * 0.5, height * 0.5);
}

/**
 * Harley-Davidson style cruiser - Subway Surfers palette
 * Third-person rear view: bike faces away (exhaust at bottom)
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
  const left = x - w / 2;
  const top = y - h;

  let tilt = laneTilt * 0.08;
  if (isSliding) tilt = 0.3;

  if (tilt !== 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.translate(-x, -y);
  }

  // Exhaust flames when boosting
  if (isBoosting) {
    const flameCount = 3;
    for (let i = 0; i < flameCount; i++) {
      const fx = left + w * 0.25 + (i * w * 0.25);
      const fy = y - 5;
      const flicker = Math.sin(Date.now() * 0.02 + i) * 4;
      const flH = 18 + flicker;
      const grad = ctx.createLinearGradient(fx, fy, fx, fy + flH);
      grad.addColorStop(0, 'rgba(255, 200, 50, 0.9)');
      grad.addColorStop(0.3, 'rgba(255, 100, 0, 0.8)');
      grad.addColorStop(0.7, 'rgba(255, 50, 0, 0.4)');
      grad.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(fx - 4, fy + flH);
      ctx.lineTo(fx, fy);
      ctx.lineTo(fx + 4, fy + flH);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Wheels (dark with cyan rim accent)
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(left + 2, y - 10, 14, 10);
  ctx.fillRect(left + w - 16, y - 10, 14, 10);
  ctx.fillStyle = '#6AEEFD';
  ctx.fillRect(left + 4, y - 9, 10, 6);
  ctx.fillRect(left + w - 14, y - 9, 10, 6);

  // Main frame - Electric Red accent
  ctx.fillStyle = isSliding ? '#354093' : '#1a1a2e';
  ctx.fillRect(left + 4, top + 18, w - 8, h - 32);
  ctx.strokeStyle = isSliding ? '#6AEEFD' : '#E31902';
  ctx.lineWidth = 2;
  ctx.strokeRect(left + 4, top + 18, w - 8, h - 32);

  // V-twin engine block (cyan/chrome)
  ctx.fillStyle = isSliding ? '#354093' : '#C6FEFE';
  ctx.fillRect(left + 10, top + 22, 10, 14);
  ctx.fillRect(left + w - 20, top + 22, 10, 14);
  ctx.strokeStyle = '#6AEEFD';
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 10, top + 22, 10, 14);
  ctx.strokeRect(left + w - 20, top + 22, 10, 14);

  // Fuel tank (dark with Shandy stripe)
  ctx.fillStyle = isSliding ? '#252d6b' : '#1a1a2e';
  ctx.fillRect(left + 6, top + 10, w - 12, 14);
  ctx.strokeStyle = '#E31902';
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 6, top + 10, w - 12, 14);
  ctx.fillStyle = isSliding ? '#6AEEFD' : '#FFED6D';
  ctx.fillRect(left + w / 2 - 4, top + 12, 8, 10);

  // Seat
  ctx.fillStyle = isSliding ? '#252d6b' : '#354093';
  ctx.fillRect(left + 6, top + 6, w - 12, 10);
  ctx.strokeStyle = '#6AEEFD';
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 6, top + 6, w - 12, 10);

  // Handlebars (cyan) - rear view: bars at top
  ctx.strokeStyle = isSliding ? '#354093' : '#6AEEFD';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left + 4, top + 12);
  ctx.lineTo(left - 4, top + 10);
  ctx.moveTo(left + w - 4, top + 12);
  ctx.lineTo(left + w + 4, top + 10);
  ctx.stroke();

  // Taillight (rear view - red)
  ctx.fillStyle = '#E31902';
  ctx.beginPath();
  ctx.arc(left + w / 2, top + 4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff4422';
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

  // Draw obstacles with perspective (far objects smaller, converge toward center)
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

  // Draw collectibles with perspective
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

  // Motorcycle at bottom - use displayX for smooth lane animation
  const mcX = motorcycle.displayX ?? laneCenterX(canvasWidth, motorcycle.lane);
  drawMotorcycle(ctx, mcX, motorcycleY, motorcycle.isSliding, motorcycle.isBoosting ?? false, motorcycle.laneTilt ?? 0);
}
