/**
 * Popover Component
 * Compact UI element positioned near trigger buttons
 * Designed for toolbar panels (Settings, Info, Social)
 */

import { useEffect, type JSX, type ReactNode } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

export type PopoverPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left-top"
  | "right-top";

export interface PopoverProps {
  /** Whether the popover is open */
  isOpen: boolean;

  /** Callback when popover should close */
  onClose: () => void;

  /** Where the popover appears on screen */
  position?: PopoverPosition;

  /** Popover content */
  children: ReactNode;

  /** Show subtle backdrop */
  backdrop?: boolean;

  /** Close when clicking backdrop */
  closeOnBackdropClick?: boolean;

  /** Close when pressing Escape key */
  closeOnEscape?: boolean;

  /** Custom z-index (default: 50) */
  zIndex?: number;

  /** Accessible name for the dialog panel */
  ariaLabel?: string;

  /** Show arrow pointer */
  showArrow?: boolean;

  /** Custom width */
  width?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Get positioning classes for the popover based on screen position
 */
function getPositionClasses(position: PopoverPosition): string {
  switch (position) {
    case "top-right":
      return "top-32 right-8";
    case "top-left":
      return "top-32 left-8"; // Aligned with potential left toolbar
    case "bottom-right":
      return "bottom-4 right-4";
    case "bottom-left":
      return "bottom-4 left-4";
    case "right-top":
      return "top-4 right-4";
    case "left-top":
      return "top-4 left-4";
    default:
      return "top-32 right-8";
  }
}

/**
 * Get arrow positioning classes
 */
function getArrowClasses(position: PopoverPosition): string {
  switch (position) {
    case "top-right":
      // Arrow points upward toward toolbar (right side)
      return "absolute -top-2 right-12 w-4 h-4 bg-panel rotate-45 border-t border-l border-rule-strong";
    case "top-left":
      // Arrow points upward toward toolbar (left side)
      return "absolute -top-2 left-12 w-4 h-4 bg-panel rotate-45 border-t border-l border-rule-strong";
    case "bottom-right":
    case "bottom-left":
      return "absolute -bottom-2 right-6 w-4 h-4 bg-panel rotate-45 border-b border-r border-rule-strong";
    case "right-top":
      return "absolute top-6 -right-2 w-4 h-4 bg-panel rotate-45 border-t border-r border-rule-strong";
    case "left-top":
      return "absolute top-6 -left-2 w-4 h-4 bg-panel rotate-45 border-t border-l border-rule-strong";
    default:
      return "absolute -top-2 right-12 w-4 h-4 bg-panel rotate-45 border-t border-l border-rule-strong";
  }
}

export function Popover({
  isOpen,
  onClose,
  position = "top-right",
  children,
  backdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  zIndex = 50,
  showArrow = false,
  ariaLabel,
  width = "320px",
  className = "",
}: PopoverProps): JSX.Element | null {
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

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  const positionClasses = getPositionClasses(position);
  const arrowClasses = getArrowClasses(position);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Subtle backdrop (optional) */}
            {backdrop && (
              <motion.div
                className="fixed inset-0"
                style={{ zIndex: zIndex - 1 }}
                onClick={handleBackdropClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            )}

            {/* Popover Content */}
            <motion.div
              role="dialog"
              aria-label={ariaLabel}
              className={`fixed max-h-[calc(100vh-14rem)] max-w-[calc(100vw-2rem)] sm:max-h-[85vh] sm:max-w-[90vw] ${positionClasses} ${className}`}
              style={{
                zIndex,
                width,
              }}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
                duration: 0.15,
              }}
              onClick={(e) => e.stopPropagation()} // Prevent backdrop click
            >
              {/* Arrow pointer */}
              {showArrow && <div className={arrowClasses} />}

              {/* Content wrapper with overflow handling */}
              <div className="rounded-card border-rule-strong bg-panel relative overflow-hidden border drop-shadow-lg">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
