'use client';

import * as React from 'react';
import { useFormInstance } from '../utils/composables.js';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';

/**
 * ## Engineering Standards
 * - **DX Pattern:** Development-only diagnostic tool for form state visualization.
 * - **Observability:** Provides a transparent view into the headless TanStack store.
 * - **Safety:** Automatically nullifies itself in production environments.
 */

/**
 * FormDebugger
 * A high-density diagnostic overlay that visualizes the entire form state.
 * Use this during development to track values, errors, and field metadata.
 */
export function FormDebugger() {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useFormInstance() as any;

  // Safety: Only render in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-8 items-center gap-2 rounded-full border px-3 text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg",
          isOpen 
            ? "bg-cyan-500 border-cyan-400 text-black" 
            : "bg-black/80 border-white/10 text-white/50 hover:text-white hover:border-white/20"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", isOpen ? "bg-black animate-pulse" : "bg-cyan-500")} />
        Form_Inspect
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-12 right-0 w-[400px] max-h-[600px] overflow-auto rounded-2xl border border-white/10 bg-black/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <form.Subscribe>
              {(state: any) => (
                <div className="space-y-6">
                  <section>
                    <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-cyan-500">Values</h4>
                    <pre className="rounded-lg bg-white/5 p-3 text-[10px] text-white/70 font-mono leading-tight">
                      {JSON.stringify(state.values, null, 2)}
                    </pre>
                  </section>

                  <section>
                    <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Global_State</h4>
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono uppercase">
                      <div className="rounded border border-white/5 p-2 bg-white/5">
                        <span className="text-white/30 block mb-1">isDirty</span>
                        <span className={state.isDirty ? "text-amber-400" : "text-white/50"}>{String(state.isDirty)}</span>
                      </div>
                      <div className="rounded border border-white/5 p-2 bg-white/5">
                        <span className="text-white/30 block mb-1">isValid</span>
                        <span className={state.isValid ? "text-emerald-400" : "text-white/50"}>{String(state.isValid)}</span>
                      </div>
                      <div className="rounded border border-white/5 p-2 bg-white/5">
                        <span className="text-white/30 block mb-1">isSubmitting</span>
                        <span className={state.isSubmitting ? "text-cyan-400" : "text-white/50"}>{String(state.isSubmitting)}</span>
                      </div>
                      <div className="rounded border border-white/5 p-2 bg-white/5">
                        <span className="text-white/30 block mb-1">Attempts</span>
                        <span className="text-white">{state.submissionAttempts}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-500">Field_Meta</h4>
                    <div className="space-y-2">
                      {Object.entries(state.fieldMeta).map(([name, meta]: [string, any]) => (
                        <div key={name} className="rounded border border-white/5 bg-white/5 p-2 text-[9px] font-mono">
                          <div className="flex justify-between mb-1">
                            <span className="text-white font-bold">{name}</span>
                            {meta.isValidating && <span className="text-cyan-400 animate-pulse">VALIDATING...</span>}
                          </div>
                          <div className="grid grid-cols-3 gap-1 opacity-50 uppercase text-[8px]">
                            <span>Touched: {String(meta.isTouched)}</span>
                            <span>Dirty: {String(!meta.isPristine)}</span>
                            <span className={meta.errors.length > 0 ? "text-red-400 font-bold" : ""}>
                              Errors: {meta.errors.length}
                            </span>
                          </div>
                          {meta.errors.length > 0 && (
                            <div className="mt-1 text-red-400 italic">
                              ↳ {meta.errors[0]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </form.Subscribe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
