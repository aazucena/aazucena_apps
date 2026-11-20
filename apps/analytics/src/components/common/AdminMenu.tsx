'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Activity, Power, Trash, Refresh } from '@aazucena/icons';
import { Button, Popover, PopoverContent, PopoverTrigger, Switch } from '@aazucena/ui';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { RootState, toggleLiveMode, clearAllHistory } from '@/store';
import { useConfirmation } from '@/providers/ConfirmationProvider';

// --- Menu rows ---

const rowClass =
  'hover:bg-state focus-visible:bg-state flex w-full items-center gap-3 px-4 py-2 text-left outline-none';

interface ActionRowProps {
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  /** Alert tone for destructive-ish actions (the icon carries the cue). */
  alert?: boolean;
  onSelect: () => void;
}

function ActionRow({ label, sub, icon: Icon, alert = false, onSelect }: ActionRowProps) {
  return (
    <button type="button" onClick={onSelect} className={rowClass}>
      <div className="min-w-0 flex-1">
        <div className={cn('text-sm font-medium', alert && 'text-alert')}>{label}</div>
        <div className="micro-label text-muted-foreground">{sub}</div>
      </div>
      <Icon size={14} className={alert ? 'text-alert' : 'text-muted-foreground'} />
    </button>
  );
}

// --- AdminMenu ---

export function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  const { confirm } = useConfirmation();

  const confirmAndClose = (options: Parameters<typeof confirm>[0]) => {
    setIsOpen(false);
    confirm(options);
  };

  const handleTerminateSession = async () => {
    dispatch(clearAllHistory());
    await fetch('/api/auth', { method: 'DELETE' });
    router.refresh(); // re-runs AuthGate on the server — cookie gone → overlay appears
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Session menu"
          className="group flex items-center gap-3 outline-none"
        >
          <div className="hidden text-right sm:block">
            <div className="micro-label text-foreground leading-tight">AZUCENA_ROOT_AUTH</div>
            <div className="micro-label text-signal leading-tight">PRIVILEGED_EXECUTION</div>
          </div>
          <div
            className={cn(
              'rounded-control flex size-8 items-center justify-center border group-focus-visible:outline-1 group-focus-visible:outline-solid group-focus-visible:outline-signal',
              isOpen ? 'border-signal text-signal' : 'border-rule-strong text-muted-foreground',
            )}
          >
            <UserCircle size={18} />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="border-rule-strong w-72 p-0">
        <div className="border-rule flex items-center gap-3 border-b p-4">
          <div className="border-rule-strong text-signal rounded-control flex size-9 items-center justify-center border">
            <Activity size={16} />
          </div>
          <div>
            <div className="micro-label text-foreground">SESSION_IDENTITY</div>
            <div className="text-muted-foreground font-mono text-xs">TRC_ROOT_0921X</div>
          </div>
        </div>

        <div className="py-2">
          <p className="micro-label text-muted-foreground px-4 py-2">Feed</p>
          <div className={rowClass}>
            <label htmlFor="admin-live-feed" className="min-w-0 flex-1 cursor-pointer">
              <div className="text-sm font-medium">Live feed</div>
              <div className="micro-label text-muted-foreground">
                {isLive ? 'POLLING_ACTIVE' : 'POLLING_PAUSED'}
              </div>
            </label>
            <Switch
              id="admin-live-feed"
              variant="cyber"
              checked={isLive}
              onCheckedChange={() => dispatch(toggleLiveMode())}
            />
          </div>

          <p className="micro-label text-muted-foreground px-4 py-2">Data</p>
          <ActionRow
            label="Refresh all data"
            sub="INVALIDATE_QUERY_CACHE"
            icon={Refresh}
            onSelect={() => queryClient.invalidateQueries()}
          />
          <ActionRow
            label="Clear AI history"
            sub="PURGE_THREAD_LOG"
            icon={Trash}
            alert
            onSelect={() =>
              confirmAndClose({
                title: 'Clear AI History',
                description:
                  'All AI conversation threads and prompt history will be permanently erased from the store. This action cannot be undone.',
                commandLabel: 'PURGE_THREAD_LOG',
                icon: Trash,
                variant: 'danger',
                confirmLabel: 'Purge History',
                onConfirm: () => dispatch(clearAllHistory()),
              })
            }
          />
        </div>

        <div className="border-rule border-t p-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() =>
              confirmAndClose({
                title: 'Terminate Session',
                description:
                  'Your authentication cookie will be revoked and this privileged session will end. You will need to re-authenticate to regain access.',
                commandLabel: 'REVOKE_SESSION_TOKEN',
                icon: Power,
                variant: 'danger',
                confirmLabel: 'Terminate',
                onConfirm: handleTerminateSession,
              })
            }
          >
            <span aria-hidden>▲</span> Terminate session
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
