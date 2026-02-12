/**
 * CommandPalette Component
 * Global CMD+K interface for navigating the monorepo.
 * Decoupled via callbacks and dynamic action injection.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '../ui/command.js';
import { useCommandSearch, type CommandAction } from '@aazucena/hooks';
import { cn } from '@aazucena/utils';
import { Search, Command as CommandIcon, Message, Zap } from '@aazucena/icons';

interface CommandPaletteProps {
  /** The list of searchable actions */
  actions: CommandAction[];
  /** Callback for navigation actions */
  onNavigate?: (href: string) => void;
  /** Callback for custom system actions */
  onAction?: (actionId: string) => void;
  /** Custom trigger element or key override (defaults to CMD+K) */
  trigger?: string;
  /** Optional class name for the wrapper */
  className?: string;
}

export function CommandPalette({ actions, onNavigate, onAction, className }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { search } = useCommandSearch(actions);

  // 1. Toggle palette visibility
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleOpenPalette = () => setOpen(true);

    document.addEventListener('keydown', down);
    window.addEventListener('open-command-palette', handleOpenPalette);

    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-palette', handleOpenPalette);
    };
  }, []);

  // 2. Handle action selection
  const handleSelect = useCallback(
    (action: CommandAction) => {
      setOpen(false);

      if (action.href && onNavigate) {
        onNavigate(action.href);
        return;
      }

      if (onAction) {
        onAction(action.id);
      }
    },
    [onNavigate, onAction],
  );

  const filteredActions = search(query);

  // Derive unique categories from current filtered actions
  const categories = Array.from(new Set(filteredActions.map((a) => a.category)));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'animate-in fade-in zoom-in-95 w-full max-w-2xl overflow-hidden bg-white duration-200 dark:bg-zinc-900',
          className,
        )}
      >
        {/* INPUT SECTION */}
        <div className="flex h-14 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400" />
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="EXECUTE_COMMAND_OR_QUERY..."
            className="flex-1 border-none bg-transparent font-mono text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100"
          />
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase">ESC</span>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <CommandList className="custom-scrollbar max-h-[400px] overflow-y-auto p-2">
          <CommandEmpty className="py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Search className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                No_Results_Found
              </p>
            </div>
          </CommandEmpty>

          {categories.map((category) => {
            const actionsInCategory = filteredActions.filter((a) => a.category === category);
            if (actionsInCategory.length === 0) return null;

            return (
              <CommandGroup key={category} heading={category} className="px-2 pt-4 pb-2">
                <div className="mb-2 px-2">
                  <span className="text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase dark:text-zinc-600">
                    {category}_CORE
                  </span>
                </div>
                {actionsInCategory.map((action) => (
                  <CommandItem
                    key={action.id}
                    onSelect={() => handleSelect(action)}
                    className="aria-selected:bg-primary-500/10 aria-selected:text-primary-500 group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200"
                  >
                    <div className="group-aria-selected:bg-primary-500/20 group-aria-selected:border-primary-500/30 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 transition-colors dark:border-zinc-700 dark:bg-zinc-800">
                      <action.icon className="h-4 w-4 transition-transform group-active:scale-90" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-xs font-bold tracking-wide uppercase">
                        {action.name}
                      </span>
                      <span className="truncate font-mono text-[10px] text-zinc-500">
                        {action.keywords}
                      </span>
                    </div>
                    <div className="text-primary-500 hidden items-center gap-1 font-mono text-[10px] font-bold opacity-50 group-aria-selected:flex">
                      ENTER <CommandIcon size={12} />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}

          {/* AI SUGGESTION */}
          <CommandGroup
            heading="AI Assistant"
            className="mt-2 border-t border-zinc-100 px-2 pt-4 pb-2 dark:border-zinc-800"
          >
            <div className="mb-2 px-2">
              <span className="text-primary-500/70 text-[9px] font-black tracking-[0.2em] uppercase">
                NEURAL_BRIDGE
              </span>
            </div>
            <CommandItem
              onSelect={() => onNavigate?.(`/ai?q=${encodeURIComponent(query)}`)}
              className="aria-selected:bg-primary-500/10 aria-selected:text-primary-500 group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200"
            >
              <div className="bg-primary-500/10 border-primary-500/20 flex h-8 w-8 items-center justify-center rounded-lg border">
                <Message className="text-primary-500 h-4 w-4" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-xs font-bold tracking-wide uppercase">Ask Assistant</span>
                <span className="truncate font-mono text-[10px] text-zinc-500">
                  {query ? `Query: "${query}"` : 'Bridge to collective monorepo memory'}
                </span>
              </div>
              <Zap className="text-primary-500 h-3 w-3 animate-pulse" />
            </CommandItem>
          </CommandGroup>
        </CommandList>

        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500">
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                ↵
              </kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-bold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </div>
          </div>
          <div className="text-primary-500/50 font-mono text-[10px] tracking-tighter uppercase italic">
            Powered_by_FlexSearch_v0.8
          </div>
        </div>
      </div>
    </CommandDialog>
  );
}
