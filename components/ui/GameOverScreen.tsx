// ==============================================================================
// file_id: SOM-SCR-0012-v0.1.0
// name: GameOverScreen.tsx
// description: Game over and victory overlay screens
// project_id: UNI-HUNT
// category: component
// tags: [ui, gameover, victory, overlay]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { GameOverScreen } from '@/components/ui/GameOverScreen'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';

interface GameOverScreenProps {
  onRestart: () => void;
  onNextLevel: () => void;
}

export function GameOverScreen({ onRestart, onNextLevel }: GameOverScreenProps) {
  const phase = useGameStore((state) => state.phase);
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);

  if (phase !== 'gameover' && phase !== 'victory') return null;

  const isVictory = phase === 'victory';

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-8 text-center max-w-md">
        {isVictory ? (
          <>
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">
              Level Complete!
            </h2>
            <p className="text-xl text-white mb-2">
              You collected all the gold!
            </p>
            <p className="text-gray-400 mb-6">
              Level {level} Score: {score.toLocaleString()}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onNextLevel}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
              >
                Next Level
              </button>
              <button
                onClick={onRestart}
                className="px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
              >
                Restart
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-red-500 mb-4">
              Game Over!
            </h2>
            <p className="text-xl text-white mb-2">
              The leprechauns stole your rainbow!
            </p>
            <p className="text-gray-400 mb-6">
              Final Score: {score.toLocaleString()}
            </p>
            <button
              onClick={onRestart}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
