# azds - Azucena Design System CLI

The design system CLI (`azds`) provides commands for generating CSS variables, Figma tokens, and favicons.

## Installation

After building the package, `azds` will be available globally:

```bash
# Build the CLI
cd packages/design-system
pnpm build

# Install globally (from package root)
pnpm install

# Now you can use azds anywhere
azds --help
```

## Quick Commands

```bash
# Show help
azds --help
azds -h
azds help
# or during development:
pnpm ds:help

# Show version
azds --version
azds -v

# Interactive mode (recommended for first-time use)
azds
# or during development:
pnpm ds

# Generate everything (CSS + Figma + Favicons)
azds all default FAVICON_MAIN ./dist
# or during development:
pnpm ds:sync

# Generate CSS variables only
azds css
# or during development:
pnpm ds:css

# Generate Figma tokens only
azds figma
# or during development:
pnpm ds:figma
```

## Non-Interactive Mode

```bash
# Full syntax
azds <action> <vibeId> <assetKey> <outputDir>

# Examples
azds all default FAVICON_MAIN ./dist
azds css cyberpunk FAVICON_MAIN ./dist
azds figma default FAVICON_MAIN ./dist
azds tokens default FAVICON_MAIN ./dist
azds favicons halloween FAVICON_ALT ./dist

# Or during development (without building)
pnpm tsx scripts/cli.ts <action> <vibeId> <assetKey> <outputDir>
```

## Available Actions

| Action     | Description              | Generates                            |
| ---------- | ------------------------ | ------------------------------------ |
| `all`      | Everything (recommended) | CSS + Figma + Favicons               |
| `tokens`   | Both token formats       | CSS + Figma                          |
| `css`      | CSS variables only       | `dist/css-vars.css`                  |
| `figma`    | Figma tokens only        | `figma.json`                         |
| `favicons` | Favicons and logos       | `dist/favicons/*` + `dist/logo*.svg` |

## Available Vibes (Themes)

- `default` - Clean, professional slate-based theme
- `cyberpunk` - Neon pink and cyan
- `glass` - Glassmorphism with blur effects
- `minimal` - Monochrome minimalist
- `nature` - Earth tones
- `hoyoverse` - Gaming-inspired theme

**Seasonal Vibes:**

- `halloween`, `christmas`, `valentines`, `easter`
- `new-years`, `lunar-new-year`, `st-patricks`
- `canada-day`, `birthday`
- `northern-lights`, `autumn`

## Available Asset Keys

- `FAVICON_MAIN` - Brand Blue (primary color)
- `FAVICON_ALT` - Clean White (neutral)

## Output Files

### CSS Generation (`css` or `tokens`)

```
dist/
└── css-vars.css (33KB, 1,489 lines)
    ├── Primitive radii
    ├── Core color palette
    ├── Spacing system
    ├── Z-index hierarchy
    ├── Responsive breakpoints
    ├── Animation durations
    ├── Animation timing functions
    └── Semantic variables (light + dark modes)
```

### Figma Generation (`figma` or `tokens`)

```
figma.json (33KB, DTCG format)
├── colors (primitive + scales)
├── spacing (0-96 scale)
└── typography (sizes, weights, line heights)
```

### Favicon Generation (`favicons` or `all`)

```
dist/
├── logo.svg (Pure brand logo)
├── logo-alt.svg (Alternative logo)
└── favicons/
    ├── favicon.ico
    ├── favicon.svg
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    └── site.webmanifest
```

## Use Cases

### During Development

```bash
# Quickly regenerate CSS after changing theme colors
azds css
# or
pnpm ds:css

# Regenerate Figma tokens after adding new design tokens
azds figma
# or
pnpm ds:figma
```

### Before Deployment

```bash
# Sync everything to ensure all assets are up to date
azds all default FAVICON_MAIN ./dist
# or
pnpm ds:sync
```

### Seasonal Updates

```bash
# Switch to Halloween theme
azds css halloween FAVICON_MAIN ./dist

# Generate Halloween favicons
azds favicons halloween FAVICON_ALT ./dist
```

## CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Build Design System CLI
  run: |
    cd packages/design-system
    pnpm build

- name: Generate Design Tokens
  run: |
    cd packages/design-system
    azds css
    azds figma
    # or use pnpm scripts during development:
    # pnpm ds:css
    # pnpm ds:figma
```

## Troubleshooting

### "Asset not found" error

- Check that the asset key is valid (`FAVICON_MAIN` or `FAVICON_ALT`)

### "Vibe not found" error

- Check that the vibe ID is valid (see list above)

### Output directory issues

- Use absolute paths or relative paths from package root
- Directory will be created if it doesn't exist

## Development

To modify the CLI behavior, edit:

- `scripts/cli.ts` - Main CLI logic
- `src/utils/generate-css.ts` - CSS generation
- `src/utils/generate-figma.ts` - Figma token generation
