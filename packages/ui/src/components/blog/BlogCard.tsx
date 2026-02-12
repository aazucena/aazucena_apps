/**
 * BlogCard Component
 * Individual blog post card
 */

import type { JSX } from 'react';
import { ExternalLink } from '@aazucena/icons';
import { GlassCard } from '../common/GlassCard.js';
import { getTagClasses } from '@aazucena/utils';
import { formatPostDate, calculateReadTime } from '@aazucena/utils';
import type { BlogPost } from '@aazucena/types';
import { cn } from '@aazucena/utils';

export interface BlogCardProps {
  post: BlogPost;
  showTags?: boolean;
  showDate?: boolean;
  showReadTime?: boolean;
  className?: string;
}

/**
 * BlogCard
 */
export function BlogCard({
  post,
  showTags = true,
  showDate = true,
  showReadTime = true,
  className,
}: BlogCardProps): JSX.Element {
  const isExternal = post.slug.startsWith('http');
  const postUrl = isExternal ? post.slug : `/blog/${post.slug}`;

  return (
    <GlassCard
      as="a"
      href={postUrl}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      hover
      clickable
      padding="lg"
      className={cn('group text-left', className)}
    >
      {showTags && post.tags && post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {post.tags.map((tag, tagIndex) => (
            <span key={tagIndex} className={getTagClasses(tag.color)}>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-400">
          {post.title}
        </h3>
        {isExternal && (
          <ExternalLink className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-cyan-400" />
        )}
      </div>

      {(showDate || showReadTime) && (
        <div className="mb-3 flex items-center gap-3">
          {showDate && (
            <p className="text-sm text-gray-400">
              {formatPostDate({ publishedAt: post.publishedAt! })}
            </p>
          )}
          {showDate && showReadTime && <span className="text-gray-500">•</span>}
          {showReadTime && (
            <p className="text-sm text-gray-400">{calculateReadTime(post.description as any)}</p>
          )}
        </div>
      )}

      <p className="line-clamp-3 text-sm leading-relaxed text-gray-300">
        {post.description as any}
      </p>
    </GlassCard>
  );
}
