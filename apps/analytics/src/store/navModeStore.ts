// apps/analytics/src/store/navModeStore.ts

// --- Local Storage Store for navMode ---
export type NavMode = 'SYSTEM' | 'INTELLIGENCE';
const NAV_MODE_STORAGE_KEY = 'navMode';

// State to manage listeners for useSyncExternalStore
let listeners: Array<() => void> = [];

/**
 * Function to get the current value from localStorage.
 * Used by useSyncExternalStore's getSnapshot.
 */
function getSnapshot(): NavMode {
  if (typeof window === 'undefined') {
    return 'SYSTEM'; // Default for SSR
  }
  try {
    const stored = localStorage.getItem(NAV_MODE_STORAGE_KEY);
    if (stored === 'SYSTEM' || stored === 'INTELLIGENCE') {
      return stored;
    }
  } catch (e) {
    console.error('[navModeStore] Failed to read from localStorage', e);
  }
  return 'SYSTEM';
}

/**
 * Function to subscribe to changes.
 * Used by useSyncExternalStore.
 */
function subscribe(callback: () => void) {
  listeners = [...listeners, callback];

  // Also listen for storage changes from other tabs/windows
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === NAV_MODE_STORAGE_KEY) callback();
    });
  }

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback);
    }
  };
}

/**
 * Function to update the navMode and notify all subscribers.
 */
function set(mode: NavMode) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(NAV_MODE_STORAGE_KEY, mode);
      // Notify all subscribers (trigger re-render in components using useSyncExternalStore)
      listeners.forEach((l) => l());
    } catch (e) {
      console.error('[navModeStore] Failed to write to localStorage', e);
    }
  }
}

/**
 * Function to get the current value for server-side rendering.
 */
function getServerSnapshot(): NavMode {
  return 'SYSTEM';
}

export const navModeStore = {
  getSnapshot,
  getServerSnapshot,
  subscribe,
  set,
};
