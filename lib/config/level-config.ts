// ==============================================================================
// file_id: SOM-CFG-0002-v0.2.0
// name: level-config.ts
// description: Level progression configuration with boss battles
// project_id: UNI-HUNT
// category: config
// tags: [config, levels, progression, boss]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { LEVELS, getLevelConfig, isBossLevel } from '@/lib/config/level-config'
// ==============================================================================

import { BossType } from '@/types/entities';

export interface BossConfig {
  bossType: BossType;
  health: number;
  attackCooldown: number;
  // Rain+Thunder
  rainIntensity: number;
  thunderFrequency: number;
  // Lightning (level 6+)
  lightningEnabled: boolean;
  lightningDamage: number;
  // Hurricane (level 9)
  hurricaneEnabled: boolean;
  hurricaneThrowForce: number;
}

export interface LevelConfig {
  level: number;
  goldRequired: number;
  unicornSpawnRate: number;
  unicornGoldValue: number;
  unicornSpeed: number;
  unicornSizeMultiplier: number; // Smaller each level (1.0 = full size)
  leprechaunSpawnRate: number;
  leprechaunSpeed: number;
  leprechaunTapsRequired: number; // 3/6/9 based
  leprechaunCanTeleport: boolean;
  maxUnicorns: number;
  maxLeprechauns: number;
  // Boss configuration
  isBossLevel: boolean;
  bossConfig?: BossConfig;
}

export const LEVELS: LevelConfig[] = [
  // Level 1 - Tutorial (3 taps, no teleport)
  {
    level: 1,
    goldRequired: 90, // Divisible by 9
    unicornSpawnRate: 2.0,
    unicornGoldValue: 9,
    unicornSpeed: 60,
    unicornSizeMultiplier: 1.0,
    leprechaunSpawnRate: 6.0,
    leprechaunSpeed: 40,
    leprechaunTapsRequired: 3,
    leprechaunCanTeleport: false,
    maxUnicorns: 6,
    maxLeprechauns: 3,
    isBossLevel: false,
  },
  // Level 2 - Getting started (3 taps)
  {
    level: 2,
    goldRequired: 180,
    unicornSpawnRate: 1.8,
    unicornGoldValue: 9,
    unicornSpeed: 70,
    unicornSizeMultiplier: 0.95,
    leprechaunSpawnRate: 5.0,
    leprechaunSpeed: 50,
    leprechaunTapsRequired: 3,
    leprechaunCanTeleport: false,
    maxUnicorns: 9,
    maxLeprechauns: 3,
    isBossLevel: false,
  },
  // Level 3 - BOSS: Storm Cloud (6 damage per tap, 54 HP = 9 taps)
  {
    level: 3,
    goldRequired: 0,
    unicornSpawnRate: 3.0,
    unicornGoldValue: 12,
    unicornSpeed: 80,
    unicornSizeMultiplier: 0.9,
    leprechaunSpawnRate: 4.0,
    leprechaunSpeed: 60,
    leprechaunTapsRequired: 3,
    leprechaunCanTeleport: false,
    maxUnicorns: 6,
    maxLeprechauns: 3,
    isBossLevel: true,
    bossConfig: {
      bossType: 'rain_thunder',
      health: 54, // 9 taps at 6 damage
      attackCooldown: 3.0,
      rainIntensity: 0.7,
      thunderFrequency: 4.0,
      lightningEnabled: false,
      lightningDamage: 0,
      hurricaneEnabled: false,
      hurricaneThrowForce: 0,
    },
  },
  // Level 4 - Harder (6 taps, teleport starts)
  {
    level: 4,
    goldRequired: 360,
    unicornSpawnRate: 1.5,
    unicornGoldValue: 12,
    unicornSpeed: 85,
    unicornSizeMultiplier: 0.85,
    leprechaunSpawnRate: 4.5,
    leprechaunSpeed: 65,
    leprechaunTapsRequired: 6,
    leprechaunCanTeleport: true,
    maxUnicorns: 9,
    maxLeprechauns: 6,
    isBossLevel: false,
  },
  // Level 5 - Intense (6 taps)
  {
    level: 5,
    goldRequired: 540,
    unicornSpawnRate: 1.3,
    unicornGoldValue: 15,
    unicornSpeed: 90,
    unicornSizeMultiplier: 0.8,
    leprechaunSpawnRate: 4.0,
    leprechaunSpeed: 70,
    leprechaunTapsRequired: 6,
    leprechaunCanTeleport: true,
    maxUnicorns: 12,
    maxLeprechauns: 6,
    isBossLevel: false,
  },
  // Level 6 - BOSS: Lightning Lord (108 HP = 18 taps)
  {
    level: 6,
    goldRequired: 0,
    unicornSpawnRate: 2.5,
    unicornGoldValue: 18,
    unicornSpeed: 95,
    unicornSizeMultiplier: 0.75,
    leprechaunSpawnRate: 3.5,
    leprechaunSpeed: 75,
    leprechaunTapsRequired: 6,
    leprechaunCanTeleport: true,
    maxUnicorns: 6,
    maxLeprechauns: 6,
    isBossLevel: true,
    bossConfig: {
      bossType: 'lightning',
      health: 108, // 18 taps at 6 damage
      attackCooldown: 2.5,
      rainIntensity: 0.9,
      thunderFrequency: 3.0,
      lightningEnabled: true,
      lightningDamage: 1,
      hurricaneEnabled: false,
      hurricaneThrowForce: 0,
    },
  },
  // Level 7 - Very hard (9 taps, fast teleport)
  {
    level: 7,
    goldRequired: 810,
    unicornSpawnRate: 1.2,
    unicornGoldValue: 18,
    unicornSpeed: 100,
    unicornSizeMultiplier: 0.7,
    leprechaunSpawnRate: 3.5,
    leprechaunSpeed: 80,
    leprechaunTapsRequired: 9,
    leprechaunCanTeleport: true,
    maxUnicorns: 15,
    maxLeprechauns: 9,
    isBossLevel: false,
  },
  // Level 8 - Pre-final (9 taps)
  {
    level: 8,
    goldRequired: 990,
    unicornSpawnRate: 1.0,
    unicornGoldValue: 18,
    unicornSpeed: 110,
    unicornSizeMultiplier: 0.6,
    leprechaunSpawnRate: 3.0,
    leprechaunSpeed: 85,
    leprechaunTapsRequired: 9,
    leprechaunCanTeleport: true,
    maxUnicorns: 18,
    maxLeprechauns: 9,
    isBossLevel: false,
  },
  // Level 9 - FINAL BOSS: Hurricane King (162 HP = 27 taps)
  {
    level: 9,
    goldRequired: 0,
    unicornSpawnRate: 2.0,
    unicornGoldValue: 27,
    unicornSpeed: 120,
    unicornSizeMultiplier: 0.5,
    leprechaunSpawnRate: 2.5,
    leprechaunSpeed: 90,
    leprechaunTapsRequired: 9,
    leprechaunCanTeleport: true,
    maxUnicorns: 9,
    maxLeprechauns: 9,
    isBossLevel: true,
    bossConfig: {
      bossType: 'hurricane',
      health: 162, // 27 taps at 6 damage
      attackCooldown: 2.0,
      rainIntensity: 1.0,
      thunderFrequency: 2.0,
      lightningEnabled: true,
      lightningDamage: 1,
      hurricaneEnabled: true,
      hurricaneThrowForce: 300,
    },
  },
];

export function getLevelConfig(level: number): LevelConfig {
  const index = Math.min(level - 1, LEVELS.length - 1);
  return LEVELS[index];
}

export function isBossLevel(level: number): boolean {
  return level === 3 || level === 6 || level === 9;
}

export function getBossType(level: number): BossType | null {
  if (level === 3) return 'rain_thunder';
  if (level === 6) return 'lightning';
  if (level === 9) return 'hurricane';
  return null;
}
