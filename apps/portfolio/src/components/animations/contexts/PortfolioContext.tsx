/**
 * PortfolioContext - Centralized state management for portfolio navigation and UI
 * Manages: sections, scroll progress, modals, and panels
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

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
const PortfolioContext = createContext<PortfolioState | undefined>(undefined);

// Provider Props
interface PortfolioProviderProps {
  children: ReactNode;
  initialSection?: number;
}

// Constants
const TOTAL_SECTIONS = 8;
const SCROLL_SENSITIVITY = 0.002;
const DEBOUNCE_TIME = 1000;

// Provider Component
export function PortfolioProvider({
  children,
  initialSection = 0,
}: PortfolioProviderProps) {
  // Section Navigation State
  const [currentSection, setCurrentSection] = useState<number>(initialSection);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const isScrollingRef = useRef<boolean>(false);

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
      if (isScrollingRef.current) return;

      const delta = e.deltaY;

      // Accumulate scroll progress
      const newProgress = Math.max(
        0,
        Math.min(0.8, scrollProgress + delta * SCROLL_SENSITIVITY)
      );
      setScrollProgress(newProgress);

      // If we've scrolled enough, transition to next/previous section
      if (newProgress >= 0.7 && delta > 0 && currentSection < TOTAL_SECTIONS - 1) {
        // Scrolling down - move to next section
        isScrollingRef.current = true;
        setCurrentSection(currentSection + 1);
        setScrollProgress(0);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, DEBOUNCE_TIME);
      } else if (newProgress <= 0.1 && delta < 0 && currentSection > 0) {
        // Scrolling up - move to previous section
        isScrollingRef.current = true;
        setCurrentSection(currentSection - 1);
        setScrollProgress(0.7); // Start at high progress when going back
        setTimeout(() => {
          isScrollingRef.current = false;
        }, DEBOUNCE_TIME);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSection, scrollProgress]);

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

// Custom Hook
export function usePortfolio(): PortfolioState {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
