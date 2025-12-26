// ==============================================================================
// file_id: SOM-SCR-0005-v0.2.0
// name: game-loop.ts
// description: Main game loop update logic - drain mechanic
// project_id: UNI-HUNT
// category: game-logic
// tags: [game-loop, update, tick, drain]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.2.0
// agent_id: AGENT-PRIME-002
// execution: import { updateGame } from '@/lib/game/game-loop'
// ==============================================================================

import { useGameStore } from '@/stores/gameStore';
import { getLevelConfig } from '@/lib/config/level-config';
import { checkCollisions } from './collision';
import {
  createUnicorn,
  createLeprechaun,
  updateUnicornWander,
  updateLeprechaunMovement,
  isPointInCircle,
} from './spawning';
import { InputState } from './input';
import { GAME_CONFIG } from '@/lib/config/game-config';
import { Player, Leprechaun } from '@/types/entities';

export function updateGame(deltaTime: number, inputState: InputState): void {
  const state = useGameStore.getState();

  if (state.phase !== 'playing') return;

  const levelConfig = getLevelConfig(state.level);

  // Update player position (follow mouse)
  const newPlayer: Partial<Player> = {
    position: { ...inputState.mousePosition },
  };

  // Find leprechaun under cursor when mouse is held down
  let drainTargetId: string | null = null;

  if (inputState.isMouseDown) {
    // Check if mouse is over any leprechaun within drain range
    for (const leprechaun of state.leprechauns) {
      const dist = Math.sqrt(
        Math.pow(inputState.mousePosition.x - leprechaun.position.x, 2) +
        Math.pow(inputState.mousePosition.y - leprechaun.position.y, 2)
      );

      if (dist <= GAME_CONFIG.DRAIN_RANGE) {
        // Check if cursor is on the leprechaun
        if (isPointInCircle(
          inputState.mousePosition.x,
          inputState.mousePosition.y,
          leprechaun.position.x,
          leprechaun.position.y,
          leprechaun.size + 15 // Extra padding for easier targeting
        )) {
          drainTargetId = leprechaun.id;
          break;
        }
      }
    }
  }

  newPlayer.isDraining = drainTargetId !== null;
  newPlayer.drainTargetId = drainTargetId;

  // Update unicorns
  const updatedUnicorns = state.unicorns.map((u) =>
    updateUnicornWander(u, deltaTime)
  );

  // Update leprechauns and handle draining
  const harvestedLeprechauns: string[] = [];
  const updatedLeprechauns = state.leprechauns.map((leprechaun) => {
    // Update movement
    let updated = updateLeprechaunMovement(leprechaun, state.potOfGold.position, deltaTime);

    // Check if this leprechaun is being drained
    if (drainTargetId === leprechaun.id) {
      const newProgress = updated.drainProgress + deltaTime * GAME_CONFIG.DRAIN_SPEED;

      if (newProgress >= updated.maxDrainTime) {
        // Leprechaun fully drained - mark for harvest
        harvestedLeprechauns.push(leprechaun.id);
      }

      updated = {
        ...updated,
        drainProgress: newProgress,
        isBeingDrained: true,
      };
    } else {
      // Not being drained - slowly recover (but don't go below 0)
      updated = {
        ...updated,
        drainProgress: Math.max(0, updated.drainProgress - deltaTime * 0.3),
        isBeingDrained: false,
      };
    }

    return updated;
  });

  // Handle harvested leprechauns
  for (const id of harvestedLeprechauns) {
    useGameStore.getState().harvestLeprechaun(id);
  }

  // Check collisions (unicorns caught by net, leprechauns reaching pot)
  const collisions = checkCollisions(
    { ...state.player, ...newPlayer } as Player,
    updatedUnicorns,
    updatedLeprechauns.filter(l => !harvestedLeprechauns.includes(l.id)),
    [], // No projectiles
    state.potOfGold
  );

  // Handle caught unicorns
  for (const id of collisions.unicornsCaught) {
    useGameStore.getState().catchUnicorn(id);
  }

  // Handle leprechauns that reached the pot (steal rainbow color)
  for (const id of collisions.leprechaunsReachedPot) {
    useGameStore.getState().stealRainbowColor(id);
  }

  // Remove collided/harvested entities from update lists
  const finalUnicorns = updatedUnicorns.filter(
    (u) => !collisions.unicornsCaught.includes(u.id)
  );
  const finalLeprechauns = updatedLeprechauns.filter(
    (l) =>
      !harvestedLeprechauns.includes(l.id) &&
      !collisions.leprechaunsReachedPot.includes(l.id)
  );

  // Handle spawning
  let newUnicornTimer = state.unicornSpawnTimer + deltaTime;
  let newLeprechaunTimer = state.leprechaunSpawnTimer + deltaTime;

  if (
    newUnicornTimer >= levelConfig.unicornSpawnRate &&
    finalUnicorns.length < levelConfig.maxUnicorns
  ) {
    const unicorn = createUnicorn(
      levelConfig.unicornGoldValue,
      levelConfig.unicornSpeed
    );
    finalUnicorns.push(unicorn);
    newUnicornTimer = 0;
  }

  if (
    newLeprechaunTimer >= levelConfig.leprechaunSpawnRate &&
    finalLeprechauns.length < levelConfig.maxLeprechauns
  ) {
    const leprechaun = createLeprechaun(levelConfig.leprechaunSpeed);
    finalLeprechauns.push(leprechaun);
    newLeprechaunTimer = 0;
  }

  // Bulk update entities
  useGameStore.getState().updateEntities({
    player: newPlayer,
    unicorns: finalUnicorns,
    leprechauns: finalLeprechauns,
    unicornSpawnTimer: newUnicornTimer,
    leprechaunSpawnTimer: newLeprechaunTimer,
  });
}
