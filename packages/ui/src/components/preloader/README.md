# Preloader Component

A fully refactored, accessible, and performant preloader system with multiple variants and extensive customization options.

## Features

✅ **Fully Type-Safe** - TypeScript strict mode compatible with specific types (no `any`)
✅ **Accessible** - WCAG compliant with ARIA attributes and keyboard navigation
✅ **Performant** - Memoized components and optimized rendering
✅ **Flexible** - Multiple variants and extensive customization options
✅ **Error Handling** - Built-in error states with retry capability
✅ **Keyboard Navigation** - Escape to skip, Enter/Space to continue
✅ **Lazy Loading** - Intersection Observer support
✅ **Modular** - Separated hooks, components, and utilities

## Architecture

```
preloader/
├── ui/                  # Presentational components
│   ├── LoadingState.tsx
│   ├── ReadyState.tsx
│   ├── SimpleLoadingState.tsx
│   ├── SimpleReadyState.tsx
│   ├── StepIndicator.tsx
│   └── ErrorState.tsx
├── InteractivePreloader.tsx
├── SimplePreloader.tsx
└── Preloader.tsx       # Main wrapper component
```

_Note: Hooks, constants, and utilities have been migrated to `@aazucena/hooks`, `@aazucena/constants`, and `@aazucena/utils` respectively._

## Basic Usage

```tsx
import { Preloader } from '@aazucena/ui';

// Interactive variant (default)
<Preloader
  variant="interactive"
  title="Loading Your Experience"
  onComplete={() => console.log('Done!')}
/>

// Simple variant
<Preloader
  variant="simple"
  title="Loading..."
  enableSkip
/>
```

## Advanced Usage

### Custom Steps

```tsx
import { Preloader, type LoadingStep } from "@aazucena/ui";
import { Database, Code } from "@aazucena/icons";

const customSteps: LoadingStep[] = [
  {
    id: 1,
    name: "Connecting to Database",
    description: "Establishing secure connection",
    icon: Database,
    check: async () => {
      const response = await fetch("/api/health");
      return response.ok;
    },
  },
  {
    id: 2,
    name: "Loading Code",
    description: "Initializing application",
    icon: Code,
  },
];

<Preloader
  customSteps={customSteps}
  onStepComplete={(id, name) => {
    console.log(`Step ${id}: ${name} completed`);
  }}
/>;
```

### Custom Ready Component

```tsx
import { Preloader, type CustomReadyComponentProps } from "@aazucena/ui";

function CustomReady({ loadTime, onContinue }: CustomReadyComponentProps) {
  return (
    <div>
      <h2>All Set!</h2>
      <p>Loaded in {loadTime}s</p>
      <button onClick={onContinue}>Let's Go!</button>
    </div>
  );
}

<Preloader customReadyComponent={CustomReady} />;
```

### Using Hooks Independently

```tsx
import { useLoadingProgress, usePreloaderVisibility } from "@aazucena/ui";

function MyComponent() {
  const { progress, isReady, startLoading } = useLoadingProgress();
  const { isVisible, handleContinue } = usePreloaderVisibility({
    onComplete: () => console.log("Done!"),
  });

  // Your custom logic here
}
```

## Props API

### Main Props

| Prop             | Type                        | Default         | Description                     |
| ---------------- | --------------------------- | --------------- | ------------------------------- |
| `variant`        | `'interactive' \| 'simple'` | `'interactive'` | Preloader variant               |
| `minDisplayTime` | `number`                    | `1500`          | Minimum display time (ms)       |
| `maxDisplayTime` | `number`                    | `10000`         | Maximum display time (ms)       |
| `autoStart`      | `boolean`                   | `true`          | Auto-start loading              |
| `enableSkip`     | `boolean`                   | `false`         | Allow skip button               |
| `continueButton` | `boolean`                   | `true`          | Show continue button when ready |

### Content Props

| Prop                 | Type     | Default                                          | Description          |
| -------------------- | -------- | ------------------------------------------------ | -------------------- |
| `title`              | `string` | `'Preparing Your Experience'`                    | Loading title        |
| `subtitle`           | `string` | `undefined`                                      | Loading subtitle     |
| `readyTitle`         | `string` | `'Ready to Explore!'`                            | Ready state title    |
| `readySubtitle`      | `string` | `'Your experience is fully optimized and ready'` | Ready state subtitle |
| `continueButtonText` | `string` | `'Enter Website'`                                | Continue button text |

### Styling Props

| Prop               | Type                                     | Default     | Description         |
| ------------------ | ---------------------------------------- | ----------- | ------------------- |
| `style`            | `CSSProperties`                          | `undefined` | Inline styles       |
| `overlayClassName` | `string`                                 | `''`        | Overlay CSS classes |
| `cardClassName`    | `string`                                 | `''`        | Card CSS classes    |
| `enableAnimations` | `boolean`                                | `true`      | Enable animations   |
| `transitionType`   | `'fade' \| 'slide' \| 'scale' \| 'none'` | `'fade'`    | Transition type     |

### Customization Props

| Prop                   | Type            | Default     | Description              |
| ---------------------- | --------------- | ----------- | ------------------------ |
| `customSteps`          | `LoadingStep[]` | `undefined` | Custom loading steps     |
| `customReadyComponent` | `ComponentType` | `undefined` | Custom ready component   |
| `customSpinner`        | `ComponentType` | `undefined` | Custom spinner component |

### Callback Props

| Prop                | Type                                              | Description                     |
| ------------------- | ------------------------------------------------- | ------------------------------- |
| `onComplete`        | `() => void`                                      | Called when loading completes   |
| `onStepComplete`    | `(stepId: number, stepName: string) => void`      | Called when each step completes |
| `onLoadingStart`    | `() => void`                                      | Called when loading starts      |
| `onLoadingProgress` | `(progress: number, currentStep: number) => void` | Called on progress update       |
| `onSkip`            | `() => void`                                      | Called when user skips          |
| `onError`           | `(error: Error) => void`                          | Called on error                 |

### Accessibility Props

| Prop                  | Type                               | Default              | Description            |
| --------------------- | ---------------------------------- | -------------------- | ---------------------- |
| `ariaLabel`           | `string`                           | `'Loading progress'` | ARIA label             |
| `ariaLive`            | `'off' \| 'polite' \| 'assertive'` | `'polite'`           | ARIA live region       |
| `skipButtonAriaLabel` | `string`                           | `'Skip loading'`     | Skip button ARIA label |

### Performance Props

| Prop       | Type      | Default | Description                  |
| ---------- | --------- | ------- | ---------------------------- |
| `lazyLoad` | `boolean` | `false` | Only render when in viewport |
| `debug`    | `boolean` | `false` | Show debug information       |

## Grouped Configuration (Alternative API)

For cleaner prop organization, you can use grouped config objects:

```tsx
import { Preloader, type PreloaderGroupedProps } from "@aazucena/ui";

const config: PreloaderGroupedProps = {
  timing: {
    minDisplayTime: 2000,
    animationDuration: 800,
  },
  content: {
    title: "Loading Your App",
    readyTitle: "Welcome!",
  },
  callbacks: {
    onComplete: () => console.log("Done!"),
    onError: (err) => console.error(err),
  },
};
```

## Keyboard Navigation

- **Escape**: Skip loading (if `enableSkip` is true)
- **Enter / Space**: Continue when ready

## Accessibility Features

- ARIA labels and live regions
- Role attributes for screen readers
- Keyboard navigation support
- Focus management
- Status announcements

## Error Handling

The preloader automatically displays an error state when:

- A loading step fails
- Maximum display time is exceeded
- Custom error is triggered

```tsx
<Preloader
  customSteps={[
    {
      id: 1,
      name: "API Check",
      icon: Globe,
      check: async () => {
        const response = await fetch("/api/health");
        if (!response.ok) throw new Error("API unavailable");
        return true;
      },
    },
  ]}
  onError={(error) => {
    console.error("Preloader error:", error);
  }}
/>
```

## Performance Optimizations

1. **Memoization**: All sub-components are memoized
2. **Lazy Loading**: Intersection Observer for viewport detection
3. **Code Splitting**: Modular architecture for tree-shaking
4. **Optimized Hooks**: Custom hooks prevent unnecessary re-renders

## Migration from Old API

The new API is **fully backward compatible**. No changes needed to existing code.

### Before (Old API)

```tsx
<InteractivePreloader title="Loading" onComplete={() => {}} />
```

### After (New API - Same Result)

```tsx
<Preloader variant="interactive" title="Loading" onComplete={() => {}} />
```

## TypeScript Support

All components and hooks are fully typed with strict TypeScript:

```tsx
import type {
  PreloaderProps,
  LoadingStep,
  CustomReadyComponentProps,
} from "@aazucena/ui";
```

## Contributing

When extending the preloader:

1. Add new types to `types/index.ts`
2. Create new components in `components/`
3. Extract shared logic into hooks in `hooks/`
4. Update this README with new features
