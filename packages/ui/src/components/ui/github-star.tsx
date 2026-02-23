'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Star, GitHub as GitHubIcon } from '@aazucena/icons';
import { useGithubRepo } from '@aazucena/hooks';

const githubStarVariants = cva(
  'inline-flex items-stretch overflow-hidden rounded-md border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-background border-input hover:border-muted-foreground/30',
        glass: 'glass border-white/10 text-white hover:bg-white/10',
        cyber:
          'bg-black border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-500/60',
      },
      size: {
        default: 'h-7 text-xs',
        sm: 'h-6 text-[10px]',
        lg: 'h-9 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface GithubStarProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof githubStarVariants> {
  owner: string;
  repo: string;
  showCount?: boolean;
  showBranding?: boolean;
}

/**
 * A GitHub Star button that mimics the official GitHub aesthetic.
 * Now powered by the reusable useGithubRepo hook.
 */
const GithubStar = React.forwardRef<HTMLAnchorElement, GithubStarProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      owner,
      repo,
      showCount = true,
      showBranding = true,
      ...props
    },
    ref,
  ) => {
    const { data, isLoading, error } = useGithubRepo(owner, repo);

    const formatCount = (count: number | undefined) => {
      if (count === undefined) return '--';
      if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
      return count.toLocaleString();
    };

    const isCyber = variant === 'cyber';
    const isGlass = variant === 'glass';

    return (
      <a
        ref={ref}
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(githubStarVariants({ variant, size }), className)}
        {...props}
      >
        {/* Left Side: Icon & Label */}
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 transition-colors",
          variant === 'default' ? "bg-background border-r" : "bg-transparent",
          isCyber && "border-r border-cyan-500/20 bg-cyan-500/5",
          isGlass && "border-r border-white/10 bg-white/5"
        )}>
          {showBranding && <GitHubIcon className={cn("size-3.5", size === 'sm' && "size-3", size === 'lg' && "size-4")} />}
          <span className="font-bolt">Star</span>
          <Star className={cn("size-3.5", size === 'sm' && "size-3", size === 'lg' && "size-4", isLoading && "animate-pulse")} />
        </div>

        {/* Right Side: Count or Status */}
        {showCount && (
          <div className={cn(
            "flex items-center px-2.5 font-mono font-medium",
            variant === 'default' ? "bg-muted/30" : "bg-transparent",
            isCyber && "text-cyan-300 bg-black/40",
            error && "text-rose-500 opacity-70 italic text-[9px]"
          )}>
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : error ? (
              <span>Unavailable</span>
            ) : (
              formatCount(data?.stargazers_count)
            )}
          </div>
        )}
      </a>
    );
  },
);
GithubStar.displayName = 'GithubStar';

export { GithubStar, githubStarVariants };
