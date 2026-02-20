'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const commentsVariants = cva('w-full space-y-4', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export interface CommentData {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes?: number;
  replies?: CommentData[];
}

export interface CommentsProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof commentsVariants> {
  comments: CommentData[];
  onReply?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  maxDepth?: number;
}

function CommentNode({
  comment,
  variant,
  depth,
  maxDepth,
  onReply,
  onLike,
}: {
  comment: CommentData;
  variant: string;
  depth: number;
  maxDepth: number;
  onReply?: (id: string) => void;
  onLike?: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        depth > 0 && 'ml-6 border-l pl-4',
        variant === 'cyber' ? 'border-cyan-500/15' : 'border-border',
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
            variant === 'cyber' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-primary/10 text-primary',
          )}
        >
          {comment.avatar ? (
            <img src={comment.avatar} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            comment.author.charAt(0).toUpperCase()
          )}
        </div>
        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                'font-semibold',
                variant === 'cyber' ? 'font-mono text-cyan-50' : 'text-foreground',
              )}
            >
              {comment.author}
            </span>
            <span
              className={cn(
                'text-[10px]',
                variant === 'cyber' ? 'text-cyan-500/40' : 'text-muted-foreground',
              )}
            >
              {comment.timestamp}
            </span>
          </div>
          <p
            className={cn(
              'mt-1 leading-relaxed',
              variant === 'cyber' ? 'text-cyan-50/80' : 'text-foreground/80',
            )}
          >
            {comment.content}
          </p>
          {/* Actions */}
          <div className="mt-1.5 flex items-center gap-3">
            {onLike && (
              <button
                type="button"
                onClick={() => onLike(comment.id)}
                className={cn(
                  'flex items-center gap-1 text-[11px] transition-colors',
                  variant === 'cyber'
                    ? 'text-cyan-500/40 hover:text-cyan-400'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                {comment.likes ?? 0}
              </button>
            )}
            {onReply && depth < maxDepth && (
              <button
                type="button"
                onClick={() => onReply(comment.id)}
                className={cn(
                  'text-[11px] transition-colors',
                  variant === 'cyber'
                    ? 'text-cyan-500/40 hover:text-cyan-400'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Nested replies */}
      {comment.replies && depth < maxDepth && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              variant={variant}
              depth={depth + 1}
              maxDepth={maxDepth}
              onReply={onReply}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const Comments = React.forwardRef<HTMLDivElement, CommentsProps>(
  (
    { className, variant = 'default', size, comments, onReply, onLike, maxDepth = 3, ...props },
    ref,
  ) => {
    const v = variant ?? 'default';

    return (
      <div ref={ref} className={cn(commentsVariants({ variant, size }), className)} {...props}>
        {comments.map((comment) => (
          <CommentNode
            key={comment.id}
            comment={comment}
            variant={v}
            depth={0}
            maxDepth={maxDepth}
            onReply={onReply}
            onLike={onLike}
          />
        ))}
      </div>
    );
  },
);
Comments.displayName = 'Comments';

export { Comments, commentsVariants };
