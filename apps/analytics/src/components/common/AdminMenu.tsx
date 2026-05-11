'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Activity, Power, Trash, Refresh } from '@aazucena/icons';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { RootState, toggleLiveMode, clearAllHistory } from '@/store';
import { useConfirmation } from '@/providers/ConfirmationProvider';

// --- SettingRow sub-component ---

interface SettingRowProps {
  label: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  /** Current toggle state — ignored when isAction=true */
  active: boolean;
  /** Renders as a one-shot action button instead of a toggle */
  isAction?: boolean;
  onToggle: () => void;
}

function SettingRow({
  label,
  sub,
  icon: Icon,
  iconColor,
  active,
  isAction = false,
  onToggle,
}: SettingRowProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group text-left"
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform',
          iconColor,
        )}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
          {label}
        </div>
        <div className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 uppercase">{sub}</div>
      </div>
      {!isAction && (
        <div
          className={cn(
            'w-8 h-4 rounded-full border transition-all duration-200 shrink-0 relative',
            active
              ? 'bg-primary-500 border-primary-500'
              : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700',
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200',
              active ? 'left-[18px]' : 'left-0.5',
            )}
          />
        </div>
      )}
    </button>
  );
}

// --- AdminMenu ---

export function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isLive = useSelector((state: RootState) => state.dashboard.status.isLive);
  const { confirm } = useConfirmation();

  const confirmAndClose = (options: Parameters<typeof confirm>[0]) => {
    setIsOpen(false);
    confirm(options);
  };

  // Measure trigger position so the portal-rendered popover aligns correctly
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPopoverStyle({
      position: 'fixed',
      top: rect.bottom + 16,
      right: window.innerWidth - rect.right,
    });
  }, []);

  const handleOpen = () => {
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  // Close on outside click — portal renders outside the backdrop-filter stacking context
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePopover = popoverRef.current?.contains(target);
      if (!insideTrigger && !insidePopover) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleTerminateSession = async () => {
    dispatch(clearAllHistory());
    await fetch('/api/auth', { method: 'DELETE' });
    router.refresh(); // re-runs AuthGate on the server — cookie gone → overlay appears
  };

  return (
    <div ref={triggerRef} className="relative h-full flex items-center">
      {/* Trigger */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-3 pl-2 group transition-all h-8"
      >
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-none uppercase group-hover:text-primary-500 transition-colors">
            AZUCENA_ROOT_AUTH
          </div>
          <div className="text-[8px] font-mono text-primary-600 mt-1 uppercase tracking-widest font-bold opacity-80 group-hover:opacity-100">
            PRIVILEGED_EXECUTION
          </div>
        </div>
        <div
          className={cn(
            'w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border transition-all flex items-center justify-center text-zinc-400 dark:text-zinc-500 shadow-sm dark:shadow-inner',
            isOpen
              ? 'border-primary-500/50 ring-2 ring-primary-500/10'
              : 'border-zinc-200 dark:border-zinc-800',
          )}
        >
          <UserCircle size={20} className={cn(isOpen && 'text-primary-500')} />
        </div>
      </button>

      {/* Popover — portalled to <body> to escape backdrop-filter stacking context */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={popoverRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={popoverStyle}
                className="w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-[9999] overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500">
                      <Activity size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter text-left">
                        Session_Identity
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">TRC_ROOT_0921X</div>
                    </div>
                  </div>
                </div>

                {/* Settings rows */}
                <div className="p-3 space-y-0.5">
                  <p className="px-3 pb-1 text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                    Feed
                  </p>

                  <SettingRow
                    label="Live Feed"
                    sub={isLive ? 'POLLING_ACTIVE' : 'POLLING_PAUSED'}
                    icon={Activity}
                    iconColor={isLive ? 'text-emerald-500' : 'text-zinc-400'}
                    active={isLive}
                    onToggle={() => dispatch(toggleLiveMode())}
                  />

                  <p className="px-3 pb-1 pt-2 text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                    Data
                  </p>

                  <SettingRow
                    label="Refresh All Data"
                    sub="INVALIDATE_QUERY_CACHE"
                    icon={Refresh}
                    iconColor="text-primary-400"
                    active={false}
                    isAction
                    onToggle={() => queryClient.invalidateQueries()}
                  />

                  <SettingRow
                    label="Clear AI History"
                    sub="PURGE_THREAD_LOG"
                    icon={Trash}
                    iconColor="text-rose-400"
                    active={false}
                    isAction
                    onToggle={() =>
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

                {/* Footer */}
                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                  <button
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
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-500/20 transition-all"
                  >
                    <Power size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Terminate_Session
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
