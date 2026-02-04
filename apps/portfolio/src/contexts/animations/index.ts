/**
 * Contexts Index
 * Centralized exports for all animation contexts
 */

// Portfolio Context
export { PortfolioProvider, type PortfolioState } from "./PortfolioContext";
export { usePortfolio } from "./usePortfolio";

// Animation Context
export { AnimationProvider, type AnimationState } from "./AnimationContext";
export { useAnimation } from "./useAnimation";

// Data Context
export { DataProvider } from "./DataContext";
export {
  useDataContext,
  useSectionData,
  usePortfolioData,
  useHomepageData,
  useRegistry,
} from "./useDataContext";
