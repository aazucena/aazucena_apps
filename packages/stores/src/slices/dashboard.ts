import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Dashboard_State, Telemetry_TimeRange } from '@aazucena/types';

// Define standard presets
export const CATEGORY_PRESETS = {
  OVERVIEW: ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'],
  MUSIC: ['Music Play'],
  PERFORMANCE: ['Error', 'Interaction', 'API', 'Database', 'Cache'],
  LOGS: ['Page View', 'Music Play', 'Interaction', 'Form Submit', 'Error'],
  SYSTEM: ['Page View', 'Interaction', 'Error', 'API'],
  INTELLIGENCE: ['Interaction', 'Error', 'API', 'Database'],
} as const;

export type CategoryPreset = keyof typeof CATEGORY_PRESETS;

const initialState: Dashboard_State = {
  filters: {
    timeRange: '24h',
    startDate: null,
    endDate: null,
    searchQuery: '',
    visibleCategories: CATEGORY_PRESETS.OVERVIEW as unknown as string[],
  },
  ui: {
    isSidebarCollapsed: false,
    navMode: 'SYSTEM',
    activeTab: 'overview',
    refreshInterval: 5000,
  },
  status: {
    isLive: true,
    lastUpdated: null,
  },
};

/**
 * [Slice] : Dashboard_Intelligence_State
 * Manages global telemetry filters, UI state, and system status.
 * Standardized for use across all workspace applications.
 */
export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    /** Sets the global time range for telemetry queries */
    setDashboardTimeRange: (state, action: PayloadAction<Telemetry_TimeRange>) => {
      state.filters.timeRange = action.payload;
    },
    /** Sets the global search query for log filtering */
    setDashboardSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    /** Toggles the sidebar expansion state */
    toggleDashboardSidebar: (state) => {
      state.ui.isSidebarCollapsed = !state.ui.isSidebarCollapsed;
    },
    /** Toggles live polling mode */
    toggleDashboardLiveMode: (state) => {
      state.status.isLive = !state.status.isLive;
      state.ui.refreshInterval = state.status.isLive ? 5000 : 0;
    },
    /** Updates the last successful sync timestamp */
    updateDashboardLastSync: (state) => {
      state.status.lastUpdated = new Date().toISOString();
    },
    /** Toggles a specific telemetry category visibility */
    toggleDashboardCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.filters.visibleCategories.includes(category)) {
        state.filters.visibleCategories = state.filters.visibleCategories.filter(
          (c) => c !== category,
        );
      } else {
        state.filters.visibleCategories.push(category);
      }
    },
    /** Resets visible categories to a specific list */
    resetDashboardCategories: (state, action: PayloadAction<string[]>) => {
      state.filters.visibleCategories = action.payload;
    },
    /** Applies a category preset */
    setDashboardCategoryPreset: (state, action: PayloadAction<CategoryPreset>) => {
      const preset = CATEGORY_PRESETS[action.payload];
      if (preset) {
        state.filters.visibleCategories = [...preset];
      }
    },
    /** Switches between SYSTEM and INTELLIGENCE navigation modes */
    setDashboardNavMode: (state, action: PayloadAction<'SYSTEM' | 'INTELLIGENCE'>) => {
      state.ui.navMode = action.payload;
    },
    /** Sets the active dashboard tab */
    setDashboardActiveTab: (state, action: PayloadAction<string>) => {
      state.ui.activeTab = action.payload;
    },
  },
});

export const {
  setDashboardTimeRange,
  setDashboardSearchQuery,
  toggleDashboardSidebar,
  toggleDashboardLiveMode,
  updateDashboardLastSync,
  resetDashboardCategories,
  toggleDashboardCategory,
  setDashboardCategoryPreset,
  setDashboardNavMode,
  setDashboardActiveTab,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
