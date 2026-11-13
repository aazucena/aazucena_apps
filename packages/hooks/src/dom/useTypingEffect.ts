import { useState, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../device/usePrefersReducedMotion';

export interface UseTypingEffectOptions {
  /** Delay between characters in milliseconds */
  delay?: number;
  /** Whether the effect is active */
  enabled?: boolean;
  /** Optional callback when typing finishes */
  onComplete?: () => void;
}

/**
 * A hook that simulates a typing effect for a given string.
 * Under prefers-reduced-motion the full text shows at once.
 */
export function useTypingEffect(text: string, options: UseTypingEffectOptions = {}): string {
  const { delay = 50, enabled = true, onComplete } = options;
  const reduceMotion = usePrefersReducedMotion();
  const animate = enabled && !reduceMotion;
  const [displayedText, setDisplayedText] = useState(animate ? '' : text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Read the callback through a ref so an inline function doesn't restart the effect.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      if (enabled) onCompleteRef.current?.();
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onCompleteRef.current?.();
      }
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay, enabled, animate]);

  return displayedText;
}
