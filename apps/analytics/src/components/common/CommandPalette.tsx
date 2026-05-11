'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useDispatch } from 'react-redux';
import { toggleLiveMode } from '@/store';
import { useCommandSearch, CommandAction } from '@/hooks/useCommandSearch';
import { cn } from '@/lib/utils';
import { Search, Command as CommandIcon, Message, Zap } from '@aazucena/icons';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const { search } = useCommandSearch();

  // 1. Toggle palette visibility
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
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
  const onSelect = useCallback(
    (action: CommandAction) => {
      setOpen(false);

      if (action.href) {
        router.push(action.href);
        return;
      }

      if (action.id === 'sys-live') {
        dispatch(toggleLiveMode());
        return;
      }

      if (action.id === 'sys-theme') {
        // Theme toggle logic - usually handled by ThemeToggle component
        // but we can trigger a click on its button or dispatch a custom event
        const themeBtn = document.querySelector('[data-theme-toggle]') as HTMLButtonElement;
        themeBtn?.click();
        return;
      }

      if (action.id === 'sys-sync') {
        fetch('/api/brain/sync?force=true').then(() => {
          alert('Knowledge base sync initiated.');
        });
        return;
      }

      if (action.id === 'ai-think') {
        router.push('/ai'); // For now, later we could open a mini-chat
        return;
      }
    },
    [router, dispatch],
  );

  const filteredActions = search(query);

  const categories = ['NAVIGATION', 'SYSTEM', 'AI'] as const;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] p-4 bg-zinc-950/20 backdrop-blur-sm"
    >
      <DialogPrimitive.Title className="sr-only">Global Command Palette</DialogPrimitive.Title>
      <DialogPrimitive.Description className="sr-only">
        Search for commands, navigation, and AI assistance.
      </DialogPrimitive.Description>

      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* INPUT SECTION */}
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800 h-14 gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="EXECUTE_COMMAND_OR_QUERY..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">ESC</span>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <Command.List className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
          <Command.Empty className="py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Search className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                No_Results_Found
              </p>
            </div>
          </Command.Empty>

          {categories.map((category) => {
            const actionsInCategory = filteredActions.filter((a) => a.category === category);
            if (actionsInCategory.length === 0) return null;

            return (
              <Command.Group key={category} heading={category} className="px-2 pt-4 pb-2">
                <div className="mb-2 px-2">
                  <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">
                    {category}_CORE
                  </span>
                </div>
                {actionsInCategory.map((action) => (
                  <Command.Item
                    key={action.id}
                    onSelect={() => onSelect(action)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-primary-500/10 aria-selected:text-primary-500 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center group-aria-selected:bg-primary-500/20 group-aria-selected:border-primary-500/30 transition-colors">
                      <action.icon className="w-4 h-4 transition-transform group-active:scale-90" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {action.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 truncate">
                        {action.keywords}
                      </span>
                    </div>
                    <div className="hidden group-aria-selected:flex items-center gap-1 text-[10px] font-mono text-primary-500 font-bold opacity-50">
                      ENTER <CommandIcon size={12} />
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}

          {/* AI SUGGESTION IF NO RESULTS OR AS A PERMANENT OPTION */}
          <Command.Group
            heading="AI Assistant"
            className="px-2 pt-4 pb-2 border-t border-zinc-100 dark:border-zinc-800 mt-2"
          >
            <div className="mb-2 px-2">
              <span className="text-[9px] font-black text-primary-500/70 uppercase tracking-[0.2em]">
                NEURAL_BRIDGE
              </span>
            </div>
            <Command.Item
              onSelect={() => router.push(`/ai?q=${encodeURIComponent(query)}`)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-primary-500/10 aria-selected:text-primary-500 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <Message className="w-4 h-4 text-primary-500" />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wide">Ask Assistant</span>
                <span className="text-[10px] font-mono text-zinc-500 truncate">
                  {query ? `Query: "${query}"` : 'Bridge to collective monorepo memory'}
                </span>
              </div>
              <Zap className="w-3 h-3 text-primary-500 animate-pulse" />
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 font-bold">
                ↵
              </kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-300 font-bold">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-primary-500/50 italic uppercase tracking-tighter">
            Powered_by_FlexSearch_v0.8
          </div>
        </div>
      </div>
    </Command.Dialog>
  );
}
