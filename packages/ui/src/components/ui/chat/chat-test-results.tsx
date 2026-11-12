'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CheckCircle, XCircle, Ban, DangerCircle } from '@aazucena/icons'; // Assuming these icons are available
import { Badge } from '../badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible';
import { ChevronsUpDown } from '@aazucena/icons'; // Re-import for collapsible trigger

const chatTestResultsVariants = cva(
  'flex flex-col gap-3 rounded-control border p-4 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal',
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
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatTestResultsVariants> {
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
  passed: 'text-success',
  failed: 'text-alert',
  skipped: 'text-warning',
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
        ? 'border-alert/20 text-alert'
        : summary.passed === summary.total && summary.total > 0
          ? 'border-success/20 text-success'
          : 'border-warning/20 text-warning';

    return (
      <div
        ref={ref}
        className={cn(chatTestResultsVariants({ variant }), totalStatusColor, className)}
        {...props}
      >
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
          <Badge variant="outline" className="border-success/20 text-success justify-between">
            Passed: <span className="font-bold">{summary.passed}</span>
          </Badge>
          <Badge variant="outline" className="border-alert/20 text-alert justify-between">
            Failed: <span className="font-bold">{summary.failed}</span>
          </Badge>
          <Badge variant="outline" className="border-warning/20 text-warning justify-between">
            Skipped: <span className="font-bold">{summary.skipped}</span>
          </Badge>
          <Badge variant="outline" className="col-span-2 justify-between">
            Duration: <span className="font-bold">{(summary.duration / 1000).toFixed(2)}s</span>
          </Badge>
        </div>

        {showTestCases && testCases.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-sm font-semibold">
              <span>View Details ({testCases.length})</span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=closed]:rotate-0 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-1">
              {testCases.map((testCase) => {
                const Icon = statusIconMap[testCase.status] as React.ComponentType<{
                  className?: string;
                }>;
                return (
                  <div key={testCase.id} className="flex items-center gap-2 text-xs">
                    <Icon className={cn('h-4 w-4 shrink-0', statusColorMap[testCase.status])} />
                    <span className="flex-grow">{testCase.name}</span>
                    {testCase.duration !== undefined && (
                      <span className="text-muted-foreground">
                        {(testCase.duration / 1000).toFixed(2)}s
                      </span>
                    )}
                    {testCase.errorMessage && (
                      <>
                        <DangerCircle className="text-alert h-4 w-4" />
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
