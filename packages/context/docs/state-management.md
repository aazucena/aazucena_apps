# State Management Guide

## SUMMARY

Strategic guide to state management architecture using @aazucena/context providers. Learn when to use each context, how to combine contexts, and best practices for local vs global state decisions.

---

## 🎯 CONTEXT_SELECTION_GUIDE

### When to Use Each Context

#### AnimationContext - Use When:

✅ **Device Capabilities Required:**

- Checking if device can handle Three.js/PixiJS
- Adapting animation quality to performance tier
- GPU detection for WebGL rendering

✅ **Sound Management:**

- Global sound on/off toggle
- Audio playback permissions

✅ **Performance Tier Detection:**

- Low/medium/high tier device classification
- Adjusting particle counts, texture quality

**Example Use Cases:**

```typescript
import { useAnimation } from '@aazucena/context';

// Conditional rendering based on device capabilities
function HeavyAnimationSection() {
  const { capabilities, performanceTier } = useAnimation();

  if (!capabilities.canUseHeavyAnimations) {
    return <LightweightAnimation />;
  }

  return <ThreeJSScene quality={performanceTier === 'high' ? 'ultra' : 'medium'} />;
}

// Sound toggle
function AudioControls() {
  const { soundEnabled, setSoundEnabled } = useAnimation();

  return (
    <button onClick={() => setSoundEnabled(!soundEnabled)}>
      {soundEnabled ? '🔊' : '🔇'}
    </button>
  );
}
```

---

#### PortfolioContext - Use When:

✅ **Section Navigation:**

- Navigating between 8 portfolio sections
- Tracking current section number
- URL sync with section state

✅ **Scroll Tracking:**

- Reading scroll progress (0-1)
- Triggering effects based on scroll position
- Atmospheric layer transitions

✅ **Modal/Panel Management:**

- Opening/closing modals (Experience details, etc.)
- Toggling side panels (Settings, Info)
- Managing overlay state

**Example Use Cases:**

```typescript
import { usePortfolio } from '@aazucena/context';

// Section navigation
function SectionNav() {
  const { currentSection, navigateToSection } = usePortfolio();

  return (
    <nav>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((section) => (
        <button
          key={section}
          onClick={() => navigateToSection(section)}
          className={currentSection === section ? 'active' : ''}
        >
          Section {section}
        </button>
      ))}
    </nav>
  );
}

// Scroll-based effects
function AtmosphericBackground() {
  const { scrollProgress } = usePortfolio();

  const layer = scrollProgress < 0.25 ? 'troposphere' : scrollProgress < 0.5 ? 'stratosphere' : 'mesosphere';

  return <Background layer={layer} />;
}

// Modal management
function ExperienceCard({ experience }) {
  const { openModal } = usePortfolio();

  return (
    <div onClick={() => openModal('experience')}>
      <h3>{experience.company}</h3>
    </div>
  );
}
```

---

#### DataContext - Use When:

✅ **CMS Data Access:**

- Reading homepage configuration
- Accessing portfolio metadata
- Fetching section-specific data

✅ **Dynamic Content Rendering:**

- Rendering sections from CMS registry
- Component mapping from Strapi data
- Template-driven layouts

✅ **Data-Driven UI:**

- Displaying project counts, years of experience
- Rendering skills, awards, testimonials
- Blog post listings

**Example Use Cases:**

```typescript
import { useDataContext, useSectionData } from '@aazucena/context';

// Access homepage data
function Hero() {
  const heroData = useSectionData('hero');

  return (
    <section>
      <h1>{heroData.title}</h1>
      <p>{heroData.tagline}</p>
    </section>
  );
}

// Display portfolio metadata
function Stats() {
  const { portfolio } = useDataContext();

  return (
    <div>
      <StatCard value={portfolio.totalProjects} label="Projects" />
      <StatCard value={portfolio.yearsOfExperience} label="Years" />
    </div>
  );
}

// Dynamic section rendering
function DynamicSections() {
  const { sections, registry } = useDataContext();

  return (
    <>
      {sections.map((section) => {
        const Component = registry[section.id];
        return Component ? <Component key={section.id} data={section} /> : null;
      })}
    </>
  );
}
```

---

#### FormContext - Use When:

✅ **Multi-Step Forms:**

- Contact forms with multiple steps
- Onboarding wizards
- Survey flows

✅ **Form State Persistence:**

- Saving progress to localStorage
- Restoring form state on page reload
- Cross-page form continuation

✅ **Step Validation:**

- Validating each step before proceeding
- Conditional step visibility
- Progress tracking

**Example Use Cases:**

```typescript
import { useFormContext } from '@aazucena/context';

// Multi-step form navigation
function FormWizard() {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    canGoNext,
    canGoPrevious,
  } = useFormContext();

  return (
    <div>
      <ProgressBar current={currentStep + 1} total={totalSteps} />
      <StepContent step={currentStep} />
      <div>
        <button onClick={previousStep} disabled={!canGoPrevious}>
          Previous
        </button>
        <button onClick={nextStep} disabled={!canGoNext}>
          {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}

// Form data persistence
function PersistentForm() {
  const { formData, updateFormData } = useFormContext();

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  return (
    <input
      value={formData.name || ''}
      onChange={(e) => updateFormData({ name: e.target.value })}
    />
  );
}
```

---

#### TelemetryContext - Use When:

✅ **Analytics Configuration:**

- Setting AZUCENA_LYTICS API endpoint
- Configuring API secret keys
- Environment-specific analytics URLs

✅ **Framework-Agnostic Telemetry:**

- Next.js telemetry ingestion
- Astro telemetry ingestion
- Unified analytics across apps

✅ **Event Tracking:**

- Page view tracking
- Button click analytics
- User interaction metrics

**Example Use Cases:**

```typescript
import { useTelemetryConfig } from '@aazucena/context';

// Track events
function AnalyticsTracker() {
  const { baseUrl, secretKey } = useTelemetryConfig();

  const trackEvent = async (event: string, metadata?: object) => {
    if (!baseUrl) return;

    await fetch(`${baseUrl}/api/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': secretKey || '',
      },
      body: JSON.stringify({ event, timestamp: Date.now(), metadata }),
    });
  };

  useEffect(() => {
    trackEvent('PageView', { url: window.location.pathname });
  }, []);

  return null;
}

// Conditional telemetry
function Component() {
  const { baseUrl } = useTelemetryConfig();

  const handleClick = () => {
    if (baseUrl) {
      trackButtonClick('submit');
    }
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

---

## 🔗 COMBINING_CONTEXTS

### Reading Multiple Contexts

```typescript
import { useAnimation, usePortfolio, useDataContext } from '@aazucena/context';

function SmartComponent() {
  const { capabilities, performanceTier } = useAnimation();
  const { currentSection, scrollProgress } = usePortfolio();
  const { portfolio } = useDataContext();

  // Combine context data for complex logic
  const shouldRenderHeavyAnimation =
    capabilities.canUseHeavyAnimations &&
    performanceTier === 'high' &&
    currentSection >= 2 &&
    scrollProgress > 0.1;

  const sectionTitle = `Section ${currentSection}: ${portfolio.sections[currentSection]?.title}`;

  return (
    <div>
      <h1>{sectionTitle}</h1>
      {shouldRenderHeavyAnimation && <ThreeJSScene />}
    </div>
  );
}
```

---

### Cross-Context Communication

```typescript
import { usePortfolio, useDataContext } from '@aazucena/context';

function NavigationWithPreview() {
  const { currentSection, navigateToSection } = usePortfolio();
  const { sections } = useDataContext();

  const handleNavigation = (targetSection: number) => {
    // Fetch section data before navigating
    const sectionData = sections[targetSection];

    if (sectionData) {
      navigateToSection(targetSection);
    } else {
      console.error('Section data not found');
    }
  };

  return (
    <nav>
      {sections.map((section, index) => (
        <button
          key={index}
          onClick={() => handleNavigation(index)}
          className={currentSection === index ? 'active' : ''}
        >
          {section.title}
        </button>
      ))}
    </nav>
  );
}
```

---

### Derived State from Multiple Contexts

```typescript
import { useMemo } from 'react';
import { useAnimation, usePortfolio } from '@aazucena/context';

function useDerivedState() {
  const { capabilities, performanceTier } = useAnimation();
  const { currentSection, scrollProgress } = usePortfolio();

  return useMemo(() => {
    const atmosphericLayer =
      scrollProgress < 0.25 ? 'troposphere' :
      scrollProgress < 0.5 ? 'stratosphere' :
      scrollProgress < 0.75 ? 'mesosphere' : 'exosphere';

    const animationQuality =
      performanceTier === 'high' ? 'ultra' :
      performanceTier === 'medium' ? 'high' : 'medium';

    const shouldUseGPU = capabilities.gpu && performanceTier !== 'low';

    return {
      atmosphericLayer,
      animationQuality,
      shouldUseGPU,
      isHeroSection: currentSection === 0,
      isContactSection: currentSection === 7,
    };
  }, [capabilities, performanceTier, currentSection, scrollProgress]);
}

// Usage
function AtmosphericScene() {
  const { atmosphericLayer, animationQuality, shouldUseGPU } = useDerivedState();

  return (
    <Canvas gl={{ antialias: shouldUseGPU }}>
      <Scene layer={atmosphericLayer} quality={animationQuality} />
    </Canvas>
  );
}
```

---

## 📊 LOCAL_VS_GLOBAL_STATE

### Decision Matrix

| State Type              | Scope         | Duration    | Use Context? | Use Local State? |
| :---------------------- | :------------ | :---------- | :----------- | :--------------- |
| **User authentication** | Global        | Session     | ✅ Yes       | ❌ No            |
| **Theme (dark/light)**  | Global        | Persistent  | ✅ Yes       | ❌ No            |
| **Current route**       | Global        | Navigation  | ✅ Yes       | ❌ No            |
| **Form input value**    | Local         | Component   | ❌ No        | ✅ Yes           |
| **Modal open state**    | Local/Feature | Interaction | ⚠️ Depends   | ⚠️ Depends       |
| **Animation frame**     | Local         | Render      | ❌ No        | ✅ Yes           |
| **API loading state**   | Local         | Request     | ❌ No        | ✅ Yes           |
| **Device capabilities** | Global        | Session     | ✅ Yes       | ❌ No            |

---

### When to Use Local State

```typescript
// ✅ GOOD: Local state for component-specific data
function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await fetchResults(query);
    setResults(data);
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### When to Use Context

```typescript
// ✅ GOOD: Context for cross-component shared state
const ThemeContext = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void } | null>(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Many components can read theme
function Header() {
  const { theme } = useTheme();
  return <header className={theme === 'dark' ? 'dark-header' : 'light-header'} />;
}

function Footer() {
  const { theme } = useTheme();
  return <footer className={theme === 'dark' ? 'dark-footer' : 'light-footer'} />;
}

function ThemeToggle() {
  const { toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

---

## 🎛️ STATE_SYNCHRONIZATION

### Sync Context with URL

```typescript
import { usePortfolio } from '@aazucena/context';
import { useEffect } from 'react';

function SyncPortfolioWithURL() {
  const { currentSection, navigateToSection } = usePortfolio();

  // Update URL when section changes
  useEffect(() => {
    const sectionNames = [
      'hero',
      'about',
      'projects',
      'experience',
      'skills',
      'testimonials',
      'blog',
      'contact',
    ];
    window.history.pushState(null, '', `#${sectionNames[currentSection]}`);
  }, [currentSection]);

  // Navigate to section on URL change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const sectionIndex = [
        'hero',
        'about',
        'projects',
        'experience',
        'skills',
        'testimonials',
        'blog',
        'contact',
      ].indexOf(hash);

      if (sectionIndex !== -1 && sectionIndex !== currentSection) {
        navigateToSection(sectionIndex);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentSection, navigateToSection]);

  return null;
}
```

---

### Sync Context with LocalStorage

```typescript
import { useFormContext } from '@aazucena/context';
import { useEffect } from 'react';

function PersistFormState() {
  const { formData, updateFormData, currentStep, goToStep } = useFormContext();

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('formState', JSON.stringify({ formData, currentStep }));
  }, [formData, currentStep]);

  // Restore on mount
  useEffect(() => {
    const saved = localStorage.getItem('formState');
    if (saved) {
      const { formData: savedData, currentStep: savedStep } = JSON.parse(saved);
      updateFormData(savedData);
      goToStep(savedStep);
    }
  }, []);

  return null;
}
```

---

### Sync Context with External Store

```typescript
import { useAnimation } from '@aazucena/context';
import { useEffect } from 'react';

function SyncAnimationWithAnalytics() {
  const { performanceTier, capabilities } = useAnimation();

  useEffect(() => {
    // Send performance data to analytics
    window.analytics?.track('DeviceCapabilities', {
      performanceTier,
      canUseHeavyAnimations: capabilities.canUseHeavyAnimations,
      hasGPU: capabilities.gpu,
    });
  }, [performanceTier, capabilities]);

  return null;
}
```

---

## 🚨 COMMON_PITFALLS

### Pitfall 1: Reading Context Outside Provider

```typescript
// ❌ WRONG: Context used before provider
function App() {
  const { currentSection } = usePortfolio(); // Error: used outside provider

  return (
    <PortfolioProvider totalSections={8}>
      <Content />
    </PortfolioProvider>
  );
}

// ✅ CORRECT: Use context inside provider
function App() {
  return (
    <PortfolioProvider totalSections={8}>
      <Content />
    </PortfolioProvider>
  );
}

function Content() {
  const { currentSection } = usePortfolio(); // Works
  return <div>Section {currentSection}</div>;
}
```

---

### Pitfall 2: Unnecessary Context Usage

```typescript
// ❌ WRONG: Using context for local state
const CountContext = createContext(0);

function CountProvider({ children }) {
  const [count, setCount] = useState(0);
  return <CountContext.Provider value={{ count, setCount }}>{children}</CountContext.Provider>;
}

function Counter() {
  const { count, setCount } = useContext(CountContext);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ CORRECT: Use local state
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

### Pitfall 3: Forgetting to Memoize

```typescript
// ❌ WRONG: Context value not memoized
function MyProvider({ children }) {
  const [state, setState] = useState('value');

  const value = {
    state,
    setState,
  }; // New object on every render

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// ✅ CORRECT: Memoized context value
function MyProvider({ children }) {
  const [state, setState] = useState('value');

  const value = useMemo(() => ({ state, setState }), [state]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

---

**AUTHOR:** aazucena_state_intelligence
