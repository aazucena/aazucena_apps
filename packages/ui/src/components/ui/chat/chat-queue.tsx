'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Badge } from '../badge'; // Assuming Badge component is available
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

const chatQueueVariants = cva('flex flex-col gap-3 rounded-control border p-4', {
  variants: {
    variant: {
      default: 'bg-background border-input',
      glass: 'glass border-input/20',
      cyber: 'bg-background/40 dark:bg-panel border-signal/30 text-signal',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface QueueItem {
  id: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
}

export interface ChatQueueProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chatQueueVariants> {
  queue: QueueItem[];
  emptyMessage?: string;
}

const statusMap: Record<QueueItem['status'], { text: string; color: string }> = {
  pending: { text: 'Pending', color: 'bg-warning/20 text-warning' },
  processing: { text: 'Processing', color: 'bg-signal/20 text-signal' },
  completed: { text: 'Completed', color: 'bg-success/20 text-success' },
  failed: { text: 'Failed', color: 'bg-alert/20 text-alert' },
};

const ChatQueue = React.forwardRef<HTMLDivElement, ChatQueueProps>(
  ({ className, variant, queue, emptyMessage = 'Queue is empty.', ...props }, ref) => {
    return (
      <div ref={ref} className={cn(chatQueueVariants({ variant }), className)} {...props}>
        {queue.length === 0 && <p className="text-muted-foreground text-center">{emptyMessage}</p>}
        <MotionConfig reducedMotion="user">
          <AnimatePresence initial={false}>
            {queue.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
                className="bg-muted/50 rounded-control flex items-center justify-between p-3 text-sm"
              >
                <span className="truncate">{item.content}</span>
                <Badge
                  className={
                    statusMap[item.status]?.color || 'bg-rule-strong/20 text-muted-foreground'
                  }
                >
                  {statusMap[item.status]?.text || 'Unknown'}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </MotionConfig>
      </div>
    );
  },
);
ChatQueue.displayName = 'ChatQueue';

export { ChatQueue, chatQueueVariants };
