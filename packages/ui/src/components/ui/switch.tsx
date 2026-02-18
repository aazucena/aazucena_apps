import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'h-5 w-9 data-checked:bg-primary data-unchecked:bg-input shadow-sm',
        // Logic variant absorbed from Prompt IDE (Force Reset style)
        logic:
          'h-4 w-7 data-checked:bg-rose-500/20 data-unchecked:bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 data-checked:border-rose-500/40',
        cyber:
          'h-5 w-9 data-checked:bg-primary/20 dark:data-checked:bg-cyan-500/20 data-unchecked:bg-muted dark:data-unchecked:bg-black border-border dark:border-cyan-500/30 data-checked:border-primary dark:data-checked:border-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
  {
    variants: {
      variant: {
        default: 'h-4 w-4 data-checked:translate-x-4 data-unchecked:translate-x-0',
        logic:
          'h-2.5 w-2.5 data-checked:translate-x-3 data-unchecked:translate-x-0.5 data-checked:bg-rose-500 data-checked:shadow-[0_0_8px_#f43f5e] data-unchecked:bg-zinc-400 dark:bg-zinc-500',
        cyber:
          'h-4 w-4 data-checked:translate-x-4 data-unchecked:translate-x-0 data-checked:bg-cyan-400 data-checked:shadow-[0_0_10px_#22d3ee]',
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
