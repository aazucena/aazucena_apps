'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible'; // Assuming Collapsible components are available
import { Terminal, ChevronsUpDown } from '@aazucena/icons'; // Assuming Terminal and ChevronsUpDown icons are available
import { CodeBlock } from '../code-block'; // Assuming CodeBlock component is available

const chatToolVariants = cva(
  'flex flex-col gap-3 rounded-md border p-4 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface ToolInput {
  [key: string]: any;
}

export interface ToolOutput {
  [key: string]: any;
}

export interface ChatToolProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatToolVariants> {
  toolName: string;
  input: ToolInput;
  output?: ToolOutput;
  status?: 'success' | 'failure' | 'executing';
  error?: string;
  isExpanded?: boolean;
}

const ChatTool = React.forwardRef<HTMLDivElement, ChatToolProps>(
  (
    {
      className,
      variant,
      toolName,
      input,
      output,
      status = 'success',
      error,
      isExpanded = false,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = React.useState(isExpanded);

    const statusColor = {
      success: 'text-green-500',
      failure: 'text-red-500',
      executing: 'text-blue-500 animate-pulse',
    }[status];

    const formatJson = (json: any) => {
      if (typeof json === 'string') {
        try {
          return JSON.stringify(JSON.parse(json), null, 2);
        } catch (e) {
          return json; // Not valid JSON, return as is
        }
      }
      return JSON.stringify(json, null, 2);
    };

    return (
      <div ref={ref} className={cn(chatToolVariants({ variant }), className)} {...props}>
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-left font-semibold">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              <span>{toolName}</span>
              {status && (
                <span className={cn('text-sm font-normal', statusColor)}>
                  {status === 'executing'
                    ? 'Executing...'
                    : status === 'success'
                      ? 'Success'
                      : 'Failure'}
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=closed]:rotate-0 data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="flex flex-col gap-3">
              <div>
                <h4 className="mb-2 text-sm font-medium">Input:</h4>
                <CodeBlock code={formatJson(input)} language="json" />
              </div>
              {output && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Output:</h4>
                  <CodeBlock code={formatJson(output)} language="json" />
                </div>
              )}
              {error && (
                <div className="text-red-500">
                  <h4 className="mb-2 text-sm font-medium">Error:</h4>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
);
ChatTool.displayName = 'ChatTool';

export { ChatTool, chatToolVariants };
