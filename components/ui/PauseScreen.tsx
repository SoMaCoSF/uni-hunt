// ==============================================================================
// file_id: SOM-SCR-0014-v0.1.0
// name: PauseScreen.tsx
// description: Pause overlay screen component
// project_id: UNI-HUNT
// category: component
// tags: [ui, pause, overlay]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { PauseScreen } from '@/components/ui/PauseScreen'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';
import { isBossLevel } from '@/lib/config/level-config';

export function PauseScreen() {
  const phase = useGameStore((state) => state.phase);
  const resumeGame = useGameStore((state) => state.resumeGame);
  const quitToMenu = useGameStore((state) => state.quitToMenu);
  const level = useGameStore((state) => state.level);
  const score = useGameStore((state) => state.score);
  const gold = useGameStore((state) => state.gold);
  const goldRequired = useGameStore((state) => state.goldRequired);

  if (phase !== 'paused') return null;

  const isBoss = isBossLevel(level);

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-8 text-center max-w-sm">
        <h2 className="text-4xl font-bold text-white mb-6">
          Paused
        </h2>

        {/* Game state display */}
        <div className="bg-black/40 rounded-lg p-4 mb-6 text-left">
          <div className="text-gray-400 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Level:</span>
              <span className="text-purple-400">
                {level}/9 {isBoss && <span className="text-yellow-400">⚡ BOSS</span>}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="text-yellow-400">{score.toLocaleString()}</span>
            </div>
            {!isBoss && (
              <div className="flex justify-between">
                <span>Gold Progress:</span>
                <span className="text-yellow-400">{gold}/{goldRequired}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick controls reference */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-6 text-left">
          <div className="text-xs text-blue-200 space-y-1">
            <div><strong>Tap leprechauns</strong>: Click/tap 5 times</div>
            <div><strong>Catch unicorns</strong>: Move net over them</div>
            <div><strong>Power-up</strong>: Catch 9 unicorns = rainbow blast</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={resumeGame}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
          >
            Resume
          </button>
          <button
            onClick={quitToMenu}
            className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
          >
            Quit to Menu
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-4">
          Press ESC to resume
        </p>
      </div>
    </div>
  );
}
