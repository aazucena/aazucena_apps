# AI-Powered Inquiry Firewall

## SUMMARY

Interactive Easter egg challenge system for form gating with visual, technical, and logic puzzles integrated into the FormWizard.

---

## 🛡️ FIREWALL_CONCEPT

### What is the Inquiry Firewall?

The **Inquiry Firewall** is a gamified anti-spam system that requires users to complete an interactive challenge before submitting forms. Unlike traditional CAPTCHAs, it's deeply integrated into the portfolio's atmospheric layer system and provides an engaging user experience.

**Goals:**
1. **Prevent Spam:** Filter automated bot submissions
2. **Engage Users:** Provide fun, interactive challenges
3. **Showcase Skills:** Demonstrate technical capabilities
4. **Collect Quality Leads:** Ensure serious inquiries

**Challenge Types:**
- **Visual:** Find hidden objects in atmospheric layers (bird, blimp, ISS, etc.)
- **Technical:** Trigger chess engine states (QSEARCH, PROBCUT, etc.)
- **Logic:** Solve programming puzzles or riddles

---

## 🎮 EASTER_EGG_CHALLENGES

### useEasterEggChallenge Hook

```typescript
import { useEasterEggChallenge } from '@aazucena/forms/hooks';

function FormWithChallenge() {
  const {
    activeChallenge,
    isCompleted,
    completeChallenge,
    resetChallenge,
  } = useEasterEggChallenge();

  if (isCompleted) {
    return <div>Challenge completed! ✅</div>;
  }

  return (
    <div>
      <h3>{activeChallenge?.label}</h3>
      <p>{activeChallenge?.hint}</p>

      <button onClick={() => completeChallenge(activeChallenge.id)}>
        Found It!
      </button>
    </div>
  );
}
```

**Hook API:**
```typescript
interface Challenge {
  id: string;
  label: string;
  hint: string;
  category: 'visual' | 'technical' | 'logic';
}

interface UseEasterEggChallengeReturn {
  activeChallenge: Challenge | null;
  isCompleted: boolean;
  completeChallenge: (id: string) => void;
  resetChallenge: () => void;
}
```

---

## 🌌 VISUAL_CHALLENGES

### Atmospheric Layer Easter Eggs

Visual challenges are hidden in the portfolio's atmospheric layers (Troposphere, Stratosphere, Mesosphere, Thermosphere, Exosphere).

**Available Challenges:**

```typescript
const VISUAL_CHALLENGES = [
  {
    id: 'bird',
    category: 'visual',
    label: 'Flying High',
    hint: 'Find the bird soaring in the Troposphere',
  },
  {
    id: 'blimp',
    category: 'visual',
    label: 'Airship Sight',
    hint: 'Locate the slow-moving blimp in the Stratosphere',
  },
  {
    id: 'drone',
    category: 'visual',
    label: 'Spy in the Sky',
    hint: 'Catch the tactical drone patrolling the Mesosphere',
  },
  {
    id: 'iss',
    category: 'visual',
    label: 'Orbital View',
    hint: 'Locate the ISS in the Thermosphere',
  },
  {
    id: 'astronaut',
    category: 'visual',
    label: 'Lost in Space',
    hint: 'Find the astronaut floating in the Exosphere',
  },
  {
    id: 'ufo',
    category: 'visual',
    label: 'Close Encounter',
    hint: 'Catch a glimpse of the UFO in the deep Mesosphere',
  },
  {
    id: 'satellite',
    category: 'visual',
    label: 'Data Stream',
    hint: 'Find the communication satellite in the Exosphere',
  },
  {
    id: 'meteor',
    category: 'visual',
    label: 'Falling Star',
    hint: 'Track the meteor streaking through the Mesosphere',
  },
];
```

**Implementation Pattern:**

```typescript
// In Three.js scene or PixiJS particles
function HiddenObject({ id, position, onFound }) {
  const meshRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    onFound(id);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
    </mesh>
  );
}
```

**User Flow:**
1. User reaches last step of form
2. Challenge appears: "Find the bird in the Troposphere"
3. User scrolls to Troposphere section
4. User clicks on hidden bird object
5. Challenge completes, form submission enabled

---

## ⚙️ TECHNICAL_CHALLENGES

### Chess Engine State Triggers

Technical challenges require triggering specific chess engine states (Stockfish integration).

**Available Challenges:**

```typescript
const TECHNICAL_CHALLENGES = [
  {
    id: 'qsearch',
    category: 'technical',
    label: 'Quiescence Verification',
    hint: 'Analyze a tactical position until QSEARCH stabilizes',
  },
  {
    id: 'probcut',
    category: 'technical',
    label: 'ProbCut Threshold',
    hint: 'Trigger a PROBCUT prune during a deep search',
  },
  {
    id: 'eval_gate',
    category: 'technical',
    label: 'Evaluation Gate',
    hint: 'Force an evaluation gate to open during search',
  },
  {
    id: 'null_move',
    category: 'technical',
    label: 'Null Move Prune',
    hint: 'Trigger a null move reduction in the search tree',
  },
  {
    id: 'tb_hit',
    category: 'technical',
    label: 'Tablebase Hit',
    hint: 'Reach an endgame tablebase position',
  },
];
```

**Implementation Pattern:**

```typescript
// In Chess Engine Integration
function ChessEngineChallengeDetector() {
  const { activeChallenge, completeChallenge } = useEasterEggChallenge();

  useEffect(() => {
    if (activeChallenge?.category !== 'technical') return;

    // Listen for engine events
    const handleEngineMessage = (message: string) => {
      // Check if challenge condition met
      if (activeChallenge.id === 'qsearch' && message.includes('QSEARCH')) {
        completeChallenge('qsearch');
      } else if (activeChallenge.id === 'probcut' && message.includes('PROBCUT')) {
        completeChallenge('probcut');
      }
      // ... other technical challenges
    };

    engine.on('message', handleEngineMessage);

    return () => {
      engine.off('message', handleEngineMessage);
    };
  }, [activeChallenge]);

  return null;
}
```

**User Flow:**
1. Challenge appears: "Trigger a QSEARCH stabilization"
2. User opens chess board (if available in portfolio)
3. User analyzes a tactical position
4. Engine emits QSEARCH message
5. Challenge completes automatically

---

## 🧩 LOGIC_CHALLENGES

### Programming Puzzles

Logic challenges present programming puzzles or riddles.

**Available Challenges:**

```typescript
const LOGIC_CHALLENGES = [
  {
    id: 'fizzbuzz',
    category: 'logic',
    label: 'FizzBuzz Master',
    hint: 'Solve the classic FizzBuzz problem',
    solution: (answer: string) => {
      // Validate FizzBuzz implementation
      return answer.includes('Fizz') && answer.includes('Buzz');
    },
  },
  {
    id: 'palindrome',
    category: 'logic',
    label: 'Palindrome Finder',
    hint: 'Find the longest palindrome in a given string',
    solution: (answer: string) => {
      return answer.length >= 5 && isPalindrome(answer);
    },
  },
  {
    id: 'binary_search',
    category: 'logic',
    label: 'Binary Search',
    hint: 'Implement binary search to find target',
    solution: (answer: string) => {
      // Validate binary search logic
      return answer.includes('log') || answer.includes('O(log n)');
    },
  },
];
```

**Implementation Pattern:**

```typescript
function LogicChallengeComponent({ challenge }) {
  const [answer, setAnswer] = useState('');
  const { completeChallenge } = useEasterEggChallenge();

  const handleSubmit = () => {
    if (challenge.solution(answer)) {
      completeChallenge(challenge.id);
    } else {
      alert('Incorrect answer. Try again!');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-bold">{challenge.label}</h4>
      <p className="text-sm text-muted-foreground">{challenge.hint}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter your solution..."
        rows={10}
        className="w-full p-4 font-mono text-sm border rounded"
      />

      <button onClick={handleSubmit} className="btn-primary">
        Submit Answer
      </button>
    </div>
  );
}
```

---

## 🔗 FORMWIZARD_INTEGRATION

### Challenge Injection

The FormWizard automatically injects the challenge before the final step:

```typescript
{showChallenge && isLastStep && !isChallengeDone && activeChallenge && (
  <div className="mt-8 p-6 rounded-2xl bg-accent/50 border border-primary/20 animate-pulse-subtle">
    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">
      Security Verification: {activeChallenge.label}
    </h4>

    <p className="text-sm text-muted-foreground mb-4">
      {activeChallenge.hint}
    </p>

    {activeChallenge.category === 'visual' && (
      <p className="text-xs italic">
        💡 Tip: Scroll through the portfolio to find the hidden object
      </p>
    )}

    {activeChallenge.category === 'technical' && (
      <p className="text-xs italic">
        💡 Tip: Interact with the chess engine or technical demos
      </p>
    )}

    {activeChallenge.category === 'logic' && (
      <LogicChallengeComponent challenge={activeChallenge} />
    )}
  </div>
)}
```

**Disable Challenge:**

```typescript
<FormWizard
  steps={steps}
  onComplete={handleComplete}
  showChallenge={false} // Disable challenge
/>
```

---

## 📊 CHALLENGE_SELECTION

### Random Challenge Assignment

```typescript
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import * as Stores from '@aazucena/stores';

export function useEasterEggChallenge() {
  const interactionsStore = (Stores as any).interactionsStore || {};
  const activeChallengeTarget = useStore(interactionsStore);

  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Select random challenge on mount
    const randomIndex = Math.floor(Math.random() * POTENTIAL_CHALLENGES.length);
    const challenge = POTENTIAL_CHALLENGES[randomIndex];

    setActiveChallenge(challenge);

    // Sync with global store
    if (Stores.setActiveChallengeTarget) {
      Stores.setActiveChallengeTarget(challenge.id);
    }
  }, []);

  const completeChallenge = (id: string) => {
    if (id === activeChallenge?.id) {
      setIsCompleted(true);
    }
  };

  const resetChallenge = () => {
    setIsCompleted(false);
    setActiveChallenge(null);
  };

  return { activeChallenge, isCompleted, completeChallenge, resetChallenge };
}
```

**Challenge Pool Strategies:**

```typescript
// Strategy 1: Random (current)
const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];

// Strategy 2: Category-based
const visualChallenges = CHALLENGES.filter((c) => c.category === 'visual');
const challenge = visualChallenges[Math.floor(Math.random() * visualChallenges.length)];

// Strategy 3: User preference
const userCategory = localStorage.getItem('preferred-challenge-category') || 'visual';
const challenges = CHALLENGES.filter((c) => c.category === userCategory);

// Strategy 4: Difficulty progression
const userLevel = getUserLevel(); // 'beginner' | 'intermediate' | 'advanced'
const challenges = CHALLENGES.filter((c) => c.difficulty === userLevel);
```

---

## 🎯 GLOBAL_STATE_SYNC

### Nano Stores Integration

The challenge system uses Nano Stores for global state management:

```typescript
// In @aazucena/stores
import { atom } from 'nanostores';

export const interactionsStore = atom({
  activeChallengeTarget: null,
  completedChallenges: [],
});

export function setActiveChallengeTarget(id: string) {
  interactionsStore.set({
    ...interactionsStore.get(),
    activeChallengeTarget: id,
  });
}

export function markChallengeComplete(id: string) {
  const current = interactionsStore.get();
  interactionsStore.set({
    ...current,
    completedChallenges: [...current.completedChallenges, id],
  });
}
```

**Listen for Challenge Completion:**

```typescript
// In portfolio scene component
import { useStore } from '@nanostores/react';
import { interactionsStore } from '@aazucena/stores';

function PortfolioScene() {
  const { activeChallengeTarget } = useStore(interactionsStore);

  const handleObjectClick = (id: string) => {
    if (id === activeChallengeTarget) {
      // Notify challenge completion
      markChallengeComplete(id);
    }
  };

  return (
    <ThreeJSScene>
      {HIDDEN_OBJECTS.map((obj) => (
        <HiddenObject
          key={obj.id}
          id={obj.id}
          position={obj.position}
          onClick={handleObjectClick}
          highlight={obj.id === activeChallengeTarget}
        />
      ))}
    </ThreeJSScene>
  );
}
```

---

## 🧪 TESTING_PATTERNS

### Unit Test: Challenge Completion

```typescript
import { renderHook, act } from '@testing-library/react';
import { useEasterEggChallenge } from '@aazucena/forms/hooks';

describe('useEasterEggChallenge', () => {
  it('should assign random challenge on mount', () => {
    const { result } = renderHook(() => useEasterEggChallenge());

    expect(result.current.activeChallenge).not.toBeNull();
    expect(result.current.isCompleted).toBe(false);
  });

  it('should complete challenge when correct ID provided', () => {
    const { result } = renderHook(() => useEasterEggChallenge());

    const challengeId = result.current.activeChallenge.id;

    act(() => {
      result.current.completeChallenge(challengeId);
    });

    expect(result.current.isCompleted).toBe(true);
  });

  it('should not complete challenge with wrong ID', () => {
    const { result } = renderHook(() => useEasterEggChallenge());

    act(() => {
      result.current.completeChallenge('wrong-id');
    });

    expect(result.current.isCompleted).toBe(false);
  });

  it('should reset challenge', () => {
    const { result } = renderHook(() => useEasterEggChallenge());

    act(() => {
      result.current.completeChallenge(result.current.activeChallenge.id);
    });

    expect(result.current.isCompleted).toBe(true);

    act(() => {
      result.current.resetChallenge();
    });

    expect(result.current.isCompleted).toBe(false);
    expect(result.current.activeChallenge).toBeNull();
  });
});
```

---

## 📋 CHALLENGE_MANAGEMENT

### Admin Interface

```typescript
function ChallengeAdminPanel() {
  const [challenges, setChallenges] = useState(POTENTIAL_CHALLENGES);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'visual' | 'technical' | 'logic'>('all');

  const filteredChallenges =
    selectedCategory === 'all'
      ? challenges
      : challenges.filter((c) => c.category === selectedCategory);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Challenge Manager</h2>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setSelectedCategory('all')}>All</button>
        <button onClick={() => setSelectedCategory('visual')}>Visual</button>
        <button onClick={() => setSelectedCategory('technical')}>Technical</button>
        <button onClick={() => setSelectedCategory('logic')}>Logic</button>
      </div>

      <div className="grid gap-4">
        {filteredChallenges.map((challenge) => (
          <div key={challenge.id} className="p-4 border rounded">
            <h3 className="font-bold">{challenge.label}</h3>
            <p className="text-sm text-muted-foreground">{challenge.hint}</p>
            <span className="text-xs uppercase px-2 py-1 bg-accent rounded">
              {challenge.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 UI_VARIATIONS

### Challenge Presentation Styles

**Minimalist:**

```typescript
<div className="mt-6 p-4 border-l-4 border-primary bg-muted/30">
  <p className="text-sm font-medium">{activeChallenge.label}</p>
  <p className="text-xs text-muted-foreground mt-1">{activeChallenge.hint}</p>
</div>
```

**Gamified:**

```typescript
<div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
  <div className="flex items-center gap-3 mb-3">
    <span className="text-2xl">🎮</span>
    <h4 className="font-black uppercase tracking-wide text-primary">
      Security Challenge
    </h4>
  </div>

  <div className="space-y-2">
    <p className="font-bold">{activeChallenge.label}</p>
    <p className="text-sm text-muted-foreground">{activeChallenge.hint}</p>
  </div>

  {activeChallenge.category === 'visual' && (
    <div className="mt-4 flex items-center gap-2 text-xs text-primary">
      <span>👀</span>
      <span>Look around the portfolio to find the hidden object</span>
    </div>
  )}
</div>
```

**Cryptic:**

```typescript
<div className="mt-6 p-6 rounded-lg bg-black/80 border border-green-500 font-mono text-green-500">
  <div className="mb-2">
    <span className="animate-pulse">$</span> SECURITY_VERIFICATION_REQUIRED
  </div>

  <div className="text-sm">
    <p>CHALLENGE_ID: {activeChallenge.id}</p>
    <p>OBJECTIVE: {activeChallenge.label}</p>
    <p>HINT: {activeChallenge.hint}</p>
  </div>

  <div className="mt-4 text-xs opacity-70">
    [System awaiting user interaction...]
  </div>
</div>
```

---

## 🚀 ADVANCED_FEATURES

### Challenge Hints System

```typescript
function ChallengeWithHints({ challenge }) {
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const hints = [
    challenge.hint, // Initial hint
    'Try scrolling to the upper atmosphere', // Hint 2
    'Look for a glowing object near the top', // Hint 3
  ];

  const revealNextHint = () => {
    if (hintsRevealed < hints.length - 1) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      <h4>{challenge.label}</h4>

      {hints.slice(0, hintsRevealed + 1).map((hint, i) => (
        <p key={i} className="text-sm text-muted-foreground">
          💡 Hint {i + 1}: {hint}
        </p>
      ))}

      {hintsRevealed < hints.length - 1 && (
        <button onClick={revealNextHint} className="text-xs underline">
          Need another hint?
        </button>
      )}
    </div>
  );
}
```

---

### Challenge Timer

```typescript
function TimedChallenge({ challenge, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete(false); // Failed
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4>{challenge.label}</h4>
        <span className={cn('font-mono', timeLeft < 10 && 'text-red-500')}>
          {timeLeft}s
        </span>
      </div>

      <p className="text-sm">{challenge.hint}</p>
    </div>
  );
}
```

---

### Multi-Step Challenges

```typescript
const MULTI_STEP_CHALLENGE = {
  id: 'scavenger-hunt',
  category: 'visual',
  label: 'Atmospheric Scavenger Hunt',
  steps: [
    { target: 'bird', hint: 'Find the bird in Troposphere' },
    { target: 'blimp', hint: 'Now find the blimp in Stratosphere' },
    { target: 'iss', hint: 'Finally, locate the ISS' },
  ],
};

function MultiStepChallenge({ challenge }) {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeChallenge } = useEasterEggChallenge();

  const handleStepComplete = (id: string) => {
    if (id === challenge.steps[currentStep].target) {
      if (currentStep === challenge.steps.length - 1) {
        completeChallenge(challenge.id);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  return (
    <div>
      <h4>{challenge.label}</h4>
      <p className="text-sm mb-2">
        Step {currentStep + 1} of {challenge.steps.length}
      </p>
      <p className="text-sm text-muted-foreground">
        {challenge.steps[currentStep].hint}
      </p>
    </div>
  );
}
```

---

## 📊 ANALYTICS_TRACKING

### Challenge Performance Metrics

```typescript
import { trackEvent } from '@aazucena/analytics';

function useChallengeTelemetry(challenge: Challenge) {
  const startTime = useRef(Date.now());

  const trackChallengeStart = () => {
    trackEvent({
      category: 'challenge',
      action: 'start',
      label: challenge.id,
      metadata: {
        category: challenge.category,
        label: challenge.label,
      },
    });
  };

  const trackChallengeComplete = (success: boolean) => {
    const duration = Date.now() - startTime.current;

    trackEvent({
      category: 'challenge',
      action: success ? 'complete' : 'fail',
      label: challenge.id,
      value: duration, // Time to complete (ms)
      metadata: {
        category: challenge.category,
        duration,
      },
    });
  };

  useEffect(() => {
    trackChallengeStart();
  }, []);

  return { trackChallengeComplete };
}
```

**Metrics to Track:**
- Challenge assignment (which challenge was shown)
- Time to complete
- Success rate per challenge type
- Hint usage
- Abandonment rate

---

**AUTHOR:** aazucena_firewall_intelligence
