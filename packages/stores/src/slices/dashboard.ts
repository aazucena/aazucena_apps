import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
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

export interface DashboardSliceConfig {
  /** Override category preset definitions */
  categoryPresets?: Record<string, string[]>;
  /** Initial navigation mode */
  defaultNavMode?: string;
  /** Initial active tab identifier */
  defaultActiveTab?: string;
  /** Initial refresh interval in milliseconds */
  defaultRefreshInterval?: number;
}

/**
 * createDashboardSlice - Factory for the dashboard Redux slice.
 * Allows configuring initial values so multiple apps can share
 * the same slice without hardcoded defaults.
 *
 * @example
 * // Zero-config (analytics app defaults)
 * const slice = createDashboardSlice();
 *
 * // Custom app
 * const slice = createDashboardSlice({
 *   defaultNavMode: 'OVERVIEW',
 *   defaultActiveTab: 'metrics',
 *   defaultRefreshInterval: 10000,
 * });
 */
export function createDashboardSlice(config?: DashboardSliceConfig) {
  const initialState: Dashboard_State = {
    filters: {
      timeRange: '24h',
      startDate: null,
      endDate: null,
      searchQuery: '',
      visibleCategories: (config?.categoryPresets?.OVERVIEW ??
        CATEGORY_PRESETS.OVERVIEW) as string[],
    },
    ui: {
      isSidebarCollapsed: false,
      navMode: config?.defaultNavMode ?? 'SYSTEM',
      activeTab: config?.defaultActiveTab ?? 'overview',
      refreshInterval: config?.defaultRefreshInterval ?? 30000,
    },
    status: {
      isLive: false,
      lastUpdated: null,
    },
  };

  return createSlice({
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
        state.ui.refreshInterval = state.status.isLive
          ? (config?.defaultRefreshInterval ?? 30000) // 30s (was 5s — too aggressive)
          : 0;
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
      /** Sets the navigation mode */
      setDashboardNavMode: (state, action: PayloadAction<string>) => {
        state.ui.navMode = action.payload;
      },
      /** Sets the active dashboard tab */
      setDashboardActiveTab: (state, action: PayloadAction<string>) => {
        state.ui.activeTab = action.payload;
      },
    },
  });
}

// Default export — zero-config for backwards compatibility
export const dashboardSlice = createDashboardSlice();

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
