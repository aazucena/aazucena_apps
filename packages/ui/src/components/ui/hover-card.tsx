'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const HoverCard = HoverCardPrimitive.Root;

const hoverCardContentVariants = cva(
  'z-50 w-64 origin-[--radix-hover-card-content-transform-origin] rounded-md border p-4 shadow-md outline-none data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-popover text-popover-foreground',
        glass: 'glass text-foreground dark:text-white shadow-2xl',
        cyber:
          'bg-primary/5 border-cyan-500/40 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.2)] dark:bg-black/90 dark:text-cyan-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> &
    VariantProps<typeof hoverCardContentVariants>
>(({ className, align = 'center', sideOffset = 4, variant, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(hoverCardContentVariants({ variant }), className)}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
