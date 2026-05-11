'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { Button, type buttonVariants } from './button';
import { Spinner } from './spinner';
import type { VariantProps } from 'class-variance-authority';

export interface SubmitButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <Button
      ref={ref}
      type="submit"
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={cn(loading && 'cursor-wait', className)}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-4" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {leftIcon && <span className="[&_svg]:size-4">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="[&_svg]:size-4">{rightIcon}</span>}
        </>
      )}
    </Button>
  ),
);
SubmitButton.displayName = 'SubmitButton';

export { SubmitButton };
