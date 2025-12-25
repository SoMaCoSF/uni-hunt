// ==============================================================================
// file_id: SOM-SCR-0003-v0.1.0
// name: spawning.ts
// description: Entity spawning and factory functions
// project_id: UNI-HUNT
// category: game-logic
// tags: [spawning, entities, factory]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { spawnUnicorn, spawnLeprechaun } from '@/lib/game/spawning'
// ==============================================================================

import { Unicorn, Leprechaun, Projectile } from '@/types/entities';
import { Vector2 } from '@/types/game';
import { GAME_CONFIG } from '@/lib/config/game-config';

let entityCounter = 0;

function generateId(prefix: string): string {
  return `${prefix}_${++entityCounter}_${Date.now()}`;
}

function getRandomEdgePosition(): Vector2 {
  const edge = Math.floor(Math.random() * 4);
  const margin = GAME_CONFIG.SPAWN_MARGIN;

  switch (edge) {
    case 0: // Top
      return {
        x: margin + Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 2 * margin),
        y: -margin,
      };
    case 1: // Right
      return {
        x: GAME_CONFIG.CANVAS_WIDTH + margin,
        y: margin + Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 2 * margin),
      };
    case 2: // Bottom
      return {
        x: margin + Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 2 * margin),
        y: GAME_CONFIG.CANVAS_HEIGHT + margin,
      };
    case 3: // Left
    default:
      return {
        x: -margin,
        y: margin + Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 2 * margin),
      };
  }
}

function getRandomWanderTarget(): Vector2 {
  const margin = GAME_CONFIG.SPAWN_MARGIN;
  return {
    x: margin + Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 2 * margin),
    y: margin + Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 2 * margin),
  };
}

export function createUnicorn(goldValue: number, speed: number): Unicorn {
  const position = getRandomEdgePosition();

  return {
    id: generateId('unicorn'),
    position,
    velocity: { x: 0, y: 0 },
    size: GAME_CONFIG.UNICORN_SIZE,
    rotation: 0,
    active: true,
    goldValue,
    speed,
    wanderTarget: getRandomWanderTarget(),
    wanderTimer: 0,
  };
}

export function createLeprechaun(speed: number): Leprechaun {
  const position = getRandomEdgePosition();

  return {
    id: generateId('leprechaun'),
    position,
    velocity: { x: 0, y: 0 },
    size: GAME_CONFIG.LEPRECHAUN_SIZE,
    rotation: 0,
    active: true,
    speed,
    targetColor: null,
  };
}

export function createProjectile(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number
): Projectile {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);

  const vx = length > 0 ? (dx / length) * GAME_CONFIG.PROJECTILE_SPEED : 0;
  const vy = length > 0 ? (dy / length) * GAME_CONFIG.PROJECTILE_SPEED : 0;

  return {
    id: generateId('projectile'),
    position: { x: startX, y: startY },
    velocity: { x: vx, y: vy },
    size: GAME_CONFIG.PROJECTILE_SIZE,
    rotation: Math.atan2(dy, dx),
    active: true,
    damage: 1,
    lifetime: 0,
    maxLifetime: GAME_CONFIG.PROJECTILE_LIFETIME,
  };
}

export function updateUnicornWander(unicorn: Unicorn, deltaTime: number): Unicorn {
  const newTimer = unicorn.wanderTimer + deltaTime;

  // Check if we need a new wander target
  let newTarget = unicorn.wanderTarget;
  let resetTimer = newTimer;

  if (newTimer >= GAME_CONFIG.UNICORN_WANDER_INTERVAL) {
    newTarget = getRandomWanderTarget();
    resetTimer = 0;
  }

  // Move toward wander target
  const dx = newTarget.x - unicorn.position.x;
  const dy = newTarget.y - unicorn.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  let vx = 0;
  let vy = 0;

  if (distance > 5) {
    vx = (dx / distance) * unicorn.speed;
    vy = (dy / distance) * unicorn.speed;
  } else {
    // Arrived at target, get new one
    newTarget = getRandomWanderTarget();
    resetTimer = 0;
  }

  return {
    ...unicorn,
    position: {
      x: unicorn.position.x + vx * deltaTime,
      y: unicorn.position.y + vy * deltaTime,
    },
    velocity: { x: vx, y: vy },
    wanderTarget: newTarget,
    wanderTimer: resetTimer,
    rotation: Math.atan2(vy, vx),
  };
}

export function updateLeprechaunMovement(
  leprechaun: Leprechaun,
  potPosition: Vector2,
  deltaTime: number
): Leprechaun {
  // Move directly toward pot of gold
  const dx = potPosition.x - leprechaun.position.x;
  const dy = potPosition.y - leprechaun.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const vx = distance > 0 ? (dx / distance) * leprechaun.speed : 0;
  const vy = distance > 0 ? (dy / distance) * leprechaun.speed : 0;

  return {
    ...leprechaun,
    position: {
      x: leprechaun.position.x + vx * deltaTime,
      y: leprechaun.position.y + vy * deltaTime,
    },
    velocity: { x: vx, y: vy },
    rotation: Math.atan2(vy, vx),
  };
}

export function updateProjectile(projectile: Projectile, deltaTime: number): Projectile {
  return {
    ...projectile,
    position: {
      x: projectile.position.x + projectile.velocity.x * deltaTime,
      y: projectile.position.y + projectile.velocity.y * deltaTime,
    },
    lifetime: projectile.lifetime + deltaTime,
  };
}

export function isProjectileExpired(projectile: Projectile): boolean {
  return (
    projectile.lifetime >= projectile.maxLifetime ||
    projectile.position.x < -50 ||
    projectile.position.x > GAME_CONFIG.CANVAS_WIDTH + 50 ||
    projectile.position.y < -50 ||
    projectile.position.y > GAME_CONFIG.CANVAS_HEIGHT + 50
  );
}
