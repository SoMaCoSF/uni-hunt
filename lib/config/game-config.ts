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

export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  // Player settings
  PLAYER_SIZE: 12,
  PLAYER_NET_RADIUS: 50,

  // Tap mechanic (mobile friendly)
  LEPRECHAUN_TAPS_REQUIRED: 5, // Taps needed to defeat a leprechaun
  TAP_RADIUS: 40, // How close tap needs to be to count
  STUN_DURATION: 0.3, // Seconds leprechaun is stunned after tap
  TAP_DECAY_TIME: 2.0, // Seconds before tap count resets if not tapped

  // Entity sizes
  UNICORN_SIZE: 18,
  LEPRECHAUN_SIZE: 14,
  POT_SIZE: 40,
  BOSS_SIZE: 60,

  // Spawning
  SPAWN_MARGIN: 50, // Distance from edge to spawn
  UNICORN_WANDER_INTERVAL: 2, // seconds between new wander targets

  // Boss settings
  BOSS_DAMAGE_PER_TAP: 5,
  BOSS_TAP_RADIUS: 80,

  // Colors
  BACKGROUND_COLOR: '#1a1a2e',
  ARENA_BORDER_COLOR: '#4a4a6a',
} as const;

export type GameConfig = typeof GAME_CONFIG;
