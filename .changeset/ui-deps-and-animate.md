---
'@aazucena/ui': patch
---

`@aazucena/ui` now declares the packages it imports: `framer-motion`, `@aazucena/types`, `@tailwindcss/typography` and `@radix-ui/react-direction` are dependencies, and `react`, `react-dom` and `tailwindcss` are peers. Twelve unused dependencies are removed and the `gsap` peer is dropped. Animations come from `tw-animate-css` instead of the `tailwindcss-animate` plugin, so an app that imports ui's `globals.css` needs `tw-animate-css` installed.
