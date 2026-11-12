'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const mentionInputVariants = cva(
  'relative w-full rounded-control border bg-transparent transition-colors',
  {
    variants: {
      variant: {
        default: 'border-input focus-within:ring-1 focus-within:ring-ring',
        glass: 'glass focus-within:bg-background/10',
        cyber: 'border-signal/30 bg-background/40 dark:bg-scrim focus-within:border-signal',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface MentionSuggestion {
  id: string;
  label: string;
  avatar?: string;
}

export interface MentionInputProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>,
    VariantProps<typeof mentionInputVariants> {
  suggestions: MentionSuggestion[];
  trigger?: string;
  value?: string;
  onChange?: (value: string) => void;
  onMention?: (user: MentionSuggestion) => void;
}

const MentionInput = React.forwardRef<HTMLTextAreaElement, MentionInputProps>(
  (
    {
      className,
      variant,
      size,
      suggestions,
      trigger = '@',
      value = '',
      onChange,
      onMention,
      placeholder,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = React.useState('');
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [cursorPos, setCursorPos] = React.useState(0);
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? innerRef;

    const filtered = suggestions.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      const pos = e.target.selectionStart ?? 0;
      onChange?.(val);
      setCursorPos(pos);

      const textBefore = val.slice(0, pos);
      const triggerIdx = textBefore.lastIndexOf(trigger);
      if (triggerIdx >= 0 && !textBefore.slice(triggerIdx + 1).includes(' ')) {
        setQuery(textBefore.slice(triggerIdx + 1));
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    };

    const insertMention = (user: MentionSuggestion) => {
      const textBefore = value.slice(0, cursorPos);
      const triggerIdx = textBefore.lastIndexOf(trigger);
      const before = value.slice(0, triggerIdx);
      const after = value.slice(cursorPos);
      const newVal = `${before}${trigger}${user.label} ${after}`;
      onChange?.(newVal);
      onMention?.(user);
      setShowDropdown(false);
    };

    return (
      <div className={cn(mentionInputVariants({ variant, size }), className)}>
        <textarea
          ref={combinedRef}
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          className="placeholder:text-muted-foreground w-full resize-none bg-transparent px-3 py-2 outline-none disabled:cursor-not-allowed disabled:opacity-50"
          rows={3}
          {...props}
        />
        {showDropdown && filtered.length > 0 && (
          <div className="bg-popover rounded-control absolute left-0 z-50 mt-1 max-h-48 w-full overflow-auto border p-1">
            {filtered.map((s) => (
              <button
                key={s.id}
                type="button"
                className="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(s);
                }}
              >
                {s.avatar && (
                  <img src={s.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
                )}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
MentionInput.displayName = 'MentionInput';

export { MentionInput, mentionInputVariants };
