// ==============================================================================
// file_id: SOM-SCR-0010-v0.1.0
// name: ScoreDisplay.tsx
// description: Score, gold, and level display component
// project_id: UNI-HUNT
// category: component
// tags: [ui, score, display]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { ScoreDisplay } from '@/components/ui/ScoreDisplay'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';

export function ScoreDisplay() {
  const score = useGameStore((state) => state.score);
  const gold = useGameStore((state) => state.gold);
  const goldRequired = useGameStore((state) => state.goldRequired);
  const level = useGameStore((state) => state.level);

  const goldProgress = Math.min((gold / goldRequired) * 100, 100);

  return (
    <div className="flex flex-col items-end gap-2 text-white">
      <div className="text-lg font-bold">
        Score: <span className="text-yellow-400">{score.toLocaleString()}</span>
      </div>

      <div className="text-lg">
        Level: <span className="text-purple-400">{level}</span>
      </div>

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
    </div>
  );
}
