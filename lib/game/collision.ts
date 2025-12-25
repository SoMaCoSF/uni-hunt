// ==============================================================================
// file_id: SOM-SCR-0002-v0.1.0
// name: collision.ts
// description: Collision detection utilities
// project_id: UNI-HUNT
// category: game-logic
// tags: [collision, physics, detection]
// created: 2025-12-25
// modified: 2025-12-25
// version: 0.1.0
// agent_id: AGENT-PRIME-002
// execution: import { circleCollision, checkCollisions } from '@/lib/game/collision'
// ==============================================================================

import { Vector2 } from '@/types/game';
import { Player, Unicorn, Leprechaun, Projectile, PotOfGold } from '@/types/entities';

interface CircleEntity {
  position: Vector2;
  size: number;
}

export function circleCollision(a: CircleEntity, b: CircleEntity): boolean {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.size + b.size;
}

export function pointInCircle(point: Vector2, circle: CircleEntity): boolean {
  const dx = point.x - circle.position.x;
  const dy = point.y - circle.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle.size;
}

export interface CollisionResults {
  unicornsCaught: string[];
  leprechaunsKilled: string[];
  leprechaunsReachedPot: string[];
  projectilesToRemove: string[];
}

export function checkCollisions(
  player: Player,
  unicorns: Unicorn[],
  leprechauns: Leprechaun[],
  projectiles: Projectile[],
  potOfGold: PotOfGold
): CollisionResults {
  const results: CollisionResults = {
    unicornsCaught: [],
    leprechaunsKilled: [],
    leprechaunsReachedPot: [],
    projectilesToRemove: [],
  };

  // Player net vs Unicorns (catching)
  for (const unicorn of unicorns) {
    if (
      circleCollision(
        { position: player.position, size: player.netRadius },
        unicorn
      )
    ) {
      results.unicornsCaught.push(unicorn.id);
    }
  }

  // Projectiles vs Leprechauns (killing)
  for (const projectile of projectiles) {
    for (const leprechaun of leprechauns) {
      if (circleCollision(projectile, leprechaun)) {
        results.leprechaunsKilled.push(leprechaun.id);
        results.projectilesToRemove.push(projectile.id);
      }
    }
  }

  // Leprechauns vs Pot of Gold (stealing)
  for (const leprechaun of leprechauns) {
    if (circleCollision(leprechaun, potOfGold)) {
      results.leprechaunsReachedPot.push(leprechaun.id);
    }
  }

  return results;
}

export function distanceBetween(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalizeVector(v: Vector2): Vector2 {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: v.x / length, y: v.y / length };
}
