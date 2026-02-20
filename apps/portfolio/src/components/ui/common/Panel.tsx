/**
 * Panel Component
 * Shared wrapper for all UI panels (Settings, Info, Social)
 * Provides consistent backdrop, animations, and behavior
 */

import { useEffect, useState, type JSX, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PanelPosition = "left" | "right" | "top" | "bottom" | "center";
export type PanelState = "closed" | "opening" | "open" | "closing";

export interface PanelProps {
  /** Whether the panel is open */
  isOpen: boolean;

  /** Callback when panel should close */
  onClose: () => void;

  /** Where the panel slides in from */
  position?: PanelPosition;

  /** Panel content */
  children: ReactNode;

  /** Show backdrop overlay */
  backdrop?: boolean;

  /** Close when clicking backdrop */
  closeOnBackdropClick?: boolean;

  /** Close when pressing Escape key */
  closeOnEscape?: boolean;

  /** Custom z-index (default: 50) */
  zIndex?: number;

  /** Custom panel width (for left/right panels) */
  width?: string;

  /** Custom panel height (for top/bottom panels) */
  height?: string;

  /** Additional CSS classes for the panel content */
  className?: string;
}

/**
 * Get animation variants based on panel position
 */
function getAnimationVariants(position: PanelPosition) {
  const slideDistance = "100%";

  switch (position) {
    case "left":
      return {
        hidden: { x: `-${slideDistance}`, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: `-${slideDistance}`, opacity: 0 },
      };

    case "right":
      return {
        hidden: { x: slideDistance, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: slideDistance, opacity: 0 },
      };

    case "top":
      return {
        hidden: { y: `-${slideDistance}`, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: `-${slideDistance}`, opacity: 0 },
      };

    case "bottom":
      return {
        hidden: { y: slideDistance, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: slideDistance, opacity: 0 },
      };

    case "center":
      return {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 },
      };

    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      };
  }
}

/**
 * Get positioning classes based on panel position
 */
function getPositionClasses(position: PanelPosition): string {
  switch (position) {
    case "left":
      return "left-0 top-0 h-full";
    case "right":
      return "right-0 top-0 h-full";
    case "top":
      return "top-0 left-0 w-full";
    case "bottom":
      return "bottom-0 left-0 w-full";
    case "center":
      return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    default:
      return "";
  }
}

export function Panel({
  isOpen,
  onClose,
  position = "right",
  children,
  backdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  zIndex = 50,
  width,
  height,
  className = "",
}: PanelProps): JSX.Element | null {
  const [panelState, setPanelState] = useState<PanelState>("closed");

  // Handle Escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup: restore original overflow when panel closes
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Update panel state based on isOpen prop
  useEffect(() => {
    if (isOpen && panelState === "closed") {
      setPanelState("opening");
      // Transition to 'open' after animation completes
      const timer = setTimeout(() => setPanelState("open"), 200);
      return () => clearTimeout(timer);
    } else if (!isOpen && (panelState === "open" || panelState === "opening")) {
      setPanelState("closing");
      // Transition to 'closed' after animation completes
      const timer = setTimeout(() => setPanelState("closed"), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, panelState]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get animation variants and position classes
  const variants = getAnimationVariants(position);
  const positionClasses = getPositionClasses(position);

  // Determine default dimensions based on position
  const defaultWidth =
    position === "left" || position === "right" ? "400px" : "100%";
  const defaultHeight =
    position === "top" || position === "bottom" ? "400px" : "100%";

  const panelWidth = width || (position === "center" ? "auto" : defaultWidth);
  const panelHeight =
    height || (position === "center" ? "auto" : defaultHeight);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Panel Content */}
          <motion.div
            className={`absolute ${positionClasses} ${className}`}
            style={{
              width: panelWidth,
              height: panelHeight,
              maxWidth: position === "center" ? "90vw" : undefined,
              maxHeight: position === "center" ? "90vh" : undefined,
            }}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.2,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking panel
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
