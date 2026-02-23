'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from './button';
import { Play, Pause, Refresh, Plus, Minus } from '@aazucena/icons';
import { useTimer } from '@aazucena/hooks';

const timerVariants = cva(
  'flex flex-col items-center gap-6 rounded-xl border p-8 transition-all duration-300 shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-card border-border text-card-foreground',
        glass: 'glass border-white/10 text-white backdrop-blur-md',
        cyber:
          'bg-black border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-cyan-400 font-mono',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface TimerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onTimeUpdate'>,
    VariantProps<typeof timerVariants> {
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
  onComplete?: () => void;
  autoStart?: boolean;
  showControls?: boolean;
  showAdjusters?: boolean;
}

// --- Utils ---

const formatTime = (ms: number) => {
  const absoluteMs = Math.abs(ms);
  const totalSeconds = Math.floor(absoluteMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((absoluteMs % 1000) / 10);
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
};

// --- Component ---

/**
 * A specialized Countdown Timer component.
 * Delegates all timing logic to useTimer from @aazucena/hooks.
 */
const Timer = React.forwardRef<HTMLDivElement, TimerProps>(
  (
    {
      className,
      variant = 'default',
      initialTime = 60000,
      onTimeUpdate,
      onComplete,
      autoStart = false,
      showControls = true,
      showAdjusters = true,
      ...props
    },
    ref,
  ) => {
    const { time, isRunning, start, pause, reset, adjustTime } = useTimer({
      initialTime,
      onTimeUpdate,
      onComplete,
      autoStart,
    });

    return (
      <div ref={ref} className={cn(timerVariants({ variant }), className)} {...props}>
        {/* Time Display */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={cn(
              'font-mono text-5xl tracking-tighter tabular-nums transition-all duration-300',
              isRunning && 'text-primary scale-110',
              time === 0 && 'text-rose-500 opacity-50',
            )}
          >
            {formatTime(time)}
          </div>
          {variant === 'cyber' && (
            <div className="text-[10px] tracking-[0.2em] uppercase opacity-40">
              {isRunning ? 'Status: Active' : 'Status: Standby'}
            </div>
          )}
        </div>

        {/* Adjusters */}
        {showAdjusters && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustTime(-60000)}
                disabled={isRunning || time < 60000}
                className={cn(
                  'h-10 px-3 text-xs font-bold',
                  variant === 'cyber' && 'border-cyan-500/20 text-cyan-500/60',
                )}
              >
                -1m
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustTime(-10000)}
                disabled={isRunning || time < 10000}
                className={cn(
                  'h-10 px-3 text-xs font-bold',
                  variant === 'cyber' && 'border-cyan-500/20 text-cyan-500/60',
                )}
              >
                -10s
              </Button>
            </div>

            <div className="bg-border mx-1 h-6 w-px opacity-50" />

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustTime(10000)}
                disabled={isRunning}
                className={cn(
                  'h-10 px-3 text-xs font-bold',
                  variant === 'cyber' && 'border-cyan-500/20 text-cyan-400',
                )}
              >
                +10s
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustTime(60000)}
                disabled={isRunning}
                className={cn(
                  'h-10 px-3 text-xs font-bold',
                  variant === 'cyber' && 'border-cyan-500/20 text-cyan-400',
                )}
              >
                +1m
              </Button>
            </div>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="flex items-center gap-4">
            <Button
              onClick={isRunning ? pause : start}
              variant={variant === 'cyber' ? 'cyber' : isRunning ? 'outline' : 'default'}
              size="icon"
              className="size-12 rounded-full"
              disabled={time === 0 && !isRunning}
            >
              {isRunning ? <Pause className="size-6" /> : <Play className="ml-1 size-6" />}
              <span className="sr-only">{isRunning ? 'Pause' : 'Start'}</span>
            </Button>

            <Button
              onClick={reset}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground size-10 rounded-full"
            >
              <Refresh className="size-5" />
              <span className="sr-only">Reset</span>
            </Button>
          </div>
        )}
      </div>
    );
  },
);
Timer.displayName = 'Timer';

export { Timer, timerVariants };
