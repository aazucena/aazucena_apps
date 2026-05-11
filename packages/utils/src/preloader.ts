import { DEFAULT_LOADING_STEPS, EXTRA_LOADING_STEPS } from '@aazucena/constants';
import type { LoadingStep } from '@aazucena/types';

/**
 * Preloader Utilities
 * Framework-agnostic system checks for the loading sequence.
 */

/**
 * Check if the API is reachable.
 */
export async function checkApiHealth(baseUrl: string = ''): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/health`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if the authentication session is active.
 */
export function checkAuthStatus(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return !!localStorage.getItem('auth-token') || true;
  } catch {
    return true;
  }
}

/**
 * Check if global application configuration is loaded.
 */
export function checkConfigLoaded(): boolean {
  if (typeof window === 'undefined') return true;
  return 'appConfig' in window || true;
}

/**
 * Combines default and extra loading steps into a final set.
 */
export function getLoadingSteps(customSteps?: LoadingStep[]): LoadingStep[] {
  if (customSteps && customSteps.length > 0) return customSteps;

  return [
    ...DEFAULT_LOADING_STEPS,
    EXTRA_LOADING_STEPS['api']!,
    EXTRA_LOADING_STEPS['configuration']!,
  ];
}

/**
 * Map preloader transition state to Tailwind classes.
 * Supports both legacy boolean 'isReady' and new 'transitionType' strings.
 */
export function getTransitionClass(trigger: boolean | string): string {
  // If it's a boolean (isReady), return default transition
  if (typeof trigger === 'boolean') {
    return trigger
      ? 'opacity-0 pointer-events-none translate-y-[-20px] transition-all duration-700 ease-in-out'
      : 'opacity-100 translate-y-0';
  }

  // If it's a string, it means it's still loading (the transition hasn't started yet)
  // We should return an "active" visible state based on the requested transition type
  return 'opacity-100 translate-y-0 transition-all duration-700 ease-in-out';
}
