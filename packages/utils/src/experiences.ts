/**
 * Experience-related utility functions
 */

/**
 * Gets a consistent gradient class based on company name
 */
export function getCompanyLogoGradient(company: string): string {
  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-emerald-500 to-teal-400',
    'from-orange-500 to-yellow-400',
    'from-indigo-500 to-blue-400',
    'from-rose-500 to-pink-400',
  ];

  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % gradients.length;
  return gradients[index] || 'from-blue-500 to-cyan-400';
}

/**
 * Gets company initials from name (e.g., "Google" -> "G", "Open AI" -> "OA")
 */
export function getCompanyInitials(company: string): string {
  if (!company) return '';

  const words = company.trim().split(/\s+/);
  if (words.length === 1 && words[0]) return words[0].substring(0, 1).toUpperCase();

  const first = words[0]?.substring(0, 1) || '';
  const last = words[words.length - 1]?.substring(0, 1) || '';

  return (first + last).toUpperCase();
}

/**
 * Formats company size string
 */
export function formatCompanySize(size: string | number): string {
  if (typeof size === 'number') return `${size.toLocaleString()}+ employees`;
  return size;
}

/**
 * Gets hex colors from a gradient class string
 */
export function getGradientColors(gradient: string): {
  from: string;
  to: string;
} {
  const colorMap: Record<string, string> = {
    cyan: '#22d3ee',
    blue: '#3b82f6',
    purple: '#a855f7',
    emerald: '#10b981',
    orange: '#f97316',
    yellow: '#fbbf24',
    rose: '#f43f5e',
    pink: '#ec4899',
  };

  const fromMatch = gradient.match(/from-(\w+)-/);
  const toMatch = gradient.match(/to-(\w+)-/);

  return {
    from: colorMap[fromMatch?.[1] || 'cyan'] || colorMap['cyan'] || '#22d3ee',
    to: colorMap[toMatch?.[1] || 'blue'] || colorMap['blue'] || '#3b82f6',
  };
}
