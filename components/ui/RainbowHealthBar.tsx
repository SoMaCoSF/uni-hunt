// ==============================================================================
// file_id: SOM-SCR-0009-v0.2.0
// name: RainbowHealthBar.tsx
// description: Hexagonal staggered rainbow health bar with glowing blocks
// project_id: UNI-HUNT
// category: component
// tags: [ui, health, rainbow, hexagon, glow]
// created: 2025-12-25
// modified: 2025-12-26
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { RainbowHealthBar } from '@/components/ui/RainbowHealthBar'
// ==============================================================================

"use client";

import { useGameStore } from '@/stores/gameStore';
import { RAINBOW_COLORS, RAINBOW_HEX, RainbowColor } from '@/types/game';

// Hexagon SVG path for a flat-top hexagon
const HEX_PATH = "M25 0 L50 14.43 L50 43.3 L25 57.74 L0 43.3 L0 14.43 Z";

interface HexBlockProps {
  color: RainbowColor;
  isActive: boolean;
  index: number;
}

function HexBlock({ color, isActive, index }: HexBlockProps) {
  const hexColor = RAINBOW_HEX[color];

  // Stagger every other hex vertically
  const isStaggered = index % 2 === 1;
  const offsetY = isStaggered ? 12 : 0;

  return (
    <div
      className={`relative transition-all duration-500 ${
        isActive ? 'scale-100' : 'scale-75 opacity-30'
      }`}
      style={{
        marginTop: `${offsetY}px`,
        marginLeft: index === 0 ? '0' : '-8px', // Overlap hexagons slightly
      }}
    >
      <svg
        width="40"
        height="46"
        viewBox="0 0 50 58"
        className={`transition-all duration-500 ${isActive ? 'drop-shadow-lg' : ''}`}
        style={{
          filter: isActive
            ? `drop-shadow(0 0 8px ${hexColor}) drop-shadow(0 0 16px ${hexColor}80)`
            : 'none',
        }}
      >
        {/* Outer glow layer */}
        {isActive && (
          <path
            d={HEX_PATH}
            fill={`${hexColor}20`}
            stroke={`${hexColor}60`}
            strokeWidth="2"
            className="animate-pulse"
          />
        )}

        {/* Main hex shape */}
        <path
          d={HEX_PATH}
          fill={isActive ? `${hexColor}90` : `${hexColor}30`}
          stroke={isActive ? hexColor : `${hexColor}50`}
          strokeWidth="2"
        />

        {/* Inner highlight for depth */}
        {isActive && (
          <path
            d="M25 8 L42 18.5 L42 39.5 L25 50 L8 39.5 L8 18.5 Z"
            fill="none"
            stroke={`${hexColor}40`}
            strokeWidth="1"
          />
        )}

        {/* Center glow spot */}
        {isActive && (
          <circle
            cx="25"
            cy="29"
            r="8"
            fill={`${hexColor}30`}
            className="animate-pulse"
          />
        )}
      </svg>

      {/* Color label (first letter) */}
      <span
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold transition-opacity duration-300 ${
          isActive ? 'opacity-80' : 'opacity-20'
        }`}
        style={{ color: isActive ? '#fff' : hexColor, textShadow: isActive ? `0 0 4px ${hexColor}` : 'none' }}
      >
        {color.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export function RainbowHealthBar() {
  const rainbowColors = useGameStore((state) => state.rainbowColors);

  return (
    <div className="flex items-start px-2 py-1">
      {RAINBOW_COLORS.map((color, index) => {
        const isActive = rainbowColors.includes(color);
        return (
          <HexBlock
            key={color}
            color={color}
            isActive={isActive}
            index={index}
          />
        );
      })}
    </div>
  );
}
