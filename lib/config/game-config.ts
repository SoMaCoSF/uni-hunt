// ==============================================================================
// file_id: SOM-CFG-0001-v0.1.0
// name: game-config.ts
// description: Game constants and configuration
// project_id: UNI-HUNT
// category: config
// tags: [config, constants, settings]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { GAME_CONFIG } from '@/lib/config/game-config'
// ==============================================================================

// Helper to get responsive canvas dimensions
export function getResponsiveCanvasSize() {
  const width = typeof window !== 'undefined' ? window.innerWidth : 800;
  const height = typeof window !== 'undefined' ? window.innerHeight : 600;

  // Base dimensions (desktop)
  const baseWidth = 800;
  const baseHeight = 600;

  // Mobile scaling - use smaller base if on mobile
  const isMobile = width < 768;

  return {
    width: isMobile ? Math.min(width, 800) : baseWidth,
    height: isMobile ? Math.min(height, 600) : baseHeight,
    scale: isMobile ? Math.min(width / baseWidth, height / baseHeight) : 1,
  };
}

export const GAME_CONFIG = {
  // Canvas dimensions (base - will be scaled responsively)
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  // Player settings
  PLAYER_SIZE: 12,
  PLAYER_NET_RADIUS: 50,

  // Tap mechanic (mobile friendly) - 3/6/9 math
  BASE_LEPRECHAUN_TAPS: 3, // Base taps needed (scales with level)
  TAP_RADIUS: 45, // How close tap needs to be to count
  STUN_DURATION: 0.3, // Seconds leprechaun is stunned after tap
  TAP_DECAY_TIME: 2.5, // Seconds before tap count resets

  // Entity base sizes (scale with level)
  BASE_UNICORN_SIZE: 18,
  MIN_UNICORN_SIZE: 9, // Smallest unicorn size at max level
  LEPRECHAUN_SIZE: 14,
  POT_SIZE: 40,
  BOSS_SIZE: 60,

  // Spawning
  SPAWN_MARGIN: 50,
  UNICORN_WANDER_INTERVAL: 2,

  // Boss settings - 3/6/9 math
  BOSS_DAMAGE_PER_TAP: 6, // Damage per tap (divisible by 3)
  BOSS_TAP_RADIUS: 80,

  // Power-up blast
  UNICORNS_FOR_POWERUP: 9, // Catch 9 unicorns to charge blast
  POWERUP_LASER_COUNT: 9, // Number of rainbow lasers

  // Teleport mechanic (high levels)
  TELEPORT_HEALTH_THRESHOLD: 0.51, // 51% health taken triggers teleport
  TELEPORT_COOLDOWN: 3.0, // Seconds between teleports

  // Colors
  BACKGROUND_COLOR: '#1a1a2e',
  ARENA_BORDER_COLOR: '#4a4a6a',
} as const;

export type GameConfig = typeof GAME_CONFIG;
