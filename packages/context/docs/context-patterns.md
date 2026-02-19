# Context Patterns

## SUMMARY

Best practices for composing React contexts, optimizing performance, and testing context-driven applications using @aazucena/context providers.

---

## 🏗️ PROVIDER_NESTING

### Recommended Nesting Order

Context providers should be nested in order of dependency and scope:

```typescript
import {
  TelemetryProvider,
  AnimationProvider,
  PortfolioProvider,
  DataProvider,
  FormProvider,
} from '@aazucena/context';

function App({ children }) {
  return (
    <TelemetryProvider config={{ baseUrl: ANALYTICS_URL, secretKey: API_KEY }}>
      {/* Foundation: Analytics configuration */}
      <AnimationProvider>
        {/* Foundation: Device capabilities */}
        <PortfolioProvider totalSections={8}>
          {/* Navigation: Section state */}
          <DataProvider data={sections} content={homepage} portfolio={portfolio}>
            {/* Data: CMS content */}
            <FormProvider>
              {/* Feature: Form state (scoped to form pages) */}
              {children}
            </FormProvider>
          </DataProvider>
        </PortfolioProvider>
      </AnimationProvider>
    </TelemetryProvider>
  );
}
```

**Nesting Hierarchy:**

1. **Foundation Contexts** (Telemetry, Animation) - No dependencies
2. **Navigation Contexts** (Portfolio) - May depend on Animation
3. **Data Contexts** (Data) - May depend on Navigation
4. **Feature Contexts** (Form) - May depend on Data

---

### Why Order Matters

```typescript
// ❌ WRONG: DataProvider before AnimationProvider
<DataProvider>
  <AnimationProvider>
    {/* AnimationProvider cannot access DataContext */}
  </AnimationProvider>
</DataProvider>

// ✅ CORRECT: Foundation first, data second
<AnimationProvider>
  <DataProvider>
    {/* DataProvider can access AnimationContext if needed */}
  </DataProvider>
</AnimationProvider>
```

---

## ⚡ PERFORMANCE_OPTIMIZATION

### Memoization Pattern

Always memoize context values to prevent unnecessary re-renders:

```typescript
import { createContext, useMemo, useState, ReactNode } from 'react';

interface MyContextValue {
  data: string;
  updateData: (newData: string) => void;
}

const MyContext = createContext<MyContextValue | null>(null);

function MyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState('initial');

  // ❌ WRONG: Creates new object on every render
  // const value = {
  //   data,
  //   updateData: setData,
  // };

  // ✅ CORRECT: Memoized value
  const value = useMemo(
    () => ({
      data,
      updateData: setData,
    }),
    [data] // Only recreate when data changes
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

---

### Selective Re-renders with Split Contexts

Split contexts when different parts update at different frequencies:

```typescript
// ❌ INEFFICIENT: One context with mixed update frequencies
interface AppContextValue {
  user: User;              // Updates rarely
  scrollPosition: number;  // Updates constantly
}

// Every scroll triggers re-render of all consumers

// ✅ EFFICIENT: Split into two contexts
interface UserContextValue {
  user: User;
  updateUser: (user: User) => void;
}

interface ScrollContextValue {
  scrollPosition: number;
}

// Components can subscribe to only what they need
function UserProfile() {
  const { user } = useUser(); // Only re-renders on user change
  return <div>{user.name}</div>;
}

function ScrollIndicator() {
  const { scrollPosition } = useScroll(); // Only re-renders on scroll
  return <div>{scrollPosition}px</div>;
}
```

---

### Context Selector Pattern

Use selectors to subscribe to specific parts of context:

```typescript
import { createContext, useContext, useSyncExternalStore } from 'react';

interface StoreValue {
  user: User;
  settings: Settings;
  theme: Theme;
}

function createStore(initialValue: StoreValue) {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  return {
    getValue: () => value,
    setValue: (newValue: StoreValue) => {
      value = newValue;
      subscribers.forEach((callback) => callback());
    },
    subscribe: (callback: () => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };
}

const StoreContext = createContext<ReturnType<typeof createStore> | null>(null);

function StoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => createStore({ user, settings, theme }), []);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

// Selector hook - only re-renders when selected value changes
function useStoreSelector<T>(selector: (state: StoreValue) => T): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStoreSelector must be used within StoreProvider');

  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getValue()),
    () => selector(store.getValue())
  );
}

// Usage - component only re-renders when user.name changes
function UserName() {
  const userName = useStoreSelector((state) => state.user.name);
  return <div>{userName}</div>;
}
```

---

## 🧩 COMPOSITION_PATTERNS

### Compound Context Pattern

Create a single provider that composes multiple contexts:

```typescript
import { AnimationProvider, PortfolioProvider, DataProvider } from '@aazucena/context';

function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AnimationProvider>
      <PortfolioProvider totalSections={8}>
        <DataProvider data={data} content={content} portfolio={portfolio}>
          {children}
        </DataProvider>
      </PortfolioProvider>
    </AnimationProvider>
  );
}

// Usage
function App() {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
}
```

---

### Context Bridge Pattern

Bridge contexts across component boundaries:

```typescript
import { useAnimation, usePortfolio } from '@aazucena/context';

interface BridgedContextValue {
  shouldAnimate: boolean;
  animationQuality: 'low' | 'medium' | 'high';
  currentView: string;
}

const BridgedContext = createContext<BridgedContextValue | null>(null);

function BridgedProvider({ children }: { children: ReactNode }) {
  const { capabilities, performanceTier } = useAnimation();
  const { currentSection } = usePortfolio();

  const value = useMemo(
    () => ({
      shouldAnimate: capabilities.canUseHeavyAnimations,
      animationQuality: performanceTier,
      currentView: `section-${currentSection}`,
    }),
    [capabilities, performanceTier, currentSection]
  );

  return <BridgedContext.Provider value={value}>{children}</BridgedContext.Provider>;
}

function useBridged() {
  const context = useContext(BridgedContext);
  if (!context) throw new Error('useBridged must be used within BridgedProvider');
  return context;
}
```

---

### Lazy Context Loading

Defer context initialization until needed:

```typescript
import { lazy, Suspense } from 'react';

const FormProvider = lazy(() => import('@aazucena/context').then((mod) => ({ default: mod.FormProvider })));

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AnimationProvider>
      <PortfolioProvider totalSections={8}>
        {showForm ? (
          <Suspense fallback={<div>Loading form...</div>}>
            <FormProvider>
              <ContactForm />
            </FormProvider>
          </Suspense>
        ) : (
          <HomePage onShowForm={() => setShowForm(true)} />
        )}
      </PortfolioProvider>
    </AnimationProvider>
  );
}
```

---

## 🧪 TESTING_PATTERNS

### Test Wrapper Pattern

Create reusable test wrappers with contexts:

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AnimationProvider, PortfolioProvider, DataProvider } from '@aazucena/context';

interface WrapperOptions {
  animation?: Partial<AnimationContextValue>;
  portfolio?: Partial<PortfolioContextValue>;
  data?: Partial<DataContextValue>;
}

function createWrapper(options: WrapperOptions = {}) {
  return function Wrapper({ children }: { children: ReactElement }) {
    return (
      <AnimationProvider {...options.animation}>
        <PortfolioProvider totalSections={8} {...options.portfolio}>
          <DataProvider {...options.data}>{children}</DataProvider>
        </PortfolioProvider>
      </AnimationProvider>
    );
  };
}

function renderWithContexts(ui: ReactElement, options: WrapperOptions = {}) {
  return render(ui, {
    wrapper: createWrapper(options),
  });
}

// Usage in tests
test('renders with custom context values', () => {
  const { getByText } = renderWithContexts(<MyComponent />, {
    animation: { performanceTier: 'high' },
    portfolio: { currentSection: 3 },
  });

  expect(getByText('Section 3')).toBeInTheDocument();
});
```

---

### Mocking Context Values

Mock specific context values for isolated testing:

```typescript
import { vi } from 'vitest';
import * as context from '@aazucena/context';

describe('MyComponent', () => {
  beforeEach(() => {
    vi.spyOn(context, 'useAnimation').mockReturnValue({
      capabilities: { canUseHeavyAnimations: true, gpu: true },
      soundEnabled: false,
      setSoundEnabled: vi.fn(),
      performanceTier: 'high',
    });

    vi.spyOn(context, 'usePortfolio').mockReturnValue({
      currentSection: 2,
      scrollProgress: 0.5,
      navigateToSection: vi.fn(),
      activeModal: null,
      openModal: vi.fn(),
      closeModal: vi.fn(),
      activePanels: [],
      togglePanel: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders with mocked context', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Section 2')).toBeInTheDocument();
  });
});
```

---

### Integration Testing with Contexts

Test interactions across multiple contexts:

```typescript
import { renderWithContexts } from './test-utils';
import { screen, fireEvent, waitFor } from '@testing-library/react';

test('navigation updates scroll progress', async () => {
  const { getByRole } = renderWithContexts(<App />);

  const nextButton = getByRole('button', { name: /next section/i });
  fireEvent.click(nextButton);

  await waitFor(() => {
    const progressIndicator = screen.getByTestId('scroll-progress');
    expect(progressIndicator).toHaveTextContent('12%'); // 1/8 sections
  });
});

test('animation quality adapts to performance tier', async () => {
  const { rerender } = renderWithContexts(<AnimatedComponent />, {
    animation: { performanceTier: 'low' },
  });

  expect(screen.queryByTestId('three-js-scene')).not.toBeInTheDocument();

  rerender(
    <AnimationProvider performanceTier="high">
      <AnimatedComponent />
    </AnimationProvider>
  );

  expect(screen.getByTestId('three-js-scene')).toBeInTheDocument();
});
```

---

## 🚫 ANTI_PATTERNS

### Avoid Over-Nesting

```typescript
// ❌ BAD: Unnecessary nesting
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AnalyticsProvider>
              <FeatureFlagProvider>
                <UserPreferencesProvider>
                  {children}
                </UserPreferencesProvider>
              </FeatureFlagProvider>
            </AnalyticsProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

// ✅ GOOD: Compose related contexts
function CoreProvider({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}

function DataProvider({ children }) {
  return (
    <AuthProvider>
      <UserPreferencesProvider>{children}</UserPreferencesProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <CoreProvider>
      <DataProvider>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </DataProvider>
    </CoreProvider>
  );
}
```

---

### Avoid Context for Frequently Changing Values

```typescript
// ❌ BAD: Mouse position in context (updates 60 times/second)
const MouseContext = createContext({ x: 0, y: 0 });

function MouseProvider({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <MouseContext.Provider value={position}>{children}</MouseContext.Provider>;
}

// ✅ GOOD: Use local state or external store
function Component() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <div>{/* Use position locally */}</div>;
}
```

---

### Avoid Mixing State and Props

```typescript
// ❌ BAD: Mixing context state with props
function MyProvider({ children, initialValue }) {
  const [value, setValue] = useState(initialValue);

  // initialValue change won't update context
  return <MyContext.Provider value={{ value, setValue }}>{children}</MyContext.Provider>;
}

// ✅ GOOD: Use controlled pattern or only context
function MyProvider({ children, value: externalValue, onChange }) {
  // Controlled by parent
  return (
    <MyContext.Provider value={{ value: externalValue, onChange }}>
      {children}
    </MyContext.Provider>
  );
}

// Or fully self-contained
function MyProvider({ children }) {
  const [value, setValue] = useState('default');
  return <MyContext.Provider value={{ value, setValue }}>{children}</MyContext.Provider>;
}
```

---

## 🔧 DEBUGGING_CONTEXTS

### React DevTools Integration

```typescript
// Add display names for easier debugging
AnimationProvider.displayName = 'AnimationProvider';
PortfolioProvider.displayName = 'PortfolioProvider';
DataProvider.displayName = 'DataProvider';

const AnimationContext = createContext<AnimationContextValue | null>(null);
AnimationContext.displayName = 'AnimationContext';
```

---

### Context Logging Hook

```typescript
import { useEffect, useRef } from 'react';

function useContextLogger(contextName: string, contextValue: any) {
  const previousValue = useRef(contextValue);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${contextName}] Updated:`, {
        previous: previousValue.current,
        current: contextValue,
      });
      previousValue.current = contextValue;
    }
  }, [contextName, contextValue]);
}

// Usage
function AnimationProvider({ children }) {
  const value = useMemo(/* ... */);
  useContextLogger('AnimationContext', value);

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}
```

---

### Context Validation

```typescript
import { z } from 'zod';

const AnimationContextSchema = z.object({
  capabilities: z.object({
    canUseHeavyAnimations: z.boolean(),
    gpu: z.boolean(),
  }),
  performanceTier: z.enum(['low', 'medium', 'high']),
  soundEnabled: z.boolean(),
  setSoundEnabled: z.function(),
});

function AnimationProvider({ children }) {
  const value = useMemo(/* ... */);

  // Validate context value in development
  if (process.env.NODE_ENV === 'development') {
    try {
      AnimationContextSchema.parse(value);
    } catch (error) {
      console.error('AnimationContext validation failed:', error);
    }
  }

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}
```

---

**AUTHOR:** aazucena_context_intelligence
