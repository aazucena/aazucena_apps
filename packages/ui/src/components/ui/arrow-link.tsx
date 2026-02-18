'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ArrowRight, ArrowLeft } from '@aazucena/icons';

const arrowLinkVariants = cva(
  'group/link transition-all duration-500 active:scale-95 inline-flex items-center gap-2 font-black uppercase tracking-[0.2em] no-underline',
  {
    variants: {
      variant: {
        default: 'text-primary hover:text-primary/80',
        cyber: 'text-primary dark:text-cyan-400 hover:text-primary/80 dark:hover:text-cyan-300 font-mono italic',
        muted: 'text-muted-foreground hover:text-primary',
        white: 'text-foreground dark:text-white hover:text-foreground/80 dark:hover:text-white/80',
        card: 'flex flex-col items-center justify-center rounded-[2rem] border p-12 backdrop-blur-sm bg-muted/50 border-border hover:bg-muted text-foreground',
        'card-glass':
          'flex flex-col items-center justify-center rounded-[2rem] border p-12 backdrop-blur-sm border-border/10 bg-background/5 dark:bg-white/5 hover:bg-background/10 dark:hover:bg-white/10 text-foreground shadow-xl',
        'card-cyber':
          'flex flex-col items-center justify-center rounded-[2rem] border p-12 backdrop-blur-sm border-border/10 dark:border-cyan-500/30 bg-primary/5 dark:bg-gradient-to-br dark:from-cyan-400/20 dark:to-blue-500/20 dark:hover:from-cyan-400/30 dark:hover:to-blue-500/30 text-foreground shadow-[0_0_20px_rgba(6,182,212,0.1)]',
        circular: 'gap-3 text-xs',
        'circular-cyber': 'gap-3 text-xs text-primary dark:text-cyan-400 hover:text-primary/80 dark:hover:text-cyan-300 font-mono italic',
      },
      size: {
        xs: 'text-[9px]',
        sm: 'text-[10px]',
        default: 'text-xs',
        lg: 'text-sm',
        xl: 'text-base',
      },
      direction: {
        left: 'flex-row-reverse',
        right: 'flex-row',
      }
    },
    compoundVariants: [
      { variant: ['card', 'card-glass', 'card-cyber'], className: 'flex-col text-center' }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      direction: 'right',
    },
  },
);

const arrowLinkIconVariants = cva('transition-all duration-300 flex items-center justify-center shrink-0', {
  variants: {
    iconStyle: {
      default: '',
      circular:
        'w-8 h-8 rounded-full bg-muted group-hover/link:bg-primary group-hover/link:text-primary-foreground',
      'circular-cyber':
        'w-8 h-8 rounded-full bg-primary/10 dark:bg-cyan-500/10 group-hover/link:bg-primary/20 dark:group-hover/link:bg-cyan-500/20 text-primary dark:text-cyan-400',
    },
  },
  defaultVariants: {
    iconStyle: 'default',
  },
});

export interface ArrowLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof arrowLinkVariants> {
  iconSize?: number;
  showArrow?: boolean;
}

const ArrowLink = React.forwardRef<HTMLAnchorElement, ArrowLinkProps>(
  (
    {
      className,
      variant,
      size,
      direction = 'right',
      iconSize,
      showArrow = true,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStr = variant?.toString() || '';
    const isCard = variantStr.startsWith('card');
    const isCircular = variantStr.startsWith('circular');
    const Icon = direction === 'left' ? ArrowLeft : ArrowRight;
    
    const iconStyle = variant === 'circular-cyber' 
      ? 'circular-cyber' 
      : isCircular 
        ? 'circular' 
        : 'default';

    return (
      <a 
        ref={ref} 
        className={cn(arrowLinkVariants({ variant, size, direction }), className)} 
        {...props}
      >
        {children}
        {showArrow && (
          <div className={cn(arrowLinkIconVariants({ iconStyle }))}>
            <Icon
              size={iconSize || (isCard ? 24 : 16)}
              className={cn(
                'transition-transform duration-300',
                direction === 'right'
                  ? 'group-hover/link:translate-x-1'
                  : 'group-hover/link:-translate-x-1',
                isCard && 'mt-4 group-hover/link:translate-x-0 group-hover/link:scale-110',
              )}
            />
          </div>
        )}
      </a>
    );
  },
);
ArrowLink.displayName = 'ArrowLink';

const ArrowLinkTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('mb-2 text-3xl font-black tracking-tighter', className)} {...props} />
));
ArrowLinkTitle.displayName = 'ArrowLinkTitle';

const ArrowLinkSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm font-medium opacity-60', className)} {...props} />
));
ArrowLinkSubtitle.displayName = 'ArrowLinkSubtitle';

export { ArrowLink, ArrowLinkTitle, ArrowLinkSubtitle, arrowLinkVariants };
