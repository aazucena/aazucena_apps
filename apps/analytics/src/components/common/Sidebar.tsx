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
  Activity,
  Globe,
  CreditCard,
  Compass,
  Mail,
  Star,
} from '@aazucena/icons';
import { cn } from '@/lib/utils';
import { navModeStore } from '@/store/navModeStore';
import { IntegrityBadge } from './IntegrityBadge';

// --- Subsystem Definitions ---
const SYSTEM_NAV = [
  { name: 'Node Overview', href: '/', icon: Grid },
  { name: 'Traffic Center', href: '/traffic', icon: Globe },
  { name: 'Journey Explorer', href: '/journey', icon: Compass },
  { name: 'Telemetry Stream', href: '/logs', icon: Terminal },
  { name: 'System Integrity', href: '/performance', icon: ChartBarOne },
  { name: 'Comms Inbox', href: '/forms', icon: Mail },
  { name: 'Easter Eggs', href: '/easter-eggs', icon: Star },
];

const INTELLIGENCE_NAV = [
  { name: 'AI Core Terminal', href: '/ai', icon: Puzzle },
  { name: 'Prompt IDE', href: '/ai/prompts', icon: LayersThree },
  { name: 'Trajectory Labs', href: '/ai/trajectories', icon: Chip },
  { name: 'Audio Intelligence', href: '/music', icon: Music },
  { name: 'Cost Center', href: '/ai/costs', icon: Database },
  { name: 'Financial Ledger', href: '/finance', icon: CreditCard },
];

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

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Brand / Logo Section */}
      <div className="h-14 flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
          <span className="text-primary-500 font-mono font-bold text-xs uppercase">AL</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-black text-xs tracking-[0.2em] text-zinc-900 dark:text-zinc-100 uppercase">
            AZUCENA_LYTICS
          </span>
        )}
      </div>

      {/* Mode Switcher */}
      {!isCollapsed && (
        <div className="px-4 pt-6">
          <div className="p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex gap-1">
            <button
              onClick={() => {
                navModeStore.set('SYSTEM');
                dispatch(setNavMode('SYSTEM'));
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                displayNavMode === 'SYSTEM'
                  ? 'bg-white dark:bg-zinc-800 text-primary-500 shadow-sm border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
              )}
            >
              <Activity size={12} />
              System
            </button>
            <button
              onClick={() => {
                navModeStore.set('INTELLIGENCE');
                dispatch(setNavMode('INTELLIGENCE'));
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                displayNavMode === 'INTELLIGENCE'
                  ? 'bg-white dark:bg-zinc-800 text-primary-500 shadow-sm border border-zinc-200 dark:border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
              )}
            >
              <Puzzle size={12} />
              Intel
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className={cn('px-3 mb-2', isCollapsed ? 'text-center' : 'text-left')}>
          <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.3em]">
            {isCollapsed ? 'NAV' : `${displayNavMode}_SUBSYSTEMS`}
          </span>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center h-10 px-3 rounded-xl transition-all duration-300 group',
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50',
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-transform group-active:scale-90',
                  isActive
                    ? 'text-primary-500'
                    : 'group-hover:text-zinc-900 dark:group-hover:text-zinc-200',
                )}
              />
              {!isCollapsed && (
                <span className="ml-3 text-xs font-bold uppercase tracking-wider">{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1 h-4 bg-primary-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle Section */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
        {!isCollapsed && (
          <div className="px-2 mb-4">
            <IntegrityBadge className="w-full justify-center" />
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-300 active:scale-95 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-[10px] font-black uppercase tracking-widest italic">
                Link_State: Open
              </span>
              <ChevronLeft size={16} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
