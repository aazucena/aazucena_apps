/**
 * CompanyLogo Component
 * Company logo or initials with gradient background
 */

import type { JSX } from 'react';
import { getCompanyLogoGradient, getCompanyInitials } from '@aazucena/utils';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const companyLogoVariants = cva(
  'flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br font-bold text-white shadow-lg',
  {
    variants: {
      size: {
        sm: 'w-10 h-10 text-base',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface CompanyLogoProps extends VariantProps<typeof companyLogoVariants> {
  /** Company name */
  company: string;
  /** Company logo data */
  companyLogo?: {
    url?: string;
    alt?: string;
  } | null;
  /** Additional className */
  className?: string;
}

/**
 * CompanyLogo
 */
export function CompanyLogo({
  company,
  companyLogo,
  size,
  className = '',
}: CompanyLogoProps): JSX.Element {
  const gradient = getCompanyLogoGradient(company);
  const initials = getCompanyInitials(company);

  return (
    <div className={cn(companyLogoVariants({ size }), gradient, className)}>
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
