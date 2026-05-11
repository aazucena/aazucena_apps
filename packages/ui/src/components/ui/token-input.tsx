'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Copy, Refresh, Check, Eye, EyeOff } from '@aazucena/icons';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const tokenInputVariants = cva(
  'flex items-center gap-2 rounded-lg border transition-all duration-300 bg-background',
  {
    variants: {
      variant: {
        default: 'border-input shadow-sm focus-within:ring-1 focus-within:ring-ring',
        glass: 'glass border-white/10 text-white',
        cyber:
          'bg-black/40 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-cyan-400 font-mono',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export type TokenAlgorithm = 'random' | 'uuid' | 'hex' | 'base64' | 'numeric' | 'custom';

export interface TokenInputProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value'>,
    VariantProps<typeof tokenInputVariants> {
  initialToken?: string;
  onTokenChange?: (token: string) => void;
  /** Max length of the generated token. Ignored for 'uuid'. */
  length?: number;
  /** Algorithm used for generation. */
  algorithm?: TokenAlgorithm;
  /** Custom generation function if algorithm is 'custom'. */
  customGenerator?: () => string;
  /** Whether the user can manually trigger a regeneration. */
  canRegenerate?: boolean;
  /** Whether the copy button is available. */
  canCopy?: boolean;
  /** Whether to show the token characters or keep them masked. */
  secure?: boolean;
}

// --- Token Generation Utils ---

const generateToken = (
  algorithm: TokenAlgorithm,
  length: number,
  customGenerator?: () => string,
): string => {
  if (algorithm === 'custom' && customGenerator) return customGenerator();
  if (algorithm === 'uuid') return crypto.randomUUID();

  let chars = '';
  if (algorithm === 'hex') chars = '0123456789abcdef';
  else if (algorithm === 'numeric') chars = '0123456789';
  else if (algorithm === 'base64')
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  else chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    const bit = array[i];
    if (bit) result += chars.charAt(bit % chars.length);
  }
  return result;
};

// --- Component ---

/**
 * A secure token/API key input component with automatic generation and management.
 */
const TokenInput = React.forwardRef<HTMLDivElement, TokenInputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      initialToken,
      onTokenChange,
      length = 32,
      algorithm = 'random',
      customGenerator,
      canRegenerate = true,
      canCopy = true,
      secure = true,
      ...props
    },
    ref,
  ) => {
    const [token, setToken] = React.useState(initialToken || '');
    const [isCopied, setIsCopied] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(!secure);

    const generate = React.useCallback(
      () => generateToken(algorithm, length, customGenerator),
      [algorithm, length, customGenerator],
    );

    const handleRegenerate = React.useCallback(() => {
      const newToken = generate();
      setToken(newToken);
      onTokenChange?.(newToken);
      setIsCopied(false);
    }, [generate, onTokenChange]);

    // Generate on mount if no initial token
    React.useEffect(() => {
      if (!initialToken && token === '') {
        handleRegenerate();
      }
    }, []);

    const handleCopy = async () => {
      if (!token) return;
      try {
        await navigator.clipboard.writeText(token);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    };

    const displayValue = React.useMemo(() => {
      if (!token) return '••••••••••••••••';
      if (isVisible) return token;

      // Show masked version with visible end for context
      const maskLength = Math.max(0, token.length - 4);
      return '•'.repeat(maskLength) + token.slice(-4);
    }, [token, isVisible]);

    return (
      <TooltipProvider>
        <div ref={ref} className={cn(tokenInputVariants({ variant, size }), className)} {...props}>
          <div className="flex min-w-0 flex-grow items-center">
            <span
              className={cn(
                'truncate font-mono tabular-nums select-all',
                isVisible ? 'text-foreground' : 'text-muted-foreground tracking-widest',
                variant === 'cyber' && 'text-cyan-400',
              )}
            >
              {displayValue}
            </span>
          </div>

          <div className="ml-2 flex shrink-0 items-center gap-1">
            {/* Toggle Visibility */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 opacity-60 hover:opacity-100"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isVisible ? 'Hide' : 'Show'}</TooltipContent>
            </Tooltip>

            {/* Regenerate */}
            {canRegenerate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-60 hover:opacity-100"
                    onClick={handleRegenerate}
                  >
                    <Refresh className={cn('size-3.5', isCopied && 'text-muted-foreground')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Regenerate</TooltipContent>
              </Tooltip>
            )}

            {/* Copy */}
            {canCopy && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'size-7 transition-all',
                      isCopied ? 'text-emerald-500 opacity-100' : 'opacity-60 hover:opacity-100',
                    )}
                    onClick={handleCopy}
                    disabled={!token}
                  >
                    {isCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isCopied ? 'Copied' : 'Copy'}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  },
);
TokenInput.displayName = 'TokenInput';

export { TokenInput, tokenInputVariants };
