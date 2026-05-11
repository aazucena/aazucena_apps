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
          'h-5 w-9 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input shadow-sm',
        // Logic variant absorbed from Prompt IDE (Force Reset style)
        logic:
          'h-4 w-7 data-[state=checked]:bg-rose-500/20 data-[state=unchecked]:bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 data-[state=checked]:border-rose-500/40',
        cyber:
          'h-5 w-9 data-[state=checked]:bg-cyan-500/20 data-[state=unchecked]:bg-white/10 border border-white/20 data-[state=checked]:border-cyan-400/60',
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
        default: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        logic:
          'h-2.5 w-2.5 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0.5 data-[state=checked]:bg-rose-500 data-[state=checked]:shadow-[0_0_8px_#f43f5e] data-[state=unchecked]:bg-zinc-400 dark:bg-zinc-500',
        cyber:
          'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-white/50 data-[state=checked]:bg-cyan-400 data-[state=checked]:shadow-[0_0_10px_#22d3ee]',
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
