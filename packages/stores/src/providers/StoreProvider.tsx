import { createContext, useContext, useRef, type ReactNode } from 'react';

/**
 * Generic store interface
 * Compatible with Redux, Zustand, or any store with subscribe/getState
 */
export interface Store<S = any, A = any> {
  getState: () => S;
  dispatch?: (action: A) => void;
  subscribe?: (listener: () => void) => () => void;
}

/**
 * Store factory configuration
 */
export interface StoreConfig<S = any, A = any> {
  /**
   * Factory function to create store instance
   * Ensures single store instance per provider
   */
  createStore: () => Store<S, A>;

  /**
   * Optional store enhancers/middleware
   */
  onStoreCreated?: (store: Store<S, A>) => void;
}

const StoreContext = createContext<Store | null>(null);

export interface StoreProviderProps<S = any, A = any> {
  children: ReactNode;
  config: StoreConfig<S, A>;
}

/**
 * StoreProvider
 * Framework-agnostic state management provider
 * Compatible with Redux, Zustand, Jotai, or custom stores
 *
 * @example Redux
 * ```tsx
 * import { configureStore } from '@reduxjs/toolkit';
 *
 * <StoreProvider
 *   config={{
 *     createStore: () => configureStore({ reducer: rootReducer })
 *   }}
 * >
 *   <App />
 * </StoreProvider>
 * ```
 *
 * @example Zustand
 * ```tsx
 * import { create } from 'zustand';
 *
 * <StoreProvider
 *   config={{
 *     createStore: () => create((set) => ({ ... }))
 *   }}
 * >
 *   <App />
 * </StoreProvider>
 * ```
 */
export function StoreProvider<S = any, A = any>({ children, config }: StoreProviderProps<S, A>) {
  const storeRef = useRef<Store<S, A> | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = config.createStore();
    config.onStoreCreated?.(storeRef.current);
  }

  return <StoreContext.Provider value={storeRef.current || null}>{children}</StoreContext.Provider>;
}

/**
 * Hook to access store
 */
export function useStore<S = any, A = any>(): Store<S, A> {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context as Store<S, A>;
}
