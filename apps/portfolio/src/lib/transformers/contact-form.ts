import type { StrapiContactForm } from '../validators/contact-form';
import { transformPageHeader } from './utils';

export interface ContactFormConfig {
  header?: ReturnType<typeof transformPageHeader>;
  formTitle: string;
  submitButtonLabel: string;
  successMessage: string;
}

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