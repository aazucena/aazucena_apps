'use client';

import React, { useEffect } from 'react';
import { DangerCircle } from '@aazucena/icons';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('ROOT_LAYOUT_EXCEPTION:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 gap-6">
      <DangerCircle size={40} className="text-rose-500" />
      <h1 className="text-xl font-black uppercase tracking-tight font-mono">Root Layout Error</h1>
      <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
