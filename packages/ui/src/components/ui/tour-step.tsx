'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';

export interface TourStepData {
  target: string;
  title: string;
  description: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TourStepProps {
  step: TourStepData;
  current: number;
  total: number;
  variant: string;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
}

const variantClasses: Record<string, string> = {
  default: 'bg-popover border border-border text-popover-foreground shadow-xl',
  glass: 'glass border-white/10 text-foreground shadow-2xl',
  cyber:
    'bg-black/95 border border-cyan-500/30 text-cyan-50 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
};

const btnClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  glass: 'glass-m text-foreground hover:opacity-80',
  cyber: 'bg-cyan-500 text-black hover:bg-cyan-400',
};

export const TourStep = React.forwardRef<HTMLDivElement, TourStepProps>(
  ({ step, current, total, variant, onNext, onPrev, onSkip }, ref) => {
    const [pos, setPos] = React.useState({ top: 0, left: 0 });

    React.useEffect(() => {
      const el = document.querySelector(step.target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const placement = step.placement ?? 'bottom';
      let top = 0;
      let left = rect.left + rect.width / 2;

      if (placement === 'bottom') top = rect.bottom + 12;
      else if (placement === 'top') top = rect.top - 12;
      else if (placement === 'left') { left = rect.left - 12; top = rect.top + rect.height / 2; }
      else { left = rect.right + 12; top = rect.top + rect.height / 2; }

      setPos({ top: top + window.scrollY, left: Math.max(16, Math.min(left, window.innerWidth - 280)) });
    }, [step]);

    return (
      <div
        ref={ref}
        role="dialog"
        aria-label={step.title}
        className={cn(
          'fixed z-[9999] w-64 rounded-lg p-4',
          variantClasses[variant],
        )}
        style={{ top: pos.top, left: pos.left, transform: 'translateX(-50%)' }}
      >
        <h4 className={cn('mb-1 text-sm font-semibold', variant === 'cyber' && 'font-mono')}>
          {step.title}
        </h4>
        <p className="mb-3 text-xs text-muted-foreground">{step.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            {current + 1} / {total}
          </span>
          <div className="flex gap-1.5">
            {onSkip && (
              <button type="button" onClick={onSkip} className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Skip
              </button>
            )}
            {onPrev && current > 0 && (
              <button type="button" onClick={onPrev} className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className={cn('rounded px-3 py-1 text-xs font-medium transition-colors', btnClasses[variant])}
            >
              {current === total - 1 ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
TourStep.displayName = 'TourStep';
