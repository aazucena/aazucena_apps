'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle,
  ShieldCheck,
  Key,
  Cog as Settings,
  Power,
  Activity,
  Bell,
} from '@mynaui/icons-react';
import { cn } from '@/lib/utils';

export function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Security Audit', sub: 'SEC_LEVEL_4', icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Access Keys', sub: 'TRC_KEY_MGMT', icon: Key, color: 'text-primary-500' },
    { label: 'Alert Config', sub: 'INT_NOTIF_v2', icon: Bell, color: 'text-secondary-500' },
    { label: 'System Prefs', sub: 'CORE_HYPER_v1', icon: Settings, color: 'text-zinc-400' },
  ];

  return (
    <div className="relative h-full flex items-center">
      {/* Trigger: The Identity Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-4 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
            >
              {/* Menu Header */}
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

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group text-left"
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform',
                        item.color,
                      )}
                    >
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
                        {item.label}
                      </div>
                      <div className="text-[9px] font-mono text-zinc-400 dark:text-zinc-600 uppercase">
                        {item.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Footer */}
              <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-500/20 transition-all">
                  <Power size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Terminate_Session
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
