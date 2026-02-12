import type { StrapiContactForm } from '../validators/contact-form.js';
import { transformPageHeader } from '@aazucena/utils';
import type { ContactFormConfig } from '@aazucena/types';

export const DEFAULT_CONTACT_FORM: ContactFormConfig = {
  formTitle: 'Send a Message',
  submitButtonLabel: 'Send Message',
  successMessage: 'Message sent successfully!',
};

export function transformContactForm(data: StrapiContactForm): ContactFormConfig {
  if (!data) return DEFAULT_CONTACT_FORM;

  return {
    header: transformPageHeader(data.header),
    formTitle: data.formTitle,
    submitButtonLabel: data.submitButtonLabel,
    successMessage: data.successMessage,
  };
}
