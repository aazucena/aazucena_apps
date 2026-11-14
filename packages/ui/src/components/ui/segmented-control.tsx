'use client';

import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const segmentedControlVariants = cva('inline-flex items-center p-1 rounded-card', {
  variants: {
    variant: {
      default: 'bg-panel dark:bg-panel/50 border border-rule',
      glass: 'glass text-foreground',
      cyber:
        'bg-background/80 dark:bg-panel border border-border dark:border-signal/20 text-foreground',
    },
    size: {
      default: 'gap-1',
      sm: 'gap-0.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * A single-choice control: a radio group (WAI-ARIA APG). One item is a tab stop and
 * the arrow keys move to, and select, the next one. It is not a tab list: it has no panels.
 */
const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof segmentedControlVariants>
>(({ className, variant, size, onKeyDown, ...props }, ref) => {
  const groupRef = React.useRef<HTMLDivElement | null>(null);
  // With nothing selected no item is a tab stop, so make the first one reachable.
  React.useEffect(() => {
    const group = groupRef.current;
    if (!group || group.querySelector('[role="radio"][tabindex="0"]')) return;
    group
      .querySelector<HTMLElement>('[role="radio"]:not(:disabled)')
      ?.setAttribute('tabindex', '0');
  });
  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- composite widget: its items take focus (roving tab stop)
    <div
      ref={(node) => {
        groupRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(segmentedControlVariants({ variant, size }), className)}
      role="radiogroup"
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        const step =
          e.key === 'ArrowRight' || e.key === 'ArrowDown'
            ? 1
            : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
              ? -1
              : 0;
        if (!step) return;
        const items = Array.from(
          e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'),
        );
        const current = items.indexOf(document.activeElement as HTMLButtonElement);
        if (current === -1) return;
        e.preventDefault();
        const next = items[(current + step + items.length) % items.length]!;
        next.focus();
        next.click();
      }}
      {...props}
    />
  );
});
SegmentedControl.displayName = 'SegmentedControl';

const segmentedItemVariants = cva(
  'relative px-4 py-1.5 rounded-control text-[9px] font-black uppercase tracking-widest transition duration-(--motion-base) focus-visible:outline-signal focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-solid',
  {
    variants: {
      isActive: {
        true: '',
        false: 'text-muted-foreground hover:text-foreground',
      },
      variant: {
        default: '',
        glass: '',
        cyber: '',
      },
    },
    compoundVariants: [
      {
        isActive: true,
        variant: 'default',
        className:
          'bg-panel dark:bg-panel-raised text-primary border border-rule dark:border-rule-strong',
      },
      {
        isActive: true,
        variant: 'cyber',
        className:
          'bg-primary/10 dark:bg-signal/10 text-primary dark:text-signal border border-border dark:border-signal/40',
      },
      {
        isActive: true,
        variant: 'glass',
        className:
          'bg-background/20 dark:bg-panel-raised text-foreground border border-border dark:border-rule',
      },
    ],
    defaultVariants: {
      isActive: false,
      variant: 'default',
    },
  },
);

interface SegmentedItemProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof segmentedItemVariants> {
  value: string;
}

const SegmentedItem = React.forwardRef<HTMLButtonElement, SegmentedItemProps>(
  ({ className, variant, isActive, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={!!isActive}
        // Roving tab stop: only the selected item is reached with Tab.
        tabIndex={isActive ? 0 : -1}
        className={cn(segmentedItemVariants({ variant, isActive }), className)}
        {...props}
      />
    );
  },
);
SegmentedItem.displayName = 'SegmentedItem';

export { SegmentedControl, segmentedControlVariants, SegmentedItem, segmentedItemVariants };
