'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const maskInputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        glass: 'glass',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// --- Masking Utils ---

export interface MaskDefinition {
  /** Regular expression pattern to match the character. */
  pattern: RegExp;
  /** Optional function to transform the character (e.g. toUpperCase). */
  transform?: (char: string) => string;
}

export const DEFAULT_MASK_DEFINITIONS: Record<string, MaskDefinition> = {
  '9': { pattern: /\d/ },
  A: { pattern: /[a-zA-Z]/ },
  '*': { pattern: /[a-zA-Z0-9]/ },
  L: { pattern: /[a-z]/, transform: (char) => char.toLowerCase() },
  U: { pattern: /[A-Z]/, transform: (char) => char.toUpperCase() },
  '#': { pattern: /[0-9a-fA-F]/, transform: (char) => char.toUpperCase() }, // Hex
};

export interface MaskInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>,
    VariantProps<typeof maskInputVariants> {
  /** The mask string. Use keys from 'definitions' (default: 9, A, *, L, U, #). */
  mask: string;
  /** Controlled value (unmasked). */
  value?: string;
  /** Callback triggered on change with the unmasked value. */
  onChange?: (value: string) => void;
  /** The character used to display empty slots. Defaults to "_". */
  replacement?: string;
  /** If true, the full mask is shown even if the input is empty. Defaults to false. */
  showMaskOnEmpty?: boolean;
  /** Custom mask definitions. Merged with defaults. */
  definitions?: Record<string, MaskDefinition>;
}

// --- Component ---

/**
 * A highly flexible masked input component with regex support and custom token definitions.
 */
const MaskInput = React.forwardRef<HTMLInputElement, MaskInputProps>(
  (
    {
      className,
      mask,
      value: controlledValue,
      onChange,
      replacement = '_',
      variant,
      showMaskOnEmpty = false,
      definitions = {},
      ...props
    },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const [unmaskedValue, setUnmaskedValue] = React.useState('');

    const allDefinitions = React.useMemo(
      () => ({
        ...DEFAULT_MASK_DEFINITIONS,
        ...definitions,
      }),
      [definitions],
    );

    // Sync with controlled value
    React.useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== unmaskedValue) {
        setUnmaskedValue(controlledValue);
      }
    }, [controlledValue, unmaskedValue]);

    const getDefinition = React.useCallback(
      (char: string) => {
        return allDefinitions[char];
      },
      [allDefinitions],
    );

    const isDataPos = React.useCallback(
      (idx: number) => {
        if (idx < 0 || idx >= mask.length) return false;
        return !!getDefinition(mask[idx]!);
      },
      [mask, getDefinition],
    );

    /**
     * Extracts only the raw data characters that fit the mask placeholders.
     */
    const unmask = React.useCallback(
      (val: string) => {
        let result = '';
        let maskIdx = 0;
        for (let i = 0; i < val.length && maskIdx < mask.length; i++) {
          const char = val[i]!;
          if (char === replacement) continue;

          // Find next data position in mask
          while (maskIdx < mask.length && !isDataPos(maskIdx)) {
            maskIdx++;
          }

          if (maskIdx >= mask.length) break;

          const def = getDefinition(mask[maskIdx]!)!;
          if (def.pattern.test(char)) {
            result += def.transform ? def.transform(char) : char;
            maskIdx++;
          }
        }
        return result;
      },
      [mask, isDataPos, getDefinition, replacement],
    );

    /**
     * Formats raw data into the mask template.
     */
    const format = React.useCallback(
      (raw: string) => {
        if (!showMaskOnEmpty && raw === '') return '';

        let formatted = '';
        let rawIdx = 0;

        for (let i = 0; i < mask.length; i++) {
          if (isDataPos(i)) {
            if (rawIdx < raw.length) {
              formatted += raw[rawIdx];
              rawIdx++;
            } else {
              formatted += replacement;
            }
          } else {
            formatted += mask[i];
          }
        }

        // Trim if not showing mask on empty
        if (!showMaskOnEmpty) {
          let lastDataIdx = -1;
          for (let i = 0; i < formatted.length; i++) {
            if (isDataPos(i) && formatted[i] !== replacement) {
              lastDataIdx = i;
            }
          }
          if (lastDataIdx === -1) return '';

          let endIdx = lastDataIdx + 1;
          while (endIdx < mask.length && !isDataPos(endIdx)) {
            endIdx++;
          }
          return formatted.slice(0, endIdx);
        }

        return formatted;
      },
      [mask, isDataPos, replacement, showMaskOnEmpty],
    );

    const displayedValue = React.useMemo(() => format(unmaskedValue), [unmaskedValue, format]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const el = e.target;
      const selectionStart = el.selectionStart || 0;
      const rawValue = el.value;

      // 1. Calculate how many DATA characters are before the current cursor in the DIRTY input
      const dataBeforeCursor = unmask(rawValue.slice(0, selectionStart)).length;

      const nextUnmasked = unmask(rawValue);
      const nextFormatted = format(nextUnmasked);

      if (controlledValue === undefined) {
        setUnmaskedValue(nextUnmasked);
      }
      onChange?.(nextUnmasked);

      // 2. Find the new cursor position in the CLEAN formatted string
      let newPos = 0;
      let foundData = 0;
      while (newPos < nextFormatted.length && foundData < dataBeforeCursor) {
        if (isDataPos(newPos)) {
          foundData++;
        }
        newPos++;
      }

      // 3. Skip any trailing literals to land on the next inputtable position
      while (newPos < nextFormatted.length && !isDataPos(newPos)) {
        newPos++;
      }

      // 4. Force synchronization of the cursor
      requestAnimationFrame(() => {
        if (internalRef.current) {
          internalRef.current.setSelectionRange(newPos, newPos);
        }
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        const input = e.currentTarget;
        const { selectionStart, selectionEnd } = input;

        if (selectionStart === selectionEnd && selectionStart !== null && selectionStart > 0) {
          // If we are about to backspace over a literal, manually move the cursor to the previous data position
          let prevPos = selectionStart - 1;
          if (!isDataPos(prevPos)) {
            e.preventDefault();
            while (prevPos > 0 && !isDataPos(prevPos)) {
              prevPos--;
            }
            input.setSelectionRange(prevPos + 1, prevPos + 1);

            // Now trigger a manual deletion of the data character at prevPos
            const dataIdx = unmask(displayedValue.slice(0, prevPos)).length;
            const nextUnmasked = unmaskedValue.slice(0, dataIdx) + unmaskedValue.slice(dataIdx + 1);

            if (controlledValue === undefined) {
              setUnmaskedValue(nextUnmasked);
            }
            onChange?.(nextUnmasked);

            requestAnimationFrame(() => {
              internalRef.current?.setSelectionRange(prevPos, prevPos);
            });
          }
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') return;

      // Snap to first empty slot
      const firstPlaceholder = val.indexOf(replacement);
      if (firstPlaceholder !== -1) {
        setTimeout(() => {
          internalRef.current?.setSelectionRange(firstPlaceholder, firstPlaceholder);
        }, 0);
      }
    };

    return (
      <input
        ref={(node) => {
          (internalRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        className={cn(maskInputVariants({ variant, className }))}
        value={displayedValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...props}
      />
    );
  },
);
MaskInput.displayName = 'MaskInput';

export { MaskInput, maskInputVariants };
