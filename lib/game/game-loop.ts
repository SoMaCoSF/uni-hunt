// ==============================================================================
// file_id: SOM-SCR-0005-v0.3.0
// name: game-loop.ts
// description: Main game loop update logic - tap mechanic & boss battles
// project_id: UNI-HUNT
// category: game-logic
// tags: [game-loop, update, tick, tap, boss]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.3.0
// agent_id: AGENT-PRIME-002
// execution: import { updateGame, handleTap } from '@/lib/game/game-loop'
// ==============================================================================

import { useGameStore, RainDrop, LightningBolt } from '@/stores/gameStore';
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
import { Player, Leprechaun, Boss } from '@/types/entities';
import { Vector2 } from '@/types/game';

// Handle tap/click on entities
export function handleTap(tapPosition: Vector2): void {
  const state = useGameStore.getState();
  if (state.phase !== 'playing') return;

  const currentTime = performance.now() / 1000;

  // Check if tapping on boss
  if (state.boss) {
    const distToBoss = Math.sqrt(
      Math.pow(tapPosition.x - state.boss.position.x, 2) +
      Math.pow(tapPosition.y - state.boss.position.y, 2)
    );
    if (distToBoss <= GAME_CONFIG.BOSS_TAP_RADIUS) {
      useGameStore.getState().damageBoss(GAME_CONFIG.BOSS_DAMAGE_PER_TAP);
      return;
    }
  }

  // Check if tapping on leprechauns
  for (const leprechaun of state.leprechauns) {
    const dist = Math.sqrt(
      Math.pow(tapPosition.x - leprechaun.position.x, 2) +
      Math.pow(tapPosition.y - leprechaun.position.y, 2)
    );

    if (dist <= GAME_CONFIG.TAP_RADIUS) {
      // Tap hit this leprechaun
      const newTapCount = leprechaun.tapCount + 1;

      if (newTapCount >= leprechaun.tapsRequired) {
        // Leprechaun defeated!
        useGameStore.getState().harvestLeprechaun(leprechaun.id);
      } else {
        // Update tap count and stun
        const updatedLeprechauns = state.leprechauns.map((l) =>
          l.id === leprechaun.id
            ? {
                ...l,
                tapCount: newTapCount,
                lastTapTime: currentTime,
                stunTimer: GAME_CONFIG.STUN_DURATION,
                isStunned: true,
              }
            : l
        );
        useGameStore.getState().updateEntities({ leprechauns: updatedLeprechauns });
      }
      return; // Only tap one entity at a time
    }
  }
}

// Generate rain drops
function generateRainDrops(intensity: number, existing: RainDrop[]): RainDrop[] {
  const targetCount = Math.floor(intensity * 100);
  const drops = [...existing];

  // Add new drops
  while (drops.length < targetCount) {
    drops.push({
      x: Math.random() * GAME_CONFIG.CANVAS_WIDTH,
      y: -10,
      speed: 300 + Math.random() * 200,
      length: 10 + Math.random() * 20,
    });
  }

  return drops;
}

// Update rain drops
function updateRainDrops(drops: RainDrop[], deltaTime: number): RainDrop[] {
  return drops
    .map((drop) => ({
      ...drop,
      y: drop.y + drop.speed * deltaTime,
    }))
    .filter((drop) => drop.y < GAME_CONFIG.CANVAS_HEIGHT + 50);
}

// Generate lightning bolt points
function generateLightningPoints(start: Vector2, end: Vector2): Vector2[] {
  const points: Vector2[] = [start];
  const segments = 8;
  const dx = (end.x - start.x) / segments;
  const dy = (end.y - start.y) / segments;

  for (let i = 1; i < segments; i++) {
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 20;
    points.push({
      x: start.x + dx * i + offsetX,
      y: start.y + dy * i + offsetY,
    });
  }
  points.push(end);
  return points;
}

// Update boss logic
function updateBoss(boss: Boss, deltaTime: number, state: ReturnType<typeof useGameStore.getState>): {
  boss: Partial<Boss>;
  rainDrops: RainDrop[];
  thunderFlash: number;
  lightningBolts: LightningBolt[];
  hurricaneAngle: number;
  screenShake: Vector2;
  shouldThrowEntities: boolean;
} {
  const levelConfig = getLevelConfig(state.level);
  const bossConfig = levelConfig.bossConfig!;

  // Update rain
  let rainDrops = generateRainDrops(boss.rainIntensity, state.rainDrops);
  rainDrops = updateRainDrops(rainDrops, deltaTime);

  // Update thunder timer
  let thunderTimer = boss.thunderTimer + deltaTime;
  let thunderFlash = state.thunderFlash;
  let screenShake = state.screenShake;

  if (thunderTimer >= bossConfig.thunderFrequency) {
    thunderTimer = 0;
    thunderFlash = 1.0; // Flash intensity
    screenShake = { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 };
  } else {
    thunderFlash = Math.max(0, state.thunderFlash - deltaTime * 3);
    screenShake = {
      x: screenShake.x * 0.9,
      y: screenShake.y * 0.9,
    };
  }

  // Update lightning bolts
  let lightningBolts = state.lightningBolts.map((bolt) => {
    if (bolt.isWarning) {
      const newWarningTimer = bolt.warningTimer - deltaTime;
      if (newWarningTimer <= 0) {
        // Strike!
        const startPos = { x: bolt.targetPos!.x, y: 0 };
        return {
          ...bolt,
          isWarning: false,
          points: generateLightningPoints(startPos, bolt.targetPos!),
          alpha: 1,
        };
      }
      return { ...bolt, warningTimer: newWarningTimer };
    } else {
      // Fade out
      return { ...bolt, alpha: bolt.alpha - deltaTime * 4 };
    }
  }).filter((bolt) => bolt.alpha > 0 || bolt.isWarning);

  // Boss attack timer for lightning
  let attackTimer = boss.attackTimer + deltaTime;
  if (bossConfig.lightningEnabled && attackTimer >= boss.attackCooldown) {
    attackTimer = 0;
    // Target player position
    const targetPos = { ...state.player.position };
    useGameStore.getState().triggerLightning(targetPos);
  }

  // Hurricane rotation and throwing
  let hurricaneAngle = boss.hurricaneAngle;
  let shouldThrowEntities = false;
  if (bossConfig.hurricaneEnabled) {
    hurricaneAngle += boss.hurricaneSpeed * deltaTime;
    // Throw entities periodically
    if (Math.random() < deltaTime * 0.5) {
      shouldThrowEntities = true;
    }
  }

  // Boss movement (sway side to side)
  const newX = GAME_CONFIG.CANVAS_WIDTH / 2 + Math.sin(performance.now() / 1000) * 100;

  return {
    boss: {
      position: { x: newX, y: boss.position.y },
      thunderTimer,
      attackTimer,
      hurricaneAngle,
    },
    rainDrops,
    thunderFlash,
    lightningBolts,
    hurricaneAngle,
    screenShake,
    shouldThrowEntities,
  };
}

export function updateGame(deltaTime: number, inputState: InputState): void {
  const state = useGameStore.getState();

  if (state.phase !== 'playing') return;

  const levelConfig = getLevelConfig(state.level);
  const currentTime = performance.now() / 1000;

  // Update player position (follow mouse/touch)
  const newPlayer: Partial<Player> = {
    position: { ...inputState.mousePosition },
  };

  // Update unicorns
  const updatedUnicorns = state.unicorns.map((u) =>
    updateUnicornWander(u, deltaTime)
  );

  // Update leprechauns
  const updatedLeprechauns = state.leprechauns.map((leprechaun) =>
    updateLeprechaunMovement(leprechaun, state.potOfGold.position, deltaTime, currentTime)
  );

  // Check collisions (unicorns caught by net, leprechauns reaching pot)
  const collisions = checkCollisions(
    { ...state.player, ...newPlayer } as Player,
    updatedUnicorns,
    updatedLeprechauns,
    [],
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

  // Remove collided entities from update lists
  const finalUnicorns = updatedUnicorns.filter(
    (u) => !collisions.unicornsCaught.includes(u.id)
  );
  const finalLeprechauns = updatedLeprechauns.filter(
    (l) => !collisions.leprechaunsReachedPot.includes(l.id)
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

  // Update boss if present
  let bossUpdates = {};
  if (state.boss) {
    const bossResult = updateBoss(state.boss, deltaTime, state);
    bossUpdates = {
      boss: bossResult.boss,
      rainDrops: bossResult.rainDrops,
      thunderFlash: bossResult.thunderFlash,
      lightningBolts: bossResult.lightningBolts,
      hurricaneAngle: bossResult.hurricaneAngle,
      screenShake: bossResult.screenShake,
    };

    if (bossResult.shouldThrowEntities) {
      useGameStore.getState().hurricaneThrow();
    }

    // Check lightning hits on player
    for (const bolt of state.lightningBolts) {
      if (!bolt.isWarning && bolt.alpha > 0.5 && bolt.targetPos) {
        const distToPlayer = Math.sqrt(
          Math.pow(state.player.position.x - bolt.targetPos.x, 2) +
          Math.pow(state.player.position.y - bolt.targetPos.y, 2)
        );
        if (distToPlayer < 40) {
          // Player hit by lightning - steal a color
          useGameStore.getState().stealRainbowColor('lightning');
        }
      }
    }
  }

  // Bulk update entities
  useGameStore.getState().updateEntities({
    player: newPlayer,
    unicorns: finalUnicorns,
    leprechauns: finalLeprechauns,
    unicornSpawnTimer: newUnicornTimer,
    leprechaunSpawnTimer: newLeprechaunTimer,
    ...bossUpdates,
  });
}
