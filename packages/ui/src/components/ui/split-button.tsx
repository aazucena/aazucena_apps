'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { ChevronDown } from '@aazucena/icons';
import { Button } from './button.js';
import { ButtonGroup } from './button-group.js';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu.js';

/**
 * SplitButton
 * A composite component that provides a primary action and a secondary dropdown menu.
 * Built using ButtonGroup and DropdownMenu primitives for consistency and accessibility.
 */
export interface SplitButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'glass' | 'cyber' | 'gradient';
  size?: 'default' | 'sm' | 'lg';
}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <ButtonGroup
        ref={ref}
        className={cn('w-fit items-stretch shadow-lg transition-all duration-300', className)}
        {...props}
      >
        {children}
      </ButtonGroup>
    );
  },
);
SplitButton.displayName = 'SplitButton';

const SplitButtonPrimary = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn('rounded-r-none border-r-0 px-8 py-4 text-lg font-bold', className)}
    {...props}
  />
));
SplitButtonPrimary.displayName = 'SplitButtonPrimary';

const SplitButtonTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger> & {
    variant?: SplitButtonProps['variant'];
    size?: SplitButtonProps['size'];
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => (
  <DropdownMenuTrigger asChild {...props}>
    <Button
      ref={ref}
      variant={variant}
      size="icon"
      className={cn('rounded-l-none border-l border-current/20 px-4 py-4', className)}
    >
      <ChevronDown size={20} />
    </Button>
  </DropdownMenuTrigger>
));
SplitButtonTrigger.displayName = 'SplitButtonTrigger';

// Reuse standard DropdownMenuContent and DropdownMenuItem for the rest
const SplitButtonContent = DropdownMenuContent;
const SplitButtonItem = DropdownMenuItem;

export {
  SplitButton,
  SplitButtonPrimary,
  SplitButtonTrigger,
  SplitButtonContent,
  SplitButtonItem,
  DropdownMenu as SplitButtonMenu, // Alias for semantic clarity
};
