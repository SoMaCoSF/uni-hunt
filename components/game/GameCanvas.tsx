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

import { useRef, useEffect, useState } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { getResponsiveCanvasSize } from '@/lib/config/game-config';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const size = getResponsiveCanvasSize();
      setCanvasSize({ width: size.width, height: size.height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useGameLoop({ canvasRef });

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="cursor-crosshair"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      }}
    />
  );
}
