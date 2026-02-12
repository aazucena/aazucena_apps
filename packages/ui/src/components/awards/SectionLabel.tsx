/**
 * SectionLabel Component
 * Decorative section label with gradient lines
 */

import type { JSX } from 'react';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const sectionLabelVariants = cva('flex items-center justify-center', {
  variants: {
    color: {
      cyan: 'text-cyan-400',
      yellow: 'text-yellow-400',
    },
  },
  defaultVariants: {
    color: 'cyan',
  },
});

const lineVariants = cva('h-px w-16', {
  variants: {
    color: {
      cyan: 'from-transparent to-cyan-400/50',
      yellow: 'from-transparent to-yellow-400/50',
    },
  },
  defaultVariants: {
    color: 'cyan',
  },
});

export interface SectionLabelProps extends VariantProps<typeof sectionLabelVariants> {
  /** Label text */
  text: string;
  /** Additional className */
  className?: string;
}

/**
 * SectionLabel
 */
export function SectionLabel({ text, color, className = '' }: SectionLabelProps): JSX.Element {
  return (
    <div className={cn(sectionLabelVariants({ color }), className)}>
      <div className="flex items-center gap-4">
        <div className={cn('bg-gradient-to-r', lineVariants({ color }))}></div>
        <h3 className="text-lg font-semibold tracking-wider uppercase">{text}</h3>
        <div className={cn('bg-gradient-to-l', lineVariants({ color }))}></div>
      </div>
    </div>
  );
}
