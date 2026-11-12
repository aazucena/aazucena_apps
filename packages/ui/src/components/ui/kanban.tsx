'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const kanbanVariants = cva('relative w-full overflow-hidden', {
  variants: {
    variant: {
      default: '',
      cyber: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Kanban = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof kanbanVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(kanbanVariants({ variant }), className)} {...props} />
));
Kanban.displayName = 'Kanban';

const KanbanBoard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const boardRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => boardRef.current!);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input')) return;
      setIsDragging(true);
      setStartX(e.pageX - (boardRef.current?.offsetLeft || 0));
      setScrollLeft(boardRef.current?.scrollLeft || 0);
    };

    const onMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - (boardRef.current?.offsetLeft || 0);
      const walk = (x - startX) * 2;
      if (boardRef.current) boardRef.current.scrollLeft = scrollLeft - walk;
    };

    const stopDragging = () => setIsDragging(false);

    return (
      <div
        ref={boardRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={cn(
          'custom-scrollbar flex cursor-grab snap-x gap-6 overflow-x-auto px-4 pt-4 pb-6 select-none active:cursor-grabbing',
          isDragging && 'cursor-grabbing',
          className,
        )}
        {...props}
      />
    );
  },
);
KanbanBoard.displayName = 'KanbanBoard';

const kanbanLaneVariants = cva(
  'flex-shrink-0 w-[85vw] md:w-[340px] snap-start transition-all duration-500 rounded-card border flex flex-col overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-muted/30 border-border hover:bg-card hover:border-primary/10 text-foreground',
        glass: 'glass text-foreground hover:bg-background/10 dark:bg-state',
        cyber:
          'glass bg-signal-faint border-signal/20 text-foreground hover:border-signal dark:bg-background/40 dark:bg-scrim dark:text-signal',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const KanbanLane = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof kanbanLaneVariants>
>(({ className, variant, ...props }, ref) => (
  <section ref={ref} className={cn(kanbanLaneVariants({ variant }), className)} {...props} />
));
KanbanLane.displayName = 'KanbanLane';

const KanbanHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('sticky top-0 z-20 px-6 pt-6', className)} {...props} />
  ),
);
KanbanHeader.displayName = 'KanbanHeader';

const KanbanContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'scrollbar-hide mask-fade-y max-h-[60vh] flex-1 space-y-3 overflow-y-auto p-4 pt-5 pb-10',
        className,
      )}
      {...props}
    />
  ),
);
KanbanContent.displayName = 'KanbanContent';

const KanbanCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-card border-border hover:border-primary/20 rounded-card border p-5 transition-all duration-300',
        className,
      )}
      {...props}
    />
  ),
);
KanbanCard.displayName = 'KanbanCard';

export {
  Kanban,
  KanbanBoard,
  KanbanLane,
  KanbanHeader,
  KanbanContent,
  KanbanCard,
  kanbanVariants,
  kanbanLaneVariants,
};
