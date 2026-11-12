'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Input } from './input';
import { Button } from './button';
import { Trash, Plus, Copy, Check } from '@aazucena/icons';

const keyValueVariants = cva('w-full space-y-2', {
  variants: {
    variant: {
      default: '',
      glass: 'p-4 rounded-card bg-state border border-rule',
      cyber: 'p-4 rounded-none border border-signal/20 bg-scrim relative',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface KeyValueEntry {
  id: string;
  key: string;
  value: string;
  disabled?: boolean;
}

export interface KeyValueProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof keyValueVariants> {
  entries: KeyValueEntry[];
  onChange: (entries: KeyValueEntry[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  allowAdd?: boolean;
  allowRemove?: boolean;
  disabled?: boolean;
  copyable?: boolean;
}

const KeyValue = React.forwardRef<HTMLDivElement, KeyValueProps>(
  (
    {
      className,
      variant,
      entries = [],
      onChange,
      keyPlaceholder = 'Key',
      valuePlaceholder = 'Value',
      addLabel = 'Add Row',
      allowAdd = true,
      allowRemove = true,
      disabled = false,
      copyable = false,
      ...props
    },
    ref,
  ) => {
    const handleAdd = () => {
      const newEntry: KeyValueEntry = {
        id: crypto.randomUUID(),
        key: '',
        value: '',
      };
      onChange([...entries, newEntry]);
    };

    const handleRemove = (id: string) => {
      onChange(entries.filter((entry) => entry.id !== id));
    };

    const handleChange = (id: string, field: 'key' | 'value', newValue: string) => {
      onChange(entries.map((entry) => (entry.id === id ? { ...entry, [field]: newValue } : entry)));
    };

    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const handleCopy = async (id: string, text: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    };

    return (
      <div ref={ref} className={cn(keyValueVariants({ variant }), className)} {...props}>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="group flex items-center gap-2">
              <Input
                placeholder={keyPlaceholder}
                value={entry.key}
                onChange={(e) => handleChange(entry.id, 'key', e.target.value)}
                disabled={disabled || entry.disabled}
                className={cn(
                  'flex-1 font-mono text-xs',
                  variant === 'cyber' &&
                    'border-signal/30 bg-signal/5 text-signal focus-visible:ring-signal/50 rounded-none',
                  variant === 'glass' &&
                    'border-rule bg-state text-foreground placeholder:text-foreground/30 focus-visible:ring-rule',
                )}
              />
              <div className="relative flex-1">
                <Input
                  placeholder={valuePlaceholder}
                  value={entry.value}
                  onChange={(e) => handleChange(entry.id, 'value', e.target.value)}
                  disabled={disabled || entry.disabled}
                  className={cn(
                    'w-full font-mono text-xs',
                    copyable && 'pr-8',
                    variant === 'cyber' &&
                      'border-signal/30 bg-signal/5 text-signal focus-visible:ring-signal/50 rounded-none',
                    variant === 'glass' &&
                      'border-rule bg-state text-foreground/90 placeholder:text-foreground/30 focus-visible:ring-rule',
                  )}
                />
                {copyable && (
                  <button
                    type="button"
                    onClick={() => handleCopy(entry.id, entry.value)}
                    className={cn(
                      'text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors',
                      variant === 'cyber' && 'text-signal/50 hover:text-signal',
                      variant === 'glass' && 'text-foreground/50 hover:text-foreground',
                    )}
                  >
                    {copiedId === entry.id ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                )}
              </div>

              {allowRemove && !disabled && !entry.disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(entry.id)}
                  className={cn(
                    'text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0',
                    variant === 'cyber' &&
                      'text-signal/50 hover:bg-alert/10 hover:text-alert rounded-none',
                    variant === 'glass' && 'text-foreground/50 hover:bg-alert/20 hover:text-alert',
                  )}
                >
                  <Trash size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>

        {allowAdd && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className={cn(
              'w-full border-dashed text-xs',
              variant === 'cyber' &&
                'border-signal/30 text-signal hover:border-signal/50 hover:bg-signal/10 rounded-none',
              variant === 'glass' &&
                'border-rule text-foreground/70 hover:bg-state hover:text-foreground',
            )}
          >
            <Plus size={14} className="mr-2" />
            {addLabel}
          </Button>
        )}
      </div>
    );
  },
);
KeyValue.displayName = 'KeyValue';

export { KeyValue, keyValueVariants };
