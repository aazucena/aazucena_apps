/**
 * useFlipText Hook
 * Animates text flipping through an array of words using GSAP.
 * Under prefers-reduced-motion the words still cycle, but swap without the flip.
 */

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePrefersReducedMotion } from '../device/usePrefersReducedMotion';

export interface FlipTextOptions {
  words: string[];
  interval?: number;
  duration?: number;
}

export function useFlipText({ words, interval = 3000, duration = 0.3 }: FlipTextOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!elementRef.current) return;

    const flipInterval = setInterval(() => {
      if (reduceMotion) {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        return;
      }
      if (elementRef.current) {
        // Kill any existing tween before creating a new one
        if (tweenRef.current) {
          tweenRef.current.kill();
        }

        tweenRef.current = gsap.to(elementRef.current, {
          rotateX: 90,
          opacity: 0,
          duration,
          ease: 'power2.in',
          onComplete: () => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
            if (elementRef.current) {
              tweenRef.current = gsap.fromTo(
                elementRef.current,
                { rotateX: -90, opacity: 0 },
                { rotateX: 0, opacity: 1, duration, ease: 'power2.out' },
              );
            }
          },
        });
      }
    }, interval);

    return () => {
      clearInterval(flipInterval);
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [words.length, interval, duration, reduceMotion]);

  return {
    currentWord: words[currentIndex],
    currentIndex,
    elementRef,
  };
}
