'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Home, Activity, DangerTriangle } from '@mynaui/icons-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function NotFound() {
  const isCollapsed = useSelector((state: RootState) => state.dashboard.ui.isSidebarCollapsed);
  return (
    <>
      {/* 1. ATMOSPHERIC DECORATION */}
      <div
        className={`absolute mx-auto inset-0 z-0 overflow-hidden pointer-events-none opacity-50 max-w-7xl right-0 ${isCollapsed ? 'left-16' : 'left-64'}`}
      >
        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.02] dark:opacity-[0.05] whitespace-nowrap">
          <span className="text-[25rem] font-black uppercase tracking-tighter italic font-mono">
            LOST
          </span>
        </div>
      </div>
      <main className="max-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500">
        {/* 2. CONTENT CONTAINER */}
        <div className="max-w-3xl mx-auto px-6 py-16 text-center relative z-10">
          {/* 404 Visual Indicator */}
          <div className="mb-12 relative inline-block group">
            <div className="absolute inset-0 bg-primary-500/20 blur-[80px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative">
              <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-zinc-900 dark:text-zinc-100 drop-shadow-2xl font-mono">
                404
              </h1>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-secondary-500 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em] shadow-xl rotate-[-2deg] flex items-center gap-2 whitespace-nowrap">
                <DangerTriangle size={14} />
                SIGNAL_LINK_SEVERED
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-6 mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">
              Trace_Lost: <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                Node Not Found
              </span>
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed font-mono uppercase tracking-wider">
              The requested telemetry node has drifted into deep space. Re-establish connection to
              mission control.
            </p>
          </div>

          {/* Action Interface */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-600 dark:hover:bg-white transition-all shadow-xl active:scale-95 group"
            >
              <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Back_To_Overview
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Retrace_Path
            </button>
          </div>

          {/* Diagnostic Beacon */}
          <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Compass size={14} className="text-primary-500 animate-[spin_10s_linear_infinite]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 font-mono">
                Diagnostic_Beacon
              </h3>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
              {[
                { label: 'Overview', href: '/' },
                { label: 'Audio', href: '/music' },
                { label: 'Telemetry', href: '/logs' },
                { label: 'Integrity', href: '/performance' },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors relative group font-mono"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary-500 transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
