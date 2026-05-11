# Color System (OKLCH)

## Overview

We use the **OKLCH** color space for all semantic and palette tokens. Unlike HSL or RGB, OKLCH is **perceptually uniform**, meaning that colors with the same lightness value appear equally bright to the human eye.

## Lightness Standards

- **50-100:** Backgrounds and subtle borders.
- **500:** Primary brand color and interactive states.
- **700-950:** Deep accents and technical text.

## Accessibility

All color combinations must meet **WCAG AA** standards. Because OKLCH is uniform, we can mathematically guarantee contrast by maintaining a specific lightness delta (L) between foreground and background.
