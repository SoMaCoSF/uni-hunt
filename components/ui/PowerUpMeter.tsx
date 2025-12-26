// ==============================================================================
// file_id: SOM-SCR-0017-v0.1.0
// name: PowerUpMeter.tsx
// description: Power-up charge meter showing unicorn captures until blast
// project_id: UNI-HUNT
// category: component
// tags: [ui, powerup, meter, rainbow]
// created: 2025-12-26
// modified: 2025-12-26
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { PowerUpMeter } from '@/components/ui/PowerUpMeter'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';
import { GAME_CONFIG } from '@/lib/config/game-config';
import { RAINBOW_HEX } from '@/types/game';

const RAINBOW_GRADIENT = [
  RAINBOW_HEX.red,
  RAINBOW_HEX.orange,
  RAINBOW_HEX.yellow,
  RAINBOW_HEX.green,
  RAINBOW_HEX.blue,
  RAINBOW_HEX.indigo,
  RAINBOW_HEX.violet,
];

export function PowerUpMeter() {
  const powerUpCharge = useGameStore((state) => state.powerUpCharge);
  const isPowerUpActive = useGameStore((state) => state.isPowerUpActive);
  const maxCharge = GAME_CONFIG.UNICORNS_FOR_POWERUP;

  const chargePercent = (powerUpCharge / maxCharge) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-2">
        <span title="Catch 9 unicorns to shoot 9 rainbow lasers in all directions">
          ⚡ Rainbow Blast (9 Lasers)
        </span>
      </div>

      {/* Firing indicator - larger and more visible */}
      {isPowerUpActive && (
        <div className="text-sm text-yellow-300 font-bold animate-pulse flex items-center gap-1 mb-1">
          <span className="text-xl">💥</span>
          <span>FIRING RAINBOW BLAST!</span>
          <span className="text-xl">💥</span>
        </div>
      )}

      <div className="relative w-40 h-4 bg-gray-800/80 rounded-full overflow-hidden border border-gray-600">
        {/* Charge bar with rainbow gradient */}
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${chargePercent}%`,
            background: `linear-gradient(90deg, ${RAINBOW_GRADIENT.join(', ')})`,
            boxShadow: chargePercent > 80 ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
          }}
        />

        {/* Charge count overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {powerUpCharge} / {maxCharge} 🦄
          </span>
        </div>

        {/* Pulsing glow when nearly full */}
        {chargePercent >= 80 && !isPowerUpActive && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,0,0.2), rgba(255,0,255,0.2))',
            }}
          />
        )}
      </div>

      {/* Helper text when not firing */}
      {!isPowerUpActive && (
        <div className="text-xs text-gray-500 mt-0.5">
          Catch {maxCharge - powerUpCharge} more unicorn{maxCharge - powerUpCharge !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
