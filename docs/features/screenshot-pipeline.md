# Screenshot Pipeline

Automated portfolio screenshot capture for project showcases and social platform assets.

## Use Cases

- Project card thumbnails within the portfolio
- OG / social images (Twitter, LinkedIn, Instagram)
- Platform showcases (GitHub, Dribbble, etc.)

## Approach

A dedicated Playwright script (separate from E2E tests) that:

1. Loops through target routes
2. Captures at multiple viewports (1200×630 OG, 1:1 social, desktop/mobile)
3. Pushes results to Cloudinary (already integrated)

Exposed as a Turborepo task (`screenshot`) — run manually or triggered via Vercel post-deploy webhook.

## Key Challenge

Portfolio uses GSAP + Three.js + PixiJS animations. Screenshots mid-animation produce broken frames. Two options:

- `?screenshot=true` query param that freezes/skips animations
- `page.waitForFunction()` polling for an animation-complete signal

## Priority

Post-Phase 5. Not a quick win due to animation-settling complexity.
