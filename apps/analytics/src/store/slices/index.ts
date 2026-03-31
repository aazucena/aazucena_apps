export * from '@aazucena/stores';

import { dashboardSlice, chatSlice } from '@aazucena/stores';
export const dashboardReducer = dashboardSlice.reducer;
export const chatReducer = chatSlice.reducer;

// Backwards-compat aliases — analytics call sites use unprefixed names
export {
  setDashboardCategoryPreset as setCategoryPreset,
  toggleDashboardLiveMode as toggleLiveMode,
  setDashboardNavMode as setNavMode,
  setDashboardSearchQuery as setSearchQuery,
  updateDashboardLastSync as updateLastSync,
  toggleDashboardCategory as toggleCategory,
  resetDashboardCategories as resetCategories,
  toggleDashboardSidebar as toggleSidebar,
} from '@aazucena/stores';

// Type aliases for ai/page.tsx compatibility
export type {
  AI_TerminalMessage as TerminalMessage,
  AI_Conversation as Conversation,
} from '@aazucena/types';
