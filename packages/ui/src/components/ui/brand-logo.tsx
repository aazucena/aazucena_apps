'use client';

import { cn, getCompanyLogoGradient } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const brandLogoVariants = cva(
  'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg font-bold text-zinc-800 dark:text-white shadow-lg transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'w-10 h-10 text-base',
        default: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl',
        xl: 'w-20 h-20 text-3xl',
      },
      variant: {
        default: 'bg-gradient-to-br border border-zinc-300/20',
        glass: 'bg-background/10 dark:bg-white/10 backdrop-blur-md border border-border/20',
        cyber:
          'bg-background dark:bg-black border border-border dark:border-cyan-500/50 text-primary dark:text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
);

export interface BrandLogoProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof brandLogoVariants> {
  name: string;
}

const BrandLogo = React.forwardRef<HTMLDivElement, BrandLogoProps>(
  ({ className, size, variant, name, ...props }, ref) => {
    const gradient = React.useMemo(() => getCompanyLogoGradient(name), [name]);

    return (
      <div
        ref={ref}
        className={cn(
          brandLogoVariants({ size, variant }),
          variant === 'default' && gradient,
          className,
        )}
        {...props}
      />
    );
  },
);
BrandLogo.displayName = 'BrandLogo';

const BrandLogoImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt, ...props }, ref) => (
  <img ref={ref} className={cn('h-full w-full object-cover', className)} alt={alt} {...props} />
));
BrandLogoImage.displayName = 'BrandLogoImage';

const BrandLogoInitials = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center font-black tracking-tighter uppercase',
        className,
      )}
      {...props}
    />
  ),
);
BrandLogoInitials.displayName = 'BrandLogoInitials';

export { BrandLogo, BrandLogoImage, BrandLogoInitials, brandLogoVariants };
