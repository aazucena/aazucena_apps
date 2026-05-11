'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const stepFormVariants = cva('w-full space-y-6 transition-all duration-300', {
  variants: {
    variant: {
      default: '',
      glass: 'rounded-2xl p-6 glass',
      cyber:
        'rounded-2xl p-6 bg-background/40 dark:bg-black/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface StepFormStep {
  label: string;
  description?: string;
  content: React.ReactNode;
  isValid?: () => boolean;
}

export interface StepFormProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'>,
    VariantProps<typeof stepFormVariants> {
  steps: StepFormStep[];
  onSubmit: () => void;
  submitLabel?: string;
  nextLabel?: string;
  prevLabel?: string;
}

const StepForm = React.forwardRef<HTMLDivElement, StepFormProps>(
  (
    {
      className,
      variant,
      steps,
      onSubmit,
      submitLabel = 'Submit',
      nextLabel = 'Next',
      prevLabel = 'Back',
      ...props
    },
    ref,
  ) => {
    const [current, setCurrent] = React.useState(0);
    const step = steps[current]!;
    const isLast = current === steps.length - 1;
    const canNext = step.isValid ? step.isValid() : true;

    return (
      <div ref={ref} className={cn(stepFormVariants({ variant }), className)} {...props}>
        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-colors',
                    i <= current ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all',
                    i < current && 'border-emerald-500 bg-emerald-500 text-white',
                    i === current && 'border-primary bg-primary text-primary-foreground scale-110',
                    i > current && 'border-border bg-background text-muted-foreground',
                  )}
                >
                  {i < current ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-muted-foreground hidden text-[10px] font-medium md:block">
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[120px]">{step.content}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrent((c) => c - 1)}
            disabled={current === 0}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              current === 0
                ? 'invisible'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            {prevLabel}
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!canNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    );
  },
);
StepForm.displayName = 'StepForm';

export { StepForm, stepFormVariants };
