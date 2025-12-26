// ==============================================================================
// file_id: SOM-SCR-0007-v0.2.0
// name: useGameLoop.ts
// description: React hook for game loop with touch support
// project_id: UNI-HUNT
// category: hooks
// tags: [hooks, game-loop, animation, touch, mobile]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { useGameLoop } from '@/hooks/useGameLoop'
// ==============================================================================

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { updateGame, handleTap } from '@/lib/game/game-loop';
import { renderGame } from '@/components/game/GameRenderer';
import { createInputHandler, InputHandlers, InputState } from '@/lib/game/input';

interface UseGameLoopOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useGameLoop({ canvasRef }: UseGameLoopOptions) {
  const inputHandlersRef = useRef<InputHandlers | null>(null);
  const inputStateRef = useRef<InputState>({
    mousePosition: { x: 400, y: 300 },
    isMouseDown: false,
    justClicked: false,
    lastTapPosition: null,
    isTouchDevice: false,
  });

  const phase = useGameStore((state) => state.phase);

  // Set up input handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlers = createInputHandler(canvas);
    inputHandlersRef.current = handlers;

    const handleMouseMove = (e: MouseEvent) => {
      handlers.onMouseMove(e);
      inputStateRef.current = handlers.getState();
    };

    const handleMouseDown = (e: MouseEvent) => {
      handlers.onMouseDown(e);
      inputStateRef.current = handlers.getState();
    };

    const handleMouseUp = () => {
      handlers.onMouseUp();
      inputStateRef.current = handlers.getState();
    };

    const handleClick = (e: MouseEvent) => {
      handlers.onClick(e);
      inputStateRef.current = handlers.getState();
      // Handle tap for leprechauns and boss
      const state = handlers.getState();
      if (state.lastTapPosition) {
        handleTap(state.lastTapPosition);
        handlers.clearTapPosition();
      }
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      handlers.onTouchStart(e);
      inputStateRef.current = handlers.getState();
      // Handle tap immediately on touch
      const state = handlers.getState();
      if (state.lastTapPosition) {
        handleTap(state.lastTapPosition);
        handlers.clearTapPosition();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handlers.onTouchMove(e);
      inputStateRef.current = handlers.getState();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handlers.onTouchEnd(e);
      inputStateRef.current = handlers.getState();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const store = useGameStore.getState();
        if (store.phase === 'playing') {
          store.pauseGame();
        } else if (store.phase === 'paused') {
          store.resumeGame();
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvasRef]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let animationId: number;

    const loop = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap at 100ms
      lastTime = currentTime;

      const state = useGameStore.getState();

      // Update game logic if playing
      if (state.phase === 'playing') {
        updateGame(deltaTime, inputStateRef.current);

        // Reset click after processing
        if (inputHandlersRef.current) {
          inputHandlersRef.current.resetClick();
          inputStateRef.current = inputHandlersRef.current.getState();
        }
      }

      // Always render (even when paused)
      const currentState = useGameStore.getState();
      renderGame(ctx, {
        player: currentState.player,
        unicorns: currentState.unicorns,
        leprechauns: currentState.leprechauns,
        potOfGold: currentState.potOfGold,
        boss: currentState.boss,
        rainDrops: currentState.rainDrops,
        thunderFlash: currentState.thunderFlash,
        lightningBolts: currentState.lightningBolts,
        hurricaneAngle: currentState.hurricaneAngle,
        screenShake: currentState.screenShake,
        powerUpLasers: currentState.powerUpLasers,
        isPowerUpActive: currentState.isPowerUpActive,
      });

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [canvasRef, phase]);

  const startGame = useCallback(() => {
    useGameStore.getState().startGame();
  }, []);

  const restartGame = useCallback(() => {
    useGameStore.getState().restartGame();
  }, []);

  const nextLevel = useCallback(() => {
    useGameStore.getState().nextLevel();
  }, []);

  return {
    startGame,
    restartGame,
    nextLevel,
  };
}
