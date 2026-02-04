/**
 * BlogCard Component
 * Individual blog post card with tags, metadata, and external link indicator
 */

import type { JSX } from 'react';
import { GlassCard } from '../common/GlassCard';
import { getTagClasses } from '~/lib/utils/animations/colors';
import { formatPostDate, calculateReadTime } from '~/lib/utils/blog';
import type { BlogPost } from '~/lib/transformers/posts';
import type { BlogConfigData } from '~/lib/transformers/blog-config';

export interface BlogCardProps {
  post: BlogPost;
  displayConfig: BlogConfigData['display'];
}

/**
 * External Link Icon
 * SVG icon indicating external links
 */
function ExternalLinkIcon(): JSX.Element {
  return (
    <svg
      className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
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
      target={post.isExternal ? '_blank' : '_self'}
      rel={post.isExternal ? 'noopener noreferrer' : undefined}
      hover
      clickable
      padding="lg"
      className="text-left group"
    >
      {/* Tags Row - Conditionally shown based on CMS config */}
      {displayConfig.showTags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {post.tags.map((tag: { label: string; color: string }, tagIndex: number) => (
            <span
              key={tagIndex}
              className={getTagClasses(tag.color)}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Title with External Link Icon */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
          {post.title}
        </h3>
        {post.isExternal && <ExternalLinkIcon />}
      </div>

      {/* Date and Read Time - Conditionally shown based on CMS config */}
      {(displayConfig.showDate || displayConfig.showReadTime) && (
        <div className="flex items-center gap-3 mb-3">
          {displayConfig.showDate && (
            <p className="text-sm text-gray-400">{formatPostDate(post)}</p>
          )}
          {displayConfig.showDate && displayConfig.showReadTime && (
            <span className="text-gray-500">•</span>
          )}
          {displayConfig.showReadTime && (
            <p className="text-sm text-gray-400">{calculateReadTime(post.description)}</p>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed">
        {post.description}
      </p>
    </GlassCard>
  );
}
