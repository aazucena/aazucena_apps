import React, { useState, type ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from '@aazucena/icons';
import { cn } from '@/lib/utils';

interface LogDetailsProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: ElementType;
  /** Text colour token class for the icon (`text-signal`). */
  color: string;
  initialExpanded?: boolean;
}

export function LogDetailsCard({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  initialExpanded = false,
}: LogDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div
      className={cn(
        'rounded-card border p-panel transition-colors',
        isExpanded ? 'border-rule-strong bg-panel-raised' : 'border-rule bg-panel hover:bg-state',
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-start gap-4 text-left"
      >
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-control border border-rule',
            color,
          )}
        >
          <Icon size={20} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-foreground">{title}</h3>
            <ChevronDown
              size={18}
              className={cn('text-muted-foreground', isExpanded && 'rotate-180')}
            />
          </div>
          {subtitle && <p className="micro-label mt-1 text-signal">{subtitle}</p>}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-rule pt-4 text-sm leading-relaxed text-muted-foreground">
              {description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
