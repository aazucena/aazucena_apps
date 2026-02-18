'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { TourStep, type TourStepData } from './tour-step.js';

const tourVariants = cva('', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface TourProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof tourVariants> {
  steps: TourStepData[];
  open?: boolean;
  defaultStep?: number;
  onComplete?: () => void;
  onSkip?: () => void;
}

const Tour = React.forwardRef<HTMLDivElement, TourProps>(
  ({ className, variant = 'default', steps, open = false, defaultStep = 0, onComplete, onSkip, ...props }, ref) => {
    const [current, setCurrent] = React.useState(defaultStep);
    const v = variant ?? 'default';

    React.useEffect(() => {
      if (!open) return;
      const step = steps[current];
      if (!step) return;
      const el = document.querySelector(step.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('tour-highlight');
        return () => el.classList.remove('tour-highlight');
      }
    }, [open, current, steps]);

    if (!open || steps.length === 0) return null;

    return (
      <div ref={ref} className={cn(tourVariants({ variant }), className)} {...props}>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-[9998]',
            v === 'cyber' ? 'bg-black/70' : 'bg-black/50',
          )}
          onClick={onSkip}
          aria-hidden="true"
        />
        {/* Spotlight */}
        <style>{`
          .tour-highlight {
            position: relative;
            z-index: 9999;
            box-shadow: 0 0 0 4000px rgba(0,0,0,0.5);
            border-radius: 4px;
          }
        `}</style>
        {/* Step tooltip */}
        <TourStep
          step={steps[current]!}
          current={current}
          total={steps.length}
          variant={v}
          onNext={() => {
            if (current < steps.length - 1) setCurrent(current + 1);
            else onComplete?.();
          }}
          onPrev={() => { if (current > 0) setCurrent(current - 1); }}
          onSkip={onSkip}
        />
      </div>
    );
  },
);
Tour.displayName = 'Tour';

export { Tour, tourVariants };
export type { TourStepData };
