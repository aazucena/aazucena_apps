import { atom, map } from 'nanostores';

/**
 * Interactions Store
 * Tracks user interactions with specific 3D objects or UI elements
 * for challenges, easter eggs, and analytics.
 */

// Map of interaction IDs to completion status/count
export const interactionsStore = map<Record<string, boolean>>({});

// The ID of the current active challenge target
export const activeChallengeTargetStore = atom<string | null>(null);

/**
 * Mark an interaction as completed
 */
export function trackInteraction(id: string) {
  interactionsStore.setKey(id, true);
}

/**
 * Reset all or specific interactions
 */
export function resetInteractions(ids?: string[]) {
  if (!ids) {
    interactionsStore.set({});
  } else {
    ids.forEach((id) => interactionsStore.setKey(id, false));
  }
}

/**
 * Set the target for an active challenge
 */
export function setActiveChallengeTarget(id: string | null) {
  activeChallengeTargetStore.set(id);
}
