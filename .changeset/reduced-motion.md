---
'@aazucena/ui': minor
'@aazucena/hooks': minor
---

Respect `prefers-reduced-motion` across the library. A global rule in `core.css` stops CSS animations and transitions (spinners and `data-motion="essential"` keep moving); Framer Motion components use `MotionConfig reducedMotion="user"`, springs and snaps go instant, coming-soon's scramble and data stream stop, and `RinCharacter` shows the static mark. New `usePrefersReducedMotion` hook; `useTypingEffect` shows the full text and `useFlipText` swaps words without the flip.
