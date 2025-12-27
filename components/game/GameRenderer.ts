// ==============================================================================
// file_id: SOM-SCR-0006-v0.4.0
// name: GameRenderer.ts
// description: Canvas rendering - boss battles & weather effects
// project_id: UNI-HUNT
// category: rendering
// tags: [canvas, rendering, draw, sprites, boss, weather]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.4.0
// agent_id: AGENT-PRIME-002
// execution: import { renderGame } from '@/components/game/GameRenderer'
// ==============================================================================

import { Player, Unicorn, Leprechaun, PotOfGold, Boss } from '@/types/entities';
import { RAINBOW_HEX, Vector2 } from '@/types/game';
import { GAME_CONFIG } from '@/lib/config/game-config';
import { RainDrop, LightningBolt } from '@/stores/gameStore';

let animTime = 0;

// Multi-layer star system for depth
interface Star {
  x: number;
  y: number;
  size: number;
  twinkle: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
  hue: number;
}

// Initialize stars dynamically based on canvas size
let stars: Star[] = [];
let nebulaClouds: NebulaCloud[] = [];
let lastCanvasWidth = 0;
let lastCanvasHeight = 0;

function initializeStars(width: number, height: number) {
  if (width === lastCanvasWidth && height === lastCanvasHeight && stars.length > 0) {
    return; // Already initialized for this size
  }

  lastCanvasWidth = width;
  lastCanvasHeight = height;
  stars = [];

  // Far layer - small, slow
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      layer: 0,
      hue: Math.random() * 60 + 200, // Blue-purple range
    });
  }
  // Mid layer
  for (let i = 0; i < 25; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      layer: 1,
      hue: Math.random() * 360, // Any color
    });
  }
  // Near layer - larger, faster twinkle
  for (let i = 0; i < 15; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      twinkle: Math.random() * Math.PI * 2,
      layer: 2,
      hue: Math.random() * 60 + 30, // Warm colors (gold, orange)
    });
  }
}

// Nebula cloud positions
interface NebulaCloud {
  x: number;
  y: number;
  radius: number;
  hue: number;
  drift: number;
}

function initializeNebulaClouds(width: number, height: number) {
  if (nebulaClouds.length > 0) return;

  for (let i = 0; i < 4; i++) {
    nebulaClouds.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 100 + Math.random() * 150,
      hue: Math.random() * 360,
      drift: Math.random() * Math.PI * 2,
    });
  }
}

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  animTime += 0.016; // ~60fps delta

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Initialize stars and nebula for current canvas size
  initializeStars(width, height);
  initializeNebulaClouds(width, height);

  // Animated color-cycling background gradient
  const cycleHue = (animTime * 5) % 360;
  const bgColor1 = `hsl(${(cycleHue + 240) % 360}, 30%, 8%)`;
  const bgColor2 = `hsl(${(cycleHue + 260) % 360}, 40%, 15%)`;
  const bgColor3 = `hsl(${(cycleHue + 280) % 360}, 25%, 5%)`;

  const bgGradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, width * 0.8
  );
  bgGradient.addColorStop(0, bgColor2);
  bgGradient.addColorStop(0.5, bgColor1);
  bgGradient.addColorStop(1, bgColor3);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Draw subtle nebula clouds for depth (very muted)
  for (const cloud of nebulaClouds) {
    const cloudX = cloud.x + Math.sin(animTime * 0.1 + cloud.drift) * 20;
    const cloudY = cloud.y + Math.cos(animTime * 0.08 + cloud.drift) * 15;
    const cloudHue = (cloud.hue + animTime * 2) % 360;

    const nebulaGrad = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloud.radius);
    nebulaGrad.addColorStop(0, `hsla(${cloudHue}, 50%, 30%, 0.05)`);
    nebulaGrad.addColorStop(0.5, `hsla(${cloudHue + 30}, 40%, 20%, 0.03)`);
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
  }

  // Draw stars by layer (far to near for depth)
  for (const star of stars) {
    const layerSpeed = [1, 1.5, 2.5][star.layer];
    const layerAlphaBase = [0.2, 0.35, 0.5][star.layer];
    const twinkleAlpha = layerAlphaBase + Math.sin(animTime * layerSpeed * 2 + star.twinkle) * 0.25;

    // Color-shifting stars
    const starHue = (star.hue + animTime * 10) % 360;
    const starSat = star.layer === 2 ? 60 : 30;
    const starLight = 70 + star.layer * 10;

    ctx.fillStyle = `hsla(${starHue}, ${starSat}%, ${starLight}%, ${twinkleAlpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    // Add glow to near stars
    if (star.layer === 2 && twinkleAlpha > 0.5) {
      const glowGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
      glowGrad.addColorStop(0, `hsla(${starHue}, 80%, 80%, 0.15)`);
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Animated glowing border with color cycling
  const borderHue = (cycleHue + 270) % 360;
  ctx.shadowColor = `hsl(${borderHue}, 60%, 50%)`;
  ctx.shadowBlur = 15 + Math.sin(animTime * 2) * 5;
  ctx.strokeStyle = `hsl(${borderHue}, 50%, 40%)`;
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, GAME_CONFIG.CANVAS_WIDTH - 16, GAME_CONFIG.CANVAS_HEIGHT - 16);
  ctx.shadowBlur = 0;
}

export function drawPotOfGold(ctx: CanvasRenderingContext2D, pot: PotOfGold): void {
  ctx.save();
  ctx.translate(pot.position.x, pot.position.y);

  const potGlow = ctx.createRadialGradient(0, 10, 0, 0, 10, pot.size * 1.5);
  potGlow.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
  potGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = potGlow;
  ctx.beginPath();
  ctx.ellipse(0, 10, pot.size * 1.5, pot.size * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  const potGradient = ctx.createLinearGradient(-pot.size, 0, pot.size, 0);
  potGradient.addColorStop(0, '#0a0a0a');
  potGradient.addColorStop(0.3, '#2a2a2a');
  potGradient.addColorStop(0.7, '#2a2a2a');
  potGradient.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = potGradient;
  ctx.beginPath();
  ctx.moveTo(-pot.size, pot.size * 0.4);
  ctx.quadraticCurveTo(-pot.size * 1.1, 0, -pot.size * 0.7, -pot.size * 0.4);
  ctx.lineTo(pot.size * 0.7, -pot.size * 0.4);
  ctx.quadraticCurveTo(pot.size * 1.1, 0, pot.size, pot.size * 0.4);
  ctx.closePath();
  ctx.fill();

  const rimGradient = ctx.createLinearGradient(0, -pot.size * 0.5, 0, -pot.size * 0.35);
  rimGradient.addColorStop(0, '#444');
  rimGradient.addColorStop(0.5, '#666');
  rimGradient.addColorStop(1, '#333');
  ctx.fillStyle = rimGradient;
  ctx.beginPath();
  ctx.ellipse(0, -pot.size * 0.42, pot.size * 0.85, pot.size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  const coinPositions = [
    { x: -15, y: -pot.size * 0.55, size: 10 },
    { x: 0, y: -pot.size * 0.6, size: 12 },
    { x: 15, y: -pot.size * 0.55, size: 10 },
    { x: -8, y: -pot.size * 0.75, size: 9 },
    { x: 8, y: -pot.size * 0.72, size: 9 },
  ];

  for (const coin of coinPositions) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(coin.x + 2, coin.y + 2, coin.size, coin.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    const coinGrad = ctx.createRadialGradient(coin.x - coin.size * 0.3, coin.y - coin.size * 0.3, 0, coin.x, coin.y, coin.size);
    coinGrad.addColorStop(0, '#FFE55C');
    coinGrad.addColorStop(0.7, '#FFD700');
    coinGrad.addColorStop(1, '#CC9900');
    ctx.fillStyle = coinGrad;
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(coin.x - coin.size * 0.3, coin.y - coin.size * 0.3, coin.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  ctx.save();
  ctx.translate(player.position.x, player.position.y);

  ctx.shadowColor = '#ff66ff';
  ctx.shadowBlur = 20;

  const netRotation = animTime * 0.5;
  ctx.rotate(netRotation);

  for (let ring = 0; ring < 3; ring++) {
    const ringRadius = player.netRadius - ring * 8;
    const dashOffset = ring * 10 + animTime * 50;

    ctx.setLineDash([12, 6]);
    ctx.lineDashOffset = dashOffset;

    const gradient = ctx.createConicGradient(0, 0, 0);
    gradient.addColorStop(0, RAINBOW_HEX.red);
    gradient.addColorStop(0.14, RAINBOW_HEX.orange);
    gradient.addColorStop(0.28, RAINBOW_HEX.yellow);
    gradient.addColorStop(0.42, RAINBOW_HEX.green);
    gradient.addColorStop(0.57, RAINBOW_HEX.blue);
    gradient.addColorStop(0.71, RAINBOW_HEX.indigo);
    gradient.addColorStop(0.85, RAINBOW_HEX.violet);
    gradient.addColorStop(1, RAINBOW_HEX.red);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4 - ring;
    ctx.globalAlpha = 1 - ring * 0.25;
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  ctx.rotate(-netRotation);
  ctx.shadowBlur = 0;

  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.netRadius);
  glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  glowGradient.addColorStop(0.5, 'rgba(200, 150, 255, 0.08)');
  glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, player.netRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-4, 0);
  ctx.moveTo(4, 0);
  ctx.lineTo(10, 0);
  ctx.moveTo(0, -10);
  ctx.lineTo(0, -4);
  ctx.moveTo(0, 4);
  ctx.lineTo(0, 10);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawUnicorn(ctx: CanvasRenderingContext2D, unicorn: Unicorn): void {
  ctx.save();
  ctx.translate(unicorn.position.x, unicorn.position.y);
  ctx.rotate(unicorn.rotation);

  // Enhanced outer shimmer glow - color shifting
  const shimmerHue = (animTime * 30) % 360;
  const shimmerColor = `hsla(${shimmerHue}, 80%, 80%, 0.2)`;

  const auraGradient = ctx.createRadialGradient(0, 0, unicorn.size, 0, 0, unicorn.size * 3);
  auraGradient.addColorStop(0, shimmerColor);
  auraGradient.addColorStop(0.3, 'rgba(255, 200, 255, 0.25)');
  auraGradient.addColorStop(0.6, 'rgba(200, 150, 255, 0.1)');
  auraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = auraGradient;
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size * 3, 0, Math.PI * 2);
  ctx.fill();

  // Sparkle particles - more and varied
  for (let i = 0; i < 8; i++) {
    const particleAngle = animTime * 1.5 + (i * Math.PI) / 4;
    const particleRadius = unicorn.size * 1.3 + Math.sin(animTime * 3 + i * 1.2) * 8;
    const px = Math.cos(particleAngle) * particleRadius;
    const py = Math.sin(particleAngle) * particleRadius;
    const particleAlpha = 0.4 + Math.sin(animTime * 5 + i) * 0.3;
    const particleSize = 1.5 + Math.sin(animTime * 4 + i * 0.7) * 1;

    // Rainbow sparkles
    const sparkleHue = (shimmerHue + i * 45) % 360;
    ctx.fillStyle = `hsla(${sparkleHue}, 100%, 80%, ${particleAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, particleSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Star sparkles around unicorn
  for (let i = 0; i < 5; i++) {
    const starAngle = animTime * 0.8 + (i * Math.PI * 2) / 5;
    const starDist = unicorn.size * 2 + Math.sin(animTime * 2 + i) * 5;
    const sx = Math.cos(starAngle) * starDist;
    const sy = Math.sin(starAngle) * starDist;
    const starAlpha = 0.3 + Math.sin(animTime * 6 + i * 1.5) * 0.3;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(animTime * 3);
    ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
    // 4-point star
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(1, -1);
    ctx.lineTo(3, 0);
    ctx.lineTo(1, 1);
    ctx.lineTo(0, 3);
    ctx.lineTo(-1, 1);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-1, -1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Shimmery body with color shifting highlight
  const bodyGradient = ctx.createRadialGradient(-unicorn.size * 0.3, -unicorn.size * 0.3, 0, 0, 0, unicorn.size);
  const bodyHue = (shimmerHue + 270) % 360; // Slight offset for variety
  bodyGradient.addColorStop(0, '#FFFFFF');
  bodyGradient.addColorStop(0.4, `hsla(${bodyHue}, 30%, 95%, 1)`);
  bodyGradient.addColorStop(0.7, '#F8F0FF');
  bodyGradient.addColorStop(1, '#E8D8F8');
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size, 0, Math.PI * 2);
  ctx.fill();

  // Shimmery outline
  const outlineGradient = ctx.createLinearGradient(-unicorn.size, 0, unicorn.size, 0);
  outlineGradient.addColorStop(0, `hsla(${shimmerHue}, 60%, 75%, 0.8)`);
  outlineGradient.addColorStop(0.5, `hsla(${(shimmerHue + 60) % 360}, 60%, 85%, 1)`);
  outlineGradient.addColorStop(1, `hsla(${(shimmerHue + 120) % 360}, 60%, 75%, 0.8)`);
  ctx.strokeStyle = outlineGradient;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glowing horn
  const hornLength = 18;
  const hornGlow = ctx.createRadialGradient(unicorn.size + hornLength * 0.7, 0, 0, unicorn.size + hornLength * 0.7, 0, 15);
  hornGlow.addColorStop(0, 'rgba(255, 223, 0, 0.5)');
  hornGlow.addColorStop(1, 'rgba(255, 223, 0, 0)');
  ctx.fillStyle = hornGlow;
  ctx.beginPath();
  ctx.arc(unicorn.size + hornLength * 0.7, 0, 15, 0, Math.PI * 2);
  ctx.fill();

  const hornGradient = ctx.createLinearGradient(unicorn.size, 0, unicorn.size + hornLength, 0);
  hornGradient.addColorStop(0, '#FFD700');
  hornGradient.addColorStop(0.3, '#FFEC8B');
  hornGradient.addColorStop(0.7, '#FFF8DC');
  hornGradient.addColorStop(1, '#FFFFEE');

  ctx.fillStyle = hornGradient;
  ctx.beginPath();
  ctx.moveTo(unicorn.size + hornLength, 0);
  ctx.lineTo(unicorn.size - 2, -7);
  ctx.lineTo(unicorn.size - 2, 7);
  ctx.closePath();
  ctx.fill();

  // Animated flowing rainbow mane
  const maneColors = [RAINBOW_HEX.red, RAINBOW_HEX.orange, RAINBOW_HEX.yellow, RAINBOW_HEX.green, RAINBOW_HEX.blue, RAINBOW_HEX.violet];
  ctx.lineWidth = 4;
  for (let i = 0; i < maneColors.length; i++) {
    const waveOffset = Math.sin(animTime * 3 + i * 0.5) * 4;
    const waveWidth = 3 + Math.sin(animTime * 2 + i) * 0.5;
    ctx.strokeStyle = maneColors[i];
    ctx.lineWidth = waveWidth;
    ctx.beginPath();
    ctx.arc(-5, waveOffset, unicorn.size + 4 + i * 4, Math.PI * 0.55, Math.PI * 1.45);
    ctx.stroke();
  }

  // Sparkling eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(unicorn.size * 0.4, -unicorn.size * 0.2, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlight with sparkle
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(unicorn.size * 0.5, -unicorn.size * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Secondary eye sparkle that moves
  const sparkleX = unicorn.size * 0.35 + Math.sin(animTime * 2) * 2;
  const sparkleY = -unicorn.size * 0.15 + Math.cos(animTime * 2) * 1;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawLeprechaun(ctx: CanvasRenderingContext2D, leprechaun: Leprechaun): void {
  ctx.save();
  ctx.translate(leprechaun.position.x, leprechaun.position.y);

  const tapPercent = leprechaun.tapCount / leprechaun.tapsRequired;

  // Stun effect - shake when stunned
  if (leprechaun.isStunned) {
    const shake = Math.sin(animTime * 50) * 3;
    ctx.translate(shake, 0);
  }

  // Scale down as more taps land
  const scale = 1 - tapPercent * 0.2;
  ctx.scale(scale, scale);

  // Stun glow when stunned
  if (leprechaun.isStunned) {
    const stunGlow = ctx.createRadialGradient(0, 0, leprechaun.size, 0, 0, leprechaun.size * 2.5);
    stunGlow.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
    stunGlow.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.fillStyle = stunGlow;
    ctx.beginPath();
    ctx.arc(0, 0, leprechaun.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Evil aura
  const evilGlow = ctx.createRadialGradient(0, 0, leprechaun.size, 0, 0, leprechaun.size * 2);
  evilGlow.addColorStop(0, 'rgba(0, 100, 0, 0.3)');
  evilGlow.addColorStop(1, 'rgba(0, 50, 0, 0)');
  ctx.fillStyle = evilGlow;
  ctx.beginPath();
  ctx.arc(0, 0, leprechaun.size * 2, 0, Math.PI * 2);
  ctx.fill();

  // Body
  const bodyGrad = ctx.createRadialGradient(-leprechaun.size * 0.3, -leprechaun.size * 0.3, 0, 0, 0, leprechaun.size);
  bodyGrad.addColorStop(0, '#44CC44');
  bodyGrad.addColorStop(0.7, '#228B22');
  bodyGrad.addColorStop(1, '#1A6B1A');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(0, 0, leprechaun.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#006400';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hat brim
  ctx.fillStyle = '#006400';
  ctx.beginPath();
  ctx.ellipse(0, -leprechaun.size, leprechaun.size * 1.1, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hat top
  const hatGrad = ctx.createLinearGradient(-leprechaun.size * 0.5, -leprechaun.size - 18, leprechaun.size * 0.5, -leprechaun.size);
  hatGrad.addColorStop(0, '#007700');
  hatGrad.addColorStop(0.5, '#009900');
  hatGrad.addColorStop(1, '#006600');
  ctx.fillStyle = hatGrad;
  ctx.beginPath();
  ctx.moveTo(-leprechaun.size * 0.6, -leprechaun.size);
  ctx.lineTo(-leprechaun.size * 0.5, -leprechaun.size - 18);
  ctx.lineTo(leprechaun.size * 0.5, -leprechaun.size - 18);
  ctx.lineTo(leprechaun.size * 0.6, -leprechaun.size);
  ctx.closePath();
  ctx.fill();

  // Hat buckle
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(-5, -leprechaun.size - 9, 10, 8);

  // Beard
  ctx.fillStyle = '#FF6600';
  ctx.beginPath();
  ctx.moveTo(-leprechaun.size * 0.7, leprechaun.size * 0.1);
  ctx.quadraticCurveTo(-leprechaun.size * 0.3, leprechaun.size * 1.5, 0, leprechaun.size * 1.3);
  ctx.quadraticCurveTo(leprechaun.size * 0.3, leprechaun.size * 1.5, leprechaun.size * 0.7, leprechaun.size * 0.1);
  ctx.fill();

  // Eyes - stars when stunned
  if (leprechaun.isStunned) {
    ctx.fillStyle = '#FFFF00';
    for (let i = 0; i < 2; i++) {
      const ex = i === 0 ? -leprechaun.size * 0.35 : leprechaun.size * 0.35;
      const ey = -leprechaun.size * 0.25;
      const starAngle = animTime * 10;
      for (let j = 0; j < 4; j++) {
        ctx.save();
        ctx.translate(ex, ey);
        ctx.rotate(starAngle + j * Math.PI / 2);
        ctx.fillRect(-1, -4, 2, 8);
        ctx.restore();
      }
    }
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(-leprechaun.size * 0.35, -leprechaun.size * 0.25, 5, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(leprechaun.size * 0.35, -leprechaun.size * 0.25, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-leprechaun.size * 0.3, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
    ctx.arc(leprechaun.size * 0.4, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tap progress indicator (circles above head)
  if (leprechaun.tapCount > 0) {
    const indicatorY = -leprechaun.size - 35;
    const spacing = 8;
    const startX = -((leprechaun.tapsRequired - 1) * spacing) / 2;

    for (let i = 0; i < leprechaun.tapsRequired; i++) {
      const x = startX + i * spacing;
      const isFilled = i < leprechaun.tapCount;

      ctx.beginPath();
      ctx.arc(x, indicatorY, 3, 0, Math.PI * 2);

      if (isFilled) {
        const colors = [RAINBOW_HEX.red, RAINBOW_HEX.orange, RAINBOW_HEX.yellow, RAINBOW_HEX.green, RAINBOW_HEX.blue];
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

// Draw rain drops
export function drawRain(ctx: CanvasRenderingContext2D, rainDrops: RainDrop[]): void {
  ctx.strokeStyle = 'rgba(150, 180, 255, 0.6)';
  ctx.lineWidth = 1;

  for (const drop of rainDrops) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 2, drop.y + drop.length);
    ctx.stroke();
  }
}

// Draw thunder flash overlay
export function drawThunderFlash(ctx: CanvasRenderingContext2D, intensity: number): void {
  if (intensity <= 0) return;

  ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.3})`;
  ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
}

// Draw lightning bolts
export function drawLightning(ctx: CanvasRenderingContext2D, bolts: LightningBolt[]): void {
  for (const bolt of bolts) {
    if (bolt.isWarning && bolt.targetPos) {
      // Draw warning circle
      const pulseSize = 30 + Math.sin(animTime * 20) * 10;
      ctx.strokeStyle = `rgba(255, 255, 0, ${0.5 + Math.sin(animTime * 15) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(bolt.targetPos.x, bolt.targetPos.y, pulseSize, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Warning text
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('!', bolt.targetPos.x, bolt.targetPos.y + 4);
    } else if (bolt.points.length > 1) {
      // Draw actual lightning bolt
      ctx.globalAlpha = bolt.alpha;

      // Glow
      ctx.shadowColor = '#88FFFF';
      ctx.shadowBlur = 20;

      // Main bolt
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (let i = 1; i < bolt.points.length; i++) {
        ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
      }
      ctx.stroke();

      // Core
      ctx.strokeStyle = '#88FFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
      for (let i = 1; i < bolt.points.length; i++) {
        ctx.lineTo(bolt.points[i].x, bolt.points[i].y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }
}

// Draw hurricane effect
export function drawHurricane(ctx: CanvasRenderingContext2D, angle: number, centerX: number, centerY: number): void {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  // Spiral arms
  for (let arm = 0; arm < 3; arm++) {
    ctx.save();
    ctx.rotate((arm * Math.PI * 2) / 3);

    ctx.strokeStyle = `rgba(100, 150, 200, 0.3)`;
    ctx.lineWidth = 8;
    ctx.beginPath();

    for (let i = 0; i < 50; i++) {
      const spiralAngle = i * 0.15;
      const radius = 20 + i * 4;
      const x = Math.cos(spiralAngle) * radius;
      const y = Math.sin(spiralAngle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Center eye
  const eyeGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
  eyeGrad.addColorStop(0, 'rgba(50, 80, 120, 0.8)');
  eyeGrad.addColorStop(1, 'rgba(50, 80, 120, 0)');
  ctx.fillStyle = eyeGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw boss
export function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss): void {
  ctx.save();
  ctx.translate(boss.position.x, boss.position.y);

  // Boss cloud body
  const cloudGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, boss.size);

  if (boss.bossType === 'rain_thunder') {
    cloudGrad.addColorStop(0, '#6688AA');
    cloudGrad.addColorStop(0.7, '#445566');
    cloudGrad.addColorStop(1, '#223344');
  } else if (boss.bossType === 'lightning') {
    cloudGrad.addColorStop(0, '#8888CC');
    cloudGrad.addColorStop(0.7, '#555588');
    cloudGrad.addColorStop(1, '#333355');
  } else {
    cloudGrad.addColorStop(0, '#5577AA');
    cloudGrad.addColorStop(0.7, '#334466');
    cloudGrad.addColorStop(1, '#112233');
  }

  // Draw cloud shape (multiple overlapping circles)
  ctx.fillStyle = cloudGrad;
  ctx.beginPath();
  ctx.arc(-boss.size * 0.4, 0, boss.size * 0.7, 0, Math.PI * 2);
  ctx.arc(boss.size * 0.4, 0, boss.size * 0.7, 0, Math.PI * 2);
  ctx.arc(0, -boss.size * 0.2, boss.size * 0.8, 0, Math.PI * 2);
  ctx.arc(-boss.size * 0.6, boss.size * 0.2, boss.size * 0.5, 0, Math.PI * 2);
  ctx.arc(boss.size * 0.6, boss.size * 0.2, boss.size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyes
  ctx.fillStyle = '#FF4444';
  ctx.beginPath();
  ctx.arc(-boss.size * 0.25, -boss.size * 0.1, 8, 0, Math.PI * 2);
  ctx.arc(boss.size * 0.25, -boss.size * 0.1, 8, 0, Math.PI * 2);
  ctx.fill();

  // Eye glow
  ctx.fillStyle = '#FFFF00';
  ctx.beginPath();
  ctx.arc(-boss.size * 0.22, -boss.size * 0.13, 3, 0, Math.PI * 2);
  ctx.arc(boss.size * 0.28, -boss.size * 0.13, 3, 0, Math.PI * 2);
  ctx.fill();

  // Health bar
  const barWidth = boss.size * 2;
  const barHeight = 8;
  const healthPercent = boss.health / boss.maxHealth;

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(-barWidth / 2, -boss.size - 20, barWidth, barHeight);

  // Health (color changes based on health)
  let healthColor = '#00FF00';
  if (healthPercent < 0.3) healthColor = '#FF0000';
  else if (healthPercent < 0.6) healthColor = '#FFAA00';

  ctx.fillStyle = healthColor;
  ctx.fillRect(-barWidth / 2, -boss.size - 20, barWidth * healthPercent, barHeight);

  // Border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(-barWidth / 2, -boss.size - 20, barWidth, barHeight);

  // Boss name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  const bossName = boss.bossType === 'rain_thunder' ? 'STORM CLOUD' :
                   boss.bossType === 'lightning' ? 'LIGHTNING LORD' : 'HURRICANE KING';
  ctx.fillText(bossName, 0, -boss.size - 30);

  ctx.restore();
}

// Draw power-up rainbow lasers
export function drawPowerUpLasers(
  ctx: CanvasRenderingContext2D,
  lasers: { x: number; y: number; angle: number; life: number }[]
): void {
  const colors = [
    RAINBOW_HEX.red, RAINBOW_HEX.orange, RAINBOW_HEX.yellow,
    RAINBOW_HEX.green, RAINBOW_HEX.blue, RAINBOW_HEX.indigo,
    RAINBOW_HEX.violet, RAINBOW_HEX.red, RAINBOW_HEX.orange
  ];

  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    const color = colors[i % colors.length];

    ctx.save();
    ctx.translate(laser.x, laser.y);
    ctx.rotate(laser.angle);

    // Laser glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;

    // Main laser beam
    const laserLength = 60;
    const gradient = ctx.createLinearGradient(0, 0, laserLength, 0);
    gradient.addColorStop(0, `${color}00`);
    gradient.addColorStop(0.2, color);
    gradient.addColorStop(0.8, color);
    gradient.addColorStop(1, `${color}00`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(laserLength, 0);
    ctx.stroke();

    // Core bright line
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(laserLength - 5, 0);
    ctx.stroke();

    // Trail particles
    for (let j = 0; j < 3; j++) {
      const trailX = -10 - j * 8;
      const trailAlpha = (1 - j * 0.3) * laser.life;
      ctx.fillStyle = `${color}${Math.floor(trailAlpha * 255).toString(16).padStart(2, '0')}`;
      ctx.beginPath();
      ctx.arc(trailX, Math.sin(animTime * 10 + j) * 2, 3 - j, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

export interface RenderState {
  player: Player;
  unicorns: Unicorn[];
  leprechauns: Leprechaun[];
  potOfGold: PotOfGold;
  boss: Boss | null;
  rainDrops: RainDrop[];
  thunderFlash: number;
  lightningBolts: LightningBolt[];
  hurricaneAngle: number;
  screenShake: Vector2;
  powerUpLasers?: { x: number; y: number; angle: number; life: number }[];
  isPowerUpActive?: boolean;
}

export function renderGame(ctx: CanvasRenderingContext2D, state: RenderState): void {
  ctx.save();

  // Apply screen shake
  if (state.screenShake) {
    ctx.translate(state.screenShake.x, state.screenShake.y);
  }

  clearCanvas(ctx);

  // Draw hurricane effect behind everything
  if (state.boss && state.boss.bossType === 'hurricane') {
    drawHurricane(ctx, state.hurricaneAngle, GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2);
  }

  drawPotOfGold(ctx, state.potOfGold);

  for (const unicorn of state.unicorns) {
    drawUnicorn(ctx, unicorn);
  }

  for (const leprechaun of state.leprechauns) {
    drawLeprechaun(ctx, leprechaun);
  }

  drawPlayer(ctx, state.player);

  // Draw power-up lasers
  if (state.powerUpLasers && state.powerUpLasers.length > 0) {
    drawPowerUpLasers(ctx, state.powerUpLasers);
  }

  // Draw boss
  if (state.boss) {
    drawBoss(ctx, state.boss);
  }

  // Draw weather effects on top
  if (state.rainDrops && state.rainDrops.length > 0) {
    drawRain(ctx, state.rainDrops);
  }

  if (state.lightningBolts && state.lightningBolts.length > 0) {
    drawLightning(ctx, state.lightningBolts);
  }

  // Thunder flash overlay (on top of everything)
  if (state.thunderFlash > 0) {
    drawThunderFlash(ctx, state.thunderFlash);
  }

  ctx.restore();
}
