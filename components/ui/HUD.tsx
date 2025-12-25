// ==============================================================================
// file_id: SOM-SCR-0011-v0.1.0
// name: HUD.tsx
// description: Heads-up display container component
// project_id: UNI-HUNT
// category: component
// tags: [ui, hud, layout]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { HUD } from '@/components/ui/HUD'
// ==============================================================================

"use client";

import { RainbowHealthBar } from './RainbowHealthBar';
import { ScoreDisplay } from './ScoreDisplay';
import { useGameStore } from '@/stores/gameStore';

export function HUD() {
  const phase = useGameStore((state) => state.phase);

  if (phase === 'menu') return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-400 uppercase tracking-wide">Rainbow Power</div>
        <RainbowHealthBar />
      </div>

      <ScoreDisplay />
    </div>
  );
}
