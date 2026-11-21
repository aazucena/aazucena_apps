/**
 * CompanyLogo Component
 * Company logo (keeps its own colours) or initials on a state tone
 * Reusable in ExperienceSection and experience detail pages
 */

import type { JSX } from "react";
import { getCompanyInitials } from "@aazucena/utils";

export interface CompanyLogoProps {
  /** Company name */
  company: string;
  /** Company logo data */
  companyLogo?: {
    url?: string;
    alt?: string;
  } | null;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

/**
 * Size variant styles
 */
const sizeVariants = {
  sm: "w-10 h-10 text-base",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-2xl",
} as const;

/**
 * CompanyLogo
 * Displays company logo image or initials on a state tone
 */
export function CompanyLogo({
  company,
  companyLogo,
  size = "md",
  className = "",
}: CompanyLogoProps): JSX.Element {
  const initials = getCompanyInitials(company);
  const sizeClass = sizeVariants[size];

  const hasLogo = Boolean(companyLogo?.url);

  return (
    <div
      className={`rounded-control border-rule flex flex-shrink-0 items-center justify-center overflow-hidden border font-mono ${hasLogo ? "bg-(--logo-plate)" : "bg-state text-signal"} ${sizeClass} ${className}`}
    >
      {companyLogo?.url ? (
        <img
          src={companyLogo.url}
          alt={companyLogo.alt || `${company} logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
