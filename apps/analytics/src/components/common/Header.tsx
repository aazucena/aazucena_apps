'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, setSearchQuery, toggleLiveMode } from '@/store';
import { Search, ClockCircle, UserCircle } from '@mynaui/icons-react';
import { ThemeToggle } from './ThemeToggle';
import { AdminMenu } from './AdminMenu';

export function Header() {
  const dispatch = useDispatch();
  const { isLive, lastUpdated } = useSelector((state: RootState) => state.dashboard.status);
  const searchQuery = useSelector((state: RootState) => state.dashboard.filters.searchQuery);

  return (
    <div className="flex-1 flex items-center justify-between h-full">
      
      {/* 1. SEARCH SECTION */}
      <div className="relative w-80 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-600 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="QUERY_TELEMETRY_STREAM..."
          className="w-full h-8 bg-zinc-100 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 text-[10px] font-mono text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
        />
      </div>

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
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isLive ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
            </div>
            <span className={`text-[9px] font-mono font-bold tracking-widest ${isLive ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {isLive ? 'CORE_OPERATIONAL' : 'CORE_SUSPENDED'}
            </span>
          </button>

          {/* Sync Time */}
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600">
            <ClockCircle size={14} />
            <span className="text-[9px] font-mono uppercase">
              SYNC: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour12: false }) : '00:00:00'}
            </span>
          </div>
        </div>

        {/* 3. USER & THEME GROUP */}
        <div className="flex items-center gap-4 h-full">
          <ThemeToggle size="sm" />

          {/* Admin Identity Popover */}
          <AdminMenu />
        </div>

      </div>
    </div>
  );
}
