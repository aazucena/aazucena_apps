'use client';

import * as React from 'react';
import { useFlipText, type FlipTextOptions } from '@aazucena/hooks';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const taglineVariants = cva('mb-8 text-center leading-relaxed transition-all duration-500', {
  variants: {
    variant: {
      default: 'text-xl md:text-2xl text-muted-foreground',
      cyber: 'text-xl md:text-2xl text-foreground/80 font-mono tracking-tight',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const flipWordVariants = cva('inline-block font-semibold transition-all duration-300', {
  variants: {
    variant: {
      default: 'text-primary',
      cyber: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface FlipWordsProps
  extends
    React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof taglineVariants>,
    FlipTextOptions {
  content: string;
  tag?: string;
}

const FlipWords = React.forwardRef<HTMLParagraphElement, FlipWordsProps>(
  ({ className, variant, content, words, duration, interval, tag = 'flipWord', ...props }, ref) => {
    const { currentWord, elementRef } = useFlipText({
      words,
      duration,
      interval,
    });

    const parts = React.useMemo(() => {
      const tagPattern = new RegExp(`{{\\s*${tag}\\s*}}`, 'g');
      return content.split(tagPattern);
    }, [content, tag]);

    return (
      <p ref={ref} className={cn(taglineVariants({ variant }), className)} {...props}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="perspective-1000 inline-block">
                <span
                  ref={elementRef as any}
                  className={cn(flipWordVariants({ variant }), 'inline-block')}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {currentWord}
                </span>
              </span>
            )}
          </React.Fragment>
        ))}
      </p>
    );
  },
);
FlipWords.displayName = 'FlipWords';

export { FlipWords, taglineVariants, flipWordVariants };
