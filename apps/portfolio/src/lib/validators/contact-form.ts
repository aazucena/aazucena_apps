import { z } from "zod";
import { PageHeaderSchema } from "./components";

/**
 * Zod schema for Contact Form Configuration from Strapi CMS
 */
export const StrapiContactFormSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  slug: z.string().default("contact").optional(), // Navigation integration
  header: PageHeaderSchema.nullable().optional(),
  formTitle: z.string().default("Send a Message"),
  submitButtonLabel: z.string().default("Send Message"),
  successMessage: z.string().default("Message sent successfully!"),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiContactForm = z.infer<typeof StrapiContactFormSchema>;
