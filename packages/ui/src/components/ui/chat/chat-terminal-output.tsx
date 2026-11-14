'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CodeBlock } from '../code-block'; // Assuming CodeBlock component is available
import { Terminal } from '@aazucena/icons'; // Assuming Terminal icon is available
import { ScrollArea } from '../scroll-area';

const chatTerminalOutputVariants = cva('flex flex-col gap-3 rounded-control border p-4', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface ChatTerminalOutputProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatTerminalOutputVariants> {
  output: string;
  title?: string;
  language?: string; // For CodeBlock highlighting
  maxHeight?: string; // e.g., '200px', '50vh'
}

const ChatTerminalOutput = React.forwardRef<HTMLDivElement, ChatTerminalOutputProps>(
  (
    {
      className,
      variant,
      output,
      title = 'Terminal Output',
      language = 'bash',
      maxHeight = '200px',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatTerminalOutputVariants({ variant }), className)} {...props}>
        <div className="flex items-center gap-2">
          <Terminal className="text-muted-foreground h-5 w-5" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <ScrollArea
          style={{ maxHeight }}
          className="rounded-control bg-background border p-3 font-mono text-xs"
        >
          <CodeBlock code={output} language={language} className="text-foreground p-0" />
        </ScrollArea>
      </div>
    );
  },
);
ChatTerminalOutput.displayName = 'ChatTerminalOutput';

export { ChatTerminalOutput, chatTerminalOutputVariants };
