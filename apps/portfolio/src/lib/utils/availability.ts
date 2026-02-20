/**
 * Availability Status Utility
 * Maps the portfolio availability status string to visual indicators (color, pulse, etc.)
 */

export interface AvailabilityIndicator {
  color: string;
  pulse: boolean;
  label: string;
}

/**
 * Get visual indicator properties based on availability status string
 *
 * Mappings:
 * - 'Open to Opportunities' -> Green + Pulse
 * - 'Busy / Working on Projects' -> Yellow
 * - 'On Break / Personal Time' -> Orange
 * - 'Looking for Collaborations' -> Blue + Pulse
 * - 'Unavailable' -> Red
 * - Default -> Gray
 */
export function getAvailabilityIndicator(
  status?: string,
): AvailabilityIndicator {
  // Normalize input
  const normalizedStatus = (status || "").toLowerCase().trim();

  if (
    normalizedStatus.includes("open") ||
    normalizedStatus.includes("opportunities")
  ) {
    return {
      color: "bg-green-500",
      pulse: true,
      label: status || "Open to Opportunities",
    };
  }

  if (
    normalizedStatus.includes("busy") ||
    normalizedStatus.includes("working")
  ) {
    return {
      color: "bg-yellow-500",
      pulse: false,
      label: status || "Busy",
    };
  }

  if (
    normalizedStatus.includes("break") ||
    normalizedStatus.includes("personal")
  ) {
    return {
      color: "bg-orange-500",
      pulse: false,
      label: status || "On Break",
    };
  }

  if (normalizedStatus.includes("collaboration")) {
    return {
      color: "bg-blue-500",
      pulse: true,
      label: status || "Collaborating",
    };
  }

  if (
    normalizedStatus.includes("unavailable") ||
    normalizedStatus.includes("closed")
  ) {
    return {
      color: "bg-red-500",
      pulse: false,
      label: status || "Unavailable",
    };
  }

  // Default fallback
  return {
    color: "bg-gray-400",
    pulse: false,
    label: status || "Status Unknown",
  };
}
