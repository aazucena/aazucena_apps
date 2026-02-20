/**
 * Tag Color Utility
 * Provides consistent tag styling across the portfolio
 */

export type TagColor =
  | "cyan"
  | "purple"
  | "green"
  | "orange"
  | "blue"
  | "pink"
  | "yellow"
  | "gray"
  | "teal"
  | "red";

/**
 * Maps tag color names to Tailwind CSS classes
 *
 * NOTE: We must use full Tailwind class names (not dynamic concatenation)
 * because Tailwind's JIT compiler needs to see the complete class name
 * at build time for proper purging.
 *
 * @param color - The color name
 * @returns Tailwind CSS classes for the tag
 */
export function getTagColorClasses(color?: string): string {
  switch (color) {
    case "cyan":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
    case "purple":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "green":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "orange":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case "blue":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "pink":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
    case "yellow":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "teal":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
    case "red":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "gray":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      // Default gray color for unknown or empty values
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

/**
 * Validates if a string is a valid tag color
 * @param color - The color to validate
 * @returns true if valid, false otherwise
 */
export function isValidTagColor(color?: string): color is TagColor {
  const validColors: TagColor[] = [
    "cyan",
    "purple",
    "green",
    "orange",
    "blue",
    "pink",
    "yellow",
    "gray",
    "teal",
    "red",
  ];
  return color ? validColors.includes(color as TagColor) : false;
}

/**
 * Gets all available tag colors
 * @returns Array of valid tag colors
 */
export function getAllTagColors(): TagColor[] {
  return [
    "cyan",
    "purple",
    "green",
    "orange",
    "blue",
    "pink",
    "yellow",
    "gray",
    "teal",
    "red",
  ];
}
