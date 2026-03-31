'use client';
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store';
import { CHAT_STORAGE_KEY, hydrateFromStorage } from '@aazucena/stores';

export default function ReduxStoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Hydrate chat state from localStorage after mount — runs client-only, after hydration
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved && storeRef.current) {
      try {
        storeRef.current.dispatch(hydrateFromStorage(JSON.parse(saved)));
      } catch {
        // Ignore corrupted storage
      }
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
