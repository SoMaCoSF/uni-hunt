# Unicorn Hunt

A fun arcade game where you catch unicorns with a rainbow net while defending your pot of gold from mischievous leprechauns!

## How to Play

- **Move your mouse** to control the rainbow net
- **Catch unicorns** by moving the net over them - earn gold!
- **Click to shoot** projectiles at leprechauns before they reach your pot
- **Defend your rainbow** - leprechauns steal colors when they reach the pot
- **Lose all 7 colors** = Game Over
- **Collect enough gold** to complete each level

## Controls

| Action | Control |
|--------|---------|
| Move net | Mouse movement |
| Shoot | Left click |
| Pause/Resume | ESC key |

## Game Mechanics

### Rainbow Health (ROYGBIV)
Your rainbow has 7 colors: Red, Orange, Yellow, Green, Blue, Indigo, Violet. Each leprechaun that reaches the pot of gold steals one color. Lose all colors and it's game over!

### Entities
- **Unicorns** - White creatures with golden horns and rainbow manes. Wander around the arena.
- **Leprechauns** - Green creatures with hats and orange beards. Move directly toward your pot of gold.
- **Pot of Gold** - Located at the center. Defend it at all costs!

### Levels
Each level requires collecting more gold with faster and more numerous enemies.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

Or use Vercel CLI:
```bash
npx vercel
```

## Tech Stack

- Next.js 15
- TypeScript
- Zustand (state management)
- HTML5 Canvas (rendering)
- Tailwind CSS (UI styling)

## License

MIT
