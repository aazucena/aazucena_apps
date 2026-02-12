import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface WatermarkBackgroundProps {
  text: string;
  size?: 'small' | 'medium' | 'large' | 'huge';
  className?: string;
}

const sizeClasses = {
  small: 'text-[15rem] md:text-[25rem]',
  medium: 'text-[20rem]',
  large: 'text-[25rem]',
  huge: 'text-[30rem] md:text-[40rem]',
};

export function WatermarkBackground({
  text,
  size = 'large',
  className,
}: WatermarkBackgroundProps): JSX.Element {
  return (
    <div
      className={cn(
        'pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-[0.02] select-none dark:opacity-[0.05]',
        className,
      )}
      aria-hidden="true"
    >
      <span className={cn(sizeClasses[size], 'font-black tracking-tighter uppercase italic')}>
        {text}
      </span>
    </div>
  );
}
