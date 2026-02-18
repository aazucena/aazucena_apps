'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, scrollToTop } from '@aazucena/utils';
import { ArrowUp } from '@aazucena/icons';

const backToTopVariants = cva(
  'fixed bottom-8 right-8 z-40 flex items-center justify-center transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90',
        glass:
          'bg-background/10 dark:bg-white/10 backdrop-blur-md border border-border/20 text-foreground rounded-full shadow-2xl hover:bg-white/20',
        cyber:
          'bg-background/80 dark:bg-black/80 border border-cyan-500/40 text-cyan-400 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      },
      size: {
        default: 'w-12 h-12',
        sm: 'w-10 h-10',
        lg: 'w-14 h-14',
      },
    },
    defaultVariants: {
      variant: 'glass',
      size: 'default',
    },
  },
);

export interface BackToTopProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof backToTopVariants> {
  threshold?: number;
  forceVisible?: boolean;
}

const BackToTop = React.forwardRef<HTMLButtonElement, BackToTopProps>(
  ({ className, variant, size, threshold = 300, forceVisible, ...props }, ref) => {
    const [scrolled, setScrolled] = React.useState(false);
    const visible = forceVisible ?? scrolled;

    // Omit motion-conflicting props
    const { onDrag, onDragStart, onDragEnd, ...cleanProps } = props as any;

    React.useEffect(() => {
      if (forceVisible !== undefined) return;
      
      const handleScroll = () => {
        setScrolled(window.scrollY > threshold);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold, forceVisible]);

    return (
      <AnimatePresence>
        {visible && (
          <motion.button
            ref={ref}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => scrollToTop()}
            className={cn(backToTopVariants({ variant, size }), className)}
            aria-label="Back to top"
            {...cleanProps}
          >
            <ArrowUp size={size === 'sm' ? 18 : 24} />
          </motion.button>
        )}
      </AnimatePresence>
    );
  },
);
BackToTop.displayName = 'BackToTop';

export { BackToTop, backToTopVariants };
