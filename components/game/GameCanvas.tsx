// ==============================================================================
// file_id: SOM-SCR-0008-v0.1.0
// name: GameCanvas.tsx
// description: Main game canvas component
// project_id: UNI-HUNT
// category: component
// tags: [canvas, game, rendering]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { GameCanvas } from '@/components/game/GameCanvas'
// ==============================================================================

"use client";

import { useRef } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { GAME_CONFIG } from '@/lib/config/game-config';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGameLoop({ canvasRef });

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.CANVAS_WIDTH}
      height={GAME_CONFIG.CANVAS_HEIGHT}
      className="cursor-crosshair"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
}
