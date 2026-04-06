/**
 * BlogCard Component
 * Individual blog post card with tags, metadata, and external link indicator
 */

import React, { type JSX } from "react";
import { ExternalLink } from "@aazucena/icons";
import { GlassCard } from "../common/GlassCard";
import { getTagClasses } from "@aazucena/utils";
import { formatPostDate, calculateReadTime } from "@aazucena/utils";
import type { BlogPost } from "@aazucena/types";
import type { BlogConfigData } from "@aazucena/types";

export interface BlogCardProps {
  post: BlogPost;
  displayConfig: BlogConfigData["display"];
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
              <span key={tagIndex} className={getTagClasses(tag.color)}>
                {tag.label}
              </span>
            ),
          )}
        </div>
      )}

      {/* Title with External Link Icon */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-400">
          {post.title}
        </h3>
        {post.isExternal && (
          <ExternalLink
            className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-cyan-400"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Date and Read Time - Conditionally shown based on CMS config */}
      {(displayConfig.showDate || displayConfig.showReadTime) && (
        <div className="mb-3 flex items-center gap-3">
          {displayConfig.showDate && (
            <p className="text-sm text-gray-400">
              {formatPostDate(post as { publishedAt: string })}
            </p>
          )}
          {displayConfig.showDate && displayConfig.showReadTime && (
            <span className="text-gray-500">•</span>
          )}
          {displayConfig.showReadTime && (
            <p className="text-sm text-gray-400">
              {calculateReadTime(post.description)}
            </p>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-300">
        {post.description as React.ReactNode}
      </p>
    </GlassCard>
  );
}
