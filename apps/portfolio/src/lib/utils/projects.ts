/**
 * Format project date
 */
export function formatProjectDate(date?: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Get project status badge classes
 */
export function getProjectStatusClasses(status: string): string {
  const statusMap: Record<string, string> = {
    Released:
      "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50",
    Completed:
      "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50",
    "In Progress":
      "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50",
    default:
      "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-900/50",
  };
  return statusMap[status] || statusMap.default!;
}

/**
 * Get project status indicator (pulsing dot for active projects)
 */
export function getProjectStatusIndicator(status: string): string {
  return status === "Released" || status === "In Progress"
    ? "bg-green-500 animate-pulse"
    : "bg-gray-400";
}

/**
 * Maps project status to StatusBadge variants
 */
export function getProjectStatusVariant(
  status: string,
): "green" | "blue" | "gray" | "yellow" | "red" {
  const map: Record<string, "green" | "blue" | "gray" | "yellow" | "red"> = {
    Released: "green",
    Completed: "green",
    "In Progress": "blue",
    Planned: "gray",
    "On Hold": "red",
    Archived: "yellow",
    Maintenance: "blue",
  };
  return map[status] || "gray";
}
