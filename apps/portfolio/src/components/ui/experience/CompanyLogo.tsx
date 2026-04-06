/**
 * CompanyLogo Component
 * Company logo or initials with gradient background
 * Reusable in ExperienceSection and experience detail pages
 */

import type { JSX } from "react";
import {
  getCompanyLogoGradient,
  getCompanyInitials,
  getGradientColors,
} from "@aazucena/utils";

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
 * Displays company logo image or gradient-filled initials
 */
export function CompanyLogo({
  company,
  companyLogo,
  size = "md",
  className = "",
}: CompanyLogoProps): JSX.Element {
  const gradient = getCompanyLogoGradient(company);
  const { from, to } = getGradientColors(gradient);
  const initials = getCompanyInitials(company);
  const sizeClass = sizeVariants[size];

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg font-bold text-white shadow-lg ${sizeClass} ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {companyLogo?.url ? (
        <img
          src={companyLogo.url}
          alt={companyLogo.alt || `${company} logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}
