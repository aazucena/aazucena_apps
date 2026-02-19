'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Refresh, Home, DangerCircle, Terminal, Activity } from '@mynaui/icons-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isCollapsed = useSelector((state: RootState) => state.dashboard.ui.isSidebarCollapsed);
  useEffect(() => {
    // Log the error to an analytics service
    console.error('CRITICAL_SYSTEM_EXCEPTION:', error);
  }, [error]);

  return (
    <>
      {/* 1. ATMOSPHERIC DECORATION */}
      <div
        className={`absolute mx-auto inset-0 z-0 overflow-hidden pointer-events-none opacity-50 max-w-7xl right-0 ${isCollapsed ? 'left-16' : 'left-64'}`}
      >
        {/* Glitchy Watermark Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.02] dark:opacity-[0.05] whitespace-nowrap">
          <span className="text-[25rem] font-black uppercase tracking-tighter italic font-mono animate-pulse">
            FAULT
          </span>
        </div>
      </div>
      <main className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-white dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 transition-colors duration-500 text-center">
        {/* 2. CONTENT CONTAINER */}
        <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
          {/* 500 Visual Indicator */}
          <div className="mb-12 relative inline-block group">
            <div className="absolute inset-0 bg-secondary-500/20 blur-[80px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative">
              <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-zinc-900 dark:text-zinc-100 drop-shadow-2xl font-mono">
                500
              </h1>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-secondary-600 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em] shadow-xl rotate-[2deg] flex items-center gap-2 whitespace-nowrap border border-secondary-400/30">
                <DangerCircle size={14} className="animate-pulse" />
                CORE_INTEGRITY_FAILURE
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">
              Critical <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-rose-600">
                Kernel Panic
              </span>
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed font-mono uppercase tracking-wider">
              An unexpected exception has occurred within the core runtime. Attempting to isolate
              the fault.
            </p>
          </div>

          {/* Debug Trace (Dev Mode Logic) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-12 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-left overflow-auto max-h-64 scrollbar-thin scrollbar-thumb-zinc-800">
              <div className="flex items-center gap-2 mb-4 text-secondary-500">
                <Terminal size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest font-mono">
                  Trace_Log
                </span>
              </div>
              <pre className="text-[10px] text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
                {error.stack || error.message}
              </pre>
            </div>
          )}

          {/* Action Interface */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-secondary-600 dark:hover:bg-white transition-all shadow-xl active:scale-95 group"
            >
              <Refresh
                size={16}
                className="group-hover:rotate-180 transition-transform duration-700"
              />
              Reboot_Node
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95 group"
            >
              <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Return_To_Deck
            </Link>
          </div>

          {/* Status Broadcast */}
          <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-secondary-500 animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 font-mono">
                  Incident_Protocol_Active
                </h3>
              </div>
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-700 uppercase tracking-[0.2em] max-w-xs leading-relaxed font-mono">
                Diagnostic data has been dispatched to the engineering deck. Auto-recovery sequence
                initialized.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
