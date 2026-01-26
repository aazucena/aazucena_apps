/**
 * Get gradient class based on variant name
 * Maps CMS variant enums to Tailwind CSS classes
 */
export function getGradientClass(variant: string): string {
  const map: Record<string, string> = {
    'blue-cyan': 'from-blue-500 to-cyan-500',
    'purple-indigo': 'from-purple-500 to-indigo-500',
    'emerald-teal': 'from-emerald-500 to-teal-500',
    'orange-red': 'from-orange-500 to-red-500',
    'pink-purple': 'from-pink-500 to-purple-500'
  };
  return map[variant] || 'from-blue-500 to-cyan-500';
}

/**
 * Get solid color class based on variant name
 * Maps CMS variant enums to Tailwind CSS classes
 */
export function getColorClass(variant: string): string {
  const map: Record<string, string> = {
    'blue': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    'orange': 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    'purple': 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    'pink': 'text-pink-600 bg-pink-50 dark:bg-pink-900/20',
    'green': 'text-green-600 bg-green-50 dark:bg-green-900/20',
    'teal': 'text-teal-600 bg-teal-50 dark:bg-teal-900/20',
    'red': 'text-red-600 bg-red-50 dark:bg-red-900/20',
    'cyan': 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20',
    'gray': 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
  };
  return map[variant] || 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
}
