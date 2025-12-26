// ==============================================================================
// file_id: SOM-SCR-0015-v0.2.0
// name: page.tsx
// description: Main game page - fullscreen mobile
// project_id: UNI-HUNT
// category: page
// tags: [page, main, game, fullscreen, mobile]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: Next.js app router page
// ==============================================================================

"use client";

import { useCallback, useEffect, useState } from 'react';
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
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Request fullscreen on mobile
    const requestFullscreen = () => {
      if (document.documentElement.requestFullscreen && window.innerWidth < 768) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    document.addEventListener('touchstart', requestFullscreen, { once: true });

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

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
    <main className="game-fullscreen">
      {/* Rotate device hint for portrait mobile */}
      {isPortrait && (
        <div className="rotate-hint fixed inset-0 bg-black/95 z-50 flex-col items-center justify-center text-white text-center p-8">
          <div className="text-6xl mb-6 animate-bounce">📱 ↻</div>
          <div className="text-2xl font-bold mb-3 text-yellow-400">Please Rotate Your Device</div>
          <div className="text-lg text-gray-300 mb-4">
            Unicorn Hunt plays best in <strong>landscape mode</strong>
          </div>
          <div className="text-sm text-gray-400">
            Turn your phone sideways for full control of your rainbow net and power-ups!
          </div>
        </div>
      )}

      <div className="game-canvas-wrapper">
        <GameCanvas />
        <HUD />
        <MenuScreen onStart={handleStart} />
        <PauseScreen />
        <GameOverScreen onRestart={handleRestart} onNextLevel={handleNextLevel} />
      </div>
    </main>
  );
}
