# [Phase Protocols] : MG_EG_Visual_Language

## SUMMARY

Visual differentiation system for Agentic Lifecycle phases: **Midgame (MG)** represents AI reasoning/thinking, while **Endgame (EG)** represents synthesis/delivery. This protocol ensures users always know the agent's current state.

---

## PHASE_DEFINITIONS

### PHASE_MIDGAME (MG) - "Thinking"

**State:** Agent is actively reasoning, exploring solution space, processing context.

**Visual Characteristics:**
- **Primary Color:** Pulsing primary-500 (cyan blue) with 2s animation cycle
- **Typography:** "Thinking..." with dot animation, Fira Code monospace
- **Motion:** Continuous pulse, floating indicators, subtle oscillation
- **Timing:** 300ms transitions, 2000ms pulse loop
- **Opacity:** Oscillates between 0.6 - 1.0
- **Icons:** Animated thought bubbles, processing spinners

**UI States:**
```typescript
const MG_STYLES = {
  badge: {
    background: 'bg-primary-500/20',
    border: 'border-primary-500',
    text: 'text-primary-500',
    animation: 'animate-pulse',
  },
  indicator: {
    color: 'text-primary-500',
    icon: 'thinking-dots',
    motion: 'pulse-continuous',
  },
  timing: {
    transition: 300,
    loop: 2000,
  },
} as const;
```

---

### PHASE_ENDGAME (EG) - "Synthesis"

**State:** Agent has completed reasoning and is delivering final output.

**Visual Characteristics:**
- **Primary Color:** Static emerald-500 (success green) or cyan-500 (info)
- **Typography:** "Complete" or "Ready", Fira Sans bold
- **Motion:** Single entrance animation (700ms), then static
- **Timing:** 700ms relaxed entrance, no loop
- **Opacity:** Solid 1.0 (no pulsing)
- **Icons:** Checkmarks, solid indicators, completion badges

**UI States:**
```typescript
const EG_STYLES = {
  badge: {
    background: 'bg-emerald-500/20',
    border: 'border-emerald-500',
    text: 'text-emerald-500',
    animation: 'none', // Static
  },
  indicator: {
    color: 'text-emerald-500',
    icon: 'check-circle',
    motion: 'fade-in-once',
  },
  timing: {
    transition: 700,
    loop: 0, // No loop
  },
} as const;
```

---

## COMPONENT_EXAMPLES

### Phase Badge Component

```typescript
interface PhaseBadgeProps {
  phase: 'midgame' | 'endgame';
  label?: string;
}

function PhaseBadge({ phase, label }: PhaseBadgeProps) {
  const isMidgame = phase === 'midgame';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border-2',
        isMidgame ? [
          'bg-primary-500/20',
          'border-primary-500',
          'text-primary-500',
          'animate-pulse',
        ] : [
          'bg-emerald-500/20',
          'border-emerald-500',
          'text-emerald-500',
        ]
      )}
    >
      {isMidgame ? (
        <ThinkingDots className="w-4 h-4" />
      ) : (
        <CheckCircle className="w-4 h-4" />
      )}
      <span className="font-mono text-sm">
        {label || (isMidgame ? 'Thinking...' : 'Complete')}
      </span>
    </div>
  );
}
```

### Phase Indicator with Timing

```typescript
function PhaseIndicator({ phase }: { phase: 'midgame' | 'endgame' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timing = phase === 'midgame' ? 300 : 700;
    const timeout = setTimeout(() => setIsVisible(true), timing);
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{
        duration: phase === 'midgame' ? 0.3 : 0.7,
        ease: 'easeOut',
      }}
    >
      <PhaseBadge phase={phase} />
    </motion.div>
  );
}
```

### Thought Trace Animation (MG only)

```typescript
function ThoughtTrace({ visible }: { visible: boolean }) {
  return (
    <div className="relative h-1 w-full bg-primary-500/10 overflow-hidden">
      {visible && (
        <motion.div
          className="absolute h-full bg-primary-500"
          initial={{ x: '-100%', width: '50%' }}
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}
```

---

## TRANSITION_PROTOCOLS

### MG → EG Transition

When agent completes reasoning and moves to synthesis:

```typescript
function usePhaseTransition(phase: 'midgame' | 'endgame') {
  const [displayPhase, setDisplayPhase] = useState(phase);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (phase !== displayPhase) {
      setIsTransitioning(true);

      // Fade out MG (300ms)
      setTimeout(() => {
        setDisplayPhase(phase);

        // Fade in EG (700ms)
        setTimeout(() => {
          setIsTransitioning(false);
        }, 700);
      }, 300);
    }
  }, [phase, displayPhase]);

  return { displayPhase, isTransitioning };
}
```

### Phase State Machine

```typescript
type PhaseState = 'idle' | 'midgame' | 'endgame' | 'error';

interface PhaseStateMachine {
  current: PhaseState;
  transition: (to: PhaseState) => void;
}

function usePhaseStateMachine(): PhaseStateMachine {
  const [current, setCurrent] = useState<PhaseState>('idle');

  const transition = useCallback((to: PhaseState) => {
    // Validate transitions
    const validTransitions: Record<PhaseState, PhaseState[]> = {
      idle: ['midgame'],
      midgame: ['endgame', 'error'],
      endgame: ['idle'],
      error: ['idle', 'midgame'],
    };

    if (validTransitions[current].includes(to)) {
      setCurrent(to);
    } else {
      console.warn(`Invalid phase transition: ${current} → ${to}`);
    }
  }, [current]);

  return { current, transition };
}
```

---

## ACCESSIBILITY_CONSIDERATIONS

### Screen Reader Announcements

```typescript
function PhaseAnnouncer({ phase }: { phase: 'midgame' | 'endgame' }) {
  return (
    <div role="status" aria-live="polite" className="sr-only">
      {phase === 'midgame'
        ? 'Agent is thinking and processing your request'
        : 'Agent has completed processing and synthesis'
      }
    </div>
  );
}
```

### Reduced Motion

```typescript
function PhaseBadgeAccessible({ phase }: { phase: 'midgame' | 'endgame' }) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div
      className={cn(
        'phase-badge',
        phase === 'midgame' && !prefersReducedMotion && 'animate-pulse'
      )}
    >
      {/* Badge content */}
    </div>
  );
}
```

---

## USAGE_GUIDELINES

### ✅ DO

- Use MG for any active processing or reasoning
- Use EG for final outputs, completed tasks, static results
- Transition smoothly from MG → EG (never skip)
- Respect `prefers-reduced-motion` for pulse animations
- Provide screen reader announcements

### ❌ DON'T

- Use pulsing animations for EG state (should be static)
- Skip the MG phase for instant results (breaks user mental model)
- Use MG indefinitely without timeout (max 30s recommended)
- Animate EG continuously (defeats the "terminal state" concept)

---

## COLOR_MAPPING

### Primary Phase Colors (OKLCH)

```css
/* Midgame (Thinking) */
--phase-mg-primary: oklch(60% 0.2 220); /* Cyan Blue */
--phase-mg-bg: oklch(60% 0.2 220 / 0.2);
--phase-mg-border: oklch(60% 0.2 220);

/* Endgame (Complete) */
--phase-eg-success: oklch(65% 0.18 145); /* Emerald Green */
--phase-eg-info: oklch(60% 0.2 220); /* Cyan (alternative) */
--phase-eg-bg: oklch(65% 0.18 145 / 0.2);
--phase-eg-border: oklch(65% 0.18 145);
```

---

## INTEGRATION_EXAMPLE

```typescript
import { PhaseBadge, ThoughtTrace } from '@aazucena/ui';
import { usePhaseStateMachine } from '@aazucena/hooks';

function AIAssistant() {
  const { current: phase, transition } = usePhaseStateMachine();

  const handleQuery = async (query: string) => {
    transition('midgame');

    try {
      const result = await processQuery(query);
      transition('endgame');
      return result;
    } catch (error) {
      transition('error');
      throw error;
    }
  };

  return (
    <div>
      <PhaseBadge phase={phase as 'midgame' | 'endgame'} />
      {phase === 'midgame' && <ThoughtTrace visible />}
      {/* UI content */}
    </div>
  );
}
```

---

**STATUS:** 🧠 COGNITIVE_STANDARD
**AUTHOR:** aazucena_intelligence_protocol
