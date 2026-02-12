/**
 * AdminMenu Component
 * Framework-agnostic identity management and quick-action popover.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Power, Activity } from '@aazucena/icons';
import { cn } from '@aazucena/utils';

export interface AdminMenuItem {
  label: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  href?: string;
  onClick?: () => void;
}

export interface AdminUser {
  name: string;
  role: string;
  id: string;
}

interface AdminMenuProps {
  /** Admin user data */
  user: AdminUser;
  /** List of administrative menu items */
  items: AdminMenuItem[];
  /** Optional callback for session termination */
  onLogout?: () => void;
  /** Custom Link component (e.g., next/link or Astro link) */
  LinkComponent?: React.ElementType;
  /** Optional class name */
  className?: string;
}

export function AdminMenu({
  user,
  items,
  onLogout,
  LinkComponent = 'a',
  className,
}: AdminMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative flex h-full items-center', className)}>
      {/* Trigger: The Identity Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-8 items-center gap-3 border-none bg-transparent pl-2 transition-all outline-none"
        aria-label="Toggle admin menu"
      >
        <div className="hidden text-right sm:block">
          <div className="group-hover:text-primary-500 text-[10px] leading-none font-black tracking-tight text-zinc-900 uppercase transition-colors dark:text-zinc-100">
            {user.name}
          </div>
          <div className="text-primary-600 mt-1 font-mono text-[8px] font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100">
            {user.role}
          </div>
        </div>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border bg-zinc-100 text-zinc-400 shadow-sm transition-all dark:bg-zinc-900 dark:text-zinc-500 dark:shadow-inner',
            isOpen
              ? 'border-primary-500/50 ring-primary-500/10 ring-2'
              : 'border-zinc-200 dark:border-zinc-800',
          )}
        >
          <UserCircle size={20} className={cn(isOpen && 'text-primary-500')} />
        </div>
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              role="presentation"
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 z-50 mt-4 w-64 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Menu Header */}
              <div className="border-b border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-500/10 border-primary-500/20 text-primary-500 flex h-10 w-10 items-center justify-center rounded-xl border">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="text-left text-xs font-black tracking-tighter text-zinc-900 uppercase dark:text-zinc-100">
                      Session_Identity
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500">{user.id}</div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {items.map((item) => {
                  const content = (
                    <div className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 transition-transform group-hover:scale-110 dark:border-zinc-800 dark:bg-zinc-950',
                          item.color,
                        )}
                      >
                        <item.icon size={16} />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold tracking-tight text-zinc-900 uppercase dark:text-zinc-100">
                          {item.label}
                        </div>
                        {item.sub && (
                          <div className="font-mono text-[9px] text-zinc-400 uppercase dark:text-zinc-600">
                            {item.sub}
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  if (item.href) {
                    return (
                      <LinkComponent
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block no-underline"
                      >
                        {content}
                      </LinkComponent>
                    );
                  }

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                      className="w-full border-none bg-transparent p-0 outline-none"
                    >
                      {content}
                    </button>
                  );
                })}
              </div>

              {/* Action Footer */}
              {onLogout && (
                <div className="border-t border-zinc-100 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="bg-secondary-500/10 border-secondary-500/20 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-500/20 flex w-full items-center justify-center gap-2 rounded-2xl border p-3 transition-all outline-none"
                  >
                    <Power size={16} />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                      Terminate_Session
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
