/**
 * Popover Component
 * Compact UI element positioned near trigger buttons
 */

import { useEffect, type JSX, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const popoverVariants = cva('fixed', {
  variants: {
    position: {
      'top-right': 'top-32 right-8',
      'top-left': 'top-32 left-8',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'right-top': 'top-4 right-4',
      'left-top': 'top-4 left-4',
    },
  },
  defaultVariants: {
    position: 'top-right',
  },
});

const arrowVariants = cva(
  'absolute w-4 h-4 bg-black/90 backdrop-blur-lg rotate-45 border-white/20',
  {
    variants: {
      position: {
        'top-right': '-top-2 right-12 border-t border-l',
        'top-left': '-top-2 left-12 border-t border-l',
        'bottom-right': '-bottom-2 right-6 border-b border-r',
        'bottom-left': '-bottom-2 right-6 border-b border-r',
        'right-top': 'top-6 -right-2 border-t border-r',
        'left-top': 'top-6 -left-2 border-t border-l',
      },
    },
    defaultVariants: {
      position: 'top-right',
    },
  },
);

export interface PopoverProps extends VariantProps<typeof popoverVariants> {
  /** Whether the popover is open */
  isOpen: boolean;

  /** Callback when popover should close */
  onClose: () => void;

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

export function Popover({
  isOpen,
  onClose,
  position = 'top-right',
  children,
  backdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  zIndex = 50,
  showArrow = false,
  width = '320px',
  className = '',
}: PopoverProps): JSX.Element | null {
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
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

          <motion.div
            className={cn(popoverVariants({ position }), className)}
            style={{
              zIndex,
              width,
              maxWidth: '90vw',
              maxHeight: '85vh',
            }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 300,
              duration: 0.15,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {showArrow && <div className={arrowVariants({ position })} />}

            <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black/90 shadow-2xl backdrop-blur-lg">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
