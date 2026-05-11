/**
 * Visual-related utility functions
 */

export * from './scene';

/**
 * Gets CSS classes for badges based on a color theme
 */
export function getBadgeClasses(color: string = 'cyan'): string {
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    purple: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
    emerald: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    orange: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    rose: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
  };

  return `px-3 py-1 text-sm font-medium rounded-full border ${colorMap[color] || colorMap.cyan}`;
}

/**
 * Gets CSS classes for tags based on a color string
 */
export function getTagClasses(color: string = 'cyan'): string {
  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-400/10 text-cyan-400',
    blue: 'bg-blue-400/10 text-blue-400',
    purple: 'bg-purple-400/10 text-purple-400',
    emerald: 'bg-emerald-400/10 text-emerald-400',
    orange: 'bg-orange-400/10 text-orange-400',
    rose: 'bg-rose-400/10 text-rose-400',
    gray: 'bg-gray-400/10 text-gray-400',
  };

  return `px-2 py-0.5 text-xs font-semibold rounded-md ${colorMap[color] || colorMap.cyan}`;
}

/**
 * Maps a Tailwind gradient string (e.g., from-cyan-400) to a base color name.
 */
export function mapGradientToColor(gradient: string): string {
  const match = gradient.match(/from-(\w+)-/);
  const color = match?.[1] || 'cyan';

  const colorMap: Record<string, string> = {
    cyan: 'cyan',
    blue: 'blue',
    purple: 'purple',
    pink: 'pink',
    green: 'emerald',
    emerald: 'emerald',
    yellow: 'yellow',
    orange: 'orange',
    red: 'rose',
    rose: 'rose',
    gray: 'gray',
  };

  return colorMap[color] || 'cyan';
}
