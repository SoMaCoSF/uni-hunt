// ==============================================================================
// file_id: SOM-SCR-0001-v0.2.0
// name: gameStore.ts
// description: Zustand store for game state management - drain mechanic
// project_id: UNI-HUNT
// category: store
// tags: [zustand, state, game, drain]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { useGameStore } from '@/stores/gameStore'
// ==============================================================================

import { create } from 'zustand';
import { GamePhase, RainbowColor, RAINBOW_COLORS } from '@/types/game';
import { Player, Unicorn, Leprechaun, PotOfGold } from '@/types/entities';
import { GAME_CONFIG } from '@/lib/config/game-config';
import { getLevelConfig } from '@/lib/config/level-config';

interface GameStore {
  // Game state
  phase: GamePhase;
  level: number;
  score: number;
  gold: number;
  goldRequired: number;
  rainbowColors: RainbowColor[];
  harvestCount: number;

  // Entities
  player: Player;
  unicorns: Unicorn[];
  leprechauns: Leprechaun[];
  potOfGold: PotOfGold;

  // Timing
  unicornSpawnTimer: number;
  leprechaunSpawnTimer: number;

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

  // Bulk updates for game loop
  updateEntities: (updates: {
    player?: Partial<Player>;
    unicorns?: Unicorn[];
    leprechauns?: Leprechaun[];
    unicornSpawnTimer?: number;
    leprechaunSpawnTimer?: number;
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
    player: createInitialPlayer(),
    unicorns: [] as Unicorn[],
    leprechauns: [] as Leprechaun[],
    potOfGold: createPotOfGold(),
    unicornSpawnTimer: 0,
    leprechaunSpawnTimer: 0,
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

    set({
      level: newLevel,
      gold: 0,
      goldRequired: levelConfig.goldRequired,
      unicorns: [],
      leprechauns: [],
      unicornSpawnTimer: 0,
      leprechaunSpawnTimer: 0,
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

    set({
      unicorns: state.unicorns.filter((u) => u.id !== id),
      gold: newGold,
      score: newScore,
    });

    // Check win condition
    if (newGold >= state.goldRequired) {
      set({ phase: 'victory' });
    }
  },

  harvestLeprechaun: (id) => {
    const state = get();
    const newHarvestCount = state.harvestCount + 1;

    set({
      leprechauns: state.leprechauns.filter((l) => l.id !== id),
      score: state.score + 100,
      harvestCount: newHarvestCount,
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

  updateEntities: (updates) => {
    set((state) => ({
      ...state,
      ...(updates.player && { player: { ...state.player, ...updates.player } }),
      ...(updates.unicorns !== undefined && { unicorns: updates.unicorns }),
      ...(updates.leprechauns !== undefined && { leprechauns: updates.leprechauns }),
      ...(updates.unicornSpawnTimer !== undefined && { unicornSpawnTimer: updates.unicornSpawnTimer }),
      ...(updates.leprechaunSpawnTimer !== undefined && { leprechaunSpawnTimer: updates.leprechaunSpawnTimer }),
    }));
  },
}));
