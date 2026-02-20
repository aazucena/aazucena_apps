/**
 * Experience Helper Utilities
 * Functions for formatting and calculating experience-related data
 */

import { DateTime } from "luxon";

/**
 * Format company size with employee count ranges
 */
export function formatCompanySize(size: string): string {
  const sizeMap: Record<string, string> = {
    startup: "Startup (1-10 employees)",
    small: "Small (11-50 employees)",
    medium: "Medium (51-200 employees)",
    midsize: "Midsize (201-1000 employees)",
    large: "Large (1001-5000 employees)",
    enterprise: "Enterprise (5001-10000 employees)",
    global: "Global (10000+ employees)",
  };

  return sizeMap[size.toLowerCase()] || size;
}

/**
 * Calculate duration from start and end dates using Luxon
 * Returns formatted string like "2 years 3 months" or "3 months"
 */
export function calculateDuration(
  startDate: string,
  endDate?: string,
  isCurrent?: boolean,
): string {
  const start = DateTime.fromISO(startDate);
  const end =
    isCurrent || !endDate ? DateTime.now() : DateTime.fromISO(endDate);

  if (!start.isValid || !end.isValid) {
    return "Invalid dates";
  }

  const diff = end.diff(start, ["years", "months"]).toObject();
  const years = Math.floor(diff.years || 0);
  const months = Math.floor(diff.months || 0);

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  }

  // Handle edge case where duration is less than a month
  if (parts.length === 0) {
    return "Less than 1 month";
  }

  return parts.join(" ");
}

/**
 * Get icon name for employment type
 */
export function getEmploymentTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    "Full-time": "briefcase",
    "Part-time": "clock",
    Contract: "file-contract",
    Freelance: "user",
    Internship: "graduation-cap",
    "Co-op": "users",
  };

  return iconMap[type] || "briefcase";
}

/**
 * Get icon name for industry
 */
export function getIndustryIcon(industry: string): string {
  const iconMap: Record<string, string> = {
    Technology: "code",
    Finance: "dollar-circle",
    Healthcare: "heart-pulse",
    Education: "book",
    Entertainment: "music",
    Retail: "shopping-cart",
    Manufacturing: "factory",
    Government: "landmark",
    "Non-Profit": "heart",
    Startup: "rocket",
    "Food & Beverage": "utensils",
    "Oil & Gas": "fire",
    Media: "camera",
  };

  return iconMap[industry] || "building";
}

/**
 * Generate deterministic gradient for company logo background
 * Hashes company name to consistently return the same gradient
 */
export function getCompanyLogoGradient(companyName: string): string {
  const gradients = [
    "from-cyan-500 to-blue-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-indigo-500 to-violet-600",
    "from-yellow-500 to-orange-500",
    "from-green-500 to-emerald-600",
    "from-blue-500 to-indigo-600",
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = (hash << 5) - hash + companyName.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % gradients.length;
  return gradients[index]!;
}

/**
 * Generate company initials from company name
 * Returns first 1-2 letters based on word count
 */
export function getCompanyInitials(companyName: string): string {
  const words = companyName.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word: take first 2 characters
    return words[0]!.substring(0, 2).toUpperCase();
  }

  // Multiple words: take first letter of first 2 words
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
