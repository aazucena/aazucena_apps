/**
 * ViewMoreCard Component
 * "View All" CTA card for carousels
 */

import type { JSX } from 'react';
import { cn } from '@aazucena/utils';

export interface ViewMoreCardProps {
  /** Link destination */
  href: string;
  /** Main heading text */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Additional className */
  className?: string;
}

/**
 * ViewMoreCard
 */
export function ViewMoreCard({
  href,
  title,
  subtitle,
  onClick,
  className,
}: ViewMoreCardProps): JSX.Element {
  return (
    <a
      href={href}
      className={cn(
        'block flex w-[420px] cursor-pointer items-center justify-center rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 p-6 text-left no-underline backdrop-blur-sm transition-all duration-300 hover:from-cyan-400/30 hover:to-blue-500/30',
        className,
      )}
      onClick={onClick}
    >
      <div className="text-center">
        <h3 className="mb-2 text-3xl font-bold text-white">{title}</h3>
        <p className="text-gray-300">{subtitle}</p>
      </div>
    </a>
  );
}
