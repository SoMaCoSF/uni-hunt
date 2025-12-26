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
import { isBossLevel } from '@/lib/config/level-config';

interface GameOverScreenProps {
  onRestart: () => void;
  onNextLevel: () => void;
}

export function GameOverScreen({ onRestart, onNextLevel }: GameOverScreenProps) {
  const phase = useGameStore((state) => state.phase);
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);
  const gold = useGameStore((state) => state.gold);
  const goldRequired = useGameStore((state) => state.goldRequired);
  const leprechaunsBanished = useGameStore((state) => state.leprechaunsBanished);
  const rainbowColors = useGameStore((state) => state.rainbowColors);

  if (phase !== 'gameover' && phase !== 'victory') return null;

  const isVictory = phase === 'victory';
  const isBoss = isBossLevel(level);

  // Boss names
  const bossNames: { [key: number]: string } = {
    3: "Storm Cloud",
    6: "Lightning Lord",
    9: "Hurricane King"
  };

  // Contextual tips for game over
  const getTip = () => {
    if (rainbowColors.length <= 2) {
      return "💡 Tip: Tap leprechauns faster! Every 3 banished restores 1 color.";
    } else if (gold < goldRequired / 2) {
      return "💡 Tip: Catch more unicorns for gold and power-ups!";
    }
    return "💡 Tip: Use power-up blasts (9 unicorns) to clear multiple enemies!";
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-8 text-center max-w-md">
        {isVictory ? (
          <>
            {isBoss && (
              <div className="text-purple-400 mb-2 text-lg font-bold animate-pulse">
                ⚡ BOSS DEFEATED: {bossNames[level]} ⚡
              </div>
            )}
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">
              {isBoss ? "Victory!" : "Level Complete!"}
            </h2>
            <p className="text-xl text-white mb-2">
              {isBoss ? `You defeated the ${bossNames[level]}!` : "You collected all the gold!"}
            </p>

            {/* Progress indicator */}
            <div className="text-purple-400 mb-4">
              Level {level}/9 Complete
            </div>

            {/* Stats breakdown */}
            <div className="bg-black/40 rounded-lg p-4 mb-6 text-left">
              <div className="text-gray-400 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="text-yellow-400">{score.toLocaleString()}</span>
                </div>
                {!isBoss && (
                  <div className="flex justify-between">
                    <span>Gold:</span>
                    <span className="text-yellow-400">{gold}/{goldRequired}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Leprechauns Banished:</span>
                  <span className="text-green-400">{leprechaunsBanished}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rainbow Health:</span>
                  <span className="text-purple-400">{rainbowColors.length}/7 colors</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              {level < 9 ? (
                <button
                  onClick={onNextLevel}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
                >
                  Next Level
                </button>
              ) : (
                <div className="text-2xl text-yellow-300 font-bold mb-2">
                  🎉 GAME COMPLETE! 🎉
                </div>
              )}
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

            {/* Stats breakdown */}
            <div className="bg-black/40 rounded-lg p-4 mb-4 text-left">
              <div className="text-gray-400 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Final Score:</span>
                  <span className="text-yellow-400">{score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level Reached:</span>
                  <span className="text-purple-400">{level}/9</span>
                </div>
                <div className="flex justify-between">
                  <span>Gold:</span>
                  <span className="text-yellow-400">{gold}/{goldRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span>Leprechauns Banished:</span>
                  <span className="text-green-400">{leprechaunsBanished}</span>
                </div>
              </div>
            </div>

            {/* Contextual tip */}
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3 mb-6 text-sm text-blue-200">
              {getTip()}
            </div>

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
