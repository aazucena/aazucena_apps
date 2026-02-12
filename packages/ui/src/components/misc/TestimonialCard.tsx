/**
 * TestimonialCard Component
 * Individual testimonial card with quote, author info, and avatar
 */

import type { JSX } from 'react';
import { GlassCard } from '../common/GlassCard.js';
import { cn } from '@aazucena/utils';

export interface TestimonialCardProps {
  /** Testimonial quote text */
  quote: string;
  /** Author name */
  name: string;
  /** Author title/position */
  title: string;
  /** Avatar text (usually initials) */
  avatar: string;
  /** Gradient class for avatar background */
  gradient: string;
  /** Additional className */
  className?: string;
}

/**
 * TestimonialCard
 */
export function TestimonialCard({
  quote,
  name,
  title,
  avatar,
  gradient,
  className,
}: TestimonialCardProps): JSX.Element {
  return (
    <GlassCard
      as="li"
      padding="lg"
      className={cn(
        'flex min-h-[280px] w-[350px] max-w-full flex-col rounded-2xl md:w-[450px]',
        className,
      )}
    >
      <blockquote className="flex h-full flex-col">
        <div
          aria-hidden="true"
          className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
        ></div>
        <div className="relative z-20 flex h-full flex-col justify-between pt-8">
          {/* Quote Text */}
          <span className="flex-grow text-base leading-[1.6] font-normal text-gray-300">
            {quote}
          </span>

          {/* Author Info & Avatar */}
          <div className="mt-auto flex flex-row items-center justify-between gap-4">
            {/* Author Details */}
            <div className="flex flex-col gap-1 *:text-left">
              <span className="text-base leading-[1.6] font-semibold text-white">{name}</span>
              <span className="text-sm leading-[1.6] font-normal text-gray-400">{title}</span>
            </div>

            {/* Avatar */}
            <div
              className={cn(
                `flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white`,
                gradient,
              )}
            >
              {avatar}
            </div>
          </div>
        </div>
      </blockquote>
    </GlassCard>
  );
}
