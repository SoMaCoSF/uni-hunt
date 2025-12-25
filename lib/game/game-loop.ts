// ==============================================================================
// file_id: SOM-SCR-0005-v0.1.0
// name: game-loop.ts
// description: Main game loop update logic
// project_id: UNI-HUNT
// category: game-logic
// tags: [game-loop, update, tick]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { updateGame } from '@/lib/game/game-loop'
// ==============================================================================

import { useGameStore } from '@/stores/gameStore';
import { getLevelConfig } from '@/lib/config/level-config';
import { checkCollisions } from './collision';
import {
  createUnicorn,
  createLeprechaun,
  createProjectile,
  updateUnicornWander,
  updateLeprechaunMovement,
  updateProjectile,
  isProjectileExpired,
} from './spawning';
import { InputState } from './input';
import { GAME_CONFIG } from '@/lib/config/game-config';
import { Player } from '@/types/entities';

export function updateGame(deltaTime: number, inputState: InputState): void {
  const state = useGameStore.getState();

  if (state.phase !== 'playing') return;

  const levelConfig = getLevelConfig(state.level);

  // Update player position (follow mouse)
  const newPlayer: Partial<Player> = {
    position: { ...inputState.mousePosition },
    shootCooldown: Math.max(0, state.player.shootCooldown - deltaTime),
  };

  // Handle shooting
  if (inputState.justClicked && state.player.shootCooldown <= 0) {
    const projectile = createProjectile(
      state.player.position.x,
      state.player.position.y,
      inputState.mousePosition.x,
      inputState.mousePosition.y
    );
    useGameStore.getState().addProjectile(projectile);
    newPlayer.shootCooldown = GAME_CONFIG.PLAYER_SHOOT_COOLDOWN;
  }

  // Update unicorns
  const updatedUnicorns = state.unicorns.map((u) =>
    updateUnicornWander(u, deltaTime)
  );

  // Update leprechauns
  const updatedLeprechauns = state.leprechauns.map((l) =>
    updateLeprechaunMovement(l, state.potOfGold.position, deltaTime)
  );

  // Update projectiles
  let updatedProjectiles = state.projectiles
    .map((p) => updateProjectile(p, deltaTime))
    .filter((p) => !isProjectileExpired(p));

  // Check collisions
  const collisions = checkCollisions(
    { ...state.player, ...newPlayer } as Player,
    updatedUnicorns,
    updatedLeprechauns,
    updatedProjectiles,
    state.potOfGold
  );

  // Handle caught unicorns
  for (const id of collisions.unicornsCaught) {
    useGameStore.getState().catchUnicorn(id);
  }

  // Handle killed leprechauns
  for (const id of collisions.leprechaunsKilled) {
    useGameStore.getState().killLeprechaun(id);
  }

  // Handle leprechauns that reached the pot (steal rainbow color)
  for (const id of collisions.leprechaunsReachedPot) {
    useGameStore.getState().stealRainbowColor(id);
  }

  // Remove collided entities from update lists
  const finalUnicorns = updatedUnicorns.filter(
    (u) => !collisions.unicornsCaught.includes(u.id)
  );
  const finalLeprechauns = updatedLeprechauns.filter(
    (l) =>
      !collisions.leprechaunsKilled.includes(l.id) &&
      !collisions.leprechaunsReachedPot.includes(l.id)
  );
  updatedProjectiles = updatedProjectiles.filter(
    (p) => !collisions.projectilesToRemove.includes(p.id)
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
    projectiles: updatedProjectiles,
    unicornSpawnTimer: newUnicornTimer,
    leprechaunSpawnTimer: newLeprechaunTimer,
  });
}
