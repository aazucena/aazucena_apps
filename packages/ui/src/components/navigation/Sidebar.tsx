/**
 * Sidebar Component
 * Framework-agnostic collapsible navigation sidebar.
 * Controlled via props for state and routing.
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from '@aazucena/icons';
import { cn } from '@aazucena/utils';
import type { NavItem, NavMode } from '@aazucena/types';
import { IconRenderer } from '../blocks/IconRenderer.js';

interface SidebarProps {
  /** Branding logo text (e.g., AL) */
  logoText?: string;
  /** Branding title text (e.g., AZUCENA_LYTICS) */
  brandTitle?: string;
  /** Whether the sidebar is currently collapsed */
  isCollapsed: boolean;
  /** Callback for toggling collapse state */
  onToggle: () => void;
  /** Current navigation mode (e.g., SYSTEM, INTEL) */
  navMode: string;
  /** Available navigation modes */
  modes?: NavMode[];
  /** Callback for switching navigation mode */
  onModeChange?: (modeId: string) => void;
  /** Current active navigation items */
  navItems: NavItem[];
  /** The currently active path for highlighting */
  activePath?: string;
  /** Custom Link component (e.g., next/link or Astro link) */
  LinkComponent?: React.ElementType;
  /** Optional slot for content above navigation */
  topSlot?: React.ReactNode;
  /** Optional slot for content below navigation */
  bottomSlot?: React.ReactNode;
  /** Optional class name */
  className?: string;
}

export function Sidebar({
  logoText = 'AL',
  brandTitle = 'AZUCENA_LYTICS',
  isCollapsed,
  onToggle,
  navMode,
  modes = [],
  onModeChange,
  navItems,
  activePath,
  LinkComponent = 'a',
  topSlot,
  bottomSlot,
  className,
}: SidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {/* Brand / Logo Section */}
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
        <div className="bg-primary-500/10 border-primary-500/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
          <span className="text-primary-500 font-mono text-xs font-bold uppercase">{logoText}</span>
        </div>
        {!isCollapsed && (
          <span className="ml-3 truncate text-xs font-black tracking-[0.2em] text-zinc-900 uppercase dark:text-zinc-100">
            {brandTitle}
          </span>
        )}
      </div>

      {/* Mode Switcher */}
      {!isCollapsed && modes.length > 0 && (
        <div className="px-4 pt-6">
          <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900/50">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => onModeChange?.(mode.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-[10px] font-black tracking-widest uppercase transition-all outline-none',
                  navMode === mode.id
                    ? 'text-primary-500 border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
                )}
              >
                <IconRenderer icon={mode.icon} size={12} />
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top Slot (Optional) */}
      {!isCollapsed && topSlot && <div className="px-4 pt-4">{topSlot}</div>}

      {/* Navigation Links */}
      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <div className={cn('mb-2 px-3', isCollapsed ? 'text-center' : 'text-left')}>
          <span className="text-[8px] font-black tracking-[0.3em] text-zinc-400 uppercase dark:text-zinc-600">
            {isCollapsed ? 'NAV' : `${navMode}_SUBSYSTEMS`}
          </span>
        </div>
        {navItems.map((item) => {
          const isActive = activePath === item.href;

          return (
            <LinkComponent
              key={item.name}
              href={item.href}
              className={cn(
                'group flex h-10 items-center rounded-xl px-3 no-underline transition-all duration-300',
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-zinc-100 shadow-sm dark:bg-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-200',
              )}
            >
              <IconRenderer
                icon={item.icon}
                size={20}
                className={cn(
                  'shrink-0 transition-transform group-active:scale-90',
                  isActive
                    ? 'text-primary-500'
                    : 'group-hover:text-zinc-900 dark:group-hover:text-zinc-200',
                )}
              />
              {!isCollapsed && (
                <span className="ml-3 truncate text-xs font-bold tracking-wider uppercase">
                  {item.name}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div className="bg-primary-500 ml-auto h-4 w-1 rounded-full" />
              )}
            </LinkComponent>
          );
        })}
      </nav>

      {/* Footer / Toggle Section */}
      <div className="border-t border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
        {!isCollapsed && bottomSlot && <div className="mb-4 px-2">{bottomSlot}</div>}
        <button
          onClick={onToggle}
          className="flex h-10 w-full items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-all duration-300 outline-none hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 dark:text-zinc-600 dark:hover:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <div className="flex w-full items-center justify-between px-2">
              <span className="text-[10px] font-black tracking-widest uppercase italic">
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
