# Phaser Error Page Games

📍 **Full Documentation:** [ROADMAP.md Features](../../ROADMAP.md#music--compositions)

## Status: ⏳ **PLANNED** (After Phase 3)

**Estimated Effort:** 7-9 days (full implementation) | 4-5 days (MVP)
**Priority:** LOW (Feature enhancement, not core functionality)
**Dependencies:** Phase 3 (Performance) completion recommended

---

## 🎯 Overview

Transform error pages (404, 500) and maintenance pages from frustrating dead-ends into delightful, engaging experiences through browser-based mini-games. This feature showcases technical range (2D/3D graphics, physics, game state management) while providing genuine value to users experiencing errors or downtime.

### Vision Statement

> "Turn every 404 into an opportunity to play, every maintenance window into a moment of delight."

### Strategic Value

**Portfolio Differentiation:**
- Unique feature rarely seen in developer portfolios
- Memorable talking point in interviews and networking
- Demonstrates creativity beyond typical web development

**Technical Showcase:**
- 2D Canvas rendering (Breakout, Sokoban, Boggle)
- 3D graphics with Three.js reuse (Rubik's Cube)
- Game physics and state management (Yahtzee, Breakout)
- Performance optimization (lazy loading, bundle splitting)

**User Experience:**
- Reduces frustration during errors
- Increases time-on-site metrics
- Creates shareable moments (viral potential)

---

## 🎮 Game Specifications

### Game 1: Breakout

**Platforms:** 404 Error Page, 500 Server Error Page
**Genre:** Arcade / Physics
**Session Length:** 1-3 minutes
**Difficulty:** Easy to moderate

#### Gameplay
Classic brick-breaker mechanics:
- Paddle controlled by mouse/keyboard (desktop) or touch drag (mobile)
- Ball bounces off paddle, walls, and blocks
- Clear all blocks to win
- Lives system (3 balls)

#### Themes

**404 Theme (Blue/Lost):**
```
Blocks labeled: "index", "about", "blog", "projects", "contact"
Background: Atmospheric blue (matching your troposphere layer)
Message: "Help us break through to find your page!"
Score display: "Pages Found: X"
```

**500 Theme (Red/Error):**
```
Blocks labeled: "500", "ERR", "FAIL", "!!!", "CRASH"
Background: Aggressive red/orange (warning colors)
Message: "Break through the server errors!"
Score display: "Errors Cleared: X"
```

#### Technical Specs
- **Engine:** Pure Canvas 2D (no Phaser needed)
- **Bundle Size:** ~25KB
- **Physics:** Custom collision detection
- **Controls:** Mouse, Keyboard (arrows/WASD), Touch
- **Mobile:** Touch drag paddle, tap to launch ball

#### Features
- Particle effects on block destruction (reuse your GSAP knowledge)
- Sound effects (optional, use Web Audio API)
- Progressive difficulty (ball speed increases)
- Easter egg: Complete game reveals secret portfolio section link

---

### Game 2: Rubik's Cube

**Platform:** Maintenance Page
**Genre:** Puzzle / 3D
**Session Length:** 5-30 minutes
**Difficulty:** Moderate to hard

#### Gameplay
Interactive 3x3x3 Rubik's Cube:
- Click and drag faces to rotate
- Solve the cube while waiting for maintenance
- One face displays "ETA: X min" (live countdown)
- Solving reveals easter egg message

#### Visual Design
```
Cube faces themed by portfolio sections:
- Red face: Hero section
- Blue face: Projects
- Green face: Skills
- Yellow face: Experience
- Orange face: Blog
- White face: Contact (with ETA overlay)
```

#### Technical Specs
- **Engine:** Three.js (REUSE existing setup from ThreeJSScene.tsx)
- **Bundle Size:** ~5KB (Three.js already loaded)
- **Controls:** Mouse drag, touch swipe
- **State Management:** 54 cubies (9 per face × 6 faces)
- **Algorithm:** Singmaster notation for rotations

#### Features
- Smooth rotation animations (GSAP integration)
- Scramble button (applies random moves)
- Reset button (return to solved state)
- Move counter display
- Device capability detection (disable on low-end devices)
- Fallback to Boggle on mobile (better touch experience)

#### Integration with Existing Systems
```typescript
// Reuse from your existing codebase:
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { ATMOSPHERIC_COLORS } from '@/config/colors';

// Use performance tier to adjust cube quality
const { performanceTier } = useDeviceCapabilities();
const cubeQuality = performanceTier === 'high' ? 'hd' : 'standard';
```

---

### Game 3: Sokoban

**Platform:** 404 Error Page (Alternative option)
**Genre:** Puzzle / Logic
**Session Length:** 2-5 minutes per level
**Difficulty:** Easy to moderate

#### Gameplay
Classic Sokoban (warehouse puzzle):
- Push boxes to target locations
- Cannot pull boxes (only push)
- Undo move functionality
- 5 thematic levels

#### Theme: "File System Navigation"
```
Player: 👨‍💻 (Developer character)
Boxes: 📦 (Lost files)
Targets: 📁 (Correct directory)
Walls: 🧱 (Restricted access)

Level 1: "Home Directory" (4 boxes)
Level 2: "Documents Folder" (6 boxes)
Level 3: "Node Modules" (8 boxes)
Level 4: "Git Repository" (10 boxes)
Level 5: "Production Server" (12 boxes)
```

#### Technical Specs
- **Engine:** DOM-based or Canvas
- **Bundle Size:** ~20KB
- **Controls:** Arrow keys, WASD, on-screen buttons (mobile)
- **State Management:** Grid-based (2D array)
- **Undo:** Move stack (array of previous states)

#### Features
- Move counter
- Optimal solution hint system
- Level selector (unlock progressively)
- Pixel art graphics (match your design system)
- LocalStorage progress saving

---

### Game 4: Boggle

**Platform:** Maintenance Page (Mobile-friendly alternative)
**Genre:** Word / Puzzle
**Session Length:** 3 minutes per round
**Difficulty:** Easy

#### Gameplay
Tech-themed word search:
- 4×4 grid of letters
- Find words by connecting adjacent letters
- Tech vocabulary focus (API, JSON, CSS, etc.)
- 3-minute timer per round

#### Word Dictionary
```javascript
// Curated tech terms (200-300 words)
const techWords = [
  'API', 'CSS', 'HTML', 'JSON', 'REST', 'AJAX',
  'NODE', 'REACT', 'VUE', 'GIT', 'NPM', 'CLI',
  'DOCKER', 'REDIS', 'MONGO', 'ASTRO', 'VITE',
  // ... more words
];
```

#### Technical Specs
- **Engine:** Canvas for grid, DOM for UI
- **Bundle Size:** ~60KB (includes word dictionary)
- **Algorithm:** Trie data structure for word lookup
- **Scoring:** Word length × rarity multiplier

#### Features
- Word highlight animation
- Score multipliers for rare words
- Word history display
- Share score (copy to clipboard)
- Infinite replayability (random grids)

---

### Game 5: Yahtzee

**Platform:** General Error/Offline Page
**Genre:** Dice / Strategy
**Session Length:** 10-20 minutes
**Difficulty:** Easy (familiar rules)

#### Gameplay
Classic Yahtzee dice game:
- Roll 5 dice up to 3 times per turn
- Choose dice to keep between rolls
- 13 scoring categories
- Bonus for upper section ≥63 points

#### Visual Design
```
Minimal, clean interface:
- Large, readable dice (SVG)
- Clear scorecard table
- Highlighted available categories
- Current roll display
```

#### Technical Specs
- **Engine:** DOM-based (no Canvas needed)
- **Bundle Size:** ~15KB
- **State Management:** Game state object (13 categories, current roll)
- **Animation:** GSAP for dice roll
- **Storage:** LocalStorage for best score

#### Features
- Dice roll animation (3D rotation effect)
- Auto-calculate best category suggestion
- Rules tooltip/modal
- Best score tracking
- Works completely offline (PWA compatible)

---

## 🏗️ Technical Architecture

### Directory Structure

```
apps/portfolio/src/
├── pages/
│   ├── 404.astro                    # Breakout or Sokoban
│   ├── 500.astro                    # Breakout (red theme)
│   └── maintenance.astro            # Rubik's Cube or Boggle
│
├── components/error-games/
│   ├── GameLauncher.tsx             # Lazy loading wrapper
│   ├── GameSelector.tsx             # UI for choosing games
│   │
│   ├── breakout/
│   │   ├── Breakout.tsx             # Main component
│   │   ├── useBreakoutPhysics.ts   # Physics hook
│   │   ├── useBreakoutControls.ts  # Input handling
│   │   ├── BreakoutCanvas.tsx      # Canvas renderer
│   │   └── themes/
│   │       ├── 404-theme.ts        # Blue/lost blocks
│   │       └── 500-theme.ts        # Red/error blocks
│   │
│   ├── rubiks-cube/
│   │   ├── RubiksCube.tsx          # Main component
│   │   ├── useRubiksState.ts       # Cube state management
│   │   ├── CubeControls.tsx        # Rotation controls
│   │   ├── CubeRenderer.tsx        # Three.js scene
│   │   └── algorithms/
│   │       ├── scramble.ts         # Random moves
│   │       └── notation.ts         # Singmaster notation
│   │
│   ├── sokoban/
│   │   ├── Sokoban.tsx             # Main component
│   │   ├── useSokobanState.ts      # Game state
│   │   ├── SokobanGrid.tsx         # Grid renderer
│   │   ├── SokobanControls.tsx     # Movement controls
│   │   └── levels/
│   │       ├── 404-levels.ts       # Thematic puzzles
│   │       └── level-validator.ts  # Solution checker
│   │
│   ├── boggle/
│   │   ├── Boggle.tsx              # Main component
│   │   ├── useBoggleState.ts       # Word tracking
│   │   ├── BoggleGrid.tsx          # Letter grid
│   │   ├── WordList.tsx            # Found words display
│   │   └── dictionary/
│   │       ├── tech-words.ts       # Tech vocabulary
│   │       └── trie.ts             # Efficient lookup
│   │
│   ├── yahtzee/
│   │   ├── Yahtzee.tsx             # Main component
│   │   ├── useYahtzeeState.ts      # Game state
│   │   ├── useDiceRoller.ts        # Dice mechanics
│   │   ├── DiceDisplay.tsx         # Animated dice
│   │   ├── Scorecard.tsx           # Score table
│   │   └── YahtzeeRules.tsx        # Rules modal
│   │
│   ├── shared/
│   │   ├── GameUI.tsx              # Common UI components
│   │   ├── GameAudio.ts            # Sound effects
│   │   ├── useGameStorage.ts       # LocalStorage hook
│   │   └── analytics.ts            # Track play events
│   │
│   └── types/
│       ├── breakout.ts
│       ├── rubiks-cube.ts
│       ├── sokoban.ts
│       ├── boggle.ts
│       └── yahtzee.ts
```

### State Management Pattern

```typescript
// Example: Breakout state hook
interface BreakoutState {
  paddle: { x: number; width: number; speed: number };
  ball: { x: number; y: number; dx: number; dy: number };
  blocks: Block[];
  score: number;
  lives: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'won' | 'lost';
}

function useBreakoutState(theme: '404' | '500') {
  const [state, setState] = useState<BreakoutState>(initialState);

  // Game loop
  useEffect(() => {
    if (state.gameStatus !== 'playing') return;

    const gameLoop = setInterval(() => {
      setState(prev => updateGamePhysics(prev));
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [state.gameStatus]);

  return { state, actions };
}
```

### Lazy Loading Strategy

```typescript
// GameLauncher.tsx
import { lazy, Suspense } from 'react';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

const Breakout = lazy(() => import('./breakout/Breakout'));
const RubiksCube = lazy(() => import('./rubiks-cube/RubiksCube'));
const Sokoban = lazy(() => import('./sokoban/Sokoban'));
const Boggle = lazy(() => import('./boggle/Boggle'));
const Yahtzee = lazy(() => import('./yahtzee/Yahtzee'));

export function GameLauncher({ type, errorCode }: Props) {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const { canUseHeavyAnimations, performanceTier } = useDeviceCapabilities();

  // Auto-suggest game based on device
  const suggestedGame = useMemo(() => {
    if (errorCode === 404) return 'breakout';
    if (type === 'maintenance') {
      return canUseHeavyAnimations ? 'rubiks-cube' : 'boggle';
    }
    return 'yahtzee';
  }, [errorCode, type, canUseHeavyAnimations]);

  return (
    <div className="game-launcher">
      {!selectedGame ? (
        <GameSelector
          suggested={suggestedGame}
          onSelect={setSelectedGame}
        />
      ) : (
        <Suspense fallback={<GameLoading />}>
          {selectedGame === 'breakout' && <Breakout theme={errorCode} />}
          {selectedGame === 'rubiks-cube' && <RubiksCube />}
          {selectedGame === 'sokoban' && <Sokoban />}
          {selectedGame === 'boggle' && <Boggle />}
          {selectedGame === 'yahtzee' && <Yahtzee />}
        </Suspense>
      )}
    </div>
  );
}
```

### Integration with Existing Systems

**Reuse from Portfolio:**
```typescript
// Use existing utilities
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { ATMOSPHERIC_COLORS } from '@/config/colors';
import { lerp, clamp } from '@/utilities/math';
import { detectCollision } from '@/utilities/physics';

// Reuse Three.js setup for Rubik's Cube
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Use existing performance tier system
const { performanceTier, canUseHeavyAnimations } = useDeviceCapabilities();

// Disable 3D games on low-end devices
if (performanceTier === 'low') {
  // Suggest Boggle or Yahtzee instead of Rubik's Cube
}
```

---

## 📐 UX Flows

### 404 Page Flow

```
User lands on 404
    ↓
Error message displays prominently
    ↓
Game options appear below:
┌─────────────────────────────────────────┐
│  Oops! Page Not Found (404)             │
│                                         │
│  The page you're looking for doesn't    │
│  exist or has been moved.               │
│                                         │
│  While you're here, want to play?       │
│                                         │
│  ┌──────────────┐  ┌─────────────┐     │
│  │ 🎮 Breakout  │  │ 🧩 Sokoban  │     │
│  │ (Suggested)  │  │             │     │
│  └──────────────┘  └─────────────┘     │
│                                         │
│  or  [← Back to Home]                   │
└─────────────────────────────────────────┘
    ↓ (User clicks Breakout)
Game loads via lazy loading
    ↓
Full-screen game experience
    ↓
[Quit Game] button in corner → Returns to error page
    ↓ (User completes game)
Victory screen with easter egg link
```

### Maintenance Page Flow

```
User lands on maintenance page
    ↓
Maintenance message with ETA
    ↓
Game options with device-aware suggestions:
┌─────────────────────────────────────────┐
│  🔧 We'll be back soon!                 │
│                                         │
│  Estimated time: 2 hours                │
│  Last updated: 5 minutes ago            │
│                                         │
│  Pass the time with:                    │
│                                         │
│  Desktop Users:                         │
│  ┌───────────────┐  ┌──────────────┐   │
│  │ 🎲 Rubik's    │  │ 📝 Boggle    │   │
│  │    Cube       │  │              │   │
│  │ (Suggested)   │  │              │   │
│  └───────────────┘  └──────────────┘   │
│                                         │
│  Mobile Users: Boggle recommended       │
│                                         │
│  [Auto-refresh in 60s] [Refresh Now]    │
└─────────────────────────────────────────┘
    ↓ (User clicks Rubik's Cube)
3D cube loads with ETA on white face
    ↓
User solves cube (or gives up)
    ↓
Easter egg revealed: "Thanks for your patience!"
    ↓
Page auto-refreshes when maintenance complete
```

---

## 📦 Bundle Size Analysis

### Initial Page Load (No Games)
```
404.astro:          ~5KB   (HTML + basic styles)
GameLauncher:       ~8KB   (UI only, no game code)
Total:              ~13KB  (No impact on error page load time)
```

### Per-Game Bundle Sizes (Lazy Loaded)

| Game | Bundle Size | Dependencies | Notes |
|------|-------------|--------------|-------|
| Breakout | ~25KB | None (pure Canvas) | Includes physics |
| Rubik's Cube | ~5KB | Three.js (already loaded) | Minimal overhead |
| Sokoban | ~20KB | None | Grid logic |
| Boggle | ~60KB | Word dictionary (~50KB) | Largest bundle |
| Yahtzee | ~15KB | None | Dice logic |

**Total if all loaded:** ~125KB (will never happen - user picks one)
**Typical session:** 15-60KB (single game)

### Optimization Strategies

```typescript
// 1. Code splitting per game
const Breakout = lazy(() => import(
  /* webpackChunkName: "game-breakout" */
  './breakout/Breakout'
));

// 2. Compress word dictionary
import { decompressDictionary } from './dictionary/compress';
const words = decompressDictionary(compressedData); // 50KB → 20KB

// 3. Share common code
// All games use shared GameUI, GameAudio, analytics
// Extracted to separate chunk: ~10KB shared

// 4. Conditional loading
if (performanceTier === 'low') {
  // Don't even load Rubik's Cube chunk
  return <SimpleTextGame />;
}
```

### Performance Budget

```
Initial error page load:  < 20KB  ✅
Game chunk load:          < 70KB  ✅
Time to interactive:      < 1s    ✅
60 FPS gameplay:          Required ✅
Mobile performance:       Smooth   ✅
```

---

## 📋 Implementation Phases

### Phase 1: MVP - 404 Games Only (2-3 days)

**Goal:** Get 404 page games functional

**Tasks:**
- [ ] Create GameLauncher component (0.5 days)
  - Lazy loading setup
  - Game selection UI
  - Loading state
- [ ] Implement Breakout (1.5 days)
  - Canvas setup and rendering
  - Paddle controls (mouse + keyboard)
  - Ball physics (collision detection)
  - Block destruction
  - 404 theme (blue blocks)
  - Victory/loss conditions
- [ ] Implement Sokoban (1 day)
  - Grid-based rendering
  - Movement logic (arrow keys)
  - Box pushing mechanics
  - 5 thematic levels
  - Undo functionality
- [ ] Integration with 404.astro (0.25 days)
- [ ] Mobile testing and polish (0.25 days)

**Deliverables:**
- Working 404 page with 2 game options
- Responsive on mobile and desktop
- Lazy loaded (no performance impact)

**Success Criteria:**
- ✅ Games load in < 1 second
- ✅ 60 FPS gameplay on mid-tier devices
- ✅ Mobile touch controls work smoothly
- ✅ "Back to Home" button always accessible

---

### Phase 2: Maintenance Games (3-4 days)

**Goal:** Add games to maintenance page

**Tasks:**
- [ ] Implement Rubik's Cube (2 days)
  - Three.js scene setup (reuse existing patterns)
  - Cube model (27 cubies)
  - Rotation mechanics (mouse drag)
  - State management (Singmaster notation)
  - Scramble algorithm
  - ETA display on cube face
  - Victory detection
- [ ] Implement Boggle (1.5 days)
  - 4×4 letter grid generation
  - Word path selection UI
  - Trie data structure for validation
  - Tech word dictionary (200-300 words)
  - 3-minute timer
  - Score calculation
  - Found words list
- [ ] Device detection logic (0.25 days)
  - Auto-suggest Rubik's for desktop
  - Auto-suggest Boggle for mobile
  - Fallback for low-performance devices
- [ ] Integration with maintenance.astro (0.25 days)
- [ ] Polish and testing (0.5 days)

**Deliverables:**
- Maintenance page with 2 game options
- Device-aware game suggestions
- Live ETA integration

**Success Criteria:**
- ✅ Rubik's Cube runs at 60 FPS on desktop
- ✅ Boggle works smoothly on mobile
- ✅ Auto-suggest works correctly
- ✅ ETA updates reflected in real-time

---

### Phase 3: Additional Games (2 days) - OPTIONAL

**Goal:** Complete the game suite

**Tasks:**
- [ ] Breakout 500 theme (0.5 days)
  - Red/orange color scheme
  - Aggressive block labels
  - Updated messaging
- [ ] Implement Yahtzee (1.5 days)
  - Dice rolling mechanics
  - Scorecard UI (13 categories)
  - Turn management
  - Best score tracking
  - Rules modal
- [ ] Integration with 500.astro and general error pages (0.25 days)
- [ ] Final testing (0.25 days)

**Deliverables:**
- Complete 5-game suite
- All error pages covered

**Success Criteria:**
- ✅ All 5 games functional
- ✅ Consistent UX across all games
- ✅ No duplicate code

---

### Phase 4: Polish & Analytics (1 day)

**Goal:** Production-ready quality

**Tasks:**
- [ ] Add sound effects (0.25 days)
  - Block break sounds (Breakout)
  - Cube rotation sounds (Rubik's)
  - Dice roll sounds (Yahtzee)
  - Victory jingles
  - Mute toggle
- [ ] Analytics integration (0.25 days)
  - Track game launch rate
  - Track game completion rate
  - Track average play duration
  - Track game preference (which games are popular)
- [ ] Accessibility improvements (0.25 days)
  - Keyboard navigation for all games
  - Screen reader announcements
  - High contrast mode support
- [ ] Easter eggs (0.25 days)
  - Hidden messages on game completion
  - Secret portfolio section links
  - Developer console messages

**Deliverables:**
- Polished, production-ready games
- Analytics tracking
- Accessibility compliance

**Success Criteria:**
- ✅ WCAG AA compliance
- ✅ Analytics events firing correctly
- ✅ Sound effects enhance experience (not annoy)
- ✅ Easter eggs are discoverable but subtle

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Per Game:**
- [ ] Loads correctly on 404/500/maintenance page
- [ ] Controls respond to keyboard input
- [ ] Controls respond to mouse/touch input
- [ ] Game state persists correctly
- [ ] Victory condition works
- [ ] Loss condition works (where applicable)
- [ ] "Quit Game" button returns to error page
- [ ] No console errors
- [ ] 60 FPS on target devices

**Cross-Browser:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Cross-Device:**
- [ ] Desktop (1920×1080)
- [ ] Laptop (1366×768)
- [ ] Tablet (768×1024)
- [ ] Mobile (375×667)

**Performance:**
- [ ] Lazy loading works (check Network tab)
- [ ] No memory leaks (check Performance tab)
- [ ] Smooth animations (60 FPS)
- [ ] Bundle sizes within budget

### Automated Testing

```typescript
// Example: Breakout game tests
describe('Breakout Game', () => {
  it('should load game on button click', async () => {
    render(<GameLauncher errorCode={404} />);
    fireEvent.click(screen.getByText('Breakout'));
    await waitFor(() => {
      expect(screen.getByTestId('breakout-canvas')).toBeInTheDocument();
    });
  });

  it('should handle paddle movement', () => {
    const { container } = render(<Breakout theme="404" />);
    const canvas = container.querySelector('canvas');

    fireEvent.keyDown(canvas, { key: 'ArrowLeft' });
    // Assert paddle moved left

    fireEvent.keyDown(canvas, { key: 'ArrowRight' });
    // Assert paddle moved right
  });

  it('should detect ball-block collision', () => {
    const { result } = renderHook(() => useBreakoutPhysics('404'));

    act(() => {
      result.current.updateBallPosition();
    });

    // Assert collision detection works
  });
});
```

### E2E Testing (Playwright)

```typescript
// tests/error-games.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Error Page Games', () => {
  test('404 page shows game options', async ({ page }) => {
    await page.goto('/nonexistent-page');

    await expect(page.getByText('Page Not Found')).toBeVisible();
    await expect(page.getByText('Breakout')).toBeVisible();
    await expect(page.getByText('Sokoban')).toBeVisible();
  });

  test('can launch and quit Breakout game', async ({ page }) => {
    await page.goto('/404');

    await page.click('text=Breakout');
    await expect(page.locator('canvas')).toBeVisible();

    await page.click('text=Quit Game');
    await expect(page.getByText('Page Not Found')).toBeVisible();
  });

  test('Rubik\'s Cube loads on maintenance page', async ({ page }) => {
    await page.goto('/maintenance');

    await page.click('text=Rubik\'s Cube');
    await expect(page.locator('canvas')).toBeVisible();

    // Assert Three.js scene rendered
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveAttribute('width');
  });
});
```

---

## 📊 Success Metrics

### Engagement Metrics (Track via Vercel Analytics)

**Primary KPIs:**
- **Game Launch Rate:** % of error page visitors who click "Play Game"
  - Target: 15-30% (industry average for optional features: ~5%)
- **Average Play Duration:** Time spent in game before quitting
  - Target: 2-5 minutes (indicates engagement)
- **Completion Rate:** % of players who finish a game
  - Target: 30-50% for Breakout/Sokoban, 10-20% for Rubik's Cube

**Secondary Metrics:**
- **Game Preference:** Which games are most popular
- **Device Distribution:** Desktop vs mobile game launches
- **Return Rate:** Do users play again on subsequent errors?
- **Bounce Rate:** Do games reduce immediate exits from error pages?

### Technical Metrics

**Performance:**
- Initial page load: < 500ms (no game code loaded)
- Game load time: < 1s (lazy loading)
- FPS during gameplay: 60 FPS (stable)
- Memory usage: < 50MB per game

**Bundle Size:**
- Total games bundle (all 5): < 150KB
- Shared components: < 15KB
- Per-game chunk: < 70KB

### Business Impact

**Portfolio Differentiation:**
- Interview mentions: Track how often games are mentioned in interviews
- Social shares: Track if error pages are shared on Twitter/LinkedIn
- Referrals: Monitor traffic from shared error page links

**User Retention:**
- Time-on-site increase: Expected +2-5 minutes for error page visitors
- Error page bounce rate: Expected decrease of 20-40%

---

## 🎨 Design System Integration

### Color Themes

**Reuse Atmospheric Colors:**
```typescript
// Match existing portfolio atmospheric layers
import { ATMOSPHERIC_COLORS } from '@/config/colors';

const gameThemes = {
  breakout404: {
    background: ATMOSPHERIC_COLORS.troposphere.bg,  // Blue
    paddle: ATMOSPHERIC_COLORS.troposphere.accent,
    ball: '#ffffff',
    blocks: [
      ATMOSPHERIC_COLORS.stratosphere.accent,
      ATMOSPHERIC_COLORS.mesosphere.accent,
      ATMOSPHERIC_COLORS.thermosphere.accent,
    ],
  },
  breakout500: {
    background: '#1a0000',  // Dark red
    paddle: '#ff4444',
    ball: '#ffffff',
    blocks: ['#ff0000', '#cc0000', '#990000'],
  },
  rubiksCube: {
    // Each face matches a portfolio section
    red: ATMOSPHERIC_COLORS.hero,
    blue: ATMOSPHERIC_COLORS.projects,
    green: ATMOSPHERIC_COLORS.skills,
    yellow: ATMOSPHERIC_COLORS.experience,
    orange: ATMOSPHERIC_COLORS.blog,
    white: '#ffffff',
  },
};
```

### Typography

**Use Existing Fonts:**
```css
/* Match portfolio typography */
.game-ui {
  font-family: var(--font-sans); /* Your existing sans-serif */
  font-size: 1rem;
  line-height: 1.5;
}

.game-title {
  font-family: var(--font-heading); /* Your existing heading font */
  font-size: 2rem;
  font-weight: 700;
}

.game-score {
  font-family: var(--font-mono); /* Monospace for numbers */
  font-variant-numeric: tabular-nums;
}
```

### Component Styling

**Use Tailwind Classes:**
```tsx
// Consistent with your existing Tailwind setup
<button className="
  px-6 py-3
  bg-blue-600 hover:bg-blue-700
  text-white font-semibold
  rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-blue-500
">
  Play Breakout
</button>
```

---

## ⚠️ Important Constraints

### Do NOT:
❌ Block access to "Back to Home" button
❌ Auto-play games (user must opt-in)
❌ Make error pages load slower (lazy load everything)
❌ Break mobile experience (responsive design required)
❌ Exceed 1 week total development time (set strict time budget)
❌ Add games to main portfolio pages (error pages only)

### DO:
✅ Make games optional enhancements
✅ Keep error information prominent
✅ Ensure keyboard accessibility
✅ Optimize for fast initial load (0KB game code upfront)
✅ Work offline where possible (PWA cache)
✅ Track analytics to measure success
✅ Set quit game button in prominent location

---

## 🔗 Integration Points

### With Existing Portfolio Features

**Device Capabilities (`useDeviceCapabilities`):**
```typescript
// Disable 3D games on low-end devices
const { performanceTier, canUseHeavyAnimations } = useDeviceCapabilities();

if (performanceTier === 'low') {
  // Suggest Boggle or Yahtzee instead of Rubik's Cube
  return <SimplifiedGameOptions />;
}
```

**Three.js Scene (`ThreeJSScene.tsx`):**
```typescript
// Reuse existing Three.js setup for Rubik's Cube
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Same patterns as your existing 3D scene
<Canvas>
  <OrbitControls />
  <RubiksCubeMesh />
</Canvas>
```

**Physics Utilities (`utilities/physics.ts`):**
```typescript
// Reuse for Breakout collision detection
import { detectCollision, calculateReflection } from '@/utilities/physics';

const ballCollision = detectCollision(ball, paddle);
if (ballCollision) {
  ball.dy = calculateReflection(ball.dy, paddle.angle);
}
```

**GSAP Animations:**
```typescript
// Dice roll animation for Yahtzee
import { gsap } from 'gsap';

gsap.to(diceRef.current, {
  rotateX: Math.random() * 360,
  rotateY: Math.random() * 360,
  duration: 0.8,
  ease: 'power2.out',
});
```

---

## 📅 Recommended Timeline

### Best Time to Implement

**After Phase 3 (Performance):**
- You'll have code splitting expertise
- Bundle optimization skills will be sharp
- Performance budgeting experience

**Before Phase 4 (Storybook):**
- Then showcase games as Storybook examples
- Document components in Storybook
- Visual regression testing with Chromatic

**Or During Phase 4:**
- Games become component documentation examples
- Practice Storybook setup on isolated components

### Full Timeline

```
Week 1:
  Days 1-2: Phase 1 (404 games - Breakout + Sokoban)
  Day 3: Testing and polish

Week 2:
  Days 1-2: Phase 2 (Maintenance games - Rubik's + Boggle)
  Day 3: Device detection and integration

Week 3 (Optional):
  Day 1: Phase 3 (Yahtzee + 500 theme)
  Day 2: Phase 4 (Polish, analytics, accessibility)
  Day 3: Buffer for unexpected issues
```

**MVP Timeline (404 + Maintenance only):**
- Total: 5 days
- Phase 1: 2 days (404 games)
- Phase 2: 3 days (Maintenance games)

**Full Implementation:**
- Total: 7-9 days
- All 5 games across all error types
- Polish and analytics included

---

## 🚀 Future Enhancements (Post-Launch)

### V2 Features (Optional)

**Leaderboards:**
- LocalStorage high scores
- Anonymous leaderboard (no login required)
- Weekly/monthly resets

**Level Editor (Sokoban):**
- Create custom levels
- Share via URL encoding
- Community level database

**Multiplayer (Breakout):**
- Two-player mode (split-screen)
- Cooperative brick-breaking
- Competitive scoring

**Achievements:**
- "Speed Runner" - Complete Sokoban level in < 50 moves
- "Perfect Game" - Complete Breakout without losing a ball
- "Cube Master" - Solve Rubik's Cube in < 100 moves

**Themes:**
- Multiple visual themes for each game
- Seasonal themes (holiday special)
- Dark mode / light mode toggle

---

## 📝 Documentation TODO

When implementing this feature:

- [ ] Create `/components/error-games/README.md` with architecture overview
- [ ] Document each game's state management pattern
- [ ] Add Storybook stories for each game component
- [ ] Update main ROADMAP.md with completion status
- [ ] Write blog post about the implementation (portfolio content)

---

## 🎯 Final Assessment

### Pros of This Feature
✅ Unique portfolio differentiation
✅ Showcases diverse technical skills (2D, 3D, physics, state management)
✅ Improves user experience during errors
✅ Leverages existing Three.js investment (Rubik's Cube)
✅ Low bundle impact with lazy loading
✅ Measurable success metrics
✅ Viral potential (shareable)

### Cons / Risks
⚠️ Maintenance overhead (5 games to test)
⚠️ Scope creep risk (games are fun to polish)
⚠️ Not core portfolio functionality
⚠️ Could be perceived as gimmicky if not polished
⚠️ Time investment (7-9 days)

### Strategic Recommendation

**Rating: 9/10** - Highly recommended for error-page-only scope

**Implementation Strategy:**
1. Start with MVP (404 + Maintenance) = 5 days
2. Measure engagement metrics for 2-4 weeks
3. If metrics are positive (>15% engagement), complete full suite
4. If metrics are weak (<10% engagement), stop at MVP

**Best Timing:**
- After Phase 3 (Performance optimization)
- Before or during Phase 4 (Developer experience)
- Not before Phase 1.5/Phase 0 (higher priorities)

**Success Criteria:**
- 15-30% game launch rate
- Mentioned in interviews/networking
- Shared on social media
- Portfolio talking point

---

**Last Updated:** 2025-12-02

**Status:** Planned feature, pending Phase 3 completion

**Next Steps:**
1. Complete Phase 1.5 (Code quality fixes)
2. Complete Phase 0 (Infrastructure)
3. Complete Phases 2-3 (Component architecture + Performance)
4. Revisit this feature for implementation decision
