'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { motion, useMotionValue, useTransform, useSpring, PanInfo, animate } from 'framer-motion';

const wheelPickerVariants = cva(
  'relative flex items-center justify-center overflow-hidden transition-all duration-300 select-none',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-cyan-400',
      },
      size: {
        default: 'w-32 h-48',
        sm: 'w-24 h-40 text-sm',
        md: 'w-32 h-48',
        lg: 'w-40 h-56 text-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ReactWheelPickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'>,
    VariantProps<typeof wheelPickerVariants> {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  itemHeight?: number;
  /** Number of items to show above and below the center */
  visibleCount?: number;
  /** Enable infinite looping of items */
  loop?: boolean;
}

// --- Utils ---

/** Wraps an index into the valid range [0, len). */
const normalizeIndex = (idx: number, len: number) => ((idx % len) + len) % len;

// --- Component ---

const ReactWheelPicker = React.forwardRef<HTMLDivElement, ReactWheelPickerProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      options,
      value,
      onChange,
      itemHeight = 40,
      visibleCount = 3,
      loop = true,
      ...props
    },
    ref,
  ) => {
    // Core motion value for the scroll position
    const y = useMotionValue(0);

    // We use a spring for the VISUAL display to give it inertia while dragging
    // but the actual container position should follow y closely.
    const springY = useSpring(y, {
      stiffness: 400,
      damping: 40,
      mass: 0.8,
    });

    const [activeIndex, setActiveIndex] = React.useState(0);

    // Initial and controlled value synchronization
    React.useEffect(() => {
      if (value !== undefined) {
        const idx = options.indexOf(value);
        const targetIdx = idx === -1 ? 0 : idx;

        // We calculate the current "page" of the loop to find the nearest target
        const currentY = y.get();
        const currentIdx = -currentY / itemHeight;

        let finalTargetIdx = targetIdx;
        if (loop) {
          // Find the target index in the loop that is closest to our current position
          const offset = Math.round((currentIdx - targetIdx) / options.length) * options.length;
          finalTargetIdx = targetIdx + offset;
        }

        animate(y, -finalTargetIdx * itemHeight, {
          type: 'spring',
          stiffness: 400,
          damping: 40,
        });
      }
    }, [value, options, itemHeight, y, loop]);

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const currentY = y.get();
      // Projection for momentum snapping
      const projectedY = currentY + info.velocity.y * 0.15;
      let targetIndex = Math.round(-projectedY / itemHeight);

      if (!loop) {
        targetIndex = Math.max(0, Math.min(options.length - 1, targetIndex));
      }

      // Force absolute snapping to the center
      animate(y, -targetIndex * itemHeight, {
        type: 'spring',
        stiffness: 500, // Slightly stiffer for a solid "thud" snap
        damping: 35,
        onComplete: () => {
          const normalizedIdx = normalizeIndex(targetIndex, options.length);
          onChange?.(options[normalizedIdx]!);
        },
      });
    };

    // Update active index for highlighting while dragging/animating
    React.useEffect(() => {
      const unsubscribe = y.on('change', (latest) => {
        const idx = Math.round(-latest / itemHeight);
        setActiveIndex(normalizeIndex(idx, options.length));
      });
      return () => unsubscribe();
    }, [y, options.length, itemHeight]);

    // Render 5 sets of options for infinite looping comfort
    const renderIndices = React.useMemo(() => {
      if (!loop) return options.map((_, i) => i);
      return Array.from({ length: options.length * 5 }, (_, i) => i - options.length * 2);
    }, [options.length, loop]);

    return (
      <div ref={ref} className={cn(wheelPickerVariants({ variant, size }), className)} {...props}>
        {/* Centered Selection Indicator */}
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y-2',
            variant === 'cyber'
              ? 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
              : 'border-primary/20 bg-primary/5',
          )}
          style={{ height: itemHeight }}
        />

        {/* The Wheel */}
        <motion.div
          className="relative flex h-full w-full cursor-grab touch-none items-center justify-center active:cursor-grabbing"
          drag="y"
          dragConstraints={loop ? false : { top: -(options.length - 1) * itemHeight, bottom: 0 }}
          dragElastic={0.1}
          style={{ y: y }} // Use direct y for drag target
          onDragEnd={handleDragEnd}
        >
          {renderIndices.map((idx) => {
            const normalizedIdx = normalizeIndex(idx, options.length);
            const option = options[normalizedIdx]!;
            const isSelected = normalizedIdx === activeIndex;

            // Perspective Transforms follow the spring for smoothness
            const offset = useTransform(springY, (latestY) => {
              return (idx * itemHeight + latestY) / itemHeight;
            });

            // Calculate rotation, scale, and opacity based on distance from center
            const rotateX = useTransform(offset, [-2, 0, 2], [45, 0, -45]);
            const opacity = useTransform(offset, [-3, -1, 0, 1, 3], [0, 0.3, 1, 0.3, 0]);
            const scale = useTransform(offset, [-1, 0, 1], [0.8, 1.15, 0.8]);

            // Text color transition
            const color = useTransform(
              offset,
              [-0.5, 0, 0.5],
              [
                variant === 'cyber' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                variant === 'cyber' ? 'rgba(34, 211, 238, 1)' : 'rgba(0, 0, 0, 1)',
                variant === 'cyber' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(0, 0, 0, 0.4)',
              ],
            );

            return (
              <motion.div
                key={`${idx}-${option}`}
                style={{
                  height: itemHeight,
                  rotateX,
                  opacity,
                  scale,
                  color,
                  position: 'absolute',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  y: idx * itemHeight,
                  backfaceVisibility: 'hidden',
                }}
                className={cn(
                  'font-bold transition-colors',
                  variant === 'cyber' && 'font-mono',
                  isSelected && 'z-20',
                )}
              >
                {option}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Vertical Fade Overlays */}
        <div className="from-background to-background pointer-events-none absolute inset-0 z-30 bg-gradient-to-b via-transparent opacity-90" />
      </div>
    );
  },
);
ReactWheelPicker.displayName = 'ReactWheelPicker';

/**
 * Group wrapper for multiple wheel pickers.
 */
export const ReactWheelPickerGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-muted/5 border-border/40 flex items-center gap-1 rounded-3xl border p-2 shadow-inner',
      className,
    )}
    {...props}
  />
));
ReactWheelPickerGroup.displayName = 'ReactWheelPickerGroup';

export { ReactWheelPicker, wheelPickerVariants };
