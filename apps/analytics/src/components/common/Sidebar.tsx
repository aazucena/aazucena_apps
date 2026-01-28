'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, toggleSidebar } from '@/store'; 
import {
  Grid,
  Music,
  Terminal,
  ChartBarOne,
  ChevronLeft,
  ChevronRight,
} from '@mynaui/icons-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Node Overview', href: '/', icon: Grid },
  { name: 'Audio Intelligence', href: '/music', icon: Music },
  { name: 'Telemetry Stream', href: '/logs', icon: Terminal },
  { name: 'System Integrity', href: '/performance', icon: ChartBarOne },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state: RootState) => state.dashboard.ui.isSidebarCollapsed);

  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>

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

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center h-10 px-3 rounded-xl transition-all duration-300 group",
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-900 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-active:scale-90", isActive ? "text-primary-500" : "group-hover:text-zinc-900 dark:group-hover:text-zinc-200")} />
              {!isCollapsed && <span className="ml-3 text-xs font-bold uppercase tracking-wider">{item.name}</span>}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1 h-4 bg-primary-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle Section */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-300 active:scale-95 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
        >
          {isCollapsed ? <ChevronRight size={18} /> : (
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-[10px] font-black uppercase tracking-widest italic">Link_State: Open</span>
              <ChevronLeft size={16} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}