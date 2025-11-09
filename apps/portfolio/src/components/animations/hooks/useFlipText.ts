/**
 * useFlipText Hook
 * Animates text flipping through an array of words using GSAP
 */

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface FlipTextOptions {
  words: string[];
  interval?: number;
  duration?: number;
}

export function useFlipText({
  words,
  interval = 3000,
  duration = 0.3
}: FlipTextOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const flipInterval = setInterval(() => {
      if (elementRef.current) {
        gsap.to(elementRef.current, {
          rotateX: 90,
          opacity: 0,
          duration,
          ease: "power2.in",
          onComplete: () => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
            if (elementRef.current) {
              gsap.fromTo(elementRef.current,
                { rotateX: -90, opacity: 0 },
                { rotateX: 0, opacity: 1, duration, ease: "power2.out" }
              );
            }
          }
        });
      }
    }, interval);

    return () => clearInterval(flipInterval);
  }, [words.length, interval, duration]);

  return {
    currentWord: words[currentIndex],
    currentIndex,
    elementRef
  };
}
