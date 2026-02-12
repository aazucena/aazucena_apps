import { useContext } from 'react';
import { PortfolioContext, type PortfolioState } from './PortfolioContext.js';

// Custom Hook
export function usePortfolio(): PortfolioState {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
