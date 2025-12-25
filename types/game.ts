// ==============================================================================
// file_id: SOM-DTA-0001-v0.1.0
// name: game.ts
// description: Core game type definitions for Unicorn Hunt
// project_id: UNI-HUNT
// category: types
// tags: [game, types, state]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { GameState, Vector2 } from '@/types/game'
// ==============================================================================

export interface Vector2 {
  x: number;
  y: number;
}

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';

export type RainbowColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'violet';

export const RAINBOW_COLORS: RainbowColor[] = [
  'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
];

export const RAINBOW_HEX: Record<RainbowColor, string> = {
  red: '#FF0000',
  orange: '#FF7F00',
  yellow: '#FFFF00',
  green: '#00FF00',
  blue: '#0000FF',
  indigo: '#4B0082',
  violet: '#9400D3',
};

export interface GameState {
  phase: GamePhase;
  level: number;
  score: number;
  gold: number;
  goldRequired: number;
  rainbowColors: RainbowColor[];
  isPaused: boolean;
}
