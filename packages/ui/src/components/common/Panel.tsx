/**
 * Panel Component
 * Shared wrapper for all UI panels
 */

import { useEffect, useState, type JSX, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const panelVariants = cva('absolute transition-all', {
  variants: {
    position: {
      left: 'left-0 top-0 h-full',
      right: 'right-0 top-0 h-full',
      top: 'top-0 left-0 w-full',
      bottom: 'bottom-0 left-0 w-full',
      center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    },
  },
  defaultVariants: {
    position: 'right',
  },
});

export interface PanelProps extends VariantProps<typeof panelVariants> {
  /** Whether the panel is open */
  isOpen: boolean;

  /** Callback when panel should close */
  onClose: () => void;

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
function getAnimationVariants(position: string | null | undefined) {
  const slideDistance = '100%';

  switch (position) {
    case 'left':
      return {
        hidden: { x: `-${slideDistance}`, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: `-${slideDistance}`, opacity: 0 },
      };

    case 'right':
      return {
        hidden: { x: slideDistance, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: slideDistance, opacity: 0 },
      };

    case 'top':
      return {
        hidden: { y: `-${slideDistance}`, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: `-${slideDistance}`, opacity: 0 },
      };

    case 'bottom':
      return {
        hidden: { y: slideDistance, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: slideDistance, opacity: 0 },
      };

    case 'center':
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

export function Panel({
  isOpen,
  onClose,
  position = 'right',
  children,
  backdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  zIndex = 50,
  width,
  height,
  className = '',
}: PanelProps): JSX.Element | null {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const animationVariants = getAnimationVariants(position);

  const defaultWidth = position === 'left' || position === 'right' ? '400px' : '100%';
  const defaultHeight = position === 'top' || position === 'bottom' ? '400px' : '100%';

  const panelWidth = width || (position === 'center' ? 'auto' : defaultWidth);
  const panelHeight = height || (position === 'center' ? 'auto' : defaultHeight);

  if (!isClient) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0" style={{ zIndex }} onClick={handleBackdropClick}>
          {backdrop && (
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}

          <motion.div
            className={cn(panelVariants({ position }), className)}
            style={{
              width: panelWidth,
              height: panelHeight,
              maxWidth: position === 'center' ? '90vw' : undefined,
              maxHeight: position === 'center' ? '90vh' : undefined,
            }}
            variants={animationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
