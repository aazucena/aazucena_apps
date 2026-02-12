# Hooks Package Documentation

## 📚 DOCUMENTATION_INDEX

Complete reference for the aazucena Reactive Intelligence Library.

---

## Quick Start

- **[Composition Patterns](./composition-patterns.md)** - Custom hook composition strategies
- **[Performance Guide](./performance.md)** - Optimization and memoization techniques
- **[SSR Guide](./ssr-guide.md)** - Server-side rendering compatibility

---

## Hook Categories

### Device Hooks (`src/device/`)
- `useDeviceCapabilities` - Device performance detection
- `useMediaQuery` - Responsive breakpoint tracking
- `useViewport` - Viewport size and orientation

### State Hooks (`src/state/`)
- `useLocalStorage` - Persistent state with LocalStorage
- `useDebounce` - Debounced value updates
- `useThrottle` - Throttled function execution

### Animation Hooks (`src/animations/`)
- `useScrollProgress` - Page scroll tracking (0-1)
- `useIntersectionObserver` - Element visibility detection
- `useGSAPAnimation` - GSAP animation setup

### Data Hooks (`src/data/`)
- `useFetch` - Async data fetching with caching
- `useAsync` - Generic async operation handler
- `useInfiniteScroll` - Paginated infinite scroll

### Telemetry Hooks (`src/telemetry/`)
- `useAnalytics` - Analytics event tracking
- `usePerformanceMonitor` - FPS and memory monitoring

### Preloader Hooks (`src/preloader/`)
- `useLoadingProgress` - Multi-step loading state
- `usePreloaderTheme` - Theme management for preloader

### DOM Hooks (`src/dom/`)
- `useElementSize` - Element dimension tracking
- `useClickOutside` - Click outside detection
- `useFocusTrap` - Focus management for modals
- `useScrollLock` - Scroll locking for overlays

---

**MAINTAINER:** aazucena_hooks_library
