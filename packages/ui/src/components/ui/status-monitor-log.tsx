'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Status Monitor Log Components
 */

export const StatusMonitorLog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isExpanded?: boolean }
>(({ className, isExpanded, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'overflow-hidden rounded-2xl border transition-all duration-500',
      isExpanded ? 'scale-[1.01] shadow-xl' : 'hover:border-current/20',
      className,
    )}
    {...props}
  />
));
StatusMonitorLog.displayName = 'StatusMonitorLog';

export const StatusMonitorLogHeader = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'flex w-full cursor-pointer items-start gap-4 border-none bg-transparent p-6 text-left outline-none',
      className,
    )}
    {...props}
  />
));
StatusMonitorLogHeader.displayName = 'StatusMonitorLogHeader';

export const StatusMonitorLogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }
>(({ className, isOpen, children, ...props }, ref) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div
          ref={ref}
          className={cn(
            'mt-0 border-t border-current/10 px-6 pt-0 pb-6 text-sm leading-relaxed italic opacity-80',
            className,
          )}
          {...props}
        >
          <div className="pt-4">{children}</div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));
StatusMonitorLogContent.displayName = 'StatusMonitorLogContent';
