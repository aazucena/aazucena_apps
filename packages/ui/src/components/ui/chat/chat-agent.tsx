'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Robot, Activity, CheckCircle, XCircle } from '@aazucena/icons'; // Assuming these icons are available
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'; // Assuming Avatar components are available

const chatAgentVariants = cva(
  'flex items-center gap-3 rounded-control border p-3 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border-input',
        glass: 'glass border-input/20',
        cyber: 'bg-background/40 dark:bg-scrim border-signal/30 text-signal',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface ChatAgentProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatAgentVariants> {
  name: string;
  avatarSrc?: string;
  status?: 'idle' | 'active' | 'thinking' | 'online' | 'offline';
  role?: string;
}

const statusColorMap: Record<Required<ChatAgentProps>['status'], string> = {
  idle: 'text-muted-foreground',
  active: 'text-signal animate-pulse',
  thinking: 'text-warning animate-pulse',
  online: 'text-success',
  offline: 'text-alert',
};

const statusIconMap: Record<Required<ChatAgentProps>['status'], React.ElementType> = {
  idle: Robot,
  active: Activity,
  thinking: Activity,
  online: CheckCircle,
  offline: XCircle,
};

const ChatAgent = React.forwardRef<HTMLDivElement, ChatAgentProps>(
  ({ className, variant, name, avatarSrc, status = 'idle', role, ...props }, ref) => {
    const StatusIcon = statusIconMap[status] as React.ComponentType<{ className?: string }>;

    return (
      <div ref={ref} className={cn(chatAgentVariants({ variant }), className)} {...props}>
        <Avatar className="border-primary/20 h-9 w-9 border-2">
          <AvatarImage src={avatarSrc} alt={`${name} avatar`} />
          <AvatarFallback className={cn('text-sm font-semibold', statusColorMap[status])}>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-grow flex-col">
          <span className="font-semibold">{name}</span>
          {role && <span className="text-muted-foreground text-xs">{role}</span>}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          {StatusIcon && <StatusIcon className={cn('h-4 w-4', statusColorMap[status])} />}
          <span className={statusColorMap[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    );
  },
);
ChatAgent.displayName = 'ChatAgent';

export { ChatAgent, chatAgentVariants };
