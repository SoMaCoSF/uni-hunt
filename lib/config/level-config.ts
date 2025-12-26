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
  leprechaunSpawnRate: number;
  leprechaunSpeed: number;
  maxUnicorns: number;
  maxLeprechauns: number;
  // Boss configuration
  isBossLevel: boolean;
  bossConfig?: BossConfig;
}

export const LEVELS: LevelConfig[] = [
  // Level 1 - Tutorial
  {
    level: 1,
    goldRequired: 100,
    unicornSpawnRate: 2.0,
    unicornGoldValue: 10,
    unicornSpeed: 60,
    leprechaunSpawnRate: 6.0,
    leprechaunSpeed: 40,
    maxUnicorns: 5,
    maxLeprechauns: 2,
    isBossLevel: false,
  },
  // Level 2 - Getting started
  {
    level: 2,
    goldRequired: 200,
    unicornSpawnRate: 1.8,
    unicornGoldValue: 12,
    unicornSpeed: 70,
    leprechaunSpawnRate: 5.0,
    leprechaunSpeed: 50,
    maxUnicorns: 7,
    maxLeprechauns: 3,
    isBossLevel: false,
  },
  // Level 3 - BOSS: Rain + Thunder
  {
    level: 3,
    goldRequired: 0, // Boss levels require defeating the boss
    unicornSpawnRate: 3.0,
    unicornGoldValue: 15,
    unicornSpeed: 80,
    leprechaunSpawnRate: 4.0,
    leprechaunSpeed: 60,
    maxUnicorns: 4,
    maxLeprechauns: 3,
    isBossLevel: true,
    bossConfig: {
      bossType: 'rain_thunder',
      health: 100,
      attackCooldown: 3.0,
      rainIntensity: 0.7,
      thunderFrequency: 4.0,
      lightningEnabled: false,
      lightningDamage: 0,
      hurricaneEnabled: false,
      hurricaneThrowForce: 0,
    },
  },
  // Level 4 - Post-boss recovery
  {
    level: 4,
    goldRequired: 400,
    unicornSpawnRate: 1.5,
    unicornGoldValue: 18,
    unicornSpeed: 85,
    leprechaunSpawnRate: 4.5,
    leprechaunSpeed: 65,
    maxUnicorns: 8,
    maxLeprechauns: 4,
    isBossLevel: false,
  },
  // Level 5 - Building up
  {
    level: 5,
    goldRequired: 550,
    unicornSpawnRate: 1.3,
    unicornGoldValue: 20,
    unicornSpeed: 90,
    leprechaunSpawnRate: 4.0,
    leprechaunSpeed: 70,
    maxUnicorns: 10,
    maxLeprechauns: 5,
    isBossLevel: false,
  },
  // Level 6 - BOSS: Lightning Storm (Rain + Thunder + Lightning)
  {
    level: 6,
    goldRequired: 0,
    unicornSpawnRate: 2.5,
    unicornGoldValue: 22,
    unicornSpeed: 95,
    leprechaunSpawnRate: 3.5,
    leprechaunSpeed: 75,
    maxUnicorns: 5,
    maxLeprechauns: 4,
    isBossLevel: true,
    bossConfig: {
      bossType: 'lightning',
      health: 150,
      attackCooldown: 2.5,
      rainIntensity: 0.9,
      thunderFrequency: 3.0,
      lightningEnabled: true,
      lightningDamage: 1, // Steals 1 rainbow color
      hurricaneEnabled: false,
      hurricaneThrowForce: 0,
    },
  },
  // Level 7 - Intense
  {
    level: 7,
    goldRequired: 700,
    unicornSpawnRate: 1.2,
    unicornGoldValue: 25,
    unicornSpeed: 100,
    leprechaunSpawnRate: 3.5,
    leprechaunSpeed: 80,
    maxUnicorns: 12,
    maxLeprechauns: 6,
    isBossLevel: false,
  },
  // Level 8 - Pre-final
  {
    level: 8,
    goldRequired: 900,
    unicornSpawnRate: 1.0,
    unicornGoldValue: 28,
    unicornSpeed: 110,
    leprechaunSpawnRate: 3.0,
    leprechaunSpeed: 85,
    maxUnicorns: 14,
    maxLeprechauns: 7,
    isBossLevel: false,
  },
  // Level 9 - FINAL BOSS: Hurricane
  {
    level: 9,
    goldRequired: 0,
    unicornSpawnRate: 2.0,
    unicornGoldValue: 30,
    unicornSpeed: 120,
    leprechaunSpawnRate: 2.5,
    leprechaunSpeed: 90,
    maxUnicorns: 6,
    maxLeprechauns: 5,
    isBossLevel: true,
    bossConfig: {
      bossType: 'hurricane',
      health: 200,
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
