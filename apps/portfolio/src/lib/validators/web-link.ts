/**
 * Zod validator for shared.web-link component
 * Validates web links with optional icons and descriptions
 */

import { z } from 'zod';

/**
 * Schema for shared.web-link component
 * Used by: Education, Experience, Project
 */
export const WebLinkSchema = z.object({
  id: z.number().optional(),
  text: z.string().max(200),
  url: z.string().url().max(255),
  openInNewTab: z.boolean().default(true),
  icon: z
    .object({
      name: z.string().optional(),
      family: z.string().optional(),
    })
    .optional()
    .nullable(),
  description: z.string().optional().nullable(),
});

export const WebLinkArraySchema = z.array(WebLinkSchema).default([]);

export type WebLink = z.infer<typeof WebLinkSchema>;
