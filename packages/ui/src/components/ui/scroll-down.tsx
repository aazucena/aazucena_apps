'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ScrollDown as Icon } from '@aazucena/icons';

const scrollDownVariants = cva(
  'fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 transition-all duration-1000 cursor-pointer group outline-none',
  {
    variants: {
      variant: {
        default: 'text-foreground/80 hover:text-foreground',
        glass: 'text-foreground/80 hover:text-primary dark:hover:text-white',
        cyber:
          'text-primary/80 dark:text-cyan-400/80 hover:text-primary dark:hover:text-cyan-400 font-mono tracking-wider',
      },
      visible: {
        true: 'opacity-100 scale-100',
        false: 'opacity-0 scale-90 pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      visible: true,
    },
  },
);

export interface ScrollDownProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof scrollDownVariants> {
  timeout?: number;
}

const ScrollDown = React.forwardRef<HTMLButtonElement, ScrollDownProps>(
  ({ className, variant, visible, timeout = 2000, children, ...props }, ref) => {
    const [showIndicator, setShowIndicator] = React.useState(false);

    React.useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => setShowIndicator(true), timeout);
        return () => clearTimeout(timer);
      } else {
        setShowIndicator(false);
      }
    }, [visible, timeout]);

    return (
      <button
        ref={ref}
        className={cn(scrollDownVariants({ variant, visible: showIndicator }), className)}
        aria-label="Scroll down"
        {...props}
      >
        {children}
      </button>
    );
  },
);
ScrollDown.displayName = 'ScrollDown';

const ScrollDownIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props}>
      <Icon size={32} />
    </div>
  ),
);
ScrollDownIcon.displayName = 'ScrollDownIcon';

const ScrollDownLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('text-[10px] font-black tracking-widest uppercase opacity-60', className)}
      {...props}
    />
  ),
);
ScrollDownLabel.displayName = 'ScrollDownLabel';

export { ScrollDown, ScrollDownIcon, ScrollDownLabel, scrollDownVariants };
