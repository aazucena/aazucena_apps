'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const Popover = PopoverPrimitive.Root;

const popoverContentVariants = cva(
  'z-50 w-72 rounded-md border p-4 shadow-md outline-none data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 origin-[--radix-popover-content-transform-origin]',
  {
    variants: {
      variant: {
        default: 'bg-popover text-popover-foreground',
        glass: 'glass text-foreground dark:text-white shadow-2xl',
        cyber:
          'bg-primary/5 border-cyan-500/40 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.2)] dark:bg-black/90 dark:text-cyan-50',
      },
      side: {
        top: 'data-[side=top]:slide-in-from-bottom-2',
        bottom: 'data-[side=bottom]:slide-in-from-top-2',
        left: 'data-[side=left]:slide-in-from-right-2',
        right: 'data-[side=right]:slide-in-from-left-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      side: 'bottom',
    },
  },
);

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    VariantProps<typeof popoverContentVariants>
>(({ className, align = 'center', sideOffset = 4, variant, side, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ variant, side }), className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
