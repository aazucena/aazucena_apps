/**
 * BlogCard Component
 * Individual blog post card with tags, metadata, and external link indicator
 */

import React, { type JSX } from "react";
import { ExternalLink } from "@aazucena/icons";
import { GlassCard } from "../common/GlassCard";
import { Badge, type BadgeVariant } from "../common/Badge";
import {
  formatPostDate,
  calculateReadTime,
  getPostExcerpt,
} from "@aazucena/utils";
import type { BlogPost } from "@aazucena/types";
import type { BlogConfigData } from "@aazucena/types";

export interface BlogCardProps {
  post: BlogPost;
  displayConfig: BlogConfigData["display"];
}

const BADGE_VARIANTS: BadgeVariant[] = [
  "cyan",
  "blue",
  "emerald",
  "purple",
  "pink",
  "yellow",
  "orange",
  "gray",
  "white",
];

/** CMS tag colour names map to tag badge hues; unknown names fall back to gray. */
function toBadgeVariant(color: string): BadgeVariant {
  return BADGE_VARIANTS.includes(color as BadgeVariant)
    ? (color as BadgeVariant)
    : "gray";
}

/**
 * BlogCard
 * Displays a single blog post with optional tags, date, read time, and external link indicator
 */
export function BlogCard({ post, displayConfig }: BlogCardProps): JSX.Element {
  return (
    <GlassCard
      as="a"
      href={post.url}
      target={post.isExternal ? "_blank" : "_self"}
      rel={post.isExternal ? "noopener noreferrer" : undefined}
      hover
      clickable
      padding="lg"
      className="group text-left"
    >
      {/* Tags Row - Conditionally shown based on CMS config */}
      {displayConfig.showTags && post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {post.tags.map(
            (tag: { label: string; color: string }, tagIndex: number) => (
              <Badge
                key={tagIndex}
                variant={toBadgeVariant(tag.color)}
                size="xs"
              >
                {tag.label}
              </Badge>
            ),
          )}
        </div>
      )}

      {/* Title with External Link Icon */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-foreground group-hover:text-signal text-lg font-semibold tracking-tight transition-colors">
          {post.title}
        </h3>
        {post.isExternal && (
          <ExternalLink
            className="text-muted-foreground group-hover:text-signal mt-1 size-4 shrink-0 transition-colors"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Date and Read Time - Conditionally shown based on CMS config */}
      {(displayConfig.showDate || displayConfig.showReadTime) && (
        <div className="mb-3 flex items-center gap-3">
          {displayConfig.showDate && (
            <p className="micro-label text-muted-foreground">
              {formatPostDate(post as { publishedAt: string })}
            </p>
          )}
          {displayConfig.showDate && displayConfig.showReadTime && (
            <span className="text-muted-foreground" aria-hidden="true">
              //
            </span>
          )}
          {displayConfig.showReadTime && (
            <p className="micro-label text-muted-foreground">
              {calculateReadTime(post.description)}
            </p>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed">
        {getPostExcerpt(post.description)}
      </p>
    </GlassCard>
  );
}
