// ==============================================================================
// file_id: SOM-SCR-0013-v0.1.0
// name: MenuScreen.tsx
// description: Main menu screen component
// project_id: UNI-HUNT
// category: component
// tags: [ui, menu, start]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { MenuScreen } from '@/components/ui/MenuScreen'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';
import { RAINBOW_HEX } from '@/types/game';

interface MenuScreenProps {
  onStart: () => void;
}

export function MenuScreen({ onStart }: MenuScreenProps) {
  const phase = useGameStore((state) => state.phase);

  if (phase !== 'menu') return null;

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center overflow-y-auto">
      <div className="text-center px-4 py-8 w-full max-w-2xl">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
          style={{
            background: `linear-gradient(to right, ${RAINBOW_HEX.red}, ${RAINBOW_HEX.orange}, ${RAINBOW_HEX.yellow}, ${RAINBOW_HEX.green}, ${RAINBOW_HEX.blue}, ${RAINBOW_HEX.indigo}, ${RAINBOW_HEX.violet})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Unicorn Hunt
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 max-w-md mx-auto">
          Catch unicorns with your rainbow net to collect gold!
          <br />
          <span className="text-red-400">Beware the leprechauns!</span>
          <br />
          <span className="text-purple-400 text-sm sm:text-base">Complete 9 levels including 3 epic boss battles!</span>
        </p>

        <div className="bg-gray-900/80 rounded-lg p-4 sm:p-6 mb-6 max-w-md mx-auto text-left">
          <h3 className="text-base sm:text-lg font-bold text-white mb-3">How to Play:</h3>
          <ul className="text-gray-300 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
            <li>🌈 <strong>Move net</strong>: Mouse/tap to control your rainbow net</li>
            <li>🦄 <strong>Catch unicorns</strong>: Earn gold & charge power-ups!</li>
            <li>⚡ <strong>Tap leprechauns</strong>: Click/tap 5 times to banish them</li>
            <li>💚 <strong>Restore colors</strong>: Every 3 leprechauns banished = +1 color!</li>
            <li>💥 <strong>Power-up blast</strong>: Catch 9 unicorns = 9 rainbow lasers!</li>
            <li>☁️ <strong>Boss battles</strong>: Storm Cloud (Lv3), Lightning Lord (Lv6), Hurricane King (Lv9)</li>
            <li>💔 <strong>Lose all colors</strong> = Game Over</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-xl sm:text-2xl font-bold rounded-xl hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          Start Game
        </button>

        <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
          Press ESC to pause
        </p>
      </div>
    </div>
  );
}
