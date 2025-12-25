// ==============================================================================
// file_id: SOM-SCR-0004-v0.1.0
// name: input.ts
// description: Input handling utilities
// project_id: UNI-HUNT
// category: game-logic
// tags: [input, mouse, keyboard]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { InputState, createInputHandler } from '@/lib/game/input'
// ==============================================================================

import { Vector2 } from '@/types/game';

export interface InputState {
  mousePosition: Vector2;
  isMouseDown: boolean;
  justClicked: boolean;
}

export function createInputState(): InputState {
  return {
    mousePosition: { x: 0, y: 0 },
    isMouseDown: false,
    justClicked: false,
  };
}

export function getMousePositionOnCanvas(
  event: MouseEvent,
  canvas: HTMLCanvasElement
): Vector2 {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

export interface InputHandlers {
  onMouseMove: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: () => void;
  onClick: (event: MouseEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  getState: () => InputState;
  resetClick: () => void;
}

export function createInputHandler(canvas: HTMLCanvasElement): InputHandlers {
  const state: InputState = createInputState();

  return {
    onMouseMove: (event: MouseEvent) => {
      state.mousePosition = getMousePositionOnCanvas(event, canvas);
    },

    onMouseDown: (event: MouseEvent) => {
      state.isMouseDown = true;
      state.mousePosition = getMousePositionOnCanvas(event, canvas);
    },

    onMouseUp: () => {
      state.isMouseDown = false;
    },

    onClick: (event: MouseEvent) => {
      state.justClicked = true;
      state.mousePosition = getMousePositionOnCanvas(event, canvas);
    },

    onKeyDown: (event: KeyboardEvent) => {
      // Handle pause with Escape key
      if (event.key === 'Escape') {
        // Will be handled by the game component
      }
    },

    getState: () => ({ ...state }),

    resetClick: () => {
      state.justClicked = false;
    },
  };
}
