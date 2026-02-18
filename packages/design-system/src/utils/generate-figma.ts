import { colors } from '../tokens/colors.js';
import { spacing } from '../tokens/spacing.js';
import { fontSizes, fontWeights, lineHeights } from '../tokens/typography.js';

/**
 * Generates a JSON string for Figma/Style Dictionary consumption.
 * Follows the Design Tokens Community Group (DTCG) draft format.
 */
export function generateFigmaTokens(): string {
  const tokens: any = {
    colors: {},
    spacing: {},
    typography: {
      fontSizes: {},
      fontWeights: {},
      lineHeights: {},
    },
  };

  // 1. Colors
  Object.entries(colors).forEach(([name, scale]) => {
    // Handle primitive color values (inherit, current, transparent, black, white)
    if (typeof scale === 'string') {
      tokens.colors[name] = {
        $value: scale,
        $type: 'color',
      };
    } else {
      // Handle color scales (slate, gray, zinc, etc.)
      tokens.colors[name] = {};
      Object.entries(scale).forEach(([weight, value]) => {
        tokens.colors[name][weight] = {
          $value: value,
          $type: 'color',
        };
      });
    }
  });

  // 2. Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    tokens.spacing[key] = {
      $value: value,
      $type: 'dimension',
    };
  });

  // 3. Typography
  Object.entries(fontSizes).forEach(([key, [value]]) => {
    tokens.typography.fontSizes[key] = {
      $value: value,
      $type: 'dimension',
    };
  });

  Object.entries(fontWeights).forEach(([key, value]) => {
    tokens.typography.fontWeights[key] = {
      $value: value,
      $type: 'fontWeight',
    };
  });

  Object.entries(lineHeights).forEach(([key, value]) => {
    tokens.typography.lineHeights[key] = {
      $value: value,
      $type: 'number',
    };
  });

  return JSON.stringify(tokens, null, 2);
}
