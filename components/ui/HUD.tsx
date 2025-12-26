// ==============================================================================
// file_id: SOM-SCR-0011-v0.2.0
// name: HUD.tsx
// description: Heads-up display with power-up and banished counter
// project_id: UNI-HUNT
// category: component
// tags: [ui, hud, layout, powerup]
// created: 2025-12-25
// modified: 2025-12-26
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { HUD } from '@/components/ui/HUD'
// ==============================================================================

"use client";

import { RainbowHealthBar } from './RainbowHealthBar';
import { ScoreDisplay } from './ScoreDisplay';
import { PowerUpMeter } from './PowerUpMeter';
import { useGameStore } from '@/stores/gameStore';

export function HUD() {
  const phase = useGameStore((state) => state.phase);

  if (phase === 'menu') return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Rainbow Power</div>
          <RainbowHealthBar />
        </div>

        <PowerUpMeter />
      </div>

      <ScoreDisplay />
    </div>
  );
}
