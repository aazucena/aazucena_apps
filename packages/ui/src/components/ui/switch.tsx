import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'h-5 w-9 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        // Logic variant absorbed from Prompt IDE (Force Reset style)
        logic:
          'h-4 w-7 data-[state=checked]:bg-alert/20 data-[state=unchecked]:bg-state dark:bg-panel-raised border-rule data-[state=checked]:border-alert/40',
        cyber:
          'h-5 w-9 data-[state=checked]:bg-signal/20 data-[state=unchecked]:bg-state border border-rule data-[state=checked]:border-signal/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background ring-0 transition-transform',
  {
    variants: {
      variant: {
        default: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        logic:
          'h-2.5 w-2.5 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-alert data-[state=unchecked]:bg-rule-strong dark:bg-rule-strong',
        cyber:
          'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-panel-raised data-[state=checked]:bg-signal',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface SwitchProps
  extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, variant, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ variant }), className)}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ variant }))} />
    </SwitchPrimitives.Root>
  ),
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
