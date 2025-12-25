// ==============================================================================
// file_id: SOM-SCR-0015-v0.1.0
// name: page.tsx
// description: Main game page component
// project_id: UNI-HUNT
// category: page
// tags: [page, main, game]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: Next.js app router page
// ==============================================================================

"use client";

import { useRef, useCallback } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { HUD } from '@/components/ui/HUD';
import { MenuScreen } from '@/components/ui/MenuScreen';
import { PauseScreen } from '@/components/ui/PauseScreen';
import { GameOverScreen } from '@/components/ui/GameOverScreen';
import { useGameStore } from '@/stores/gameStore';

export default function Home() {
  const startGame = useGameStore((state) => state.startGame);
  const restartGame = useGameStore((state) => state.restartGame);
  const nextLevel = useGameStore((state) => state.nextLevel);

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleRestart = useCallback(() => {
    restartGame();
  }, [restartGame]);

  const handleNextLevel = useCallback(() => {
    nextLevel();
  }, [nextLevel]);

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <GameCanvas />
        <HUD />
        <MenuScreen onStart={handleStart} />
        <PauseScreen />
        <GameOverScreen onRestart={handleRestart} onNextLevel={handleNextLevel} />
      </div>

      <footer className="mt-4 text-gray-600 text-sm">
        Move mouse to catch unicorns | Click to shoot leprechauns | ESC to pause
      </footer>
    </main>
  );
}
