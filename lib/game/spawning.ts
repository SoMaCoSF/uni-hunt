// ==============================================================================
// file_id: SOM-SCR-0003-v0.3.0
// name: spawning.ts
// description: Entity spawning with scaling and teleport mechanics
// project_id: UNI-HUNT
// category: game-logic
// tags: [spawning, entities, factory, teleport, scaling]
// created: 2025-12-25
// modified: 2025-12-26
// version: 0.3.0
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

function getRandomTeleportPosition(): Vector2 {
  // Get a random position away from the pot center
  const margin = GAME_CONFIG.SPAWN_MARGIN * 2;
  const centerX = GAME_CONFIG.CANVAS_WIDTH / 2;
  const centerY = GAME_CONFIG.CANVAS_HEIGHT / 2;

  let x, y;
  do {
    x = margin + Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 2 * margin);
    y = margin + Math.random() * (GAME_CONFIG.CANVAS_HEIGHT - 2 * margin);
  } while (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < 150);

  return { x, y };
}

export interface UnicornSpawnOptions {
  goldValue: number;
  speed: number;
  sizeMultiplier?: number; // From level config, default 1.0
}

export interface LeprechaunSpawnOptions {
  speed: number;
  tapsRequired?: number; // From level config, default 3
  canTeleport?: boolean; // From level config
}

export function createUnicorn(options: UnicornSpawnOptions): Unicorn {
  const position = getRandomEdgePosition();
  const sizeMultiplier = options.sizeMultiplier ?? 1.0;
  const size = Math.max(
    GAME_CONFIG.MIN_UNICORN_SIZE,
    GAME_CONFIG.BASE_UNICORN_SIZE * sizeMultiplier
  );

  return {
    id: generateId('unicorn'),
    position,
    velocity: { x: 0, y: 0 },
    size,
    rotation: 0,
    active: true,
    goldValue: options.goldValue,
    speed: options.speed,
    wanderTarget: getRandomWanderTarget(),
    wanderTimer: 0,
  };
}

export function createLeprechaun(options: LeprechaunSpawnOptions): Leprechaun {
  const position = getRandomEdgePosition();
  const tapsRequired = options.tapsRequired ?? GAME_CONFIG.BASE_LEPRECHAUN_TAPS;
  const canTeleport = options.canTeleport ?? false;

  return {
    id: generateId('leprechaun'),
    position,
    velocity: { x: 0, y: 0 },
    size: GAME_CONFIG.LEPRECHAUN_SIZE,
    rotation: 0,
    active: true,
    speed: options.speed,
    targetColor: null,
    tapCount: 0,
    tapsRequired,
    lastTapTime: 0,
    stunTimer: 0,
    isStunned: false,
    // Teleport fields
    canTeleport,
    teleportCooldown: GAME_CONFIG.TELEPORT_COOLDOWN,
    lastTeleportTime: 0,
    hasTeleported: false,
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
  deltaTime: number,
  currentTime: number
): Leprechaun {
  // Update stun timer
  let stunTimer = leprechaun.stunTimer;
  let isStunned = leprechaun.isStunned;

  if (isStunned) {
    stunTimer -= deltaTime;
    if (stunTimer <= 0) {
      stunTimer = 0;
      isStunned = false;
    }
  }

  // Decay tap count if not tapped recently
  let tapCount = leprechaun.tapCount;
  if (tapCount > 0 && currentTime - leprechaun.lastTapTime > GAME_CONFIG.TAP_DECAY_TIME) {
    tapCount = Math.max(0, tapCount - deltaTime * 2); // Decay 2 taps per second
  }

  // Check for teleport trigger (51% damage threshold)
  let newPosition = leprechaun.position;
  let hasTeleported = leprechaun.hasTeleported;
  let lastTeleportTime = leprechaun.lastTeleportTime;

  if (
    leprechaun.canTeleport &&
    !hasTeleported &&
    tapCount / leprechaun.tapsRequired >= GAME_CONFIG.TELEPORT_HEALTH_THRESHOLD &&
    currentTime - lastTeleportTime > leprechaun.teleportCooldown
  ) {
    // Teleport to random position away from pot
    newPosition = getRandomTeleportPosition();
    hasTeleported = true;
    lastTeleportTime = currentTime;
    // Brief stun after teleport
    stunTimer = 0.5;
    isStunned = true;
  }

  // If stunned, don't move
  if (isStunned) {
    return {
      ...leprechaun,
      position: newPosition,
      stunTimer,
      isStunned,
      tapCount,
      hasTeleported,
      lastTeleportTime,
      velocity: { x: 0, y: 0 },
    };
  }

  // Move directly toward pot of gold
  const dx = potPosition.x - newPosition.x;
  const dy = potPosition.y - newPosition.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const vx = distance > 0 ? (dx / distance) * leprechaun.speed : 0;
  const vy = distance > 0 ? (dy / distance) * leprechaun.speed : 0;

  return {
    ...leprechaun,
    position: {
      x: newPosition.x + vx * deltaTime,
      y: newPosition.y + vy * deltaTime,
    },
    velocity: { x: vx, y: vy },
    rotation: Math.atan2(vy, vx),
    stunTimer,
    isStunned,
    tapCount,
    hasTeleported,
    lastTeleportTime,
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
