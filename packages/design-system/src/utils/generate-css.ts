import { colors } from '../tokens/colors.js';
import { spacing, layout } from '../tokens/spacing.js';
import { zIndex } from '../tokens/z-index.js';
import { vibes } from '../themes/registry.js';
import { fontFamilies } from '../tokens/typography.js';
import type { SystemThemeConfig } from '@aazucena/types';

/**
 * Helper to convert a camelCase string to kebab-case
 */
const toKebabCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/**
 * Generates semantic CSS variables for a specific theme config
 */
function generateSemanticVars(theme: SystemThemeConfig, indent: string = '  '): string {
  let css = `${indent}/* Semantic Variables */\n`;

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    css += `${indent}--${toKebabCase(key)}: ${value};\n`;
  });

  // Effects
  css += `\n${indent}/* Effects */\n`;
  css += `${indent}--backdrop-blur: ${theme.effects.backdropBlur};\n`;
  if (theme.effects.cardBlur) {
    css += `${indent}--card-blur: ${theme.effects.cardBlur};\n`;
  }
  css += `${indent}--shadow: ${theme.effects.shadow};\n`;
  if (theme.effects.glowColor) {
    css += `${indent}--glow-color: ${theme.effects.glowColor};\n`;
  }

  // Border Radius
  Object.entries(theme.effects.borderRadius).forEach(([key, value]) => {
    css += `${indent}--radius-${key}: ${value};\n`;
  });

  // Typography
  css += `\n${indent}/* Typography */\n`;

  const hFont = fontFamilies[theme.typography.headingFont].join(', ');
  const bFont = fontFamilies[theme.typography.bodyFont].join(', ');

  css += `${indent}--font-heading: ${hFont};\n`;
  css += `${indent}--font-body: ${bFont};\n`;

  Object.entries(theme.typography).forEach(([key, value]) => {
    if (key !== 'headingFont' && key !== 'bodyFont' && key !== 'fontFamily') {
      css += `${indent}--font-${toKebabCase(key)}: ${value};\n`;
    }
  });

  return css;
}

/**
 * Generates a CSS string containing :root and .dark variables.
 * @param vibeId - Which vibe to use for the semantic variables (defaults to 'default')
 */
export function generateCssVariables(vibeId: string = 'default'): string {
  const vibe = vibes[vibeId] || vibes['default'] || Object.values(vibes)[0];
  if (!vibe) return '/* Error: No vibe found */';

  let css = `/* AUTOMATICALLY GENERATED - VIBE: ${vibe.name} - DO NOT EDIT MANUALLY */\n\n`;

  css += ':root {\n';

  // 1. Core Primitives (Radii)
  css += '  /* Primitive Radii */\n';
  Object.entries(layout.radii).forEach(([key, value]) => {
    css += `  --radius-primitive-${key}: ${value};\n`;
  });
  css += '  --radius: var(--radius-md);\n\n';

  // 2. Core Primitives (Colors)
  css += '  /* Core Palette */\n';
  Object.entries(colors).forEach(([name, scale]) => {
    if (typeof scale === 'string') {
      css += `  --${name}: ${scale};\n`;
    } else {
      Object.entries(scale as Record<string, string>).forEach(([weight, value]) => {
        css += `  --${name}-${weight}: ${value};\n`;
      });
    }
    css += '\n';
  });

  // 3. Spacing
  css += '  /* Spacing System */\n';
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --spacing-${key.replace('.', '_')}: ${value};\n`;
  });
  css += '\n';

  // 4. Z-Index
  css += '  /* Z-Index Hierarchy */\n';
  Object.entries(zIndex).forEach(([key, value]) => {
    css += `  --z-${key}: ${value};\n`;
  });
  css += '\n';

  // 5. Default Vibe Mode (Light)
  if (vibe) {
    css += `  /* ${vibe.name} Light Mode */\n`;
    css += generateSemanticVars(vibe.light);
  }

  css += '}\n\n';

  // 6. Dark Mode Overrides
  css += '.dark {\n';
  if (vibe) {
    css += `  /* ${vibe.name} Dark Mode */\n`;
    css += generateSemanticVars(vibe.dark);
  }
  css += '}\n';

  return css;
}
