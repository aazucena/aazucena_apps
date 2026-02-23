'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Check } from '@aazucena/icons';

const holdToConfirmVariants = cva(
  'relative w-full overflow-hidden rounded-md border transition-all cursor-pointer select-none flex items-center justify-center font-medium text-sm',
  {
    variants: {
      variant: {
        default: 'bg-background border-input text-foreground hover:bg-muted/50',
        destructive: 'bg-background border-rose-200 text-rose-600 hover:bg-rose-50',
        glass: 'glass border-white/10 text-white',
        cyber: 'bg-black border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface HoldToConfirmProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onConfirm'>,
    VariantProps<typeof holdToConfirmVariants> {
  /** Callback triggered when the hold duration is completed. */
  onConfirm: () => void;
  /** Duration in milliseconds to hold. Default is 2000. */
  duration?: number;
  /** Text shown in idle state. */
  text?: string;
  /** Text shown while holding. */
  confirmText?: string;
  /** If true, interactions are disabled. */
  disabled?: boolean;
}

/**
 * A high-fidelity button that requires the user to hold it down for a specified duration
 * before triggering an action. Provides clear visual feedback via a background fill animation.
 */
const HoldToConfirm = React.forwardRef<HTMLDivElement, HoldToConfirmProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      onConfirm,
      duration = 2000,
      text = 'Hold to Confirm',
      confirmText = 'Hold...',
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isHolding, setIsHolding] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);
    const controls = useAnimation();
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const startHold = async (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled || isComplete) return;
      
      setIsHolding(true);
      
      // Start the fill animation using Framer Motion
      // We use linear easing for predictable feedback
      controls.start({
        width: '100%',
        transition: { duration: duration / 1000, ease: 'linear' }
      });

      timerRef.current = setTimeout(() => {
        setIsComplete(true);
        setIsHolding(false);
        onConfirm();
        
        // Reset after a brief success state
        setTimeout(() => {
          setIsComplete(false);
          controls.set({ width: '0%' });
        }, 1500);
      }, duration);
    };

    const reset = () => {
      if (isComplete) return;
      setIsHolding(false);
      
      // Stop and reset the progress fill
      controls.stop();
      controls.start({
        width: '0%',
        transition: { duration: 0.2, ease: 'easeOut' }
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    const progressColor = React.useMemo(() => {
      switch (variant) {
        case 'destructive': return 'bg-rose-500/20';
        case 'cyber': return 'bg-cyan-500/30';
        case 'glass': return 'bg-white/20';
        default: return 'bg-primary/20';
      }
    }, [variant]);

    const successColor = React.useMemo(() => {
      switch (variant) {
        case 'destructive': return 'bg-rose-500 text-white';
        case 'cyber': return 'bg-cyan-500 text-black';
        case 'glass': return 'bg-white text-blue-600';
        default: return 'bg-emerald-500 text-white';
      }
    }, [variant]);

    return (
      <div
        ref={ref}
        className={cn(
          holdToConfirmVariants({ variant, size }),
          isHolding && 'scale-[0.98] ring-2 ring-primary/10',
          isComplete && successColor,
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onMouseDown={startHold}
        onMouseUp={reset}
        onMouseLeave={reset}
        onTouchStart={startHold}
        onTouchEnd={reset}
        {...props}
      >
        {/* Progress Fill Layer */}
        <motion.div
          initial={{ width: '0%' }}
          animate={controls}
          className={cn(
            'absolute left-0 top-0 h-full z-0 pointer-events-none',
            progressColor
          )}
        />
        
        {/* Label Layer */}
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="relative z-10 flex items-center gap-2"
            >
              <Check className="size-4" />
              <span>Confirmed</span>
            </motion.div>
          ) : (
            <motion.span
              key="text"
              className="relative z-10"
              initial={{ opacity: 1 }}
            >
              {isHolding ? confirmText : text}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Shine/Glow Effect for Cyber Variant */}
        {variant === 'cyber' && isHolding && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-shimmer pointer-events-none" />
        )}
      </div>
    );
  },
);
HoldToConfirm.displayName = 'HoldToConfirm';

export { HoldToConfirm, holdToConfirmVariants };
