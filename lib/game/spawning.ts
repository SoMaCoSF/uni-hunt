// ==============================================================================
// file_id: SOM-SCR-0003-v0.2.0
// name: spawning.ts
// description: Entity spawning and factory functions - drain mechanic
// project_id: UNI-HUNT
// category: game-logic
// tags: [spawning, entities, factory, drain]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { createUnicorn, createLeprechaun } from '@/lib/game/spawning'
// ==============================================================================

import { Unicorn, Leprechaun } from '@/types/entities';
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
    drainProgress: 0,
    maxDrainTime: GAME_CONFIG.LEPRECHAUN_DRAIN_TIME,
    isBeingDrained: false,
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
  // If being drained, slow down significantly
  const speedMultiplier = leprechaun.isBeingDrained ? 0.2 : 1;

  // Move directly toward pot of gold
  const dx = potPosition.x - leprechaun.position.x;
  const dy = potPosition.y - leprechaun.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const effectiveSpeed = leprechaun.speed * speedMultiplier;
  const vx = distance > 0 ? (dx / distance) * effectiveSpeed : 0;
  const vy = distance > 0 ? (dy / distance) * effectiveSpeed : 0;

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

export function isPointInCircle(
  pointX: number,
  pointY: number,
  circleX: number,
  circleY: number,
  radius: number
): boolean {
  const dx = pointX - circleX;
  const dy = pointY - circleY;
  return dx * dx + dy * dy <= radius * radius;
}
