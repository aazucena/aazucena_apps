import { useContext } from 'react';
import { DataContext } from './DataContext';

// Custom hook with error handling
export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    // Improved error message for HMR debugging
    const isDev = (import.meta as any).env?.DEV;
    if (isDev) {
      console.error(
        '[DataContext] Component is missing DataProvider wrapper.\n' +
          'This can happen during HMR (Hot Module Reload).\n' +
          'Try refreshing the page to restore the proper context.',
      );
    }
    throw new Error(
      'useDataContext must be used within DataProvider. ' +
        (isDev ? 'Check console for details or refresh the page.' : ''),
    );
  }
  return context;
}

// Convenience hooks for specific data
export function useSectionData() {
  return useDataContext().data;
}

export function usePortfolioData() {
  return useDataContext().portfolio;
}

export function useHomepageData() {
  return useDataContext().content;
}

export function useRegistry() {
  return useDataContext().registry;
}
