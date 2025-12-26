// ==============================================================================
// file_id: SOM-SCR-0010-v0.2.0
// name: ScoreDisplay.tsx
// description: Score, gold, level, and leprechauns banished display
// project_id: UNI-HUNT
// category: component
// tags: [ui, score, display, banished]
// created: 2025-12-25
// modified: 2025-12-26
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { ScoreDisplay } from '@/components/ui/ScoreDisplay'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';
import { getLevelConfig } from '@/lib/config/level-config';

export function ScoreDisplay() {
  const score = useGameStore((state) => state.score);
  const gold = useGameStore((state) => state.gold);
  const goldRequired = useGameStore((state) => state.goldRequired);
  const level = useGameStore((state) => state.level);
  const leprechaunsBanished = useGameStore((state) => state.leprechaunsBanished);
  const harvestCount = useGameStore((state) => state.harvestCount);
  const rainbowColors = useGameStore((state) => state.rainbowColors);

  const levelConfig = getLevelConfig(level);
  const isBossLevel = levelConfig.isBossLevel;

  const goldProgress = goldRequired > 0 ? Math.min((gold / goldRequired) * 100, 100) : 0;

  // Calculate restoration progress (every 3 harvests = 1 color restored)
  const untilRestore = rainbowColors.length < 7 ? 3 - (harvestCount % 3) : 0;

  return (
    <div className="flex flex-col items-end gap-2 text-white">
      <div className="text-lg font-bold">
        Score: <span className="text-yellow-400">{score.toLocaleString()}</span>
      </div>

      {/* Level with progression */}
      <div className="text-lg">
        Level: <span className="text-purple-400">{level}/9</span>
        {isBossLevel && (
          <span className="ml-2 text-red-500 text-sm font-bold animate-pulse">⚡ BOSS</span>
        )}
      </div>

      {!isBossLevel && (
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm">
            Gold: <span className="text-yellow-400">{gold}</span> / {goldRequired}
          </div>
          <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-300"
              style={{ width: `${goldProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Leprechauns Banished Counter with Restoration Progress */}
      <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-900/40 rounded-lg border border-green-700/50">
        <span className="text-lg">🍀</span>
        <div className="flex flex-col items-end">
          <span className="text-xs text-green-400 uppercase tracking-wide">Banished</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-300">{leprechaunsBanished}</span>
            {untilRestore > 0 && (
              <span className="text-xs text-purple-300">
                (⭐ in {untilRestore})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
