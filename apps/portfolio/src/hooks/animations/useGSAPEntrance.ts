/**
 * useGSAPEntrance Hook
 * GSAP entrance animations for hero section
 */

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export interface GSAPEntranceRefs {
  titleRef: RefObject<HTMLHeadingElement | null>;
  subtitleRef: RefObject<HTMLParagraphElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
}

export function useGSAPEntrance(
  scope?: RefObject<HTMLElement | null>,
): GSAPEntranceRefs {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Validate DOM elements before animating
      if (!titleRef.current || !subtitleRef.current || !ctaRef.current) return;

      const tl = gsap.timeline();

      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
      )
        .fromTo(
          subtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.5",
        )
        .fromTo(
          ctaRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.3",
        );

      return () => {
        tl.kill();
      };
    },
    { scope },
  );

  return { titleRef, subtitleRef, ctaRef };
}
