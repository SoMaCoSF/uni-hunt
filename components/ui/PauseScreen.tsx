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

export function PauseScreen() {
  const phase = useGameStore((state) => state.phase);
  const resumeGame = useGameStore((state) => state.resumeGame);

  if (phase !== 'paused') return null;

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Paused
        </h2>
        <button
          onClick={resumeGame}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
        >
          Resume
        </button>
        <p className="text-gray-500 text-sm mt-4">
          Press ESC to resume
        </p>
      </div>
    </div>
  );
}
