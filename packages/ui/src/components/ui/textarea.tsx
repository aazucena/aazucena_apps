/** @shadcn standard component */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const textareaVariants = cva(
  'flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground',
  {
    variants: {
      variant: {
        default: 'border-input',
        glass: 'glass-m focus-visible:bg-background/10 dark:bg-white/10 dark:text-white',
        cyber:
          'glass bg-primary-100 border-cyan-500/30 focus-visible:border-cyan-400 focus-visible:shadow-[0_0_10px_rgba(6,182,212,0.2)] dark:bg-background/40 dark:bg-black/40 dark:text-cyan-50',
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
