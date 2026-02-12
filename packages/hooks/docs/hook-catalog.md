# Hook Catalog

## SUMMARY

Complete reference for all 29 custom hooks in @aazucena/hooks, organized by domain with usage examples and integration patterns.

---

## 🎬 ANIMATION_HOOKS

### useGSAPEntrance

GSAP entrance animations for hero sections.

```typescript
import { useGSAPEntrance } from '@aazucena/hooks/animations';

function HeroSection() {
  const { titleRef, subtitleRef, ctaRef } = useGSAPEntrance();

  return (
    <div>
      <h1 ref={titleRef}>Welcome</h1>
      <p ref={subtitleRef}>Subtitle text</p>
      <div ref={ctaRef}>
        <button>Get Started</button>
      </div>
    </div>
  );
}
```

**Returns:**
- `titleRef` - Ref for title element (animates with y: 100 → 0, opacity: 0 → 1)
- `subtitleRef` - Ref for subtitle element (animates with y: 50 → 0, opacity: 0 → 1)
- `ctaRef` - Ref for CTA element (animates with scale: 0.8 → 1, opacity: 0 → 1)

**Timeline:**
1. Title fades in from bottom (1.2s, power3.out)
2. Subtitle fades in from bottom (-0.5s overlap, power2.out)
3. CTA scales in with bounce (-0.3s overlap, back.out)

---

### useFlipText

Text flipping animation with GSAP.

```typescript
import { useFlipText } from '@aazucena/hooks/animations';

function AnimatedText() {
  const textRef = useFlipText<HTMLSpanElement>({
    duration: 0.8,
    stagger: 0.05,
    ease: 'power2.out',
  });

  return <span ref={textRef}>Animated Text</span>;
}
```

**Options:**
- `duration` - Animation duration in seconds (default: 0.6)
- `stagger` - Delay between character animations (default: 0.03)
- `ease` - GSAP easing function (default: 'power1.out')

**Use Cases:**
- Hero titles with character-by-character reveal
- Section headings with staggered entrance
- Interactive text animations on hover/scroll

---

### useAtmosphericLayer

Determines current atmospheric layer based on scroll progress.

```typescript
import { useAtmosphericLayer } from '@aazucena/hooks/animations';

function AnimatedBackground() {
  const layer = useAtmosphericLayer(scrollProgress);

  return (
    <div
      style={{
        backgroundColor: layer.backgroundColor,
        opacity: layer.opacity,
      }}
    >
      Layer: {layer.name}
    </div>
  );
}
```

**Parameters:**
- `scrollProgress` - Scroll position (0-1)

**Returns:**
- `name` - Layer name ('troposphere' | 'stratosphere' | 'mesosphere' | 'exosphere')
- `start` - Layer start position (0-1)
- `end` - Layer end position (0-1)
- `particles` - Particle count
- `backgroundColor` - OKLCH color string

**Layer Ranges:**
- Troposphere: 0.0 - 0.25 (100 particles)
- Stratosphere: 0.25 - 0.50 (75 particles)
- Mesosphere: 0.50 - 0.75 (50 particles)
- Exosphere: 0.75 - 1.0 (25 particles)

---

### useSectionRefs

Manages refs for portfolio sections (0-7).

```typescript
import { useSectionRefs } from '@aazucena/hooks/animations';

function Portfolio() {
  const sectionRefs = useSectionRefs();

  return (
    <>
      <section ref={sectionRefs[0]}>Hero</section>
      <section ref={sectionRefs[1]}>About</section>
      <section ref={sectionRefs[2]}>Projects</section>
      {/* ... sections 3-7 */}
    </>
  );
}
```

**Returns:**
Array of 8 refs (RefObject<HTMLElement | null>[])

**Section Mapping:**
- 0: Hero
- 1: About
- 2: Projects
- 3: Experience
- 4: Skills
- 5: Testimonials
- 6: Awards
- 7: Contact

---

### useSectionTransitions

GSAP-powered section transitions with scroll triggers.

```typescript
import { useSectionTransitions } from '@aazucena/hooks/animations';

function AnimatedSections() {
  const { currentSection, transitionTo } = useSectionTransitions({
    sections: sectionRefs,
    onSectionChange: (index) => {
      console.log(`Navigated to section ${index}`);
    },
  });

  return (
    <div>
      <p>Current Section: {currentSection}</p>
      <button onClick={() => transitionTo(2)}>Go to Projects</button>
    </div>
  );
}
```

**Options:**
- `sections` - Array of section refs
- `onSectionChange` - Callback when section changes
- `duration` - Transition duration (default: 1.2s)
- `ease` - GSAP easing (default: 'power2.inOut')

**Returns:**
- `currentSection` - Active section index (0-7)
- `transitionTo` - Function to navigate to section
- `isTransitioning` - Boolean transition state

---

### useSectionRegistry

Component registry for dynamic section rendering.

```typescript
import { useSectionRegistry } from '@aazucena/hooks/animations';
import { HeroSection, AboutSection, ProjectsSection } from './sections';

function DynamicPortfolio() {
  const registry = useSectionRegistry({
    hero: HeroSection,
    about: AboutSection,
    projects: ProjectsSection,
  });

  const SectionComponent = registry.get('hero');

  return <SectionComponent />;
}
```

**Usage:**
- Register components by key
- Dynamically render sections based on CMS data
- Type-safe component lookup

**Methods:**
- `get(key)` - Retrieve component by key
- `has(key)` - Check if component exists
- `keys()` - Get all registered keys

---

### useShapeRefs

Manages refs for Three.js shapes in the scene.

```typescript
import { useShapeRefs } from '@aazucena/hooks/animations';
import { useFrame } from '@react-three/fiber';

function ThreeJSScene() {
  const shapeRefs = useShapeRefs();

  useFrame(() => {
    if (shapeRefs.sphere.current) {
      shapeRefs.sphere.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <mesh ref={shapeRefs.sphere}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      <mesh ref={shapeRefs.torus}>
        <torusGeometry args={[1, 0.4, 16, 100]} />
      </mesh>
    </>
  );
}
```

**Returns:**
- `sphere` - Ref for sphere mesh
- `torus` - Ref for torus mesh
- `icosahedron` - Ref for icosahedron mesh
- `plane` - Ref for plane mesh

---

### useDragToSwipe

Touch drag gesture handler with momentum.

```typescript
import { useDragToSwipe } from '@aazucena/hooks/animations';

function Carousel() {
  const { dragProps, offset, isDragging } = useDragToSwipe({
    onSwipeLeft: () => nextSlide(),
    onSwipeRight: () => prevSlide(),
    threshold: 50, // px
  });

  return (
    <div {...dragProps} style={{ transform: `translateX(${offset}px)` }}>
      {/* Carousel slides */}
    </div>
  );
}
```

**Options:**
- `onSwipeLeft` - Callback for left swipe
- `onSwipeRight` - Callback for right swipe
- `threshold` - Swipe distance threshold (default: 50px)
- `momentum` - Enable momentum scrolling (default: true)

**Returns:**
- `dragProps` - Props to spread on draggable element
- `offset` - Current drag offset (px)
- `isDragging` - Boolean drag state

---

## 📊 DATA_HOOKS

### useHandlebars

Handlebars template rendering with CMS data.

```typescript
import { useHandlebars } from '@aazucena/hooks/data';

function TemplatedContent() {
  const render = useHandlebars();

  const template = 'Hello, {{name}}! You have {{count}} messages.';
  const data = { name: 'John', count: 5 };

  return <div>{render(template, data)}</div>;
}
```

**Usage:**
- Render Handlebars templates from Strapi CMS
- Dynamic content interpolation
- Supports helpers and partials

**Helpers:**
- `{{uppercase value}}` - Uppercase text
- `{{lowercase value}}` - Lowercase text
- `{{formatDate date}}` - Format date
- `{{pluralize count singular plural}}` - Pluralization

---

### useCommandSearch

Fuzzy search for command palette.

```typescript
import { useCommandSearch } from '@aazucena/hooks/data';

function CommandPalette() {
  const [query, setQuery] = useState('');
  const { results, loading } = useCommandSearch(query, {
    keys: ['title', 'description'],
    threshold: 0.3,
  });

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {results.map((result) => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

**Options:**
- `keys` - Fields to search (default: ['title', 'description'])
- `threshold` - Fuzzy match threshold (0-1, default: 0.3)
- `limit` - Max results (default: 10)

**Returns:**
- `results` - Filtered and scored results
- `loading` - Boolean loading state

---

## 📱 DEVICE_HOOKS

### useDeviceCapabilities

Device performance detection with localStorage persistence.

```typescript
import { useDeviceCapabilities } from '@aazucena/hooks/device';

function AdaptiveUI() {
  const { capabilities, updateCapabilities, mounted } = useDeviceCapabilities();

  if (!mounted) return <div>Loading...</div>;

  return (
    <div>
      <p>Mobile: {capabilities.isMobile ? 'Yes' : 'No'}</p>
      <p>Performance: {capabilities.performanceTier}</p>
      <p>Heavy Animations: {capabilities.canUseHeavyAnimations ? 'Yes' : 'No'}</p>

      <button
        onClick={() =>
          updateCapabilities({
            canUseHeavyAnimations: !capabilities.canUseHeavyAnimations,
          })
        }
      >
        Toggle Animations
      </button>
    </div>
  );
}
```

**Returns:**
- `capabilities` - Device capabilities object
  - `isMobile` - Is mobile device
  - `performanceTier` - 'low' | 'medium' | 'high'
  - `canUseHeavyAnimations` - Boolean for Three.js/PixiJS
- `updateCapabilities` - Update capabilities (persists to localStorage)
- `mounted` - Boolean for SSR safety

**Detection Logic:**
- **isMobile:** User agent check + screen width < 768px
- **performanceTier:**
  - High: 16GB+ RAM, 8+ cores, GPU available
  - Medium: 8GB+ RAM, 4+ cores
  - Low: Below medium threshold
- **canUseHeavyAnimations:** performanceTier === 'high' && !isMobile

---

## 🌐 DOM_HOOKS

### useIntersectionObserver

Element visibility detection with Intersection Observer API.

```typescript
import { useIntersectionObserver } from '@aazucena/hooks/dom';

function LazyImage({ src, alt }) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="skeleton" />
      )}
    </div>
  );
}
```

**Options:**
- `threshold` - Visibility percentage (0-1, default: 0)
- `rootMargin` - Margin around root (default: '0px')
- `root` - Root element (default: viewport)
- `triggerOnce` - Disconnect after first intersection (default: false)

**Returns:**
- `ref` - Ref to attach to observed element
- `isIntersecting` - Boolean visibility state
- `entry` - Full IntersectionObserverEntry object

---

### useWindowSize

Tracks browser window dimensions.

```typescript
import { useWindowSize } from '@aazucena/hooks/dom';

function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>Window: {width}x{height}</p>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

**Returns:**
- `width` - Window width (px, undefined on SSR)
- `height` - Window height (px, undefined on SSR)

**Use Cases:**
- Responsive layout logic
- Canvas/SVG sizing
- Conditional rendering based on breakpoints

---

### useScrollToTop

Smooth scroll to top functionality.

```typescript
import { useScrollToTop } from '@aazucena/hooks/dom';

function BackToTop() {
  const scrollToTop = useScrollToTop({
    smooth: true,
    duration: 800,
  });

  return <button onClick={scrollToTop}>Back to Top</button>;
}
```

**Options:**
- `smooth` - Smooth scroll behavior (default: true)
- `duration` - Animation duration (default: 600ms)
- `offset` - Scroll offset from top (default: 0)

**Returns:**
Function to trigger scroll to top

---

## 🔄 PRELOADER_HOOKS

### useLoadingProgress

Multi-step loading state management.

```typescript
import { useLoadingProgress } from '@aazucena/hooks/preloader';

function Preloader() {
  const { progress, setProgress, complete, reset } = useLoadingProgress({
    steps: [
      { name: 'fonts', weight: 20 },
      { name: 'images', weight: 50 },
      { name: 'animations', weight: 30 },
    ],
  });

  useEffect(() => {
    // Load fonts
    loadFonts().then(() => setProgress('fonts', 100));

    // Load images
    loadImages((p) => setProgress('images', p)).then(() => complete('images'));

    // Initialize animations
    initAnimations().then(() => setProgress('animations', 100));
  }, []);

  return (
    <div>
      <progress value={progress.total} max={100} />
      <p>{progress.current}% - {progress.message}</p>
    </div>
  );
}
```

**Options:**
- `steps` - Array of loading steps with weights
- `onComplete` - Callback when all steps complete

**Returns:**
- `progress` - Progress object
  - `total` - Overall progress (0-100)
  - `current` - Current step progress (0-100)
  - `message` - Loading message
  - `step` - Current step index
- `setProgress(step, value)` - Update step progress
- `complete(step)` - Mark step as complete
- `reset()` - Reset all progress

---

### usePreloaderVisibility

Controls preloader show/hide state.

```typescript
import { usePreloaderVisibility } from '@aazucena/hooks/preloader';

function App() {
  const { visible, hide, show } = usePreloaderVisibility({
    delay: 500, // ms before hiding
    fadeOut: 300, // ms fade-out duration
  });

  useEffect(() => {
    if (allResourcesLoaded) {
      hide();
    }
  }, [allResourcesLoaded, hide]);

  return (
    <>
      {visible && <Preloader />}
      <MainContent />
    </>
  );
}
```

**Options:**
- `delay` - Delay before hiding (default: 0ms)
- `fadeOut` - Fade-out duration (default: 300ms)
- `persistent` - Keep in DOM after hide (default: false)

**Returns:**
- `visible` - Boolean visibility state
- `hide()` - Hide preloader
- `show()` - Show preloader
- `toggle()` - Toggle visibility

---

### usePreloaderLifecycle

State machine for preloader lifecycle.

```typescript
import { usePreloaderLifecycle } from '@aazucena/hooks/preloader';

function PreloaderStateMachine() {
  const { state, start, complete, error, interactive } = usePreloaderLifecycle({
    onStart: () => console.log('Loading started'),
    onComplete: () => console.log('Loading complete'),
    onError: (err) => console.error('Loading error:', err),
  });

  return (
    <div>
      {state === 'idle' && <button onClick={start}>Start Loading</button>}
      {state === 'loading' && <Spinner />}
      {state === 'complete' && <SuccessMessage />}
      {state === 'error' && <ErrorMessage />}
      {state === 'interactive' && <InteractiveContent />}
    </div>
  );
}
```

**States:**
- `idle` - Initial state
- `loading` - Loading in progress
- `complete` - Loading finished successfully
- `error` - Loading failed
- `interactive` - User interaction required

**Transitions:**
- `start()` - idle → loading
- `complete()` - loading → complete
- `error(message)` - loading → error
- `interactive()` - loading → interactive
- `reset()` - any → idle

---

### useKeyboardNavigation

Keyboard navigation for preloader interactions.

```typescript
import { useKeyboardNavigation } from '@aazucena/hooks/preloader';

function InteractivePreloader() {
  const { selected, navigate, confirm } = useKeyboardNavigation({
    items: ['Skip', 'Continue', 'Settings'],
    onConfirm: (item) => {
      if (item === 'Skip') skipPreloader();
      if (item === 'Continue') continueLoading();
    },
  });

  return (
    <div>
      {items.map((item, i) => (
        <button key={item} className={selected === i ? 'selected' : ''}>
          {item}
        </button>
      ))}
      <p>Use ↑/↓ to navigate, Enter to select</p>
    </div>
  );
}
```

**Options:**
- `items` - Array of navigation items
- `onConfirm` - Callback when Enter pressed
- `wrap` - Wrap navigation at ends (default: true)

**Returns:**
- `selected` - Selected item index
- `navigate(direction)` - Navigate up (-1) or down (1)
- `confirm()` - Trigger onConfirm for selected item

**Keyboard Shortcuts:**
- `↑` / `k` - Navigate up
- `↓` / `j` - Navigate down
- `Enter` - Confirm selection
- `Escape` - Cancel/close

---

### usePreloaderTheme

Theme management for preloader with OKLCH colors.

```typescript
import { usePreloaderTheme } from '@aazucena/hooks/preloader';

function ThemedPreloader() {
  const theme = usePreloaderTheme({
    primary: 'oklch(60% 0.20 250)', // Cyan blue
    secondary: 'oklch(65% 0.18 45)', // Coral orange
    background: 'oklch(10% 0.05 250)', // Dark blue
    text: 'oklch(95% 0.02 250)', // Near white
  });

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <div style={{ color: theme.primary }}>Loading...</div>
      <progress style={{ accentColor: theme.secondary }} />
    </div>
  );
}
```

**Options:**
- `primary` - Primary color (OKLCH)
- `secondary` - Secondary color (OKLCH)
- `background` - Background color (OKLCH)
- `text` - Text color (OKLCH)
- `mode` - 'light' | 'dark' (default: 'dark')

**Returns:**
Theme object with all colors and helper functions
- `colors` - All color values
- `isDark` - Boolean for dark mode
- `toggle()` - Toggle light/dark

---

### useShowOnce

Show preloader only once per session.

```typescript
import { useShowOnce } from '@aazucena/hooks/preloader';

function SmartPreloader() {
  const { shouldShow, markShown } = useShowOnce('portfolio-preloader', {
    duration: 24 * 60 * 60 * 1000, // 24 hours
  });

  useEffect(() => {
    if (shouldShow) {
      // Show preloader
      setTimeout(() => {
        markShown();
      }, 3000);
    }
  }, [shouldShow, markShown]);

  return shouldShow ? <Preloader /> : null;
}
```

**Options:**
- `key` - localStorage key
- `duration` - Cache duration (ms, default: session)
- `resetOnError` - Reset if previous session errored (default: true)

**Returns:**
- `shouldShow` - Boolean whether to show
- `markShown()` - Mark as shown
- `reset()` - Reset cache

---

## 🎯 STATE_HOOKS

### useLocalStorage

Generic localStorage state management.

```typescript
import { useLocalStorage } from '@aazucena/hooks/state';

function ThemeToggle() {
  const [theme, setTheme, mounted] = useLocalStorage('theme', 'dark');

  if (!mounted) return null; // SSR safety

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {theme}
    </button>
  );
}
```

**Parameters:**
- `key` - localStorage key
- `defaultValue` - Default value if key not found

**Returns:**
- `value` - Current value
- `setValue` - Update function (supports callback like useState)
- `mounted` - Boolean for SSR safety

**Features:**
- TypeScript generic for type safety
- JSON serialization/deserialization
- Error handling with fallback
- SSR-safe with mounted flag

---

### useTheme

Theme management with system preference detection.

```typescript
import { useTheme } from '@aazucena/hooks/state';

function ThemeProvider({ children }) {
  const { theme, setTheme, systemTheme, isDark } = useTheme();

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
        Toggle Theme
      </button>
      <p>System prefers: {systemTheme}</p>
      {children}
    </div>
  );
}
```

**Returns:**
- `theme` - Current theme ('light' | 'dark' | 'system')
- `setTheme(theme)` - Update theme
- `systemTheme` - System preference ('light' | 'dark')
- `isDark` - Computed boolean for dark mode

**Features:**
- Respects system preference
- localStorage persistence
- Media query listener for system changes

---

### useModal

Modal state management with focus trap.

```typescript
import { useModal } from '@aazucena/hooks/state';

function ModalExample() {
  const { isOpen, open, close, toggle } = useModal({
    onOpen: () => console.log('Modal opened'),
    onClose: () => console.log('Modal closed'),
    closeOnEscape: true,
    closeOnOutsideClick: true,
  });

  return (
    <>
      <button onClick={open}>Open Modal</button>

      {isOpen && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Modal Title</h2>
            <button onClick={close}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```

**Options:**
- `onOpen` - Callback when modal opens
- `onClose` - Callback when modal closes
- `closeOnEscape` - Close on Esc key (default: true)
- `closeOnOutsideClick` - Close on overlay click (default: true)

**Returns:**
- `isOpen` - Boolean modal state
- `open()` - Open modal
- `close()` - Close modal
- `toggle()` - Toggle modal

---

## 📈 TELEMETRY_HOOKS

### useSystemStats

Fetches system statistics from AZUCENA_LYTICS.

```typescript
import { useSystemStats } from '@aazucena/hooks/telemetry';

function SystemDashboard() {
  const { data: stats, loading, error } = useSystemStats({
    isLive: true, // Poll every 15s
  });

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <p>Total Events: {stats.totalEvents}</p>
      <p>Avg Latency: {stats.avgLatency}ms</p>
      <p>Error Rate: {stats.errorRate}%</p>
    </div>
  );
}
```

**Options:**
- `isLive` - Enable polling (default: false)
- `refetchInterval` - Poll interval (default: 15000ms)

**Returns:**
- `data` - System statistics
- `loading` - Boolean loading state
- `error` - Error object if failed

---

### usePerformanceTraffic

Tracks performance metrics over time.

```typescript
import { usePerformanceTraffic } from '@aazucena/hooks/telemetry';

function PerformanceGraph() {
  const { data: traffic, loading } = usePerformanceTraffic({
    timeRange: '24h',
    isLive: true,
  });

  return (
    <LineChart
      data={traffic}
      xAxis="timestamp"
      yAxis="latency"
      series={['p50', 'p95', 'p99']}
    />
  );
}
```

**Options:**
- `timeRange` - '1h' | '24h' | '7d' | '30d' (default: '24h')
- `isLive` - Enable polling (default: false)

**Returns:**
- `data` - Time-series performance data
- `loading` - Boolean loading state

---

### useSentinel

Sentinel health status and active alerts.

```typescript
import { useSentinel } from '@aazucena/hooks/telemetry';

function SentinelStatus() {
  const { data: sentinel, loading } = useSentinel(true); // isLive

  return (
    <div>
      <h3>System Health: {sentinel.status}</h3>
      {sentinel.alerts.map((alert) => (
        <Alert key={alert.id} severity={alert.severity}>
          {alert.message}
        </Alert>
      ))}
    </div>
  );
}
```

**Returns:**
- `data` - Sentinel status object
  - `status` - 'healthy' | 'degraded' | 'down'
  - `alerts` - Active alerts array
  - `lastCheck` - Timestamp of last check
- `loading` - Boolean loading state

---

### useSystemStatus

Public system status endpoint (no auth required).

```typescript
import { useSystemStatus } from '@aazucena/hooks/telemetry';

function PublicStatus() {
  const { data: status, loading } = useSystemStatus();

  return (
    <div>
      <StatusBadge status={status.overall} />
      <p>Uptime: {status.uptime}%</p>
      <p>Last Incident: {status.lastIncident}</p>
    </div>
  );
}
```

**Returns:**
- `data` - Public status information
  - `overall` - 'operational' | 'degraded' | 'outage'
  - `uptime` - Uptime percentage
  - `lastIncident` - Timestamp of last incident
- `loading` - Boolean loading state

---

### useAiIntelligence

AI model usage and cost tracking.

```typescript
import { useAiIntelligence } from '@aazucena/hooks/telemetry';

function AiCostCenter() {
  const { data: ai, loading } = useAiIntelligence({
    timeRange: '7d',
    isLive: true,
  });

  return (
    <div>
      <h3>AI Costs (Last 7 Days)</h3>
      <p>Total Spend: ${ai.totalCost.toFixed(2)}</p>
      <p>Token Count: {ai.totalTokens.toLocaleString()}</p>

      <h4>By Model:</h4>
      {ai.byModel.map((model) => (
        <div key={model.name}>
          <p>{model.name}: ${model.cost.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

**Options:**
- `timeRange` - '1h' | '24h' | '7d' | '30d' (default: '24h')
- `isLive` - Enable polling (default: false)

**Returns:**
- `data` - AI intelligence data
  - `totalCost` - Total USD spent
  - `totalTokens` - Total tokens used
  - `byModel` - Breakdown by model
  - `byPhase` - Breakdown by MG/EG phase
- `loading` - Boolean loading state

---

### useFinancial

Financial metrics and revenue tracking.

```typescript
import { useFinancial } from '@aazucena/hooks/telemetry';

function RevenueChart() {
  const { data: financial, loading } = useFinancial({
    timeRange: '30d',
    isLive: true,
  });

  return (
    <div>
      <h3>Revenue (Last 30 Days)</h3>
      <p>Total: ${financial.revenue.toFixed(2)}</p>
      <p>Expenses: ${financial.expenses.toFixed(2)}</p>
      <p>Net: ${financial.net.toFixed(2)}</p>

      <AreaChart
        data={financial.daily}
        xAxis="date"
        yAxis="revenue"
        series={['revenue', 'expenses']}
      />
    </div>
  );
}
```

**Options:**
- `timeRange` - '1h' | '24h' | '7d' | '30d' (default: '30d')
- `isLive` - Enable polling (default: false)

**Returns:**
- `data` - Financial metrics
  - `revenue` - Total revenue
  - `expenses` - Total expenses
  - `net` - Net profit/loss
  - `daily` - Daily breakdown
- `loading` - Boolean loading state

---

**AUTHOR:** aazucena_hooks_intelligence
