/**
 * TestimonialCard Component
 * Individual testimonial card with quote, author info, and avatar
 */

import type { JSX } from "react";
import { GlassCard } from "./common/GlassCard";

export interface TestimonialCardProps {
  /** Testimonial quote text */
  quote: string;
  /** Author name */
  name: string;
  /** Author title/position */
  title: string;
  /** Avatar text (usually initials) */
  avatar: string;
}

/**
 * TestimonialCard
 * Displays a testimonial with quote, author info, and initials avatar
 */
export function TestimonialCard({
  quote,
  name,
  title,
  avatar,
}: TestimonialCardProps): JSX.Element {
  return (
    <GlassCard
      as="li"
      padding="lg"
      className="flex min-h-[280px] w-[350px] max-w-full flex-col md:w-[450px]"
    >
      <blockquote className="flex h-full flex-col">
        <div
          aria-hidden="true"
          className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
        ></div>
        <div className="relative z-20 flex h-full flex-col justify-between pt-8">
          {/* Quote Text */}
          <span className="text-foreground flex-grow text-base leading-[1.6] font-normal">
            {quote}
          </span>

          {/* Author Info & Avatar */}
          <div className="mt-auto flex flex-row items-center justify-between gap-4">
            {/* Author Details */}
            <div className="flex flex-col gap-1 *:text-left">
              <span className="text-foreground text-base leading-[1.6] font-semibold">
                {name}
              </span>
              <span className="text-muted-foreground text-sm leading-[1.6] font-normal">
                {title}
              </span>
            </div>

            {/* Avatar */}
            <div className="bg-state border-rule-strong text-foreground flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border font-mono text-base">
              {avatar}
            </div>
          </div>
        </div>
      </blockquote>
    </GlassCard>
  );
}
