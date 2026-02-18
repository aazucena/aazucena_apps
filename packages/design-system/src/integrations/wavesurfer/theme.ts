import { colors } from '../../tokens/colors.js';
import { toHex } from '../../utils/color-converter.js';

/**
 * Wavesurfer.js Visualization Theme
 * Provides color configurations for the Waveform canvas renderer.
 */
export const wavesurferTheme = {
  /** The color of the unplayed part of the waveform. */
  waveColor: toHex(colors.zinc[700]),
  
  /** The color of the played part of the waveform. */
  progressColor: toHex(colors.primary[500]),
  
  /** The color of the playback cursor. */
  cursorColor: toHex(colors.secondary[500]),
  
  /** Ghost/Secondary waveform for comparison or background tracks. */
  ghost: {
    waveColor: toHex(colors.zinc[800]),
    progressColor: toHex(colors.zinc[600]),
  }
} as const;

export type WavesurferTheme = typeof wavesurferTheme;
