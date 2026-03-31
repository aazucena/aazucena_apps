'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { CodeBlock, CodeBlockHeader } from './code-block';
import { Terminal, Activity, Code as CodeIcon } from '@aazucena/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { SegmentedControl, SegmentedItem } from './segmented-control';
import { useCodeBlockCommand } from '../../hooks/use-code-block-command';

const codeBlockCommandVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type CodeBlockCommandVariant = VariantProps<typeof codeBlockCommandVariants>['variant'];

export interface CodeBlockCommandProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof codeBlockCommandVariants> {
  command?: string;
  methods?: Record<string, string>;
  storageKey?: string;
  output?: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  fileName?: string;
  showCommandSymbol?: boolean;
  typingEffect?: boolean;
  typingDelay?: number;
  enableTabs?: boolean;
}

// --- Internal Sub-components ---

const MethodSwitcher = ({
  methods,
  activeMethod,
  onMethodChange,
  variant,
}: {
  methods: string[];
  activeMethod: string;
  onMethodChange: (method: string) => void;
  variant: CodeBlockCommandVariant;
}) => {
  if (methods.length <= 1) return null;
  const v = (variant ?? 'default') as 'default' | 'glass' | 'cyber';
  return (
    <SegmentedControl variant={v} size="sm" className="ml-auto">
      {methods.map((key) => (
        <SegmentedItem
          key={key}
          value={key}
          isActive={activeMethod === key}
          variant={v}
          onClick={() => onMethodChange(key)}
        >
          {key}
        </SegmentedItem>
      ))}
    </SegmentedControl>
  );
};

const CommandHeader = ({
  fileName,
  variant,
  methods,
  activeMethod,
  onMethodChange,
  copyable,
  onCopy,
  copied,
  copyError,
  icon: Icon = Terminal,
}: {
  fileName?: string;
  variant: CodeBlockCommandVariant;
  methods?: string[];
  activeMethod?: string;
  onMethodChange?: (method: string) => void;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  copyError?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) => {
  const v = (variant ?? 'default') as 'default' | 'glass' | 'cyber';
  return (
    <CodeBlockHeader
      variant={v}
      copyable={copyable}
      onCopy={onCopy}
      copied={copied}
      copyError={copyError}
      className="border-b"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} className="opacity-50" />
        <span className="text-[10px] font-bold tracking-widest uppercase">{fileName}</span>
      </div>
      {methods && activeMethod && onMethodChange && (
        <MethodSwitcher
          methods={methods}
          activeMethod={activeMethod}
          onMethodChange={onMethodChange}
          variant={v}
        />
      )}
    </CodeBlockHeader>
  );
};

// --- Main Component ---

/**
 * A specialized code block for displaying terminal commands and their outputs.
 * Supports multiple command methods (pnpm, npm, etc.), persistent preferences,
 * and a typing animation effect.
 */
const CodeBlockCommand = React.forwardRef<HTMLDivElement, CodeBlockCommandProps>(
  (
    {
      className,
      variant = 'default',
      command: singleCommand,
      methods,
      storageKey = 'aazucena-command-preference',
      output,
      language = 'bash',
      showLineNumbers = false,
      copyable = true,
      fileName,
      showCommandSymbol = true,
      typingEffect = false,
      typingDelay = 50,
      enableTabs = true,
      ...props
    },
    ref,
  ) => {
    const {
      methodKeys,
      preferredMethod: _preferredMethod,
      setPreferredMethod,
      activeMethod,
      activeCommand,
      displayedCommand,
      displayedOutput,
      commandContent,
      cmdStatus,
      outStatus,
      handleCopyAction,
      setCmdStatus,
      setOutStatus,
    } = useCodeBlockCommand({
      methods,
      command: singleCommand,
      storageKey,
      typingEffect,
      typingDelay,
      showCommandSymbol,
      output,
    });

    const v = (variant || 'default') as 'default' | 'glass' | 'cyber';

    if (enableTabs && output) {
      return (
        <div ref={ref} className={cn(codeBlockCommandVariants({ variant }), className)} {...props}>
          <Tabs defaultValue="command" className="w-full">
            <div
              className={cn(
                'bg-muted/20 flex items-center justify-between border-b px-1',
                v === 'cyber' && 'border-cyan-500/20 bg-black',
                v === 'glass' && 'border-white/10 bg-white/5',
              )}
            >
              <TabsList className={cn('h-9 bg-transparent p-0', v === 'cyber' && 'gap-1')}>
                <TabsTrigger
                  value="command"
                  className={cn(
                    'data-[state=active]:border-primary h-full rounded-none px-4 text-[10px] font-bold tracking-widest uppercase data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                    v === 'cyber' &&
                      'text-cyan-500/50 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-400',
                    v === 'glass' &&
                      'text-white/50 data-[state=active]:border-white data-[state=active]:text-white',
                  )}
                >
                  <CodeIcon className="mr-2 size-3" />
                  Command
                </TabsTrigger>
                <TabsTrigger
                  value="output"
                  className={cn(
                    'data-[state=active]:border-primary h-full rounded-none px-4 text-[10px] font-bold tracking-widest uppercase data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                    v === 'cyber' &&
                      'text-cyan-500/50 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-400',
                    v === 'glass' &&
                      'text-white/50 data-[state=active]:border-white data-[state=active]:text-white',
                  )}
                >
                  <Activity className="mr-2 size-3" />
                  Output
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 px-3 font-mono text-[9px] tracking-tighter uppercase opacity-40">
                <Terminal className="size-3" />
                {fileName && <span>{fileName}</span>}
              </div>
            </div>

            <TabsContent
              value="command"
              className="ring-offset-background mt-0 focus-visible:outline-none"
            >
              <CommandHeader
                fileName={fileName}
                variant={v}
                methods={methodKeys}
                activeMethod={activeMethod}
                onMethodChange={setPreferredMethod}
                copyable={copyable}
                onCopy={() => handleCopyAction(commandContent, setCmdStatus)}
                copied={cmdStatus.copied}
                copyError={cmdStatus.error}
                icon={CodeIcon}
              />
              <CodeBlock
                code={commandContent}
                language={language}
                showLineNumbers={showLineNumbers}
                copyable={false}
                variant={v}
                header={null}
              />
            </TabsContent>
            <TabsContent
              value="output"
              className="ring-offset-background mt-0 focus-visible:outline-none"
            >
              <CommandHeader
                fileName="output.log"
                variant={v}
                copyable={copyable}
                onCopy={() => handleCopyAction(displayedOutput, setOutStatus)}
                copied={outStatus.copied}
                copyError={outStatus.error}
                icon={Activity}
              />
              <CodeBlock
                code={displayedOutput}
                language="text"
                showLineNumbers={showLineNumbers}
                copyable={false}
                variant={v}
                header={null}
              />
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(codeBlockCommandVariants({ variant }), className)} {...props}>
        <div className="flex flex-col">
          <CommandHeader
            fileName={fileName}
            variant={v}
            methods={methodKeys}
            activeMethod={activeMethod}
            onMethodChange={setPreferredMethod}
            copyable={copyable}
            onCopy={() =>
              handleCopyAction(
                `${showCommandSymbol ? '$ ' : ''}${activeCommand}${output ? `\n${output}` : ''}`,
                setCmdStatus,
              )
            }
            copied={cmdStatus.copied}
            copyError={cmdStatus.error}
          />
          <CodeBlock
            code={`${showCommandSymbol ? '$ ' : ''}${displayedCommand}${displayedOutput ? `\n${displayedOutput}` : ''}`}
            language={language}
            showLineNumbers={showLineNumbers}
            copyable={false}
            variant={v}
            header={null}
          />
        </div>
      </div>
    );
  },
);
CodeBlockCommand.displayName = 'CodeBlockCommand';

export { CodeBlockCommand, codeBlockCommandVariants };
