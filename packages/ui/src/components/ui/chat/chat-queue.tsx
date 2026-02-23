'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Badge } from '../badge'; // Assuming Badge component is available
import { motion, AnimatePresence } from 'framer-motion';

const chatQueueVariants = cva(
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

export interface QueueItem {
  id: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
}

export interface ChatQueueProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatQueueVariants> {
  queue: QueueItem[];
  emptyMessage?: string;
}

const statusMap: Record<QueueItem['status'], { text: string; color: string }> = {
  pending: { text: 'Pending', color: 'bg-yellow-500/20 text-yellow-500' },
  processing: { text: 'Processing', color: 'bg-blue-500/20 text-blue-500' },
  completed: { text: 'Completed', color: 'bg-green-500/20 text-green-500' },
  failed: { text: 'Failed', color: 'bg-red-500/20 text-red-500' },
};

const ChatQueue = React.forwardRef<HTMLDivElement, ChatQueueProps>(
  (
    {
      className,
      variant,
      queue,
      emptyMessage = 'Queue is empty.',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn(chatQueueVariants({ variant }), className)} {...props}>
        {queue.length === 0 && (
          <p className="text-center text-muted-foreground">{emptyMessage}</p>
        )}
        <AnimatePresence initial={false}>
          {queue.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between rounded-md bg-muted/50 p-3 text-sm"
            >
              <span className="truncate">{item.content}</span>
              <Badge className={statusMap[item.status]?.color || 'bg-gray-500/20 text-gray-500'}>
                {statusMap[item.status]?.text || 'Unknown'}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);
ChatQueue.displayName = 'ChatQueue';

export { ChatQueue, chatQueueVariants };
