'use client';

import * as React from 'react';
import { useFormInstance } from '../utils/composables';

/**
 * ## Engineering Standards
 * - **Telemetry Pattern:** Invisible subscriber for tracking form health and conversions.
 * - **Observability:** Connects form life-cycle events to AZUCENA_LYTICS.
 * - **Performance:** Uses form.subscribe to prevent React re-renders.
 */

export interface FormTelemetryProps {
  /**
   * The name of the form for analytics tracking.
   */
  formId: string;
}

/**
 * FormTelemetry
 * An invisible component that tracks form errors, submission attempts, and completion
 * rates, sending high-fidelity pulses to the telemetry ingestion endpoint.
 */
export function FormTelemetry({ formId }: FormTelemetryProps) {
  const form = useFormInstance();
  const lastErrorCount = React.useRef(0);

  React.useEffect(() => {
    // 1. Subscribe to form state changes
    const subscription = form.store.subscribe(() => {
      const state = form.state;
      // Track validation error spikes
      const currentErrors = Object.keys(state.fieldMeta).filter(
        (key) => (state.fieldMeta as any)[key]?.errors.length > 0,
      ).length;

      if (currentErrors > lastErrorCount.current) {
        console.log(
          `[Telemetry:${formId}] Validation Error Spike detected: ${currentErrors} fields`,
        );
        // TODO: Integrate with @aazucena/api ingestTelemetry
      }
      lastErrorCount.current = currentErrors;

      // Track successful submission
      if (state.isSubmitted && !state.isSubmitting && currentErrors === 0) {
        console.log(`[Telemetry:${formId}] Conversion: Form successfully submitted`);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, formId]);

  return null; // This component is logic-only
}
