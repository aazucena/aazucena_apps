/**
 * [Utils] : Experience_Analytics
 * Specialized helpers for career timeline and company metadata.
 */

/**
 * Format company size with employee count ranges.
 */
export function formatCompanySize(size: string): string {
  const sizeMap: Record<string, string> = {
    startup: 'Startup (1-10 employees)',
    small: 'Small (11-50 employees)',
    medium: 'Medium (51-200 employees)',
    midsize: 'Midsize (201-1000 employees)',
    large: 'Large (1001-5000 employees)',
    enterprise: 'Enterprise (5001-10000 employees)',
    global: 'Global (10000+ employees)',
  };

  return sizeMap[size.toLowerCase()] || size;
}

/**
 * Calculate duration between dates.
 * Returns formatted string like "2 years 3 months" or "3 months".
 */
export function calculateDuration(
  startDate: string,
  endDate?: string,
  isCurrent?: boolean,
): string {
  const start = new Date(startDate);
  const end = isCurrent || !endDate ? new Date() : new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid dates';
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);

  return parts.length === 0 ? 'Less than 1 month' : parts.join(' ');
}

/**
 * Generate deterministic gradient for company logo background.
 */
export function getCompanyLogoGradient(companyName: string): string {
  const gradients = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-violet-600',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-emerald-600',
    'from-blue-500 to-indigo-600',
  ];

  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = (hash << 5) - hash + companyName.charCodeAt(i);
    hash = hash & hash;
  }

  const index = Math.abs(hash) % gradients.length;
  return gradients[index] || 'from-cyan-500 to-blue-600';
}

/**
 * Generate company initials from name.
 */
export function getCompanyInitials(companyName: string): string {
  const words = companyName.trim().split(/\s+/);
  if (words.length === 1 && words[0]) return words[0].substring(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => (word ? word[0] : ''))
    .join('')
    .toUpperCase();
}
