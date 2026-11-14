/** @shadcn standard component */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@aazucena/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-[color,background-color,border-color,opacity] duration-(--motion-base) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-signal aria-invalid:border-alert",
  {
    variants: {
      variant: {
        default: 'bg-signal text-signal-foreground hover:bg-signal/90',
        /** Coral outline + label: destructive actions never rely on color alone. */
        destructive: 'border border-alert bg-transparent text-alert hover:bg-alert/10',
        outline: 'border border-rule-strong bg-transparent text-foreground hover:bg-state',
        secondary: 'bg-panel-raised text-foreground hover:bg-state',
        ghost: 'text-foreground hover:bg-state',
        link: 'text-signal underline-offset-4 hover:underline',
        glass: 'glass text-foreground hover:bg-state',
        cyber:
          'border border-signal bg-transparent font-mono uppercase tracking-[0.12em] text-signal shadow-[inset_0_0_6px_var(--signal-line)] hover:bg-signal-faint',
        /** @deprecated Avra 0.2 has no gradients; renders as `default`. Removed in 0.3.0. */
        gradient: 'bg-signal text-signal-foreground hover:bg-signal/90',
      },
      size: {
        default: 'h-control px-4 has-[>svg]:px-3',
        sm: 'h-control-sm gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-control-lg px-6 has-[>svg]:px-4',
        icon: 'size-control',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
