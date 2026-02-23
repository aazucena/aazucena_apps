import { useState, useEffect, useRef } from 'react';

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
 */
export function useTypingEffect(
  text: string,
  options: UseTypingEffectOptions = {}
): string {
  const { delay = 50, enabled = true, onComplete } = options;
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
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
        onComplete?.();
      }
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay, enabled, onComplete]);

  return displayedText;
}
