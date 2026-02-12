import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface GradientAccentProps {
  variant?: 'default' | 'print-hidden';
  className?: string;
}

export function GradientAccent({
  variant = 'default',
  className,
}: GradientAccentProps): JSX.Element {
  return (
    <div
      className={cn(
        'h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
        variant === 'print-hidden' && 'print:hidden',
        className,
      )}
      aria-hidden="true"
    ></div>
  );
}
