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
      glass: 'p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md',
      cyber: 'p-4 rounded-none border border-cyan-500/20 bg-black/40 relative',
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
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
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
      onChange(
        entries.map((entry) =>
          entry.id === id ? { ...entry, [field]: newValue } : entry
        )
      );
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
            <div key={entry.id} className="flex items-center gap-2 group">
              <Input
                placeholder={keyPlaceholder}
                value={entry.key}
                onChange={(e) => handleChange(entry.id, 'key', e.target.value)}
                disabled={disabled || entry.disabled}
                className={cn(
                  'flex-1 font-mono text-xs',
                  variant === 'cyber' && 'rounded-none border-cyan-500/30 bg-cyan-500/5 text-cyan-400 focus-visible:ring-cyan-500/50',
                  variant === 'glass' && 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/30'
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
                    variant === 'cyber' && 'rounded-none border-cyan-500/30 bg-cyan-500/5 text-cyan-100 focus-visible:ring-cyan-500/50',
                    variant === 'glass' && 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/30 focus-visible:ring-white/30'
                  )}
                />
                {copyable && (
                  <button
                    type="button"
                    onClick={() => handleCopy(entry.id, entry.value)}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      variant === 'cyber' && "text-cyan-500/50 hover:text-cyan-400",
                      variant === 'glass' && "text-white/50 hover:text-white"
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
                    "h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                    variant === 'cyber' && "text-cyan-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-none",
                    variant === 'glass' && "text-white/50 hover:text-red-300 hover:bg-red-500/20"
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
              "w-full border-dashed text-xs",
              variant === 'cyber' && "border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500/50 rounded-none",
              variant === 'glass' && "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
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
