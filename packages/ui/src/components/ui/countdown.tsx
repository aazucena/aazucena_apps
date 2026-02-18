'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const countdownVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'gap-2 text-lg',
      md: 'gap-3 text-2xl',
      lg: 'gap-4 text-4xl',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const segmentStyles: Record<string, string> = {
  default: 'bg-muted text-foreground rounded-lg border border-border',
  glass: 'glass rounded-lg',
  cyber: 'bg-cyan-500/5 border border-cyan-500/30 text-cyan-400 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.1)]',
};

const segmentSizes: Record<string, string> = {
  sm: 'px-2 py-1 min-w-[40px]',
  md: 'px-3 py-2 min-w-[56px]',
  lg: 'px-4 py-3 min-w-[72px]',
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date | number): TimeLeft {
  const targetMs = typeof target === 'number' ? target : target.getTime();
  const diff = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export interface CountdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof countdownVariants> {
  target: Date | number;
  onComplete?: () => void;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  label?: string;
}

const Countdown = React.forwardRef<HTMLDivElement, CountdownProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      target,
      onComplete,
      showDays = true,
      showHours = true,
      showMinutes = true,
      showSeconds = true,
      label,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const s = size ?? 'md';
    const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(calcTimeLeft(target));
    const completedRef = React.useRef(false);

    React.useEffect(() => {
      const tick = () => {
        const tl = calcTimeLeft(target);
        setTimeLeft(tl);
        if (
          !completedRef.current &&
          tl.days === 0 &&
          tl.hours === 0 &&
          tl.minutes === 0 &&
          tl.seconds === 0
        ) {
          completedRef.current = true;
          onComplete?.();
        }
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, [target, onComplete]);

    const segments: { label: string; value: number }[] = [];
    if (showDays) segments.push({ label: 'Days', value: timeLeft.days });
    if (showHours) segments.push({ label: 'Hours', value: timeLeft.hours });
    if (showMinutes) segments.push({ label: 'Min', value: timeLeft.minutes });
    if (showSeconds) segments.push({ label: 'Sec', value: timeLeft.seconds });

    return (
      <div ref={ref} className={cn('flex flex-col items-center gap-2', className)} {...props}>
        {label && (
          <span
            className={cn(
              'text-sm font-medium',
              v === 'cyber' ? 'font-mono text-cyan-500/60' : 'text-muted-foreground',
            )}
          >
            {label}
          </span>
        )}
        <div className={cn(countdownVariants({ variant, size }))}>
          {segments.map((seg, i) => (
            <React.Fragment key={seg.label}>
              {i > 0 && (
                <span
                  className={cn(
                    'font-bold',
                    v === 'cyber' ? 'text-cyan-500/40' : 'text-muted-foreground',
                  )}
                >
                  :
                </span>
              )}
              <div className={cn('flex flex-col items-center', segmentStyles[v], segmentSizes[s])}>
                <span className={cn('font-bold tabular-nums', v === 'cyber' && 'font-mono')}>
                  {String(seg.value).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-[9px] uppercase tracking-wider',
                    v === 'cyber' ? 'text-cyan-500/40' : 'text-muted-foreground',
                  )}
                >
                  {seg.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  },
);
Countdown.displayName = 'Countdown';

export { Countdown, countdownVariants };
