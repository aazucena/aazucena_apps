import { useState } from 'react';
import { fetchStrapi } from '@aazucena/api';
import type { AnyFormData } from '../schemas/index.js';

/**
 * Hook for handling form submission to Strapi
 */
export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submitForm(data: AnyFormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Post to the 'form-submissions' collection in Strapi
      await fetchStrapi('form-submissions', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            ...data,
            submittedAt: new Date().toISOString(),
            rawMessage: data.message,
            // Additional system metadata can be added here or via server-side middleware
          },
        }),
      });

      setSuccess(true);
    } catch (err) {
      console.error('[FormSubmit] Error submitting form:', err);
      setError('Failed to submit form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitForm,
    isSubmitting,
    error,
    success,
    reset: () => {
      setSuccess(false);
      setError(null);
    },
  };
}
