import { colors } from '../tokens/colors';
import { spacing, layout } from '../tokens/spacing';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  letterSpacing,
  lineHeights,
} from '../tokens/typography';
import { shadows } from '../tokens/shadows';
import { transitions } from '../tokens/motion';
import { breakpoints } from '../tokens/breakpoints';
import { zIndex } from '../tokens/z-index';
import { toHex } from './color-converter';

// Parses a CSS box-shadow string into the Token Studio object format.
// Handles multi-shadow (comma-separated) and inset shadows.
function parseShadow(css: string): object | object[] {
  if (css === 'none') {
    return { x: '0', y: '0', blur: '0', spread: '0', color: 'rgba(0,0,0,0)', type: 'dropShadow' };
  }

  // Split on commas outside parentheses to handle rgba(r,g,b,a) values
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of css) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());

  const parsed = parts.map((part) => {
    const isInset = part.startsWith('inset ');
    const str = isInset ? part.slice(6).trim() : part;
    const colorMatch = str.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/);
    const color = colorMatch ? colorMatch[0] : '#000000';
    const dims = str
      .replace(/rgba?\([^)]+\)/, '')
      .replace(/#[0-9a-fA-F]{3,8}/, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return {
      x: dims[0] ?? '0',
      y: dims[1] ?? '0',
      blur: dims[2] ?? '0',
      spread: dims[3] ?? '0',
      color,
      type: isInset ? 'innerShadow' : 'dropShadow',
    };
  });

  // parsed[0]! is safe: we only reach this branch when length === 1
  return parsed.length === 1 ? parsed[0]! : parsed;
}

// Converts a unitless line-height ratio (e.g. "1.5") to a percentage string ("150%").
// Values that already carry a unit (rem, px, %) pass through unchanged.
function toLineHeightPercent(value: string): string {
  if (/^\d*\.?\d+$/.test(value)) {
    return `${Math.round(parseFloat(value) * 100)}%`;
  }
  return value;
}

/**
 * Generates a JSON string for Figma/Token Studio consumption.
 * Follows the Token Studio / W3C DTCG draft format ($value / $type).
 */
export function generateFigmaTokens(): string {
  const tokens: any = {
    colors: {},
    spacing: {},
    sizing: {},
    borderRadius: {},
    borderWidth: {},
    border: {},
    opacity: {},
    boxShadow: {},
    fontFamilies: {},
    fontSizes: {},
    fontWeights: {},
    lineHeights: {},
    letterSpacing: {},
    paragraphSpacing: {},
    textCase: {},
    textDecoration: {},
    typography: {},
    duration: {},
    dimension: {},
    number: {},
  };

  // 1. Colors
  Object.entries(colors).forEach(([name, scale]) => {
    if (typeof scale === 'string') {
      tokens.colors[name] = { $value: toHex(scale), $type: 'color' };
    } else {
      tokens.colors[name] = {};
      Object.entries(scale as Record<string, string>).forEach(([weight, value]) => {
        tokens.colors[name][weight] = { $value: toHex(value), $type: 'color' };
      });
    }
  });

  // 2. Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    tokens.spacing[key] = { $value: value, $type: 'spacing' };
  });

  // 3. Sizing — same scale as spacing, distinct semantic type for width/height
  Object.entries(spacing).forEach(([key, value]) => {
    tokens.sizing[key] = { $value: value, $type: 'sizing' };
  });

  // 4. Border Radius
  Object.entries(layout.radii).forEach(([key, value]) => {
    tokens.borderRadius[key] = { $value: value, $type: 'borderRadius' };
  });

  // 5. Border Width — standard values (no dedicated token source)
  const borderWidthValues: Record<string, string> = {
    '0': '0px',
    '1': '1px',
    '2': '2px',
    '4': '4px',
    '8': '8px',
  };
  Object.entries(borderWidthValues).forEach(([key, value]) => {
    tokens.borderWidth[key] = { $value: value, $type: 'borderWidth' };
  });

  // 6. Border — composite tokens (color + width + style) referencing other token groups
  const borderPresets: Array<{ key: string; color: string; width: string; style: string }> = [
    { key: 'default', color: '{colors.slate.200}', width: '{borderWidth.1}', style: 'solid' },
    { key: 'muted', color: '{colors.slate.100}', width: '{borderWidth.1}', style: 'solid' },
    { key: 'strong', color: '{colors.slate.900}', width: '{borderWidth.2}', style: 'solid' },
    { key: 'focus', color: '{colors.blue.500}', width: '{borderWidth.2}', style: 'solid' },
    { key: 'destructive', color: '{colors.red.500}', width: '{borderWidth.1}', style: 'solid' },
    { key: 'dashed', color: '{colors.slate.300}', width: '{borderWidth.1}', style: 'dashed' },
    { key: 'dotted', color: '{colors.slate.300}', width: '{borderWidth.1}', style: 'dotted' },
    { key: 'none', color: 'transparent', width: '{borderWidth.0}', style: 'solid' },
  ];
  borderPresets.forEach(({ key, color, width, style }) => {
    tokens.border[key] = {
      $value: { color, width, style },
      $type: 'border',
    };
  });

  // 7. Opacity — standard scale (no dedicated token source)
  const opacityValues: Record<string, number> = {
    '0': 0,
    '5': 0.05,
    '10': 0.1,
    '20': 0.2,
    '25': 0.25,
    '30': 0.3,
    '40': 0.4,
    '50': 0.5,
    '60': 0.6,
    '70': 0.7,
    '75': 0.75,
    '80': 0.8,
    '90': 0.9,
    '95': 0.95,
    '100': 1,
  };
  Object.entries(opacityValues).forEach(([key, value]) => {
    tokens.opacity[key] = { $value: value, $type: 'opacity' };
  });

  // 8. Box Shadow — parsed from CSS strings to Token Studio object format
  Object.entries(shadows).forEach(([key, value]) => {
    tokens.boxShadow[key] = { $value: parseShadow(value), $type: 'boxShadow' };
  });

  // 9. Font Families — primary family name only (Token Studio takes a string)
  Object.entries(fontFamilies).forEach(([key, value]) => {
    tokens.fontFamilies[key] = {
      $value: (value as readonly string[])[0],
      $type: 'fontFamilies',
    };
  });

  // 10. Font Sizes
  Object.entries(fontSizes).forEach(([key, tuple]) => {
    const [value] = tuple as unknown as [string, ...unknown[]];
    tokens.fontSizes[key] = { $value: value, $type: 'fontSizes' };
  });

  // 11. Font Weights
  Object.entries(fontWeights).forEach(([key, value]) => {
    tokens.fontWeights[key] = { $value: Number(value), $type: 'fontWeights' };
  });

  // 12. Line Heights
  Object.entries(lineHeights).forEach(([key, value]) => {
    tokens.lineHeights[key] = {
      $value: `${Math.round(parseFloat(value as string) * 100)}%`,
      $type: 'lineHeights',
    };
  });

  // 13. Letter Spacing
  Object.entries(letterSpacing).forEach(([key, value]) => {
    tokens.letterSpacing[key] = { $value: value, $type: 'letterSpacing' };
  });

  // 14. Paragraph Spacing — semantic subset drawn from the spacing scale
  (['2', '3', '4', '5', '6', '8'] as Array<keyof typeof spacing>).forEach((key) => {
    tokens.paragraphSpacing[key] = { $value: spacing[key], $type: 'paragraphSpacing' };
  });

  // 15. Text Case
  const textCaseValues: Record<string, string> = {
    none: 'none',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
  };
  Object.entries(textCaseValues).forEach(([key, value]) => {
    tokens.textCase[key] = { $value: value, $type: 'textCase' };
  });

  // 16. Text Decoration
  const textDecorationValues: Record<string, string> = {
    none: 'none',
    underline: 'underline',
    lineThrough: 'line-through',
    overline: 'overline',
  };
  Object.entries(textDecorationValues).forEach(([key, value]) => {
    tokens.textDecoration[key] = { $value: value, $type: 'textDecoration' };
  });

  // 17. Typography — composite tokens built from fontSizes tuples.
  // References {fontFamilies.sans} so Figma resolves the family from the token set.
  Object.entries(fontSizes).forEach(([key, tuple]) => {
    const [fontSize, meta] = tuple as [
      string,
      { lineHeight?: string; fontWeight?: string } | undefined,
    ];
    const lineHeight = meta?.lineHeight ? toLineHeightPercent(meta.lineHeight) : '150%';
    const fontWeight = meta?.fontWeight ? Number(meta.fontWeight) : 400;
    tokens.typography[key] = {
      $value: {
        fontFamily: '{fontFamilies.sans}',
        fontWeight,
        fontSize,
        lineHeight,
        letterSpacing: '0',
      },
      $type: 'typography',
    };
  });

  // 18. Duration — animation timing from motion tokens
  Object.entries(transitions.duration).forEach(([key, value]) => {
    tokens.duration[key] = { $value: value, $type: 'duration' };
  });

  // 19. Dimension — breakpoints as named viewport dimensions
  Object.entries(breakpoints).forEach(([key, value]) => {
    tokens.dimension[key] = { $value: value, $type: 'dimension' };
  });

  // 20. Number — z-index hierarchy ('auto' excluded as it is not numeric)
  Object.entries(zIndex).forEach(([key, value]) => {
    if (value !== 'auto') {
      tokens.number[key] = { $value: value, $type: 'number' };
    }
  });

  return JSON.stringify(tokens, null, 2);
}
