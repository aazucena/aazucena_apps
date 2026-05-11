'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  ConfirmationModal,
  type ConfirmationModalOptions,
} from '@/components/common/ConfirmationModal';

// --- Context ---

interface ConfirmationContextValue {
  confirm: (options: ConfirmationModalOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

// --- Provider ---

export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<ConfirmationModalOptions | null>(null);

  const confirm = useCallback((options: ConfirmationModalOptions) => {
    setPending(options);
  }, []);

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        options={pending}
      />
    </ConfirmationContext.Provider>
  );
}

// --- Hook ---

export function useConfirmation() {
  const ctx = useContext(ConfirmationContext);
  if (!ctx) throw new Error('useConfirmation must be used within ConfirmationProvider');
  return ctx;
}
