'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, toggleSidebar, setNavMode } from '@/store';
import { useEffect, useSyncExternalStore } from 'react';
import {
  Grid,
  Music,
  Terminal,
  ChartBarOne,
  ChevronLeft,
  ChevronRight,
  Puzzle,
  Chip,
  Database,
  LayersThree,
  Globe,
  CreditCard,
  Compass,
  Mail,
  Star,
} from '@aazucena/icons';
import { Tabs, TabsList, TabsTrigger } from '@aazucena/ui';
import { cn } from '@/lib/utils';
import { navModeStore, type NavMode } from '@/store/navModeStore';
import { IntegrityBadge } from './IntegrityBadge';

// --- Subsystem Definitions ---
export const SYSTEM_NAV = [
  { name: 'Node Overview', href: '/', icon: Grid },
  { name: 'Traffic Center', href: '/traffic', icon: Globe },
  { name: 'Journey Explorer', href: '/journey', icon: Compass },
  { name: 'Telemetry Stream', href: '/logs', icon: Terminal },
  { name: 'System Integrity', href: '/performance', icon: ChartBarOne },
  { name: 'Comms Inbox', href: '/forms', icon: Mail },
  { name: 'Easter Eggs', href: '/easter-eggs', icon: Star },
];

export const INTELLIGENCE_NAV = [
  { name: 'AI Core Terminal', href: '/ai', icon: Puzzle },
  { name: 'Prompt IDE', href: '/ai/prompts', icon: LayersThree },
  { name: 'Trajectory Labs', href: '/ai/trajectories', icon: Chip },
  { name: 'Audio Intelligence', href: '/music', icon: Music },
  { name: 'Cost Center', href: '/ai/costs', icon: Database },
  { name: 'Financial Ledger', href: '/finance', icon: CreditCard },
];

/** Exact match for `/`, prefix match for the rest; the longest matching href wins. */
function activeHref(pathname: string, items: { href: string }[]): string | undefined {
  return items
    .filter((i) => (i.href === '/' ? pathname === '/' : pathname.startsWith(i.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state: RootState) => state.dashboard.ui.isSidebarCollapsed);
  const reduxNavMode = useSelector((state: RootState) => state.dashboard.ui.navMode);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Sync with localStorage store using useSyncExternalStore
  const clientNavMode = useSyncExternalStore(
    navModeStore.subscribe,
    navModeStore.getSnapshot,
    navModeStore.getServerSnapshot,
  );

  // Keep Redux in sync with localStorage on mount
  useEffect(() => {
    if (clientNavMode !== reduxNavMode) {
      dispatch(setNavMode(clientNavMode));
    }
  }, [clientNavMode, reduxNavMode, dispatch]);

  // Use clientNavMode for rendering once mounted to ensure no hydration flicker
  const displayNavMode = isMounted ? clientNavMode : 'SYSTEM';
  const navItems = displayNavMode === 'SYSTEM' ? SYSTEM_NAV : INTELLIGENCE_NAV;
  const current = activeHref(pathname, navItems);

  const setMode = (mode: NavMode) => {
    navModeStore.set(mode);
    dispatch(setNavMode(mode));
  };

  return (
    <div
      className={cn(
        'border-rule bg-background flex h-full flex-col border-r',
        isCollapsed ? 'w-16' : 'w-52',
      )}
    >
      {/* Brand */}
      <div className="border-rule flex h-14 shrink-0 flex-col justify-center border-b px-3">
        {isCollapsed ? (
          <span className="text-signal text-center font-mono text-xs font-bold">AL</span>
        ) : (
          <>
            <span className="font-mono text-xs leading-tight font-bold tracking-wider">
              AZUCENA_LYTICS
            </span>
            <span className="micro-label text-muted-foreground">CORE_TERMINAL // V2</span>
          </>
        )}
      </div>

      {/* Mode switch */}
      {!isCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <Tabs value={displayNavMode} onValueChange={(v) => setMode(v as NavMode)}>
            <TabsList className="border-rule bg-panel h-[34px] w-full border p-0.5">
              {(
                [
                  ['SYSTEM', 'System'],
                  ['INTELLIGENCE', 'Intel'],
                ] as const
              ).map(([value, label]) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="text-muted-foreground data-[state=active]:bg-signal data-[state=active]:text-signal-foreground h-full flex-1 font-mono text-[10px] leading-[14px] font-normal tracking-[0.2em] uppercase"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Navigation */}
      <nav aria-label="Primary" className="flex-1 overflow-y-auto pt-2">
        <div className={cn('px-3 pb-2', isCollapsed && 'text-center')}>
          <span className="micro-label text-muted-foreground">
            {isCollapsed
              ? 'NAV'
              : `${displayNavMode === 'SYSTEM' ? 'SYSTEM' : 'INTEL'} // ${navItems.length}`}
          </span>
        </div>
        {navItems.map((item) => {
          const isActive = item.href === current;
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={isCollapsed ? item.name : undefined}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                'flex h-9 items-center gap-2 border-l-2 px-3 outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-solid focus-visible:outline-signal',
                isCollapsed && 'justify-center',
                isActive
                  ? 'border-signal bg-state text-foreground'
                  : 'text-muted-foreground hover:bg-state hover:text-foreground border-transparent',
              )}
            >
              <item.icon className={cn('size-4 shrink-0', isActive && 'text-signal')} />
              {!isCollapsed && <span className="micro-label truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-rule shrink-0 border-t p-3">
        {!isCollapsed && <IntegrityBadge className="mb-1" />}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-muted-foreground hover:bg-state hover:text-foreground rounded-control flex h-8 w-full items-center gap-2 px-2 outline-none focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-signal"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="mx-auto" />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span className="micro-label">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
