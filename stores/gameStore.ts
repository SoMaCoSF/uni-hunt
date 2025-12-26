// ==============================================================================
// file_id: SOM-SCR-0001-v0.3.0
// name: gameStore.ts
// description: Zustand store for game state management - with boss battles
// project_id: UNI-HUNT
// category: store
// tags: [zustand, state, game, drain, boss]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.3.0
// agent_id: AGENT-PRIME-002
// execution: import { useGameStore } from '@/stores/gameStore'
// ==============================================================================

import { create } from 'zustand';
import { GamePhase, RainbowColor, RAINBOW_COLORS, Vector2 } from '@/types/game';
import { Player, Unicorn, Leprechaun, PotOfGold, Boss, BossType } from '@/types/entities';
import { GAME_CONFIG } from '@/lib/config/game-config';
import { getLevelConfig, isBossLevel } from '@/lib/config/level-config';

// Weather effect particles
export interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
}

export interface LightningBolt {
  points: Vector2[];
  alpha: number;
  targetPos: Vector2 | null;
  isWarning: boolean;
  warningTimer: number;
}

interface GameStore {
  // Game state
  phase: GamePhase;
  level: number;
  score: number;
  gold: number;
  goldRequired: number;
  rainbowColors: RainbowColor[];
  harvestCount: number;
  leprechaunsBanished: number; // Total banished across game
  powerUpCharge: number; // 0-9, fires at 9
  isPowerUpActive: boolean;
  powerUpLasers: { x: number; y: number; angle: number; life: number }[];

  // Entities
  player: Player;
  unicorns: Unicorn[];
  leprechauns: Leprechaun[];
  potOfGold: PotOfGold;
  boss: Boss | null;

  // Weather effects
  rainDrops: RainDrop[];
  thunderFlash: number;
  lightningBolts: LightningBolt[];
  hurricaneAngle: number;
  screenShake: Vector2;

  // Timing
  unicornSpawnTimer: number;
  leprechaunSpawnTimer: number;
  bossAttackTimer: number;

  // Actions
  startGame: () => void;
  restartGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  nextLevel: () => void;

  // Entity actions
  updatePlayer: (updates: Partial<Player>) => void;
  addUnicorn: (unicorn: Unicorn) => void;
  removeUnicorn: (id: string) => void;
  addLeprechaun: (leprechaun: Leprechaun) => void;
  removeLeprechaun: (id: string) => void;

  // Game logic actions
  catchUnicorn: (id: string) => void;
  harvestLeprechaun: (id: string) => void;
  stealRainbowColor: (leprechaunId: string) => void;
  restoreRainbowColor: () => void;

  // Boss actions
  spawnBoss: (bossType: BossType) => void;
  damageBoss: (amount: number) => void;
  defeatBoss: () => void;
  triggerLightning: (targetPos: Vector2) => void;
  hurricaneThrow: () => void;

  // Power-up actions
  firePowerUpBlast: () => void;
  updatePowerUpLasers: (deltaTime: number) => void;

  // Bulk updates for game loop
  updateEntities: (updates: {
    player?: Partial<Player>;
    unicorns?: Unicorn[];
    leprechauns?: Leprechaun[];
    boss?: Partial<Boss> | null;
    unicornSpawnTimer?: number;
    leprechaunSpawnTimer?: number;
    bossAttackTimer?: number;
    rainDrops?: RainDrop[];
    thunderFlash?: number;
    lightningBolts?: LightningBolt[];
    hurricaneAngle?: number;
    screenShake?: Vector2;
    powerUpLasers?: { x: number; y: number; angle: number; life: number }[];
    isPowerUpActive?: boolean;
  }) => void;
}

function createInitialPlayer(): Player {
  return {
    id: 'player',
    position: { x: GAME_CONFIG.CANVAS_WIDTH / 2, y: GAME_CONFIG.CANVAS_HEIGHT / 2 },
    velocity: { x: 0, y: 0 },
    size: GAME_CONFIG.PLAYER_SIZE,
    rotation: 0,
    active: true,
    netRadius: GAME_CONFIG.PLAYER_NET_RADIUS,
    isDraining: false,
    drainTargetId: null,
  };
}

function createPotOfGold(): PotOfGold {
  return {
    id: 'pot',
    position: { x: GAME_CONFIG.CANVAS_WIDTH / 2, y: GAME_CONFIG.CANVAS_HEIGHT / 2 },
    velocity: { x: 0, y: 0 },
    size: GAME_CONFIG.POT_SIZE,
    rotation: 0,
    active: true,
  };
}

function createBoss(bossType: BossType): Boss {
  const levelConfig = getLevelConfig(
    bossType === 'rain_thunder' ? 3 : bossType === 'lightning' ? 6 : 9
  );
  const bossConfig = levelConfig.bossConfig!;

  return {
    id: 'boss',
    position: { x: GAME_CONFIG.CANVAS_WIDTH / 2, y: 80 },
    velocity: { x: 0, y: 0 },
    size: 60,
    rotation: 0,
    active: true,
    bossType,
    health: bossConfig.health,
    maxHealth: bossConfig.health,
    phase: 1,
    isVulnerable: true,
    vulnerableTimer: 0,
    attackTimer: 0,
    attackCooldown: bossConfig.attackCooldown,
    rainIntensity: bossConfig.rainIntensity,
    thunderTimer: 0,
    lightningTargets: [],
    hurricaneAngle: 0,
    hurricaneSpeed: bossType === 'hurricane' ? 2 : 0,
  };
}

function getInitialState() {
  const levelConfig = getLevelConfig(1);
  return {
    phase: 'menu' as GamePhase,
    level: 1,
    score: 0,
    gold: 0,
    goldRequired: levelConfig.goldRequired,
    rainbowColors: [...RAINBOW_COLORS],
    harvestCount: 0,
    leprechaunsBanished: 0,
    powerUpCharge: 0,
    isPowerUpActive: false,
    powerUpLasers: [] as { x: number; y: number; angle: number; life: number }[],
    player: createInitialPlayer(),
    unicorns: [] as Unicorn[],
    leprechauns: [] as Leprechaun[],
    potOfGold: createPotOfGold(),
    boss: null as Boss | null,
    rainDrops: [] as RainDrop[],
    thunderFlash: 0,
    lightningBolts: [] as LightningBolt[],
    hurricaneAngle: 0,
    screenShake: { x: 0, y: 0 } as Vector2,
    unicornSpawnTimer: 0,
    leprechaunSpawnTimer: 0,
    bossAttackTimer: 0,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  startGame: () => {
    const levelConfig = getLevelConfig(1);
    set({
      ...getInitialState(),
      phase: 'playing',
      goldRequired: levelConfig.goldRequired,
    });
  },

  restartGame: () => {
    const levelConfig = getLevelConfig(1);
    set({
      ...getInitialState(),
      phase: 'playing',
      goldRequired: levelConfig.goldRequired,
    });
  },

  pauseGame: () => {
    set({ phase: 'paused' });
  },

  resumeGame: () => {
    set({ phase: 'playing' });
  },

  nextLevel: () => {
    const state = get();
    const newLevel = state.level + 1;
    const levelConfig = getLevelConfig(newLevel);

    // Check if next level is a boss level
    const isBoss = isBossLevel(newLevel);
    let boss: Boss | null = null;
    if (isBoss && levelConfig.bossConfig) {
      boss = createBoss(levelConfig.bossConfig.bossType);
    }

    set({
      level: newLevel,
      gold: 0,
      goldRequired: levelConfig.goldRequired,
      unicorns: [],
      leprechauns: [],
      boss,
      rainDrops: [],
      thunderFlash: 0,
      lightningBolts: [],
      hurricaneAngle: 0,
      screenShake: { x: 0, y: 0 },
      unicornSpawnTimer: 0,
      leprechaunSpawnTimer: 0,
      bossAttackTimer: 0,
      phase: 'playing',
      player: createInitialPlayer(),
    });
  },

  updatePlayer: (updates) => {
    set((state) => ({
      player: { ...state.player, ...updates },
    }));
  },

  addUnicorn: (unicorn) => {
    set((state) => ({
      unicorns: [...state.unicorns, unicorn],
    }));
  },

  removeUnicorn: (id) => {
    set((state) => ({
      unicorns: state.unicorns.filter((u) => u.id !== id),
    }));
  },

  addLeprechaun: (leprechaun) => {
    set((state) => ({
      leprechauns: [...state.leprechauns, leprechaun],
    }));
  },

  removeLeprechaun: (id) => {
    set((state) => ({
      leprechauns: state.leprechauns.filter((l) => l.id !== id),
    }));
  },

  catchUnicorn: (id) => {
    const state = get();
    const unicorn = state.unicorns.find((u) => u.id === id);
    if (!unicorn) return;

    const newGold = state.gold + unicorn.goldValue;
    const newScore = state.score + unicorn.goldValue * 10;
    const newPowerUpCharge = state.powerUpCharge + 1;

    set({
      unicorns: state.unicorns.filter((u) => u.id !== id),
      gold: newGold,
      score: newScore,
      powerUpCharge: newPowerUpCharge,
    });

    // Trigger power-up blast at 9 unicorns
    if (newPowerUpCharge >= GAME_CONFIG.UNICORNS_FOR_POWERUP) {
      get().firePowerUpBlast();
    }

    // Check win condition (only on non-boss levels)
    const levelConfig = getLevelConfig(state.level);
    if (!levelConfig.isBossLevel && newGold >= state.goldRequired) {
      set({ phase: 'victory' });
    }
  },

  harvestLeprechaun: (id) => {
    const state = get();
    const newHarvestCount = state.harvestCount + 1;
    const newBanished = state.leprechaunsBanished + 1;

    set({
      leprechauns: state.leprechauns.filter((l) => l.id !== id),
      score: state.score + 100,
      harvestCount: newHarvestCount,
      leprechaunsBanished: newBanished,
    });

    // Every 3 harvests, restore a rainbow color
    if (newHarvestCount % 3 === 0) {
      get().restoreRainbowColor();
    }
  },

  restoreRainbowColor: () => {
    const state = get();
    if (state.rainbowColors.length >= 7) return;

    // Find the next missing color (restore from left to right)
    const missingColors = RAINBOW_COLORS.filter(
      (c) => !state.rainbowColors.includes(c)
    );

    if (missingColors.length > 0) {
      // Add back the first missing color (leftmost in ROYGBIV order)
      const colorToRestore = missingColors[0];
      const colorIndex = RAINBOW_COLORS.indexOf(colorToRestore);

      // Insert color in correct position
      const newColors = [...state.rainbowColors];
      newColors.splice(colorIndex, 0, colorToRestore);

      set({ rainbowColors: newColors });
    }
  },

  stealRainbowColor: (leprechaunId) => {
    const state = get();
    if (state.rainbowColors.length === 0) return;

    // Leprechaun steals the last color (from right to left: violet first)
    const newColors = state.rainbowColors.slice(0, -1);

    set({
      rainbowColors: newColors,
      leprechauns: state.leprechauns.filter((l) => l.id !== leprechaunId),
    });

    // Check game over
    if (newColors.length === 0) {
      set({ phase: 'gameover' });
    }
  },

  // Boss actions
  spawnBoss: (bossType) => {
    const boss = createBoss(bossType);
    set({ boss });
  },

  damageBoss: (amount) => {
    const state = get();
    if (!state.boss) return;

    const newHealth = Math.max(0, state.boss.health - amount);

    if (newHealth <= 0) {
      get().defeatBoss();
    } else {
      set({
        boss: { ...state.boss, health: newHealth },
        screenShake: { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 },
      });
    }
  },

  defeatBoss: () => {
    const state = get();
    set({
      boss: null,
      rainDrops: [],
      thunderFlash: 0,
      lightningBolts: [],
      screenShake: { x: 0, y: 0 },
      score: state.score + 1000,
      phase: 'victory',
    });
  },

  triggerLightning: (targetPos) => {
    const state = get();
    // Create lightning bolt with warning
    const newBolt: LightningBolt = {
      points: [],
      alpha: 1,
      targetPos,
      isWarning: true,
      warningTimer: 1.0, // 1 second warning
    };
    set({
      lightningBolts: [...state.lightningBolts, newBolt],
    });
  },

  hurricaneThrow: () => {
    const state = get();
    // Apply random force to all unicorns and leprechauns
    const levelConfig = getLevelConfig(state.level);
    const throwForce = levelConfig.bossConfig?.hurricaneThrowForce || 200;

    const thrownUnicorns = state.unicorns.map((u) => ({
      ...u,
      velocity: {
        x: (Math.random() - 0.5) * throwForce,
        y: (Math.random() - 0.5) * throwForce,
      },
    }));

    const thrownLeprechauns = state.leprechauns.map((l) => ({
      ...l,
      velocity: {
        x: (Math.random() - 0.5) * throwForce,
        y: (Math.random() - 0.5) * throwForce,
      },
    }));

    set({
      unicorns: thrownUnicorns,
      leprechauns: thrownLeprechauns,
      screenShake: { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20 },
    });
  },

  // Power-up blast - shoots 9 rainbow lasers in all directions
  firePowerUpBlast: () => {
    const state = get();
    const playerPos = state.player.position;
    const laserCount = GAME_CONFIG.POWERUP_LASER_COUNT;
    const lasers: { x: number; y: number; angle: number; life: number }[] = [];

    // Create 9 lasers evenly distributed in a circle
    for (let i = 0; i < laserCount; i++) {
      const angle = (i / laserCount) * Math.PI * 2;
      lasers.push({
        x: playerPos.x,
        y: playerPos.y,
        angle,
        life: 1.0, // 1 second lifetime
      });
    }

    set({
      powerUpCharge: 0,
      isPowerUpActive: true,
      powerUpLasers: lasers,
      screenShake: { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 },
    });
  },

  // Update power-up lasers each frame
  updatePowerUpLasers: (deltaTime: number) => {
    const state = get();
    if (!state.isPowerUpActive || state.powerUpLasers.length === 0) return;

    const laserSpeed = 500; // pixels per second
    const updatedLasers = state.powerUpLasers
      .map((laser) => ({
        ...laser,
        x: laser.x + Math.cos(laser.angle) * laserSpeed * deltaTime,
        y: laser.y + Math.sin(laser.angle) * laserSpeed * deltaTime,
        life: laser.life - deltaTime,
      }))
      .filter((laser) => laser.life > 0);

    // Check if blast is complete
    if (updatedLasers.length === 0) {
      set({
        isPowerUpActive: false,
        powerUpLasers: [],
      });
    } else {
      set({ powerUpLasers: updatedLasers });
    }
  },

  updateEntities: (updates) => {
    set((state) => ({
      ...state,
      ...(updates.player && { player: { ...state.player, ...updates.player } }),
      ...(updates.unicorns !== undefined && { unicorns: updates.unicorns }),
      ...(updates.leprechauns !== undefined && { leprechauns: updates.leprechauns }),
      ...(updates.boss !== undefined && {
        boss: updates.boss === null ? null : state.boss ? { ...state.boss, ...updates.boss } : null
      }),
      ...(updates.unicornSpawnTimer !== undefined && { unicornSpawnTimer: updates.unicornSpawnTimer }),
      ...(updates.leprechaunSpawnTimer !== undefined && { leprechaunSpawnTimer: updates.leprechaunSpawnTimer }),
      ...(updates.bossAttackTimer !== undefined && { bossAttackTimer: updates.bossAttackTimer }),
      ...(updates.rainDrops !== undefined && { rainDrops: updates.rainDrops }),
      ...(updates.thunderFlash !== undefined && { thunderFlash: updates.thunderFlash }),
      ...(updates.lightningBolts !== undefined && { lightningBolts: updates.lightningBolts }),
      ...(updates.hurricaneAngle !== undefined && { hurricaneAngle: updates.hurricaneAngle }),
      ...(updates.screenShake !== undefined && { screenShake: updates.screenShake }),
      ...(updates.powerUpLasers !== undefined && { powerUpLasers: updates.powerUpLasers }),
      ...(updates.isPowerUpActive !== undefined && { isPowerUpActive: updates.isPowerUpActive }),
    }));
  },
}));
