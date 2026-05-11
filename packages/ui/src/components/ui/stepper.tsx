'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Check } from '@aazucena/icons';

const stepperVariants = cva(
  'flex w-full items-center justify-between transition-all duration-500',
  {
    variants: {
      variant: {
        default: 'gap-4',
        compact: 'gap-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Stepper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof stepperVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(stepperVariants({ variant }), className)} {...props} />
));
Stepper.displayName = 'Stepper';

const stepVariants = cva('flex flex-col items-center flex-1 relative group', {
  variants: {
    status: {
      pending: 'text-muted-foreground',
      active: 'text-primary',
      completed: 'text-emerald-500',
    },
  },
  defaultVariants: {
    status: 'pending',
  },
});

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof stepVariants>
>(({ className, status, ...props }, ref) => (
  <div ref={ref} className={cn(stepVariants({ status }), className)} {...props} />
));
Step.displayName = 'Step';

const stepIndicatorVariants = cva(
  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10',
  {
    variants: {
      status: {
        pending: 'bg-background border-border text-muted-foreground',
        active:
          'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110',
        completed: 'bg-emerald-500 border-emerald-500 text-foreground',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  },
);

const StepIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof stepIndicatorVariants> & { index?: number }
>(({ className, status, index, children, ...props }, ref) => (
  <div ref={ref} className={cn(stepIndicatorVariants({ status }), className)} {...props}>
    {status === 'completed' ? (
      <Check size={16} strokeWidth={3} />
    ) : (
      children || (index !== undefined ? index + 1 : null)
    )}
  </div>
));
StepIndicator.displayName = 'StepIndicator';

const StepLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'mt-3 hidden text-[10px] font-black tracking-[0.2em] uppercase transition-colors md:block',
        className,
      )}
      {...props}
    />
  ),
);
StepLabel.displayName = 'StepLabel';

const stepLineVariants = cva(
  'absolute top-4 left-1/2 w-full h-[2px] -z-0 transition-colors duration-500',
  {
    variants: {
      status: {
        pending: 'bg-border',
        active: 'bg-primary/30',
        completed: 'bg-emerald-500',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
  },
);

const StepLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof stepLineVariants>
>(({ className, status, ...props }, ref) => (
  <div ref={ref} className={cn(stepLineVariants({ status }), className)} {...props} />
));
StepLine.displayName = 'StepLine';

export { Stepper, Step, StepIndicator, StepLabel, StepLine, stepperVariants, stepVariants };
