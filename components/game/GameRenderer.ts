// ==============================================================================
// file_id: SOM-SCR-0006-v0.1.0
// name: GameRenderer.ts
// description: Canvas rendering functions for all game entities
// project_id: UNI-HUNT
// category: rendering
// tags: [canvas, rendering, draw, sprites]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { renderGame } from '@/components/game/GameRenderer'
// ==============================================================================

import { Player, Unicorn, Leprechaun, PotOfGold, Projectile } from '@/types/entities';
import { RAINBOW_HEX } from '@/types/game';
import { GAME_CONFIG } from '@/lib/config/game-config';

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = GAME_CONFIG.BACKGROUND_COLOR;
  ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

  // Draw arena border
  ctx.strokeStyle = GAME_CONFIG.ARENA_BORDER_COLOR;
  ctx.lineWidth = 3;
  ctx.strokeRect(5, 5, GAME_CONFIG.CANVAS_WIDTH - 10, GAME_CONFIG.CANVAS_HEIGHT - 10);
}

export function drawPotOfGold(ctx: CanvasRenderingContext2D, pot: PotOfGold): void {
  ctx.save();
  ctx.translate(pot.position.x, pot.position.y);

  // Pot body (black trapezoid shape)
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.moveTo(-pot.size, pot.size * 0.4);
  ctx.lineTo(-pot.size * 0.7, -pot.size * 0.4);
  ctx.lineTo(pot.size * 0.7, -pot.size * 0.4);
  ctx.lineTo(pot.size, pot.size * 0.4);
  ctx.closePath();
  ctx.fill();

  // Pot rim
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(-pot.size * 0.8, -pot.size * 0.5, pot.size * 1.6, pot.size * 0.15);

  // Gold coins on top
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 5; i++) {
    const offsetX = (i - 2) * 12;
    const offsetY = -pot.size * 0.35 - Math.abs(i - 2) * 3;
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Coin shine
    ctx.fillStyle = '#FFEC8B';
    ctx.beginPath();
    ctx.arc(offsetX - 2, offsetY - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFD700';
  }

  ctx.restore();
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  ctx.save();
  ctx.translate(player.position.x, player.position.y);

  // Rainbow net (dashed gradient circle)
  ctx.setLineDash([8, 4]);
  const gradient = ctx.createLinearGradient(
    -player.netRadius,
    0,
    player.netRadius,
    0
  );
  gradient.addColorStop(0, RAINBOW_HEX.red);
  gradient.addColorStop(0.17, RAINBOW_HEX.orange);
  gradient.addColorStop(0.33, RAINBOW_HEX.yellow);
  gradient.addColorStop(0.5, RAINBOW_HEX.green);
  gradient.addColorStop(0.67, RAINBOW_HEX.blue);
  gradient.addColorStop(0.83, RAINBOW_HEX.indigo);
  gradient.addColorStop(1, RAINBOW_HEX.violet);

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, player.netRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner glow
  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.netRadius);
  glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, player.netRadius, 0, Math.PI * 2);
  ctx.fill();

  // Player core
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Core outline
  ctx.strokeStyle = '#CCCCCC';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

export function drawUnicorn(ctx: CanvasRenderingContext2D, unicorn: Unicorn): void {
  ctx.save();
  ctx.translate(unicorn.position.x, unicorn.position.y);
  ctx.rotate(unicorn.rotation);

  // Body glow
  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, unicorn.size * 1.5);
  glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Body (white circle with golden outline)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, unicorn.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Horn (golden triangle pointing right - direction of movement)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(unicorn.size + 12, 0);
  ctx.lineTo(unicorn.size - 2, -6);
  ctx.lineTo(unicorn.size - 2, 6);
  ctx.closePath();
  ctx.fill();

  // Horn sparkle
  ctx.fillStyle = '#FFEC8B';
  ctx.beginPath();
  ctx.arc(unicorn.size + 6, -2, 2, 0, Math.PI * 2);
  ctx.fill();

  // Rainbow mane (arc behind body)
  ctx.lineWidth = 5;
  const maneColors = [
    RAINBOW_HEX.red,
    RAINBOW_HEX.orange,
    RAINBOW_HEX.yellow,
    RAINBOW_HEX.green,
    RAINBOW_HEX.blue,
    RAINBOW_HEX.violet,
  ];

  for (let i = 0; i < maneColors.length; i++) {
    ctx.strokeStyle = maneColors[i];
    ctx.beginPath();
    ctx.arc(
      -5,
      0,
      unicorn.size + 3 + i * 3,
      Math.PI * 0.6,
      Math.PI * 1.4
    );
    ctx.stroke();
  }

  ctx.restore();
}

export function drawLeprechaun(ctx: CanvasRenderingContext2D, leprechaun: Leprechaun): void {
  ctx.save();
  ctx.translate(leprechaun.position.x, leprechaun.position.y);

  // Body (green circle)
  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.arc(0, 0, leprechaun.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#006400';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Hat base
  ctx.fillStyle = '#006400';
  ctx.fillRect(
    -leprechaun.size * 0.9,
    -leprechaun.size - 2,
    leprechaun.size * 1.8,
    4
  );

  // Hat top (rectangle)
  ctx.fillStyle = '#006400';
  ctx.fillRect(
    -leprechaun.size * 0.5,
    -leprechaun.size - 14,
    leprechaun.size,
    14
  );

  // Hat buckle
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(
    -leprechaun.size * 0.25,
    -leprechaun.size - 10,
    leprechaun.size * 0.5,
    6
  );

  // Orange beard
  ctx.fillStyle = '#FF8C00';
  ctx.beginPath();
  ctx.moveTo(-leprechaun.size * 0.6, leprechaun.size * 0.2);
  ctx.quadraticCurveTo(
    0,
    leprechaun.size * 1.2,
    leprechaun.size * 0.6,
    leprechaun.size * 0.2
  );
  ctx.fill();

  // Eyes (mischievous)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-leprechaun.size * 0.3, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
  ctx.arc(leprechaun.size * 0.3, -leprechaun.size * 0.2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile): void {
  ctx.save();
  ctx.translate(projectile.position.x, projectile.position.y);

  // Glow effect
  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, projectile.size * 2);
  glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
  glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, projectile.size * 2, 0, Math.PI * 2);
  ctx.fill();

  // Core
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(0, 0, projectile.size, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-projectile.size * 0.3, -projectile.size * 0.3, projectile.size * 0.3, 0, Math.PI * 2);
  ctx.fill();

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
