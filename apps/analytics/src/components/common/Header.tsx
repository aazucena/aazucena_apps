'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, toggleLiveMode } from '@/store';
import { Search, ClockCircle, Bell } from '@aazucena/icons';
import { NotificationCenter } from '@aazucena/ui';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { ThemeToggle } from './ThemeToggle';
import { AdminMenu } from './AdminMenu';

export function Header() {
  const dispatch = useDispatch();
  const { isLive, lastUpdated } = useSelector((state: RootState) => state.dashboard.status);
  const { notifications, unreadCount, markRead, markAllRead, dismiss } = useNotifications();

  return (
    <div className="flex-1 flex items-center justify-between h-full">
      {/* 1. SEARCH SECTION */}
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }}
        className="relative w-80 group flex items-center h-8 bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 hover:border-primary-500/50 transition-all cursor-text"
      >
        <Search className="w-4 h-4 mr-3 text-zinc-400 group-hover:text-primary-500 transition-colors" />
        <span className="flex-1 text-left uppercase tracking-tighter">
          QUERY_TELEMETRY_STREAM...
        </span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-[9px] font-bold text-zinc-500">
          <span className="text-[10px]">⌘</span>K
        </div>
      </button>

      {/* 2. ACTIONS & STATUS SECTION */}
      <div className="flex items-center gap-6 h-full">
        {/* System Status Group */}
        <div className="flex items-center gap-4 border-r border-zinc-200 dark:border-zinc-800 pr-6 h-8">
          {/* Live Toggle */}
          <button
            onClick={() => dispatch(toggleLiveMode())}
            className="flex items-center gap-2 group"
          >
            <div className="relative flex items-center justify-center w-2 h-2">
              {isLive && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              )}
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isLive ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              />
            </div>
            <span
              className={`text-[9px] font-mono font-bold tracking-widest ${isLive ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`}
            >
              {isLive ? 'CORE_OPERATIONAL' : 'CORE_SUSPENDED'}
            </span>
          </button>

          {/* Sync Time */}
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600">
            <ClockCircle size={14} />
            <span className="text-[9px] font-mono uppercase">
              SYNC:{' '}
              {lastUpdated
                ? new Date(lastUpdated).toLocaleTimeString([], { hour12: false })
                : '00:00:00'}
            </span>
          </div>
        </div>

        {/* 3. USER & THEME GROUP */}
        <div className="flex items-center gap-4 h-full">
          <ThemeToggle size="sm" />

          <NotificationCenter
            notifications={notifications}
            onRead={markRead}
            onDismiss={dismiss}
            onMarkAllRead={markAllRead}
            trigger={
              <button
                type="button"
                className="relative p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-primary-500 text-[8px] font-black text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            }
          />

          {/* Admin Identity Popover */}
          <AdminMenu />
        </div>
      </div>
    </div>
  );
}
