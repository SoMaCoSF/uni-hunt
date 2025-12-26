// ==============================================================================
// file_id: SOM-SCR-0006-v0.2.0
// name: GameRenderer.ts
// description: Canvas rendering functions for all game entities - Enhanced graphics
// project_id: UNI-HUNT
// category: rendering
// tags: [canvas, rendering, draw, sprites, effects]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { renderGame } from '@/components/game/GameRenderer'
// ==============================================================================

import { Player, Unicorn, Leprechaun, PotOfGold, Projectile } from '@/types/entities';
import { RAINBOW_HEX } from '@/types/game';
import { GAME_CONFIG } from '@/lib/config/game-config';

// Animation time for effects
let animTime = 0;

// Stars for background
const stars: { x: number; y: number; size: number; twinkle: number }[] = [];
for (let i = 0; i < 50; i++) {
  stars.push({
    x: Math.random() * GAME_CONFIG.CANVAS_WIDTH,
    y: Math.random() * GAME_CONFIG.CANVAS_HEIGHT,
    size: Math.random() * 2 + 0.5,
    twinkle: Math.random() * Math.PI * 2,
  });
}

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  // Gradient background
  const bgGradient = ctx.createRadialGradient(
    GAME_CONFIG.CANVAS_WIDTH / 2,
    GAME_CONFIG.CANVAS_HEIGHT / 2,
    0,
    GAME_CONFIG.CANVAS_WIDTH / 2,
    GAME_CONFIG.CANVAS_HEIGHT / 2,
    GAME_CONFIG.CANVAS_WIDTH
  );
  bgGradient.addColorStop(0, '#1a1a3e');
  bgGradient.addColorStop(1, '#0a0a1a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

  // Draw twinkling stars
  animTime += 0.02;
  for (const star of stars) {
    const twinkleAlpha = 0.3 + Math.sin(animTime * 2 + star.twinkle) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkleAlpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw arena border with glow
  ctx.shadowColor = '#8844ff';
  ctx.shadowBlur = 15;
  ctx.strokeStyle = '#6644aa';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, GAME_CONFIG.CANVAS_WIDTH - 16, GAME_CONFIG.CANVAS_HEIGHT - 16);
  ctx.shadowBlur = 0;

  // Inner border
  ctx.strokeStyle = '#4422aa44';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, GAME_CONFIG.CANVAS_WIDTH - 40, GAME_CONFIG.CANVAS_HEIGHT - 40);
}

export function drawPotOfGold(ctx: CanvasRenderingContext2D, pot: PotOfGold): void {
  ctx.save();
  ctx.translate(pot.position.x, pot.position.y);

  // Glow under pot
  const potGlow = ctx.createRadialGradient(0, 10, 0, 0, 10, pot.size * 1.5);
  potGlow.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
  potGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = potGlow;
  ctx.beginPath();
  ctx.ellipse(0, 10, pot.size * 1.5, pot.size * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pot body (gradient black pot)
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

  // Pot rim with shine
  const rimGradient = ctx.createLinearGradient(0, -pot.size * 0.5, 0, -pot.size * 0.35);
  rimGradient.addColorStop(0, '#444');
  rimGradient.addColorStop(0.5, '#666');
  rimGradient.addColorStop(1, '#333');
  ctx.fillStyle = rimGradient;
  ctx.beginPath();
  ctx.ellipse(0, -pot.size * 0.42, pot.size * 0.85, pot.size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gold coins with 3D effect
  const coinPositions = [
    { x: -15, y: -pot.size * 0.55, size: 10 },
    { x: 0, y: -pot.size * 0.6, size: 12 },
    { x: 15, y: -pot.size * 0.55, size: 10 },
    { x: -8, y: -pot.size * 0.75, size: 9 },
    { x: 8, y: -pot.size * 0.72, size: 9 },
    { x: 0, y: -pot.size * 0.85, size: 8 },
  ];

  for (const coin of coinPositions) {
    // Coin shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(coin.x + 2, coin.y + 2, coin.size, coin.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coin body
    const coinGrad = ctx.createRadialGradient(
      coin.x - coin.size * 0.3,
      coin.y - coin.size * 0.3,
      0,
      coin.x,
      coin.y,
      coin.size
    );
    coinGrad.addColorStop(0, '#FFE55C');
    coinGrad.addColorStop(0.7, '#FFD700');
    coinGrad.addColorStop(1, '#CC9900');
    ctx.fillStyle = coinGrad;
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
    ctx.fill();

    // Coin shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(coin.x - coin.size * 0.3, coin.y - coin.size * 0.3, coin.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sparkle effect
  const sparkleTime = animTime * 3;
  for (let i = 0; i < 3; i++) {
    const angle = sparkleTime + (i * Math.PI * 2) / 3;
    const sparkX = Math.cos(angle) * pot.size * 0.6;
    const sparkY = -pot.size * 0.6 + Math.sin(angle * 2) * 10;
    const sparkAlpha = 0.5 + Math.sin(sparkleTime * 2 + i) * 0.5;

    ctx.fillStyle = `rgba(255, 255, 200, ${sparkAlpha})`;
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  ctx.save();
  ctx.translate(player.position.x, player.position.y);

  // Outer glow ring
  ctx.shadowColor = '#ff66ff';
  ctx.shadowBlur = 20;

  // Animated rainbow net
  const netRotation = animTime * 0.5;
  ctx.rotate(netRotation);

  // Multiple rainbow rings
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

  // Inner glow
  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.netRadius);
  glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
  glowGradient.addColorStop(0.5, 'rgba(200, 150, 255, 0.08)');
  glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, player.netRadius, 0, Math.PI * 2);
  ctx.fill();

  // Crosshair center
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

  // Center dot
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

  // Magical aura
  const auraGradient = ctx.createRadialGradient(0, 0, unicorn.size, 0, 0, unicorn.size * 2.5);
  auraGradient.addColorStop(0, 'rgba(255, 200, 255, 0.3)');
  auraGradient.addColorStop(0.5, 'rgba(200, 150, 255, 0.15)');
  auraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = auraGradient;
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Floating particles
  for (let i = 0; i < 4; i++) {
    const particleAngle = animTime * 2 + (i * Math.PI) / 2;
    const particleRadius = unicorn.size * 1.5 + Math.sin(animTime * 3 + i) * 5;
    const px = Math.cos(particleAngle) * particleRadius;
    const py = Math.sin(particleAngle) * particleRadius;
    const particleAlpha = 0.3 + Math.sin(animTime * 4 + i) * 0.2;

    ctx.fillStyle = `rgba(255, 200, 255, ${particleAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Body shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(2, 3, unicorn.size, unicorn.size * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (white with gradient)
  const bodyGradient = ctx.createRadialGradient(
    -unicorn.size * 0.3,
    -unicorn.size * 0.3,
    0,
    0,
    0,
    unicorn.size
  );
  bodyGradient.addColorStop(0, '#FFFFFF');
  bodyGradient.addColorStop(0.7, '#F8F0FF');
  bodyGradient.addColorStop(1, '#E8D8F8');
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size, 0, Math.PI * 2);
  ctx.fill();

  // Body outline
  ctx.strokeStyle = '#DDB8FF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Golden horn with spiral
  const hornLength = 18;
  const hornGradient = ctx.createLinearGradient(unicorn.size, 0, unicorn.size + hornLength, 0);
  hornGradient.addColorStop(0, '#FFD700');
  hornGradient.addColorStop(0.5, '#FFEC8B');
  hornGradient.addColorStop(1, '#FFF8DC');

  ctx.fillStyle = hornGradient;
  ctx.beginPath();
  ctx.moveTo(unicorn.size + hornLength, 0);
  ctx.lineTo(unicorn.size - 2, -7);
  ctx.lineTo(unicorn.size - 2, 7);
  ctx.closePath();
  ctx.fill();

  // Horn spiral lines
  ctx.strokeStyle = '#CC9900';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const offset = i * 5 + 3;
    ctx.beginPath();
    ctx.moveTo(unicorn.size + offset, -4 + i);
    ctx.lineTo(unicorn.size + offset + 2, 4 - i);
    ctx.stroke();
  }

  // Horn sparkle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(unicorn.size + hornLength - 4, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  // Rainbow mane (flowing effect)
  const maneColors = [
    RAINBOW_HEX.red,
    RAINBOW_HEX.orange,
    RAINBOW_HEX.yellow,
    RAINBOW_HEX.green,
    RAINBOW_HEX.blue,
    RAINBOW_HEX.violet,
  ];

  ctx.lineWidth = 4;
  for (let i = 0; i < maneColors.length; i++) {
    const waveOffset = Math.sin(animTime * 3 + i * 0.5) * 3;
    ctx.strokeStyle = maneColors[i];
    ctx.beginPath();
    ctx.arc(-5, waveOffset, unicorn.size + 4 + i * 4, Math.PI * 0.55, Math.PI * 1.45);
    ctx.stroke();
  }

  // Eye
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(unicorn.size * 0.4, -unicorn.size * 0.2, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(unicorn.size * 0.5, -unicorn.size * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawLeprechaun(ctx: CanvasRenderingContext2D, leprechaun: Leprechaun): void {
  ctx.save();
  ctx.translate(leprechaun.position.x, leprechaun.position.y);

  // Evil aura
  const evilGlow = ctx.createRadialGradient(0, 0, leprechaun.size, 0, 0, leprechaun.size * 2);
  evilGlow.addColorStop(0, 'rgba(0, 100, 0, 0.3)');
  evilGlow.addColorStop(1, 'rgba(0, 50, 0, 0)');
  ctx.fillStyle = evilGlow;
  ctx.beginPath();
  ctx.arc(0, 0, leprechaun.size * 2, 0, Math.PI * 2);
  ctx.fill();

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(2, leprechaun.size + 3, leprechaun.size * 0.8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (green with gradient)
  const bodyGrad = ctx.createRadialGradient(
    -leprechaun.size * 0.3,
    -leprechaun.size * 0.3,
    0,
    0,
    0,
    leprechaun.size
  );
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

  // Hat with better shape
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

  // Hat band
  ctx.fillStyle = '#111';
  ctx.fillRect(-leprechaun.size * 0.55, -leprechaun.size - 8, leprechaun.size * 1.1, 6);

  // Hat buckle with shine
  const buckleGrad = ctx.createLinearGradient(-4, -leprechaun.size - 8, 4, -leprechaun.size - 2);
  buckleGrad.addColorStop(0, '#FFE55C');
  buckleGrad.addColorStop(0.5, '#FFD700');
  buckleGrad.addColorStop(1, '#CC9900');
  ctx.fillStyle = buckleGrad;
  ctx.fillRect(-5, -leprechaun.size - 9, 10, 8);
  ctx.strokeStyle = '#996600';
  ctx.lineWidth = 1;
  ctx.strokeRect(-5, -leprechaun.size - 9, 10, 8);

  // Orange beard with texture
  ctx.fillStyle = '#FF6600';
  ctx.beginPath();
  ctx.moveTo(-leprechaun.size * 0.7, leprechaun.size * 0.1);
  ctx.quadraticCurveTo(-leprechaun.size * 0.3, leprechaun.size * 1.5, 0, leprechaun.size * 1.3);
  ctx.quadraticCurveTo(leprechaun.size * 0.3, leprechaun.size * 1.5, leprechaun.size * 0.7, leprechaun.size * 0.1);
  ctx.fill();

  // Beard highlights
  ctx.strokeStyle = '#FF8833';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 4, leprechaun.size * 0.3);
    ctx.quadraticCurveTo(i * 3, leprechaun.size * 0.8, i * 5, leprechaun.size * 1.1);
    ctx.stroke();
  }

  // Mischievous eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-leprechaun.size * 0.35, -leprechaun.size * 0.25, 5, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(leprechaun.size * 0.35, -leprechaun.size * 0.25, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils (looking at pot)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-leprechaun.size * 0.3, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
  ctx.arc(leprechaun.size * 0.4, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Evil eyebrows
  ctx.strokeStyle = '#442200';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-leprechaun.size * 0.55, -leprechaun.size * 0.5);
  ctx.lineTo(-leprechaun.size * 0.15, -leprechaun.size * 0.4);
  ctx.moveTo(leprechaun.size * 0.55, -leprechaun.size * 0.5);
  ctx.lineTo(leprechaun.size * 0.15, -leprechaun.size * 0.4);
  ctx.stroke();

  // Sneaky smile
  ctx.strokeStyle = '#330000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, leprechaun.size * 0.1, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

export function drawProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile): void {
  ctx.save();
  ctx.translate(projectile.position.x, projectile.position.y);

  // Rainbow trail
  const trailLength = 20;
  const angle = Math.atan2(projectile.velocity.y, projectile.velocity.x);
  ctx.rotate(angle);

  const trailGrad = ctx.createLinearGradient(-trailLength, 0, 0, 0);
  trailGrad.addColorStop(0, 'rgba(255, 0, 0, 0)');
  trailGrad.addColorStop(0.2, 'rgba(255, 127, 0, 0.3)');
  trailGrad.addColorStop(0.4, 'rgba(255, 255, 0, 0.4)');
  trailGrad.addColorStop(0.6, 'rgba(0, 255, 0, 0.5)');
  trailGrad.addColorStop(0.8, 'rgba(0, 0, 255, 0.6)');
  trailGrad.addColorStop(1, 'rgba(148, 0, 211, 0.8)');

  ctx.fillStyle = trailGrad;
  ctx.beginPath();
  ctx.moveTo(-trailLength, -projectile.size * 0.5);
  ctx.lineTo(0, -projectile.size);
  ctx.lineTo(projectile.size, 0);
  ctx.lineTo(0, projectile.size);
  ctx.lineTo(-trailLength, projectile.size * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.rotate(-angle);

  // Outer glow
  ctx.shadowColor = '#FFDD00';
  ctx.shadowBlur = 15;

  // Core with gradient
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, projectile.size);
  coreGrad.addColorStop(0, '#FFFFFF');
  coreGrad.addColorStop(0.3, '#FFFF88');
  coreGrad.addColorStop(0.7, '#FFD700');
  coreGrad.addColorStop(1, '#FF8800');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0, 0, projectile.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.restore();
}

export interface RenderState {
  player: Player;
  unicorns: Unicorn[];
  leprechauns: Leprechaun[];
  projectiles: Projectile[];
  potOfGold: PotOfGold;
}

export function renderGame(ctx: CanvasRenderingContext2D, state: RenderState): void {
  clearCanvas(ctx);

  // Draw pot of gold first (in center, behind everything)
  drawPotOfGold(ctx, state.potOfGold);

  // Draw unicorns
  for (const unicorn of state.unicorns) {
    drawUnicorn(ctx, unicorn);
  }

  // Draw leprechauns
  for (const leprechaun of state.leprechauns) {
    drawLeprechaun(ctx, leprechaun);
  }

  // Draw projectiles
  for (const projectile of state.projectiles) {
    drawProjectile(ctx, projectile);
  }

  // Draw player (on top)
  drawPlayer(ctx, state.player);
}
