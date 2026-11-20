/** @shadcn standard component */
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from '@aazucena/icons';

import { cn } from '@aazucena/utils';

const checkboxVariants = cva(
  'grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition',
  {
    variants: {
      variant: {
        default:
          'border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        cyber:
          'border-border dark:border-signal/50 data-[state=checked]:bg-primary/10 dark:data-[state=checked]:bg-signal/10 data-[state=checked]:text-primary dark:data-[state=checked]:text-signal data-[state=checked]:border-primary dark:data-[state=checked]:border-signal',
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
