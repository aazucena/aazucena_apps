# @aazucena/context : State_Intelligence_Orchestrator

## SUMMARY

Centralized React Context providers for global state management across the portfolio. Provides 5 specialized contexts for animation state, portfolio navigation, CMS data, form state, and telemetry configuration with hooks for easy consumption.

---

## 🛠️ TOOLKIT_MANIFEST

| System               | Protocol         | Description                                                 |
| :------------------- | :--------------- | :---------------------------------------------------------- |
| **AnimationContext** | Device_State     | Device capabilities, sound settings, performance tiers.     |
| **PortfolioContext** | Navigation_State | Section navigation, scroll progress, modal/panel state.     |
| **DataContext**      | CMS_Provider     | CMS data provider (homepage, portfolio, section registry).  |
| **FormContext**      | Multi_Step_State | Multi-step form state, validation, submission tracking.     |
| **TelemetryContext** | Analytics_Config | Analytics API configuration for meta-framework agnosticism. |

---

## 🏗️ SYSTEM_FACTORIES

### [AnimationContext] : The_Performance_Gatekeeper

- **Location:** `src/AnimationContext.tsx`
- **Logic:** Device capability detection, sound toggle, performance tier management.
- **Exports:** `AnimationProvider`, `useAnimation()`.

### [PortfolioContext] : The_Navigation_Engine

- **Location:** `src/PortfolioContext.tsx`
- **Logic:** Section navigation (0-7), scroll progress tracking, modal/panel state.
- **Exports:** `PortfolioProvider`, `usePortfolio()`.

### [DataContext] : The_CMS_Bridge

- **Location:** `src/DataContext.tsx`
- **Logic:** CMS data provider with section registry and component mapping.
- **Exports:** `DataProvider`, `useDataContext()`, `useSectionData()`.

### [FormContext] : The_Wizard_Controller

- **Location:** `src/FormContext.tsx`
- **Logic:** Multi-step form state machine with validation and submission tracking.
- **Exports:** `FormProvider`, `useFormContext()`.

### [TelemetryContext] : The_Analytics_Gateway

- **Location:** `src/TelemetryContext.tsx`
- **Logic:** Analytics API configuration for framework-agnostic telemetry ingestion.
- **Exports:** `TelemetryProvider`, `useTelemetryConfig()`.

---

## 🚦 USAGE_PROTOCOLS

### Application Setup

```typescript
import {
  AnimationProvider,
  PortfolioProvider,
  DataProvider,
  TelemetryProvider
} from '@aazucena/context';

function App({ children }) {
  return (
    <TelemetryProvider config={{ baseUrl: ANALYTICS_URL, secretKey: API_KEY }}>
      <AnimationProvider>
        <PortfolioProvider totalSections={8}>
          <DataProvider data={cmsData} content={homepageContent} portfolio={portfolioMetadata}>
            {children}
          </DataProvider>
        </PortfolioProvider>
      </AnimationProvider>
    </TelemetryProvider>
  );
}
```

### Animation Context

```typescript
import { useAnimation } from '@aazucena/context';

const { capabilities, soundEnabled, setSoundEnabled, performanceTier } = useAnimation();

if (capabilities.canUseHeavyAnimations) {
  // Enable Three.js scene
}

const quality = performanceTier === 'high' ? 'ultra' : 'medium';
```

### Portfolio Context

```typescript
import { usePortfolio } from '@aazucena/context';

const {
  currentSection,
  scrollProgress,
  navigateToSection,
  activeModal,
  openModal,
  closeModal
} = usePortfolio();

<button onClick={() => navigateToSection(3)}>Go to Section 3</button>
<div>Scroll: {Math.round(scrollProgress * 100)}%</div>
```

### Data Context

```typescript
import { useDataContext, useSectionData } from '@aazucena/context';

const { homepage, portfolio, sections } = useDataContext();
const heroData = useSectionData('hero');

<h1>{heroData.title}</h1>
<p>Total Projects: {portfolio.totalProjects}</p>
```

---

## ✅ VERIFICATION_SUITE

- **Single Responsibility:** Each context handles one domain.
- **Performance:** Memoized values, selective re-renders.
- **Type Safety:** Full TypeScript support with strict mode.
- **Testability:** Contexts are easily mockable.
- **Composition:** Contexts can be nested arbitrarily.

---

## 🔗 DEPENDENCY_GRAPH

**Internal:** @aazucena/types, @aazucena/constants, @aazucena/utils
**External:** react

**Compatible:** ✅ Next.js | ✅ Astro | ✅ Remix | ✅ Vite

---

## 📚 TUTORIAL_GUIDE

### Quick Start

```bash
# 1. Install dependencies (handled by monorepo)
pnpm install

# 2. Wrap your app with providers
import { AnimationProvider, PortfolioProvider, DataProvider } from '@aazucena/context';

# 3. Use hooks in components
import { useAnimation, usePortfolio, useDataContext } from '@aazucena/context';
```

### Common Patterns

#### Multi-Provider Setup

```typescript
import {
  AnimationProvider,
  PortfolioProvider,
  DataProvider,
  FormProvider,
  TelemetryProvider,
} from '@aazucena/context';

function App({ children }) {
  // CMS data fetched at app level
  const cmsData = await fetchHomepage();
  const portfolio = await fetchPortfolio();

  return (
    <TelemetryProvider config={{ baseUrl: process.env.ANALYTICS_URL, secretKey: process.env.API_KEY }}>
      <AnimationProvider>
        <PortfolioProvider totalSections={8}>
          <DataProvider
            data={cmsData.sections}
            content={cmsData.homepage}
            portfolio={portfolio}
          >
            <FormProvider>
              {children}
            </FormProvider>
          </DataProvider>
        </PortfolioProvider>
      </AnimationProvider>
    </TelemetryProvider>
  );
}
```

#### Animation Context Usage

```typescript
import { useAnimation } from '@aazucena/context';
import { useEffect } from 'react';

function AnimatedSection() {
  const {
    capabilities,
    soundEnabled,
    setSoundEnabled,
    performanceTier,
  } = useAnimation();

  // Check device capabilities before rendering heavy animations
  const shouldUseThreeJS = capabilities.canUseHeavyAnimations;
  const shouldUsePixiJS = capabilities.gpu && performanceTier !== 'low';

  // Adjust animation quality based on performance tier
  const particleCount = performanceTier === 'high' ? 200 : performanceTier === 'medium' ? 100 : 50;
  const textureQuality = performanceTier === 'high' ? 2048 : 1024;

  useEffect(() => {
    if (capabilities.canUseHeavyAnimations) {
      // Initialize Three.js scene
      console.log('Device can handle heavy animations');
    } else {
      // Fallback to CSS animations
      console.log('Using lightweight animations');
    }
  }, [capabilities]);

  return (
    <div>
      <button onClick={() => setSoundEnabled(!soundEnabled)}>
        {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
      </button>

      {shouldUseThreeJS ? (
        <ThreeJSCanvas quality={textureQuality} />
      ) : (
        <CSSAnimatedBackground />
      )}

      {shouldUsePixiJS && (
        <PixiJSParticles count={particleCount} />
      )}
    </div>
  );
}
```

#### Portfolio Navigation Context

```typescript
import { usePortfolio } from '@aazucena/context';
import { useEffect } from 'react';

function Navigation() {
  const {
    currentSection,
    scrollProgress,
    navigateToSection,
    activeModal,
    openModal,
    closeModal,
    activePanels,
    togglePanel,
  } = usePortfolio();

  // Sync URL with current section
  useEffect(() => {
    const sectionNames = ['hero', 'about', 'projects', 'experience', 'skills', 'testimonials', 'blog', 'contact'];
    window.history.pushState(null, '', `#${sectionNames[currentSection]}`);
  }, [currentSection]);

  // Show scroll progress indicator
  const progressPercent = Math.round(scrollProgress * 100);

  return (
    <nav>
      {/* Section Navigation */}
      <ul>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((section) => (
          <li key={section}>
            <button
              onClick={() => navigateToSection(section)}
              className={currentSection === section ? 'active' : ''}
            >
              Section {section}
            </button>
          </li>
        ))}
      </ul>

      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
        <div
          className="h-full bg-primary-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Modals */}
      <button onClick={() => openModal('experience')}>
        View Experience Details
      </button>

      {activeModal === 'experience' && (
        <div className="modal">
          <button onClick={closeModal}>Close</button>
          {/* Modal content */}
        </div>
      )}

      {/* Panels */}
      <button onClick={() => togglePanel('settings')}>
        {activePanels.includes('settings') ? 'Hide' : 'Show'} Settings
      </button>
    </nav>
  );
}
```

#### Data Context Usage

```typescript
import {
  useDataContext,
  useSectionData,
  usePortfolioData,
  useHomepageData,
  useRegistry,
} from '@aazucena/context';

function HeroSection() {
  // Get all CMS data
  const { homepage, portfolio, sections, registry } = useDataContext();

  // Or get section-specific data
  const heroData = useSectionData('hero');
  const aboutData = useSectionData('about');

  // Or get specific data slices
  const portfolioData = usePortfolioData();
  const homepageData = useHomepageData();
  const componentRegistry = useRegistry();

  return (
    <section>
      <h1>{heroData.title}</h1>
      <p>{heroData.tagline}</p>
      <p>Total Projects: {portfolioData.totalProjects}</p>
      <p>Years of Experience: {portfolioData.yearsOfExperience}</p>

      {/* Dynamic component rendering using registry */}
      {sections.map((section) => {
        const Component = registry[section.id];
        return Component ? <Component key={section.id} data={section} /> : null;
      })}
    </section>
  );
}
```

#### Form Context Usage

```typescript
import { useFormContext } from '@aazucena/context';
import { useEffect } from 'react';

function MultiStepForm() {
  const {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    nextStep,
    previousStep,
    goToStep,
    formData,
    updateFormData,
    resetForm,
  } = useFormContext();

  // Save to localStorage on each step
  useEffect(() => {
    localStorage.setItem('formProgress', JSON.stringify({ currentStep, formData }));
  }, [currentStep, formData]);

  // Restore on mount
  useEffect(() => {
    const saved = localStorage.getItem('formProgress');
    if (saved) {
      const { currentStep: savedStep, formData: savedData } = JSON.parse(saved);
      goToStep(savedStep);
      updateFormData(savedData);
    }
  }, []);

  const handleSubmit = async () => {
    if (currentStep === totalSteps - 1) {
      // Final step - submit form
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      resetForm();
      localStorage.removeItem('formProgress');
    } else {
      nextStep();
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <div className="mb-4">
        <p>Step {currentStep + 1} of {totalSteps}</p>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${
                i === currentStep ? 'bg-primary-500' : i < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step-specific fields */}
      {currentStep === 0 && (
        <>
          <label>Name</label>
          <input
            value={formData.name || ''}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
          <label>Email</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
        </>
      )}

      {currentStep === 1 && (
        <>
          <label>Message</label>
          <textarea
            value={formData.message || ''}
            onChange={(e) => updateFormData({ message: e.target.value })}
          />
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button type="button" onClick={previousStep} disabled={!canGoPrevious}>
          Previous
        </button>
        <button type="button" onClick={resetForm}>
          Reset
        </button>
        <button type="submit" disabled={!canGoNext}>
          {currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  );
}
```

#### Telemetry Context Usage

```typescript
import { useTelemetryConfig } from '@aazucena/context';

function AnalyticsWrapper({ children }) {
  const { baseUrl, secretKey } = useTelemetryConfig();

  const trackEvent = async (event: string, metadata?: Record<string, any>) => {
    if (!baseUrl) return; // Telemetry not configured

    await fetch(`${baseUrl}/api/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-key': secretKey || '',
      },
      body: JSON.stringify({
        event,
        timestamp: Date.now(),
        metadata,
      }),
    });
  };

  // Track page views
  useEffect(() => {
    trackEvent('PageView', { url: window.location.pathname });

    // Track time on page
    const startTime = Date.now();
    return () => {
      const timeOnPage = Date.now() - startTime;
      trackEvent('PageLeave', {
        url: window.location.pathname,
        duration: timeOnPage,
      });
    };
  }, []);

  return (
    <div onClick={(e) => {
      if (e.target instanceof HTMLButtonElement) {
        trackEvent('ButtonClick', {
          label: e.target.textContent,
          id: e.target.id,
        });
      }
    }}>
      {children}
    </div>
  );
}
```

### Advanced Usage

#### Custom Context Integration

```typescript
import { createContext, useContext } from 'react';
import { useAnimation, usePortfolio } from '@aazucena/context';

// Create custom context that uses animation + portfolio contexts
const CustomContext = createContext<any>(null);

function CustomProvider({ children }) {
  const animation = useAnimation();
  const portfolio = usePortfolio();

  const value = {
    // Combine contexts with custom logic
    isReady: animation.capabilities && portfolio.currentSection >= 0,
    shouldAnimate: animation.capabilities.canUseHeavyAnimations && portfolio.scrollProgress > 0.1,
  };

  return <CustomContext.Provider value={value}>{children}</CustomContext.Provider>;
}

function useCustomContext() {
  const context = useContext(CustomContext);
  if (!context) throw new Error('useCustomContext must be used within CustomProvider');
  return context;
}
```

#### Context Testing

```typescript
import { render } from '@testing-library/react';
import { AnimationProvider, PortfolioProvider } from '@aazucena/context';

function renderWithContexts(component: React.ReactElement) {
  return render(
    <AnimationProvider>
      <PortfolioProvider totalSections={8}>
        {component}
      </PortfolioProvider>
    </AnimationProvider>
  );
}

// Usage in tests
test('renders with contexts', () => {
  const { getByText } = renderWithContexts(<MyComponent />);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

### Troubleshooting

#### Context Hook Error

```typescript
// ❌ Wrong: Using hook outside provider
function Component() {
  const { currentSection } = usePortfolio(); // Error: hook used outside provider
  return <div>{currentSection}</div>;
}

// ✅ Correct: Wrap with provider first
function App() {
  return (
    <PortfolioProvider totalSections={8}>
      <Component />
    </PortfolioProvider>
  );
}
```

#### Stale Context Data

```typescript
// ❌ Wrong: Not memoizing context value
function MyProvider({ children }) {
  const value = { data: someData }; // New object on every render
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// ✅ Correct: Memoize context value
import { useMemo } from 'react';

function MyProvider({ children }) {
  const value = useMemo(() => ({ data: someData }), [someData]);
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

#### Provider Nesting Order

```typescript
// ❌ Wrong: DataProvider before AnimationProvider
<DataProvider>
  <AnimationProvider>
    {children}
  </AnimationProvider>
</DataProvider>

// ✅ Correct: Foundation contexts first, then data contexts
<TelemetryProvider>
  <AnimationProvider>
    <PortfolioProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </PortfolioProvider>
  </AnimationProvider>
</TelemetryProvider>
```

---

**VERSION:** 0.0.0
**STATUS:** Development
**PROVIDER:** aazucena_intelligence_engine
