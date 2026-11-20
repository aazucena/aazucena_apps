'use client';

import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, toggleLiveMode } from '@/store';
import { Search, ClockCircle, Bell } from '@aazucena/icons';
import { Button, NotificationCenter } from '@aazucena/ui';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { AdminMenu } from './AdminMenu';
import { SYSTEM_NAV, INTELLIGENCE_NAV } from './Sidebar';

function pageName(pathname: string): string {
  const match = [...SYSTEM_NAV, ...INTELLIGENCE_NAV]
    .filter((i) => (i.href === '/' ? pathname === '/' : pathname.startsWith(i.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return (match?.name ?? pathname.replace(/^\//, '') ?? 'NODE')
    .toUpperCase()
    .replace(/[\s/]+/g, '_');
}

export function Header() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { isLive, lastUpdated } = useSelector((state: RootState) => state.dashboard.status);
  const { notifications, unreadCount, markRead, markAllRead, dismiss } = useNotifications();

  return (
    <div className="flex h-full flex-1 items-center justify-between gap-4">
      {/* Breadcrumb + search */}
      <div className="flex min-w-0 items-center gap-6">
        <span className="micro-label text-foreground truncate">LYTICS // {pageName(pathname)}</span>
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-command-palette'));
          }}
          className="border-rule text-muted-foreground hover:border-rule-strong rounded-control hidden h-8 w-64 items-center gap-2 border px-2 font-mono text-xs outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-signal lg:flex"
        >
          <Search className="size-4" />
          <span className="micro-label flex-1 text-left">QUERY_TELEMETRY_STREAM</span>
          <kbd className="border-rule rounded-control border px-1 text-[10px]">⌘K</kbd>
        </button>
      </div>

      {/* Status + actions */}
      <div className="flex h-full items-center gap-4">
        <button
          type="button"
          onClick={() => dispatch(toggleLiveMode())}
          className={cn(
            'micro-label flex items-center gap-2',
            isLive ? 'text-signal' : 'text-muted-foreground',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'size-1.5 rounded-full',
              isLive ? 'bg-signal motion-safe:animate-pulse' : 'bg-rule-strong',
            )}
          />
          {isLive ? 'CORE_OPERATIONAL' : 'CORE_SUSPENDED'}
        </button>

        <div className="text-muted-foreground hidden items-center gap-2 xl:flex">
          <ClockCircle size={14} />
          <span className="micro-label">
            SYNC:{' '}
            {lastUpdated
              ? new Date(lastUpdated).toLocaleTimeString([], { hour12: false })
              : '00:00:00'}
          </span>
        </div>

        <ThemeToggle size="sm" />

        <NotificationCenter
          notifications={notifications}
          onRead={markRead}
          onDismiss={dismiss}
          onMarkAllRead={markAllRead}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={
                unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
              }
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="bg-signal text-signal-foreground absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full font-mono text-[8px] font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          }
        />

        <AdminMenu />
      </div>
    </div>
  );
}
