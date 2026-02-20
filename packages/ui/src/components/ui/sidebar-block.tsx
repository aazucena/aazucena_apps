'use client';

import { cn } from '@aazucena/utils';
import * as React from 'react';
import { Card } from './card.js';

const SidebarBlock = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Card>>(
  ({ className, variant = 'default', padding = 'lg', radius = 'lg', ...props }, ref) => (
    <Card
      ref={ref}
      variant={variant}
      padding={padding}
      radius={radius}
      className={cn('flex flex-col space-y-8', className)}
      {...props}
    />
  ),
);
SidebarBlock.displayName = 'SidebarBlock';

const SidebarBlockHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4 border-b border-current/10 pb-4', className)} {...props} />
  ),
);
SidebarBlockHeader.displayName = 'SidebarBlockHeader';

const SidebarBlockTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-[10px] font-black tracking-[0.3em] uppercase opacity-40', className)}
    {...props}
  />
));
SidebarBlockTitle.displayName = 'SidebarBlockTitle';

const SidebarBlockContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-6', className)} {...props} />
  ),
);
SidebarBlockContent.displayName = 'SidebarBlockContent';

const SidebarBlockItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('group flex items-center gap-4 transition-all', className)}
      {...props}
    />
  ),
);
SidebarBlockItem.displayName = 'SidebarBlockItem';

export {
  SidebarBlock,
  SidebarBlockContent,
  SidebarBlockHeader,
  SidebarBlockItem,
  SidebarBlockTitle,
};
