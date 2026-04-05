/**
 * Journey Components Index
 * Re-exports journey components from their new organized locations
 *
 * Main component stays here, subcomponents moved to:
 * - UI: ~/components/ui/journey
 * - Visualizations: ~/components/visualizations/journey
 * - Transformers: ~/lib/transformers/journey
 * - Utils: ~/lib/utils/journey
 * - Store: ~/store/journey
 */

// Main journey dashboard component (stays in this directory)
export { JourneyDashboard } from "./JourneyDashboard";

// Re-export from new locations for backward compatibility
export * from "~/components/ui/journey";
export * from "~/components/visualizations/journey";
export * from "~/lib/transformers/journey";
export * from "~/store/journey";
