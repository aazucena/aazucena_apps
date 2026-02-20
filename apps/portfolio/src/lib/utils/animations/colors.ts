/**
 * Color Utilities
 * Shared color mapping functions to prevent Tailwind CSS purging
 * and convert between Tailwind color names and hex values
 */

// Tailwind color name to hex conversion map
const COLOR_HEX_MAP: Record<string, string> = {
  "cyan-400": "#22d3ee",
  "blue-500": "#3b82f6",
  "purple-400": "#c084fc",
  "pink-500": "#ec4899",
  "yellow-400": "#facc15",
  "orange-500": "#f97316",
  "green-400": "#4ade80",
  "emerald-500": "#10b981",
} as const;

/**
 * Converts a Tailwind color name to hex value for use in SVG/inline styles
 * @param colorName - Tailwind color name (e.g., 'cyan-400')
 * @returns Hex color value (e.g., '#22d3ee')
 */
export function getHexColor(colorName: string): string {
  return COLOR_HEX_MAP[colorName] || "#22d3ee";
}

/**
 * Parses a Tailwind gradient string and returns hex values for from/to colors
 * @param gradient - Gradient string (e.g., 'from-cyan-400 to-blue-500')
 * @returns Object with 'from' and 'to' hex color values
 */
export function getGradientColors(gradient: string): {
  from: string;
  to: string;
} {
  const parts = gradient.split(" ");
  const fromColor = parts[0]!.replace("from-", "");
  const toColor = parts[1]!.replace("to-", "");

  return {
    from: getHexColor(fromColor),
    to: getHexColor(toColor),
  };
}

/**
 * Returns complete Tailwind classes for skill badges based on gradient
 * Using complete class names to prevent Tailwind CSS purging
 * @param gradient - Gradient string (e.g., 'from-cyan-400 to-blue-500')
 * @returns Complete Tailwind class string
 */
export function getBadgeClasses(gradient: string): string {
  const baseClasses =
    "px-4 py-2 rounded-full text-sm font-medium transition-colors";

  const colorMap: Record<string, string> = {
    "from-cyan-400 to-blue-500":
      "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/30",
    "from-purple-400 to-pink-500":
      "bg-purple-400/20 text-purple-400 border border-purple-400/30 hover:bg-purple-400/30",
    "from-green-400 to-emerald-500":
      "bg-green-400/20 text-green-400 border border-green-400/30 hover:bg-green-400/30",
    "from-blue-400 to-indigo-500":
      "bg-blue-400/20 text-blue-400 border border-blue-400/30 hover:bg-blue-400/30",
    "from-yellow-400 to-orange-500":
      "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/30",
    "from-pink-400 to-red-500":
      "bg-pink-400/20 text-pink-400 border border-pink-400/30 hover:bg-pink-400/30",
  };

  return `${baseClasses} ${colorMap[gradient] || colorMap["from-cyan-400 to-blue-500"]}`;
}

/**
 * Returns complete Tailwind classes for blog/tag badges based on color name
 * Using complete class names to prevent Tailwind CSS purging
 * @param color - Color name (e.g., 'cyan', 'purple', 'green')
 * @returns Complete Tailwind class string
 */
export function getTagClasses(color: string): string {
  const colorMap: Record<string, string> = {
    cyan: "px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-xs",
    purple: "px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full text-xs",
    green: "px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-xs",
    blue: "px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs",
    yellow: "px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs",
    pink: "px-3 py-1 bg-pink-400/20 text-pink-400 rounded-full text-xs",
    red: "px-3 py-1 bg-red-400/20 text-red-400 rounded-full text-xs",
  };

  return (colorMap[color] || colorMap["cyan"]) as string;
}
