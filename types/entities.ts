// ==============================================================================
// file_id: SOM-DTA-0002-v0.3.0
// name: entities.ts
// description: Entity type definitions for game objects - with bosses
// project_id: UNI-HUNT
// category: types
// tags: [entities, player, unicorn, leprechaun, boss]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.3.0
// agent_id: AGENT-PRIME-002
// execution: import { Player, Unicorn, Leprechaun, Boss } from '@/types/entities'
// ==============================================================================

import { Vector2, RainbowColor } from './game';

// Boss types for levels 3, 6, 9
export type BossType = 'rain_thunder' | 'lightning' | 'hurricane';

export interface Entity {
  id: string;
  position: Vector2;
  velocity: Vector2;
  size: number;
  rotation: number;
  active: boolean;
}

export interface Boss extends Entity {
  bossType: BossType;
  health: number;
  maxHealth: number;
  phase: number; // Boss phases increase difficulty
  isVulnerable: boolean;
  vulnerableTimer: number;
  attackTimer: number;
  attackCooldown: number;
  // Visual effects
  rainIntensity: number;
  thunderTimer: number;
  lightningTargets: Vector2[];
  hurricaneAngle: number;
  hurricaneSpeed: number;
}

export interface Player extends Entity {
  netRadius: number;
  isDraining: boolean;
  drainTargetId: string | null;
}

export interface Unicorn extends Entity {
  goldValue: number;
  wanderTarget: Vector2;
  speed: number;
  wanderTimer: number;
}

export interface Leprechaun extends Entity {
  speed: number;
  targetColor: RainbowColor | null;
  // Tap mechanic (mobile friendly)
  tapCount: number;
  tapsRequired: number;
  lastTapTime: number;
  stunTimer: number; // Brief stun after being tapped
  isStunned: boolean;
  // Teleport mechanic (higher levels)
  canTeleport: boolean;
  teleportCooldown: number;
  lastTeleportTime: number;
  hasTeleported: boolean; // Tracks if teleported this encounter
}

export interface PotOfGold extends Entity {
  // Center of arena, stationary
}

export interface Projectile extends Entity {
  damage: number;
  lifetime: number;
  maxLifetime: number;
}

// Factory function types
export type CreatePlayerFn = (x: number, y: number) => Player;
export type CreateUnicornFn = (x: number, y: number, goldValue: number) => Unicorn;
export type CreateLeprechaunFn = (x: number, y: number, speed: number) => Leprechaun;
export type CreateProjectileFn = (x: number, y: number, vx: number, vy: number) => Projectile;
