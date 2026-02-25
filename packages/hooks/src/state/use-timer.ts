import * as React from 'react';

export interface UseTimerOptions {
  /** Initial time in milliseconds. Default is 60000 (1 minute). */
  initialTime?: number;
  /** Callback triggered every tick (~10ms) with current time remaining. */
  onTimeUpdate?: (time: number) => void;
  /** Callback triggered when countdown reaches zero. */
  onComplete?: () => void;
  /** If true, the timer starts immediately on mount. */
  autoStart?: boolean;
}

export interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  adjustTime: (amount: number) => void;
}

/**
 * Domain-agnostic countdown timer hook.
 * Uses real-time delta ticks for accuracy regardless of event-loop congestion.
 */
export function useTimer({
  initialTime = 60000,
  onTimeUpdate,
  onComplete,
  autoStart = false,
}: UseTimerOptions = {}): UseTimerReturn {
  const [time, setTime] = React.useState(initialTime);
  const [isRunning, setIsRunning] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = React.useRef<number>(0);

  const pause = React.useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = React.useCallback(() => {
    setTime((prev) => {
      if (prev <= 0) return prev;
      lastTickRef.current = Date.now();
      setIsRunning(true);
      return prev;
    });
  }, []);

  const reset = React.useCallback(() => {
    pause();
    setTime(initialTime);
  }, [initialTime, pause]);

  const adjustTime = React.useCallback((amount: number) => {
    setTime((prev) => Math.max(0, prev + amount));
  }, []);

  React.useEffect(() => {
    if (isRunning) {
      lastTickRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;

        setTime((prev) => {
          const nextTime = prev - delta;

          if (nextTime <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRunning(false);
            // Defer callback until after state batch settles
            queueMicrotask(() => {
              onComplete?.();
            });
            return 0;
          }

          onTimeUpdate?.(nextTime);
          return nextTime;
        });
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onTimeUpdate, onComplete]);

  // Handle autoStart on mount
  React.useEffect(() => {
    if (autoStart) {
      lastTickRef.current = Date.now();
      setIsRunning(true);
    }
  }, []);

  return { time, isRunning, start, pause, reset, adjustTime };
}
