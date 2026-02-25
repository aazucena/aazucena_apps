'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CheckCircle, XCircle, CircleNotch as Loader, CircleDashed } from '@aazucena/icons'; // Assuming these icons are available

const chatPlanVariants = cva(
  'flex flex-col gap-4 rounded-md border p-4 transition-all duration-300',
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

export interface PlanStep {
  id: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  details?: string;
}

export interface ChatPlanProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatPlanVariants> {
  plan: PlanStep[];
  emptyMessage?: string;
}

const statusIconMap: Record<PlanStep['status'], React.ElementType> = {
  pending: CircleDashed,
  active: Loader,
  completed: CheckCircle,
  failed: XCircle,
};

const statusColorMap: Record<PlanStep['status'], string> = {
  pending: 'text-muted-foreground',
  active: 'text-blue-500 animate-spin',
  completed: 'text-green-500',
  failed: 'text-red-500',
};

const ChatPlan = React.forwardRef<HTMLDivElement, ChatPlanProps>(
  ({ className, variant, plan, emptyMessage = 'No plan defined.', ...props }, ref) => {
    return (
      <div ref={ref} className={cn(chatPlanVariants({ variant }), className)} {...props}>
        {plan.length === 0 && <p className="text-muted-foreground text-center">{emptyMessage}</p>}
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
          {plan.map((step, index) => {
            const Icon = statusIconMap[step.status] as React.ComponentType<{ className?: string }>;
            return (
              <li key={step.id} className="mb-6 ml-6">
                <span
                  className={cn(
                    'bg-background ring-background absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8',
                    statusColorMap[step.status],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-foreground flex items-center text-lg font-semibold">
                  {step.description}
                </h3>
                {step.details && (
                  <p className="text-muted-foreground text-sm font-normal">{step.details}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);
ChatPlan.displayName = 'ChatPlan';

export { ChatPlan, chatPlanVariants };
