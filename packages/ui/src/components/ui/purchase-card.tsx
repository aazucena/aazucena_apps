'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Image } from './image';
import { Badge } from './badge';

const purchaseCardVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface PurchaseCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof purchaseCardVariants> {
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  buttonText?: string;
  onPurchase?: () => void;
  features?: string[];
  badgeText?: string;
  disabled?: boolean;
}

const PurchaseCard = React.forwardRef<HTMLDivElement, PurchaseCardProps>(
  (
    {
      className,
      variant,
      title,
      description,
      price,
      imageUrl,
      buttonText = 'Purchase',
      onPurchase,
      features,
      badgeText,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          purchaseCardVariants({ variant }),
          'flex flex-col overflow-hidden',
          variant === 'glass' && 'bg-white/5 border-white/10 text-white',
          variant === 'cyber' && 'bg-black border-cyan-500/20 text-cyan-50',
          className,
        )}
        variant={variant === 'glass' || variant === 'cyber' ? variant : 'default'}
        {...props}
      >
        {imageUrl && (
          <Image src={imageUrl} alt={title} aspectRatio="16/9" className="h-48 object-cover" />
        )}
        <CardHeader className="flex-grow">
          <div className="flex items-center justify-between">
            <CardTitle
              className={cn(
                variant === 'cyber' && 'font-mono italic text-cyan-400',
              )}
            >
              {title}
            </CardTitle>
            {badgeText && (
              <Badge variant={variant === 'cyber' ? 'cyber' : 'secondary'}>{badgeText}</Badge>
            )}
          </div>
          <CardDescription
            className={cn(
              variant === 'glass' && 'text-white/70',
              variant === 'cyber' && 'font-mono text-cyan-500/60',
            )}
          >
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold">
            {price}
            {variant === 'cyber' && <span className="font-mono text-cyan-400">$</span>}
          </div>
          {features && (
            <ul
              className={cn(
                'text-sm list-inside list-disc space-y-1',
                variant === 'cyber' && 'font-mono text-cyan-500/80 list-[">"]',
              )}
            >
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={onPurchase}
            className="w-full"
            variant={variant === 'cyber' ? 'cyber' : 'default'}
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    );
  },
);
PurchaseCard.displayName = 'PurchaseCard';

export { PurchaseCard, purchaseCardVariants };
