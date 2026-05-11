import { useContext } from 'react';
import { AnimationContext, type AnimationState } from './AnimationContext';

// Custom Hook
export function useAnimation(): AnimationState {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
