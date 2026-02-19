import { configureStore } from '@reduxjs/toolkit';
import { dashboardReducer, chatReducer } from './slices';

export const makeStore = () => {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      chat: chatReducer,
      // Add other slices here (e.g., filters, user preferences)
    },
  });
};

export * from './slices';
export { default as ReduxStoreProvider } from '@/store/ReduxStoreProvider';

// Infer the types for TypeScript safety
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
