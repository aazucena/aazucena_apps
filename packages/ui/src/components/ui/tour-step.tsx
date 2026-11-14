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
  default: 'bg-popover border border-border text-popover-foreground',
  glass: 'glass border-rule text-foreground',
  cyber: 'bg-panel border border-signal/30 text-signal',
};

const btnClasses: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  glass: 'glass text-foreground hover:opacity-80',
  cyber: 'bg-signal text-signal-foreground hover:bg-signal',
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
      else if (placement === 'left') {
        left = rect.left - 12;
        top = rect.top + rect.height / 2;
      } else {
        left = rect.right + 12;
        top = rect.top + rect.height / 2;
      }

      setPos({
        top: top + window.scrollY,
        left: Math.max(16, Math.min(left, window.innerWidth - 280)),
      });
    }, [step]);

    const dialogRef = React.useRef<HTMLDivElement | null>(null);
    const titleId = React.useId();
    const descId = React.useId();

    // The tour is modal: remember where focus was, and give it back when the tour ends.
    React.useEffect(() => {
      const previous = document.activeElement as HTMLElement | null;
      return () => previous?.focus?.();
    }, []);

    // Each step takes focus, so a screen reader reads its title and description.
    React.useEffect(() => {
      dialogRef.current?.focus();
    }, [step]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && onSkip) {
        e.preventDefault();
        onSkip();
        return;
      }
      if (e.key !== 'Tab') return;
      // Keep Tab inside the step while the tour is open.
      const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button'));
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey && (activeEl === first || activeEl === e.currentTarget)) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    return (
      <div
        ref={(node) => {
          dialogRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'rounded-control focus-visible:outline-signal fixed z-(--z-max) w-64 p-4 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid',
          variantClasses[variant],
        )}
        style={{ top: pos.top, left: pos.left, transform: 'translateX(-50%)' }}
      >
        <h4
          id={titleId}
          className={cn('mb-1 text-sm font-semibold', variant === 'cyber' && 'font-mono')}
        >
          {step.title}
        </h4>
        <p id={descId} className="text-muted-foreground mb-3 text-xs">
          {step.description}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-muted-foreground text-[10px]"
            aria-label={`Step ${current + 1} of ${total}`}
          >
            {current + 1} / {total}
          </span>
          <div className="flex gap-1.5">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground rounded px-2 py-1 text-xs transition-colors"
              >
                Skip
              </button>
            )}
            {onPrev && current > 0 && (
              <button
                type="button"
                onClick={onPrev}
                className="text-muted-foreground hover:text-foreground rounded px-2 py-1 text-xs transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className={cn(
                'rounded px-3 py-1 text-xs font-medium transition-colors',
                btnClasses[variant],
              )}
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
