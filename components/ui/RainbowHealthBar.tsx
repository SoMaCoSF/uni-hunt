// ==============================================================================
// file_id: SOM-SCR-0009-v0.1.0
// name: RainbowHealthBar.tsx
// description: ROYGBIV rainbow health bar display
// project_id: UNI-HUNT
// category: component
// tags: [ui, health, rainbow]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { RainbowHealthBar } from '@/components/ui/RainbowHealthBar'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';
import { RAINBOW_COLORS, RAINBOW_HEX, RainbowColor } from '@/types/game';

export function RainbowHealthBar() {
  const rainbowColors = useGameStore((state) => state.rainbowColors);

  return (
    <div className="flex gap-1">
      {RAINBOW_COLORS.map((color) => {
        const isActive = rainbowColors.includes(color);
        return (
          <div
            key={color}
            className={`w-8 h-8 rounded transition-all duration-300 ${
              isActive
                ? 'opacity-100 scale-100'
                : 'opacity-20 scale-90'
            }`}
            style={{
              backgroundColor: RAINBOW_HEX[color],
              boxShadow: isActive
                ? `0 0 10px ${RAINBOW_HEX[color]}, 0 0 20px ${RAINBOW_HEX[color]}40`
                : 'none',
            }}
            title={color.charAt(0).toUpperCase() + color.slice(1)}
          />
        );
      })}
    </div>
  );
}
