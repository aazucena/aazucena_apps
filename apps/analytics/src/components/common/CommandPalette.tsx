'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { toggleLiveMode } from '@/store';
import { useCommandSearch, CommandAction } from '@/hooks/useCommandSearch';
import { Search, Command as CommandIcon, Message, Zap } from '@aazucena/icons';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { search } = useCommandSearch();

  // 1. Toggle palette visibility
  useEffect(() => {
    // The login overlay is modal: no shortcut or event may open another layer over it.
    const locked = () => document.querySelector('[data-login-overlay]') !== null;

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        if (locked()) return;
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const handleOpenPalette = () => {
      if (!locked()) setOpen(true);
    };

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
        queryClient.invalidateQueries();
        return;
      }

      if (action.id === 'ai-think') {
        router.push('/ai'); // For now, later we could open a mini-chat
        return;
      }
    },
    [router, dispatch, queryClient],
  );

  const filteredActions = search(query);

  const categories = ['NAVIGATION', 'SYSTEM', 'AI'] as const;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      overlayClassName="bg-scrim fixed inset-0 z-(--z-overlay)"
      contentClassName="fixed top-[20vh] left-1/2 z-(--z-modal) w-full max-w-2xl -translate-x-1/2 px-4"
      className="border-rule-strong bg-panel-raised text-foreground rounded-card overflow-hidden border"
    >
      <DialogPrimitive.Title className="sr-only">Global Command Palette</DialogPrimitive.Title>
      <DialogPrimitive.Description className="sr-only">
        Search for commands, navigation, and AI assistance.
      </DialogPrimitive.Description>

      {/* INPUT SECTION */}
      <div className="border-rule flex h-14 items-center gap-3 border-b px-4">
        <Search className="text-muted-foreground size-5" />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="EXECUTE_COMMAND_OR_QUERY..."
          className="placeholder:text-muted-foreground flex-1 border-none bg-transparent font-mono text-sm outline-none"
        />
        <kbd className="micro-label border-rule text-muted-foreground rounded-control border px-2 py-1">
          ESC
        </kbd>
      </div>

      {/* RESULTS SECTION */}
      <Command.List className="max-h-[400px] overflow-y-auto p-2">
        <Command.Empty className="py-12 text-center">
          <p className="micro-label text-muted-foreground">No_Results_Found</p>
        </Command.Empty>

        {categories.map((category) => {
          const actionsInCategory = filteredActions.filter((a) => a.category === category);
          if (actionsInCategory.length === 0) return null;

          return (
            <Command.Group
              key={category}
              heading={category}
              className="px-2 pt-3 pb-2 [&_[cmdk-group-heading]]:sr-only"
            >
              <div className="mb-2 px-2">
                <span className="micro-label text-muted-foreground">{category}_CORE</span>
              </div>
              {actionsInCategory.map((action) => (
                <Command.Item
                  key={action.id}
                  onSelect={() => onSelect(action)}
                  className="rounded-control aria-selected:bg-state aria-selected:text-signal group flex cursor-pointer items-center gap-3 px-3 py-2"
                >
                  <div className="border-rule rounded-control flex size-8 items-center justify-center border">
                    <action.icon className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="micro-label">{action.name}</span>
                    <span className="text-muted-foreground truncate font-mono text-[10px]">
                      {action.keywords}
                    </span>
                  </div>
                  <div className="text-signal hidden items-center gap-1 font-mono text-[10px] group-aria-selected:flex">
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
          className="border-rule mt-2 border-t px-2 pt-3 pb-2 [&_[cmdk-group-heading]]:sr-only"
        >
          <div className="mb-2 px-2">
            <span className="micro-label text-signal">NEURAL_BRIDGE</span>
          </div>
          <Command.Item
            onSelect={() => router.push(`/ai?q=${encodeURIComponent(query)}`)}
            className="rounded-control aria-selected:bg-state aria-selected:text-signal flex cursor-pointer items-center gap-3 px-3 py-2"
          >
            <div className="border-rule text-signal rounded-control flex size-8 items-center justify-center border">
              <Message className="size-4" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="micro-label">Ask Assistant</span>
              <span className="text-muted-foreground truncate font-mono text-[10px]">
                {query ? `Query: "${query}"` : 'Bridge to collective monorepo memory'}
              </span>
            </div>
            <Zap className="text-signal size-3" />
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="border-rule text-muted-foreground flex items-center justify-between border-t px-4 py-3 font-mono text-[10px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <kbd className="border-rule rounded-control border px-1.5 py-0.5">↵</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="border-rule rounded-control border px-1.5 py-0.5">↑↓</kbd>
            <span>to navigate</span>
          </div>
        </div>
        <span className="micro-label">Powered_by_FlexSearch_v0.8</span>
      </div>
    </Command.Dialog>
  );
}
