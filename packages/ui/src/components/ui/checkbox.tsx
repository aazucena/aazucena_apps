/** @shadcn standard component */
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from '@aazucena/icons';

import { cn } from '@aazucena/utils';

const checkboxVariants = cva(
  'grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all',
  {
    variants: {
      variant: {
        default:
          'border-primary data-checked:bg-primary data-checked:text-primary-foreground',
        cyber:
          'border-border dark:border-cyan-500/50 data-checked:bg-primary/20 dark:data-checked:bg-cyan-500/20 data-checked:text-primary dark:data-checked:text-cyan-400 data-checked:border-primary dark:data-checked:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0)] data-checked:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('grid place-content-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
