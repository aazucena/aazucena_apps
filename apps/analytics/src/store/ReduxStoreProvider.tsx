'use client';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store';
import { CHAT_STORAGE_KEY, hydrateFromStorage } from '@aazucena/stores';

export default function ReduxStoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    // Hydrate chat state from localStorage after mount — runs client-only, after hydration
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        store.dispatch(hydrateFromStorage(JSON.parse(saved)));
      } catch {
        // Ignore corrupted storage
      }
    }
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
