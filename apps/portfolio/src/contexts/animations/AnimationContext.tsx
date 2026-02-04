/**
 * AnimationContext - Centralized state management for animation settings
 * Manages: device capabilities, sound settings, and performance preferences
 */

import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { DeviceCapabilities } from '~/config/animations';
import { detectDeviceCapabilities } from '~/lib/utils/animations';

const CAPABILITIES_STORAGE_KEY = "portfolioSettings";
const SOUND_STORAGE_KEY = "soundMuted";

// Types
export interface AnimationState {
  // Device Capabilities
  capabilities: DeviceCapabilities;
  updateCapabilities: (updates: Partial<DeviceCapabilities>) => void;

  // Sound Settings
  isSoundMuted: boolean;
  setIsSoundMuted: (muted: boolean) => void;
  toggleSound: () => void;

  // Mount State
  mounted: boolean;
}

// Context
export const AnimationContext = createContext<AnimationState | undefined>(undefined);

// Provider Props
interface AnimationProviderProps {
  children: ReactNode;
}

// Provider Component
export function AnimationProvider({ children }: AnimationProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [isSoundMuted, setIsSoundMutedState] = useState<boolean>(true);
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    performanceTier: "medium",
    canUseHeavyAnimations: true,
  });

  // Load capabilities from localStorage on mount
  useEffect(() => {
    setMounted(true);

    const loadCapabilities = (): DeviceCapabilities => {
      try {
        const saved = localStorage.getItem(CAPABILITIES_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validate that parsed is a plain object (not array, not null)
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            // Explicitly validate each field to prevent injection
            const isMobile = typeof parsed.isMobile === "boolean"
              ? parsed.isMobile
              : false;

            const performanceTier = ["low", "medium", "high"].includes(parsed.performanceTier)
              ? parsed.performanceTier
              : "medium";

            const canUseHeavyAnimations = typeof parsed.canUseHeavyAnimations === "boolean"
              ? parsed.canUseHeavyAnimations
              : true;

            return { isMobile, performanceTier, canUseHeavyAnimations };
          }
        }
      } catch (error) {
        console.error("Failed to load capabilities:", error);
      }

      // Detect device capabilities as fallback
      return detectDeviceCapabilities();
    };

    const loadSoundPreference = (): boolean => {
      try {
        const saved = localStorage.getItem(SOUND_STORAGE_KEY);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          // Validate that parsed is a boolean
          if (typeof parsed === "boolean") {
            return parsed;
          }
        }
      } catch (error) {
        console.error("Failed to load sound preference:", error);
      }
      return true; // Default: muted
    };

    setCapabilities(loadCapabilities());
    setIsSoundMutedState(loadSoundPreference());
  }, []);

  // Save capabilities to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(
          CAPABILITIES_STORAGE_KEY,
          JSON.stringify(capabilities),
        );
      } catch (error) {
        console.error("Failed to save capabilities:", error);
      }
    }
  }, [capabilities, mounted]);

  // Save sound preference to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(isSoundMuted));
      } catch (error) {
        console.error("Failed to save sound preference:", error);
      }
    }
  }, [isSoundMuted, mounted]);

  // Update capabilities
  const updateCapabilities = (updates: Partial<DeviceCapabilities>): void => {
    setCapabilities((prev) => ({ ...prev, ...updates }));
  };

  // Set sound muted state
  const setIsSoundMuted = (muted: boolean): void => {
    setIsSoundMutedState(muted);
  };

  // Toggle sound
  const toggleSound = (): void => {
    setIsSoundMutedState((prev) => !prev);
  };

  const value: AnimationState = {
    capabilities,
    updateCapabilities,
    isSoundMuted,
    setIsSoundMuted,
    toggleSound,
    mounted,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

// Add display name for React Fast Refresh
AnimationProvider.displayName = 'AnimationProvider';
