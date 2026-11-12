/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const textareaVariants = cva(
  'flex min-h-[60px] w-full rounded-control border bg-transparent px-3 py-2 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground',
  {
    variants: {
      variant: {
        default: 'border-input',
        glass: 'glass focus-visible:bg-background/10 dark:bg-state dark:text-foreground',
        cyber:
          'glass bg-signal-faint border-signal/30 focus-visible:border-signal dark:bg-background/40 dark:bg-panel dark:text-signal',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface TextareaProps
  extends React.ComponentProps<'textarea'>, VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea className={cn(textareaVariants({ variant }), className)} ref={ref} {...props} />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
