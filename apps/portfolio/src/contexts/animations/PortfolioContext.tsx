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
} from "react";
import {
  SCROLL_SENSITIVITY,
  SCROLL_DEBOUNCE_TIME,
  SCROLL_PROGRESS_MAX,
  SCROLL_PROGRESS_THRESHOLD,
  SCROLL_PROGRESS_RETURN,
  SCROLL_PROGRESS_MIN,
} from '~/config/animations/constants';

// Types
export interface PortfolioState {
  // Section Navigation
  currentSection: number;
  scrollProgress: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  setScrollProgress: Dispatch<SetStateAction<number>>;

  // Modal State
  isExperienceModalOpen: boolean;
  selectedExperienceIndex: number | null;
  openExperienceModal: (index: number) => void;
  closeExperienceModal: () => void;

  // Panel State
  showInfoPanel: boolean;
  showSettingsPanel: boolean;
  showSocialMenu: boolean;
  setShowInfoPanel: Dispatch<SetStateAction<boolean>>;
  setShowSettingsPanel: Dispatch<SetStateAction<boolean>>;
  setShowSocialMenu: Dispatch<SetStateAction<boolean>>;

  // Utility functions
  navigateToSection: (index: number) => void;
  togglePanel: (panelType: "info" | "settings" | "social") => void;
}

// Context
export const PortfolioContext = createContext<PortfolioState | undefined>(undefined);

// Provider Props
interface PortfolioProviderProps {
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

  // Modal State
  const [isExperienceModalOpen, setIsExperienceModalOpen] =
    useState<boolean>(false);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);

  // Panel State
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [showSocialMenu, setShowSocialMenu] = useState<boolean>(false);

  // Scroll Navigation Handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't handle scroll when modal is open (check body overflow to support any modal)
      const isModalOpen = document.body.style.overflow === 'hidden';
      if (isScrollingRef.current || isModalOpen) return;

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
        Math.min(SCROLL_PROGRESS_MAX, scrollProgress + delta * SCROLL_SENSITIVITY)
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
        setCurrentSection(currentSection - 1);
        setScrollProgress(SCROLL_PROGRESS_RETURN); // Start at high progress when going back
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, SCROLL_DEBOUNCE_TIME);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        isScrollingRef.current = false; // Reset scroll lock on cleanup
      }
    };
  }, [currentSection, scrollProgress, totalSections]);

  // Modal Handlers
  const openExperienceModal = (index: number): void => {
    setSelectedExperienceIndex(index);
    setIsExperienceModalOpen(true);
  };

  const closeExperienceModal = (): void => {
    setIsExperienceModalOpen(false);
    setSelectedExperienceIndex(null);
  };

  // Utility: Navigate to section (resets scroll progress)
  const navigateToSection = (index: number): void => {
    setCurrentSection(index);
    setScrollProgress(0);
  };

  // Utility: Toggle panel (closes others)
  const togglePanel = (panelType: "info" | "settings" | "social"): void => {
    switch (panelType) {
      case "info":
        setShowInfoPanel((prev) => !prev);
        setShowSettingsPanel(false);
        setShowSocialMenu(false);
        break;
      case "settings":
        setShowSettingsPanel((prev) => !prev);
        setShowInfoPanel(false);
        setShowSocialMenu(false);
        break;
      case "social":
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

    // Modal State
    isExperienceModalOpen,
    selectedExperienceIndex,
    openExperienceModal,
    closeExperienceModal,

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

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Add display name for React Fast Refresh
PortfolioProvider.displayName = 'PortfolioProvider';
