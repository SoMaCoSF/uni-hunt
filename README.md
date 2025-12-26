# Unicorn Hunt

A fun arcade game where you catch unicorns with a rainbow net while defending your pot of gold from mischievous leprechauns!

## How to Play

- **Control your rainbow net**: Move your mouse (desktop) or tap near position (mobile)
- **Catch unicorns**: Move the net over them to earn gold and charge power-ups
- **Tap to drain leprechauns**: Click/tap on leprechauns 5 times to banish them (tap count scales: 3→6→9 per level)
- **Restore rainbow colors**: Every 3 leprechauns banished = restore 1 color!
- **Charge power-up blast**: Catch 9 unicorns to trigger a 9-laser rainbow blast attack
- **Defend your rainbow**: Leprechauns that reach the pot steal colors
- **Lose all 7 colors** = Game Over
- **Complete 9 levels** including 3 epic boss battles to win!

## Controls

| Action | Control |
|--------|---------|
| Move net | Mouse movement (desktop) / Tap near position (mobile) |
| Drain leprechaun | Left click/tap (5 times to banish - scales by level) |
| Charge power-up | Catch unicorns (9 needed for rainbow blast) |
| Pause/Resume | ESC key |

## Game Mechanics

### Tap-to-Drain System
Leprechauns are banished by tapping/clicking them repeatedly:
- **Levels 1-3**: 3 taps required
- **Levels 4-6**: 6 taps required
- **Levels 7-9**: 9 taps required
- Each tap drains the leprechaun, slowing it briefly
- Visual tap counter appears above leprechaun
- Banished leprechauns fade and award 100 points

### Rainbow Health & Restoration (ROYGBIV)
Your rainbow has 7 colors: **R**ed, **O**range, **Y**ellow, **G**reen, **B**lue, **I**ndigo, **V**iolet

**Color Loss**: Each leprechaun that reaches the pot steals 1 color (from right to left: Violet first)

**Color Restoration**: Every 3 leprechauns banished = restore 1 color! This rewards active play and gives you a second chance.

**Game Over**: Lose all 7 colors = Game Over

### Power-Up Blast System
- Catch **9 unicorns** to charge the power-up meter
- Automatically activates when charged
- Shoots **9 rainbow lasers** in all directions
- Damages multiple leprechauns and bosses simultaneously
- Creates screen shake and visual effects
- Highly effective against boss attacks

### Boss Battles
Fight 3 epic boss battles with unique mechanics:

**Level 3 - Storm Cloud**:
- Summons rain and thunder attacks
- 54 HP (9 taps at 6 damage each)
- Rain slows visibility

**Level 6 - Lightning Lord**:
- All Storm Cloud attacks PLUS lightning strikes
- 108 HP (18 taps)
- Lightning targets player position with warning indicators

**Level 9 - Hurricane King** (FINAL BOSS):
- Full power: Rain + Thunder + Lightning + Hurricane winds
- 162 HP (27 taps)
- Hurricane throws entities around the arena
- Spiral visual effects
- Ultimate challenge!

### Entities
- **Unicorns** - Shimmery creatures with rainbow auras, orbiting sparkles, and glowing horns. Wander around the arena. Catch them for gold!
- **Leprechauns** - Green creatures with evil auras. Move directly toward your pot of gold. Tap them to drain and banish!
- **Pot of Gold** - Located at the center with 3D coins and sparkle effects. Defend it at all costs!
- **Bosses** - Massive cloud entities with weather powers. Tap them repeatedly to defeat!

### Levels & Progression
**9 total levels** with increasing difficulty:
- **Levels 1-2**: Tutorial & ramp-up (3-tap leprechauns, slower enemies)
- **Level 3**: 🌩️ BOSS - Storm Cloud
- **Levels 4-5**: Intense action (6-tap leprechauns, faster enemies)
- **Level 6**: ⚡ BOSS - Lightning Lord
- **Levels 7-8**: Very hard (9-tap leprechauns, high spawn rates)
- **Level 9**: 🌀 FINAL BOSS - Hurricane King

Each level increases:
- Gold required to complete
- Enemy spawn rates
- Enemy movement speed
- Leprechaun tap requirements

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
