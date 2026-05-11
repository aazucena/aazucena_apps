# @aazucena/storybook

Storybook documentation app for the @aazucena/ui component library.

## Overview

This app contains interactive documentation for all UI components following Turborepo best practices by separating Storybook from the UI package itself.

## Quick Start

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Chromatic visual regression
pnpm chromatic
```

## Architecture

### Why a Separate App?

According to [Turborepo's Storybook guide](https://turborepo.dev/docs/guides/tools/storybook), having Storybook in a separate app (rather than in the UI package) provides:

- ✅ **Clean separation of concerns** - UI package focuses solely on components
- ✅ **No circular dependencies** - Avoids workspace resolution issues
- ✅ **Better build performance** - Independent build caching
- ✅ **Clearer dependency tree** - Storybook depends on UI, not vice versa

### Structure

```
apps/storybook/
├── .storybook/          # Storybook configuration
│   ├── main.ts          # Main config (addons, framework)
│   └── preview.ts       # Preview config (themes, decorators)
├── stories/             # Component stories
│   ├── accordion.stories.tsx
│   ├── alert.stories.tsx
│   └── ...              # 20 story files total
└── package.json         # Dependencies & scripts
```

## Stories

### Current Coverage

- **20 story files** covering core UI components
- **69 individual stories** demonstrating component variants
- All stories support **light/dark themes** automatically
- **Accessibility testing** enabled via addon-a11y

### Component Categories

1. **Form Components** - Input, Textarea, Label, Progress
2. **Layout Components** - Card, Separator, AspectRatio, ScrollArea
3. **Overlay Components** - Dialog, Sheet, Tooltip, HoverCard
4. **Navigation Components** - Tabs, Accordion, Command
5. **Feedback Components** - Alert, Badge, Skeleton, Timeline
6. **Data Display** - Avatar

## Development

### Adding New Stories

1. Create a new story file in `stories/`:

   ```typescript
   // stories/my-component.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react-vite';
   import { MyComponent } from '@aazucena/ui/components/ui/my-component.js';

   const meta = {
     title: 'UI/MyComponent',
     component: MyComponent,
     parameters: { layout: 'centered' },
     tags: ['autodocs'],
   } satisfies Meta<typeof MyComponent>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {},
   };
   ```

2. Import components from `@aazucena/ui` package
3. Stories are auto-discovered by Storybook

### Theme Support

All stories automatically support light/dark themes via the `withThemeByClassName` decorator configured in `preview.ts`.

## Deployment

### Chromatic (Visual Regression)

```bash
# Run visual regression tests
pnpm chromatic

# CI/CD integration
CHROMATIC_PROJECT_TOKEN=<token> pnpm chromatic --exit-zero-on-changes
```

### Static Build

```bash
# Build static site
pnpm build

# Output: storybook-static/
# Deploy to Vercel, Netlify, or any static host
```

## Migration Notes

This Storybook app was migrated from `packages/ui` on 2026-02-12 following Turborepo best practices. The migration resolved workspace package resolution warnings and provides cleaner architecture.

### What Changed

- ✅ Moved `.storybook/` from `packages/ui` to `apps/storybook`
- ✅ Moved all story files from `packages/ui/src` to `apps/storybook/stories`
- ✅ Updated imports to use `@aazucena/ui` package
- ✅ Created separate package.json with Storybook dependencies
- ✅ Removed Storybook dependencies from `packages/ui`

### Benefits

- ❌ **Before**: Workspace resolution warnings for @aazucena/constants, @aazucena/utils, @aazucena/types
- ✅ **After**: Clean builds with no warnings
- 🚀 **Performance**: Faster builds with independent caching
