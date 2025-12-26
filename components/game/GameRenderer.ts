// ==============================================================================
// file_id: SOM-SCR-0006-v0.3.0
// name: GameRenderer.ts
// description: Canvas rendering - drain beam mechanic
// project_id: UNI-HUNT
// category: rendering
// tags: [canvas, rendering, draw, sprites, drain]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.3.0
// agent_id: AGENT-PRIME-002
// execution: import { renderGame } from '@/components/game/GameRenderer'
// ==============================================================================

import { Player, Unicorn, Leprechaun, PotOfGold } from '@/types/entities';
import { RAINBOW_HEX } from '@/types/game';
import { GAME_CONFIG } from '@/lib/config/game-config';

let animTime = 0;

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
  const bgGradient = ctx.createRadialGradient(
    GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2, 0,
    GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2, GAME_CONFIG.CANVAS_WIDTH
  );
  bgGradient.addColorStop(0, '#1a1a3e');
  bgGradient.addColorStop(1, '#0a0a1a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

  animTime += 0.02;
  for (const star of stars) {
    const twinkleAlpha = 0.3 + Math.sin(animTime * 2 + star.twinkle) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkleAlpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowColor = '#8844ff';
  ctx.shadowBlur = 15;
  ctx.strokeStyle = '#6644aa';
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

export function drawDrainBeam(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  targetX: number,
  targetY: number,
  progress: number
): void {
  ctx.save();

  const dx = targetX - playerX;
  const dy = targetY - playerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Rainbow beam with animated segments
  const beamWidth = 8 + Math.sin(animTime * 10) * 2;
  const colors = [RAINBOW_HEX.red, RAINBOW_HEX.orange, RAINBOW_HEX.yellow, RAINBOW_HEX.green, RAINBOW_HEX.blue, RAINBOW_HEX.violet];

  ctx.globalAlpha = 0.8;

  for (let i = 0; i < colors.length; i++) {
    const offset = (i - colors.length / 2) * 2;
    const waveOffset = Math.sin(animTime * 8 + i) * 3;

    ctx.strokeStyle = colors[i];
    ctx.lineWidth = beamWidth - i * 0.5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(playerX, playerY);

    // Wavy beam
    const steps = 10;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = playerX + dx * t;
      const y = playerY + dy * t + Math.sin(t * Math.PI * 4 + animTime * 10 + i) * waveOffset;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  // Center bright core
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(playerX, playerY);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // Particles along beam
  ctx.globalAlpha = 1;
  for (let i = 0; i < 5; i++) {
    const t = ((animTime * 2 + i * 0.2) % 1);
    const px = playerX + dx * t;
    const py = playerY + dy * t + Math.sin(t * Math.PI * 4 + animTime * 10) * 3;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawUnicorn(ctx: CanvasRenderingContext2D, unicorn: Unicorn): void {
  ctx.save();
  ctx.translate(unicorn.position.x, unicorn.position.y);
  ctx.rotate(unicorn.rotation);

  const auraGradient = ctx.createRadialGradient(0, 0, unicorn.size, 0, 0, unicorn.size * 2.5);
  auraGradient.addColorStop(0, 'rgba(255, 200, 255, 0.3)');
  auraGradient.addColorStop(0.5, 'rgba(200, 150, 255, 0.15)');
  auraGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = auraGradient;
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size * 2.5, 0, Math.PI * 2);
  ctx.fill();

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

  const bodyGradient = ctx.createRadialGradient(-unicorn.size * 0.3, -unicorn.size * 0.3, 0, 0, 0, unicorn.size);
  bodyGradient.addColorStop(0, '#FFFFFF');
  bodyGradient.addColorStop(0.7, '#F8F0FF');
  bodyGradient.addColorStop(1, '#E8D8F8');
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#DDB8FF';
  ctx.lineWidth = 2;
  ctx.stroke();

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

  const maneColors = [RAINBOW_HEX.red, RAINBOW_HEX.orange, RAINBOW_HEX.yellow, RAINBOW_HEX.green, RAINBOW_HEX.blue, RAINBOW_HEX.violet];
  ctx.lineWidth = 4;
  for (let i = 0; i < maneColors.length; i++) {
    const waveOffset = Math.sin(animTime * 3 + i * 0.5) * 3;
    ctx.strokeStyle = maneColors[i];
    ctx.beginPath();
    ctx.arc(-5, waveOffset, unicorn.size + 4 + i * 4, Math.PI * 0.55, Math.PI * 1.45);
    ctx.stroke();
  }

  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(unicorn.size * 0.4, -unicorn.size * 0.2, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(unicorn.size * 0.5, -unicorn.size * 0.3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawLeprechaun(ctx: CanvasRenderingContext2D, leprechaun: Leprechaun): void {
  ctx.save();
  ctx.translate(leprechaun.position.x, leprechaun.position.y);

  const drainPercent = leprechaun.drainProgress / leprechaun.maxDrainTime;

  // Drain effect - leprechaun fades and gets smaller as drained
  const scale = 1 - drainPercent * 0.3;
  const alpha = 1 - drainPercent * 0.5;
  ctx.scale(scale, scale);
  ctx.globalAlpha = alpha;

  // Drain glow when being drained
  if (leprechaun.isBeingDrained) {
    const drainGlow = ctx.createRadialGradient(0, 0, leprechaun.size, 0, 0, leprechaun.size * 2.5);
    drainGlow.addColorStop(0, 'rgba(255, 100, 255, 0.5)');
    drainGlow.addColorStop(1, 'rgba(255, 0, 255, 0)');
    ctx.fillStyle = drainGlow;
    ctx.beginPath();
    ctx.arc(0, 0, leprechaun.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Evil aura (reduced when draining)
  const auraAlpha = leprechaun.isBeingDrained ? 0.1 : 0.3;
  const evilGlow = ctx.createRadialGradient(0, 0, leprechaun.size, 0, 0, leprechaun.size * 2);
  evilGlow.addColorStop(0, `rgba(0, 100, 0, ${auraAlpha})`);
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

  // Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-leprechaun.size * 0.35, -leprechaun.size * 0.25, 5, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(leprechaun.size * 0.35, -leprechaun.size * 0.25, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils - spin when being drained!
  const pupilOffset = leprechaun.isBeingDrained ? Math.sin(animTime * 20) * 2 : 0;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-leprechaun.size * 0.3 + pupilOffset, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
  ctx.arc(leprechaun.size * 0.4 + pupilOffset, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1;

  // Drain progress bar above head
  if (leprechaun.drainProgress > 0) {
    const barWidth = 30;
    const barHeight = 4;
    const barY = -leprechaun.size - 30;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);

    // Progress (rainbow gradient)
    const progressGrad = ctx.createLinearGradient(-barWidth / 2, 0, barWidth / 2, 0);
    progressGrad.addColorStop(0, RAINBOW_HEX.red);
    progressGrad.addColorStop(0.5, RAINBOW_HEX.green);
    progressGrad.addColorStop(1, RAINBOW_HEX.violet);
    ctx.fillStyle = progressGrad;
    ctx.fillRect(-barWidth / 2, barY, barWidth * drainPercent, barHeight);

    // Border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);
  }

  ctx.restore();
}

export interface RenderState {
  player: Player;
  unicorns: Unicorn[];
  leprechauns: Leprechaun[];
  potOfGold: PotOfGold;
}

export function renderGame(ctx: CanvasRenderingContext2D, state: RenderState): void {
  clearCanvas(ctx);

  drawPotOfGold(ctx, state.potOfGold);

  for (const unicorn of state.unicorns) {
    drawUnicorn(ctx, unicorn);
  }

  for (const leprechaun of state.leprechauns) {
    drawLeprechaun(ctx, leprechaun);
  }

  // Draw drain beam if draining
  if (state.player.isDraining && state.player.drainTargetId) {
    const target = state.leprechauns.find(l => l.id === state.player.drainTargetId);
    if (target) {
      drawDrainBeam(
        ctx,
        state.player.position.x,
        state.player.position.y,
        target.position.x,
        target.position.y,
        target.drainProgress / target.maxDrainTime
      );
    }
  }

  drawPlayer(ctx, state.player);
}
