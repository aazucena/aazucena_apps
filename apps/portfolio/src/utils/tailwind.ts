import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string with deduplication.
 * 
 * @param inputs - An array of class values that can be strings, arrays, or objects.
 * @returns A merged string of class names, with duplicates removed.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}