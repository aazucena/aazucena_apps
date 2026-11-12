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
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof purchaseCardVariants> {
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
          variant === 'glass' && 'border-rule bg-state text-foreground',
          variant === 'cyber' && 'border-signal/20 bg-background text-signal',
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
            <CardTitle className={cn(variant === 'cyber' && 'text-signal font-mono italic')}>
              {title}
            </CardTitle>
            {badgeText && (
              <Badge variant={variant === 'cyber' ? 'cyber' : 'secondary'}>{badgeText}</Badge>
            )}
          </div>
          <CardDescription
            className={cn(
              variant === 'glass' && 'text-foreground/70',
              variant === 'cyber' && 'text-muted-foreground font-mono',
            )}
          >
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold">
            {price}
            {variant === 'cyber' && <span className="text-signal font-mono">$</span>}
          </div>
          {features && (
            <ul
              className={cn(
                'list-inside list-disc space-y-1 text-sm',
                variant === 'cyber' && 'text-muted-foreground list-[">"] font-mono',
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
