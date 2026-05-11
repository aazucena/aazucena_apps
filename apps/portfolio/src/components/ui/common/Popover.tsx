/**
 * Popover Component
 * Compact UI element positioned near trigger buttons
 * Designed for toolbar panels (Settings, Info, Social)
 */

import { useEffect, type JSX, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      // Below toolbar with generous spacing
      // Toolbar at top-8 (~32px) + height (~70-80px) + gap (~40px) = ~140px
      // Position at top-32 (144px) for comfortable, non-overlapping spacing
      return "top-32 right-8"; // Aligned with toolbar's right-8
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
      return "absolute -top-2 right-12 w-4 h-4 bg-black/90 backdrop-blur-lg rotate-45 border-t border-l border-white/20";
    case "top-left":
      // Arrow points upward toward toolbar (left side)
      return "absolute -top-2 left-12 w-4 h-4 bg-black/90 backdrop-blur-lg rotate-45 border-t border-l border-white/20";
    case "bottom-right":
    case "bottom-left":
      return "absolute -bottom-2 right-6 w-4 h-4 bg-black/90 backdrop-blur-lg rotate-45 border-b border-r border-white/20";
    case "right-top":
      return "absolute top-6 -right-2 w-4 h-4 bg-black/90 backdrop-blur-lg rotate-45 border-t border-r border-white/20";
    case "left-top":
      return "absolute top-6 -left-2 w-4 h-4 bg-black/90 backdrop-blur-lg rotate-45 border-t border-l border-white/20";
    default:
      return "absolute -top-2 right-12 w-4 h-4 bg-black/90 backdrop-blur-lg rotate-45 border-t border-l border-white/20";
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
            className={`fixed ${positionClasses} ${className}`}
            style={{
              zIndex,
              width,
              maxWidth: "90vw",
              maxHeight: "85vh",
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
            <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black/90 shadow-2xl backdrop-blur-lg">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
