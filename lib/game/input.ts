// ==============================================================================
// file_id: SOM-SCR-0004-v0.2.0
// name: input.ts
// description: Input handling utilities - mobile touch support
// project_id: UNI-HUNT
// category: game-logic
// tags: [input, mouse, keyboard, touch, mobile]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { InputState, createInputHandler } from '@/lib/game/input'
// ==============================================================================

import { Vector2 } from '@/types/game';

export interface InputState {
  mousePosition: Vector2;
  isMouseDown: boolean;
  justClicked: boolean;
  lastTapPosition: Vector2 | null;
  isTouchDevice: boolean;
}

export function createInputState(): InputState {
  return {
    mousePosition: { x: 400, y: 300 },
    isMouseDown: false,
    justClicked: false,
    lastTapPosition: null,
    isTouchDevice: false,
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

export function getTouchPositionOnCanvas(
  touch: Touch,
  canvas: HTMLCanvasElement
): Vector2 {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY,
  };
}

export interface InputHandlers {
  onMouseMove: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: () => void;
  onClick: (event: MouseEvent) => void;
  onTouchStart: (event: TouchEvent) => void;
  onTouchMove: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  getState: () => InputState;
  resetClick: () => void;
  clearTapPosition: () => void;
}

export function createInputHandler(canvas: HTMLCanvasElement): InputHandlers {
  const state: InputState = createInputState();

  return {
    onMouseMove: (event: MouseEvent) => {
      if (!state.isTouchDevice) {
        state.mousePosition = getMousePositionOnCanvas(event, canvas);
      }
    },

    onMouseDown: (event: MouseEvent) => {
      if (!state.isTouchDevice) {
        state.isMouseDown = true;
        state.mousePosition = getMousePositionOnCanvas(event, canvas);
      }
    },

    onMouseUp: () => {
      if (!state.isTouchDevice) {
        state.isMouseDown = false;
      }
    },

    onClick: (event: MouseEvent) => {
      if (!state.isTouchDevice) {
        state.justClicked = true;
        const pos = getMousePositionOnCanvas(event, canvas);
        state.mousePosition = pos;
        state.lastTapPosition = pos;
      }
    },

    onTouchStart: (event: TouchEvent) => {
      state.isTouchDevice = true;
      if (event.touches.length > 0) {
        const pos = getTouchPositionOnCanvas(event.touches[0], canvas);
        state.mousePosition = pos;
        state.isMouseDown = true;
        state.justClicked = true;
        state.lastTapPosition = pos;
      }
    },

    onTouchMove: (event: TouchEvent) => {
      if (event.touches.length > 0) {
        state.mousePosition = getTouchPositionOnCanvas(event.touches[0], canvas);
      }
    },

    onTouchEnd: (event: TouchEvent) => {
      state.isMouseDown = false;
      // Keep the last position for the player net
    },

    onKeyDown: (event: KeyboardEvent) => {
      // Handle pause with Escape key - handled by the game component
    },

    getState: () => ({ ...state }),

    resetClick: () => {
      state.justClicked = false;
    },

    clearTapPosition: () => {
      state.lastTapPosition = null;
    },
  };
}
