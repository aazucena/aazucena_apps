/**
 * useDeviceCapabilities Hook
 * Detects and manages device capabilities with localStorage persistence
 */

import { useState, useEffect } from 'react';
import type { DeviceCapabilities } from '@aazucena/types';
import { detectDeviceCapabilities } from '@aazucena/utils';
import { STORAGE_KEYS } from '@aazucena/constants';

const STORAGE_KEY = STORAGE_KEYS.USER_PREFERENCES;

export function useDeviceCapabilities(): {
  capabilities: DeviceCapabilities;
  updateCapabilities: (capabilities: Partial<DeviceCapabilities>) => void;
  mounted: boolean;
} {
  const [mounted, setMounted] = useState(false);
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    performanceTier: 'medium',
    canUseHeavyAnimations: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true);

    const loadSettings = (): DeviceCapabilities => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return {
              isMobile: parsed.isMobile ?? false,
              performanceTier: ['low', 'medium', 'high'].includes(parsed.performanceTier)
                ? parsed.performanceTier
                : 'medium',
              canUseHeavyAnimations: parsed.canUseHeavyAnimations ?? true,
            };
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }

      // Detect device capabilities as fallback
      return detectDeviceCapabilities();
    };

    setCapabilities(loadSettings());
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(capabilities));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  }, [capabilities, mounted]);

  const updateCapabilities = (updates: Partial<DeviceCapabilities>) => {
    setCapabilities((prev) => ({ ...prev, ...updates }));
  };

  return { capabilities, updateCapabilities, mounted };
}
