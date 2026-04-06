/**
 * Contexts Index
 * Portfolio-specific data contexts (AnimationContext + PortfolioContext live in @aazucena/context)
 */

// Data Context — portfolio-specific section-based data shape
export { DataProvider } from "./DataContext";
export {
  useDataContext,
  useSectionData,
  usePortfolioData,
  useHomepageData,
  useRegistry,
} from "./useDataContext";
