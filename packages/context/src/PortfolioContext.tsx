/**
 * PortfolioContext - Centralized state management for portfolio navigation and UI
 * Manages: sections, scroll progress, modals, and panels
 */

import {
  createContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  SCROLL_SENSITIVITY,
  SCROLL_DEBOUNCE_TIME,
  SCROLL_PROGRESS_MAX,
  SCROLL_PROGRESS_THRESHOLD,
  SCROLL_PROGRESS_RETURN,
  SCROLL_PROGRESS_MIN,
} from '@aazucena/constants';

// Types
export interface PortfolioState {
  // Section Navigation
  currentSection: number;
  scrollProgress: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  setScrollProgress: Dispatch<SetStateAction<number>>;

  // Panel State
  showInfoPanel: boolean;
  showSettingsPanel: boolean;
  showSocialMenu: boolean;
  setShowInfoPanel: Dispatch<SetStateAction<boolean>>;
  setShowSettingsPanel: Dispatch<SetStateAction<boolean>>;
  setShowSocialMenu: Dispatch<SetStateAction<boolean>>;

  // Utility functions
  navigateToSection: (index: number) => void;
  togglePanel: (panelType: 'info' | 'settings' | 'social') => void;
}

// Context
export const PortfolioContext = createContext<PortfolioState | undefined>(undefined);

// Provider Props
export interface PortfolioProviderProps {
  children: ReactNode;
  initialSection?: number;
  totalSections: number; // Dynamic section count from CMS
}

// Provider Component
export function PortfolioProvider({
  children,
  initialSection = 0,
  totalSections,
}: PortfolioProviderProps) {
  // Section Navigation State
  const [currentSection, setCurrentSection] = useState<number>(initialSection);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Panel State
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [showSocialMenu, setShowSocialMenu] = useState<boolean>(false);

  // Touch Navigation Handler (mobile swipe up/down = next/prev section)
  const touchStartYRef = useRef<number>(0);
  const touchScrollableRef = useRef<{ el: HTMLElement; scrollTop: number } | null>(null);
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? 0;
      touchScrollableRef.current = null;
      // Snapshot the nearest scrollable ancestor and its scroll position at gesture start
      const path = e.composedPath();
      for (const node of path) {
        if (node === document || node === window) break;
        const el = node as HTMLElement;
        if (!el.scrollHeight) continue;
        const { overflowY } = window.getComputedStyle(el);
        const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
        const hasScrollableContent = el.scrollHeight > el.clientHeight;
        if (isScrollable && hasScrollableContent) {
          touchScrollableRef.current = { el, scrollTop: el.scrollTop };
          break;
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const delta = touchStartYRef.current - endY;
      const SWIPE_THRESHOLD = 50;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      // Use the snapshotted scroll position to check if the container could absorb this swipe
      if (touchScrollableRef.current) {
        const { el, scrollTop } = touchScrollableRef.current;
        const swipingDown = delta > 0;
        const atTop = scrollTop === 0;
        const atBottom = scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if (swipingDown && !atBottom) return;
        if (!swipingDown && !atTop) return;
      }
      if (delta > 0 && currentSection < totalSections - 1) {
        navigateToSection(currentSection + 1);
      } else if (delta < 0 && currentSection > 0) {
        navigateToSection(currentSection - 1);
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSection, totalSections]);

  // Scroll Navigation Handler
  useEffect(() => {
    const isInsideScrollableContainer = (e: WheelEvent): boolean => {
      const path = e.composedPath();
      for (const node of path) {
        if (node === document || node === window) break;
        const el = node as HTMLElement;
        if (!el.scrollHeight) continue;
        const { overflowY } = window.getComputedStyle(el);
        const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
        const hasScrollableContent = el.scrollHeight > el.clientHeight;
        if (!isScrollable || !hasScrollableContent) continue;
        const scrollingDown = e.deltaY > 0;
        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if (scrollingDown && !atBottom) return true;
        if (!scrollingDown && !atTop) return true;
      }
      return false;
    };

    const handleWheel = (e: WheelEvent) => {
      // Don't handle scroll when modal is open (check body overflow to support any modal)
      const isModalOpen = document.body.style.overflow === 'hidden';
      if (isScrollingRef.current || isModalOpen) return;

      // Let scrollable containers (e.g. chat feed) absorb their own scroll
      if (isInsideScrollableContainer(e)) return;

      const delta = e.deltaY;

      // Only accumulate scroll progress if we can actually scroll in that direction
      const canScrollDown = currentSection < totalSections - 1;
      const canScrollUp = currentSection > 0;
      const isScrollingDown = delta > 0;
      const isScrollingUp = delta < 0;

      // Don't update scroll progress if we're at a boundary
      if ((isScrollingDown && !canScrollDown) || (isScrollingUp && !canScrollUp)) {
        return;
      }

      // Accumulate scroll progress
      const newProgress = Math.max(
        0,
        Math.min(SCROLL_PROGRESS_MAX, scrollProgress + delta * SCROLL_SENSITIVITY),
      );
      setScrollProgress(newProgress);

      // If we've scrolled enough, transition to next/previous section
      if (newProgress >= SCROLL_PROGRESS_THRESHOLD && isScrollingDown && canScrollDown) {
        // Scrolling down - move to next section
        isScrollingRef.current = true;
        setCurrentSection(currentSection + 1);
        setScrollProgress(0);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, SCROLL_DEBOUNCE_TIME);
      } else if (newProgress <= SCROLL_PROGRESS_MIN && isScrollingUp && canScrollUp) {
        // Scrolling up - move to previous section
        isScrollingRef.current = true;
        const prevSection = currentSection - 1;
        setCurrentSection(prevSection);
        // Section 0 has no prior section to scroll into, so snap to 0 to avoid
        // getting stuck at SCROLL_PROGRESS_RETURN with no way to reduce it further.
        setScrollProgress(prevSection === 0 ? 0 : SCROLL_PROGRESS_RETURN);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, SCROLL_DEBOUNCE_TIME);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        isScrollingRef.current = false; // Reset scroll lock on cleanup
      }
    };
  }, [currentSection, scrollProgress, totalSections]);

  // Utility: Navigate to section (resets scroll progress)
  const navigateToSection = (index: number): void => {
    setCurrentSection(index);
    setScrollProgress(0);
  };

  // Utility: Toggle panel (closes others)
  const togglePanel = (panelType: 'info' | 'settings' | 'social'): void => {
    switch (panelType) {
      case 'info':
        setShowInfoPanel((prev) => !prev);
        setShowSettingsPanel(false);
        setShowSocialMenu(false);
        break;
      case 'settings':
        setShowSettingsPanel((prev) => !prev);
        setShowInfoPanel(false);
        setShowSocialMenu(false);
        break;
      case 'social':
        setShowSocialMenu((prev) => !prev);
        setShowInfoPanel(false);
        setShowSettingsPanel(false);
        break;
    }
  };

  const value: PortfolioState = {
    // Section Navigation
    currentSection,
    scrollProgress,
    setCurrentSection,
    setScrollProgress,

    // Panel State
    showInfoPanel,
    showSettingsPanel,
    showSocialMenu,
    setShowInfoPanel,
    setShowSettingsPanel,
    setShowSocialMenu,

    // Utility Functions
    navigateToSection,
    togglePanel,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

// Add display name for React Fast Refresh
PortfolioProvider.displayName = 'PortfolioProvider';
