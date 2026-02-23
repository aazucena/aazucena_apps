'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CheckCircle, XCircle, Ban, DangerCircle } from '@aazucena/icons'; // Assuming these icons are available
import { Badge } from '../badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible';
import { ChevronsUpDown } from '@aazucena/icons'; // Re-import for collapsible trigger

const chatTestResultsVariants = cva(
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

export interface TestCase {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  errorMessage?: string;
  duration?: number; // in ms
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number; // in ms
}

export interface ChatTestResultsProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatTestResultsVariants> {
  summary: TestSummary;
  testCases: TestCase[];
  title?: string;
  showTestCases?: boolean;
}

const statusIconMap: Record<TestCase['status'], React.ElementType> = {
  passed: CheckCircle,
  failed: XCircle,
  skipped: Ban,
};

const statusColorMap: Record<TestCase['status'], string> = {
  passed: 'text-green-500',
  failed: 'text-red-500',
  skipped: 'text-yellow-500',
};

const ChatTestResults = React.forwardRef<HTMLDivElement, ChatTestResultsProps>(
  (
    {
      className,
      variant,
      summary,
      testCases,
      title = 'Test Results',
      showTestCases = true,
      ...props
    },
    ref,
  ) => {
    const totalStatusColor =
      summary.failed > 0
        ? 'border-red-500/20 text-red-500'
        : summary.passed === summary.total && summary.total > 0
          ? 'border-green-500/20 text-green-500'
          : 'border-yellow-500/20 text-yellow-500';

    return (
      <div ref={ref} className={cn(chatTestResultsVariants({ variant }), totalStatusColor, className)} {...props}>
        <div className="flex items-center gap-2">
          {summary.failed > 0 ? (
            <XCircle className="h-5 w-5" />
          ) : summary.passed === summary.total && summary.total > 0 ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <DangerCircle className="h-5 w-5" />
          )}
          <h3 className="font-semibold">{title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <Badge variant="outline" className="justify-between">
            Total: <span className="font-bold">{summary.total}</span>
          </Badge>
          <Badge variant="outline" className="justify-between text-green-500 border-green-500/20">
            Passed: <span className="font-bold">{summary.passed}</span>
          </Badge>
          <Badge variant="outline" className="justify-between text-red-500 border-red-500/20">
            Failed: <span className="font-bold">{summary.failed}</span>
          </Badge>
          <Badge variant="outline" className="justify-between text-yellow-500 border-yellow-500/20">
            Skipped: <span className="font-bold">{summary.skipped}</span>
          </Badge>
          <Badge variant="outline" className="justify-between col-span-2">
            Duration: <span className="font-bold">{(summary.duration / 1000).toFixed(2)}s</span>
          </Badge>
        </div>

        {showTestCases && testCases.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left font-semibold text-sm">
              <span>View Details ({testCases.length})</span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=closed]:rotate-0 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {testCases.map(testCase => {
                const Icon = statusIconMap[testCase.status];
                return (
                  <div key={testCase.id} className="flex items-center gap-2 text-xs">
                    <Icon className={cn('h-4 w-4 shrink-0', statusColorMap[testCase.status])} />
                    <span className="flex-grow">{testCase.name}</span>
                    {testCase.duration !== undefined && (
                      <span className="text-muted-foreground">{(testCase.duration / 1000).toFixed(2)}s</span>
                    )}
                    {testCase.errorMessage && (
                      <>
                        <DangerCircle className="h-4 w-4 text-red-500" />
                        {testCase.errorMessage}
                      </>
                    )}
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    );
  },
);
ChatTestResults.displayName = 'ChatTestResults';

export { ChatTestResults, chatTestResultsVariants };
