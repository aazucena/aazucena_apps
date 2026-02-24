'use client';

/** @shadcn standard component */
import { cn } from '@aazucena/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-lg p-1 transition-all',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground',
        glass: 'glass-m text-foreground',
        cyber:
          'glass bg-primary-100 border border-cyan-500/20 text-cyan-600 dark:bg-zinc-950/40 dark:text-cyan-500/70',
        phone:
          'relative mt-16 mb-8 h-[420px] w-full max-w-[600px] flex items-center justify-center bg-transparent border-none overflow-visible',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => {
  if (variant === 'phone') {
    return <PhoneDialTabsList ref={ref} className={className} {...props} />;
  }

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-active:bg-background data-active:text-foreground data-active:shadow',
        glass:
          'text-foreground/60 data-active:bg-background/20 data-active:text-foreground data-active:border-white/20',
        cyber:
          'text-cyan-600/50 data-active:bg-cyan-500/10 data-active:text-cyan-600 dark:text-cyan-500/50 dark:data-active:text-cyan-400 data-active:border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0)] data-active:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
        phone:
          'absolute flex flex-col items-center justify-center gap-2 rounded-xl p-4 border backdrop-blur-sm pointer-events-auto border-border/10 bg-background/5 data-active:scale-110 data-active:border-primary/40 data-active:shadow-lg data-active:shadow-primary/20 text-muted-foreground data-active:text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

/**
 * Phone Dial Tabs Logic (Consolidated)
 */
const PhoneDialTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, _ref) => {
    const [rotation, setRotation] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const _rotationTweenRef = React.useRef<gsap.core.Tween | null>(null);

    const triggers = React.Children.toArray(children);
    const totalTabs = triggers.length;
    const radius = 200;
    const _angleStep = 180 / (totalTabs - 1);

    const getAngleFromCenter = (clientX: number, clientY: number): number => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      setIsDragging(true);
      const startAngle = getAngleFromCenter(e.clientX, e.clientY);
      const startRotation = rotation;

      const handleMouseMove = (me: MouseEvent) => {
        const currentAngle = getAngleFromCenter(me.clientX, me.clientY);
        const diff = currentAngle - startAngle;
        setRotation(startRotation + diff * 0.6);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <TabsPrimitive.List
        ref={containerRef}
        onMouseDown={handleMouseDown}
        className={cn(
          'relative mt-16 mb-8 flex h-[420px] w-full max-w-[600px] items-center justify-center overflow-visible select-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          className,
        )}
        {...props}
      >
        <svg
          className="pointer-events-none absolute h-full w-full max-w-[500px]"
          viewBox="0 0 500 400"
        >
          <circle
            cx="250"
            cy="200"
            r="200"
            fill="none"
            className="stroke-border opacity-20 dark:opacity-10"
            strokeWidth="2"
            strokeDasharray="6.28 6.28"
          />
          <circle
            cx="250"
            cy="200"
            r="8"
            className="fill-border stroke-border opacity-40 dark:opacity-20"
            strokeWidth="2"
          />
        </svg>

        {triggers.map((child, index) => {
          const baseAngle = -180 + (180 * index) / (totalTabs - 1);
          const angle = baseAngle + rotation;
          const angleRad = (angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius - 10;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                minWidth: '100px',
              }}
            >
              {child}
            </div>
          );
        })}
      </TabsPrimitive.List>
    );
  },
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
