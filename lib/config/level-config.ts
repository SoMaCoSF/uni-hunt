// ==============================================================================
// file_id: SOM-CFG-0002-v0.1.0
// name: level-config.ts
// description: Level progression configuration
// project_id: UNI-HUNT
// category: config
// tags: [config, levels, progression]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { LEVELS, getLevelConfig } from '@/lib/config/level-config'
// ==============================================================================

export interface LevelConfig {
  level: number;
  goldRequired: number;
  unicornSpawnRate: number;    // seconds between spawns
  unicornGoldValue: number;
  unicornSpeed: number;
  leprechaunSpawnRate: number;
  leprechaunSpeed: number;
  maxUnicorns: number;
  maxLeprechauns: number;
}

export const LEVELS: LevelConfig[] = [
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
  },
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
  },
  {
    level: 3,
    goldRequired: 350,
    unicornSpawnRate: 1.5,
    unicornGoldValue: 15,
    unicornSpeed: 80,
    leprechaunSpawnRate: 4.0,
    leprechaunSpeed: 60,
    maxUnicorns: 8,
    maxLeprechauns: 4,
  },
  {
    level: 4,
    goldRequired: 500,
    unicornSpawnRate: 1.2,
    unicornGoldValue: 18,
    unicornSpeed: 90,
    leprechaunSpawnRate: 3.5,
    leprechaunSpeed: 70,
    maxUnicorns: 10,
    maxLeprechauns: 5,
  },
  {
    level: 5,
    goldRequired: 750,
    unicornSpawnRate: 1.0,
    unicornGoldValue: 20,
    unicornSpeed: 100,
    leprechaunSpawnRate: 3.0,
    leprechaunSpeed: 80,
    maxUnicorns: 12,
    maxLeprechauns: 6,
  },
];

export function getLevelConfig(level: number): LevelConfig {
  const index = Math.min(level - 1, LEVELS.length - 1);
  return LEVELS[index];
}
