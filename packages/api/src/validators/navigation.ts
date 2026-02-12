import { z } from 'zod';
import type { NavigationItem } from '@aazucena/types';

// Navigation item schema (matches Strapi navigation plugin TREE format)
export const NavigationItemSchema: z.ZodType<NavigationItem> = z.object({
  id: z.number().optional(), // May not be present in tree format
  title: z.string(),
  type: z.enum(['INTERNAL', 'EXTERNAL', 'WRAPPER']),
  path: z.string().nullable(),
  externalPath: z.string().nullable().optional(),
  slug: z.string().optional(),
  external: z.boolean().optional(),
  uiRouterKey: z.string().optional(),
  menuAttached: z.boolean().default(false),
  order: z.number().default(0).optional(),
  related: z.any().optional(),
  audience: z.array(z.any()).optional(),
  // Custom fields are nested in additionalFields by the navigation plugin
  additionalFields: z
    .object({
      label: z.string().optional(), // Custom field - display text that overrides title
      icon: z.string().optional(), // Custom field
      buttonStyle: z.enum(['primary', 'secondary', 'outline']).optional(), // Render as button
      description: z.string().optional(), // Custom field
      cssClass: z.string().optional(), // Custom field
    })
    .optional(),
  items: z.lazy(() => z.array(NavigationItemSchema)).optional(), // Nested items
});

// Navigation container schema (for internal use with fallbacks)
export const NavigationSchema = z.object({
  id: z.number().default(0),
  name: z.string().default('Navigation'),
  slug: z.string(),
  visible: z.boolean().default(true),
  items: z.array(NavigationItemSchema),
});

// Strapi render response is just an array of items
export const NavigationRenderResponseSchema = z.array(NavigationItemSchema);

export type Navigation = z.infer<typeof NavigationSchema>;

// Validator function for render response (returns array of items)
export function validateNavigationRender(data: unknown): NavigationItem[] {
  return NavigationRenderResponseSchema.parse(data);
}

// Validator function for full navigation container
export function validateNavigation(data: unknown): Navigation {
  return NavigationSchema.parse(data);
}
