import { z } from "zod";
import { ImageElementSchema } from "./components";

/**
 * Zod schema for Music Genre from Strapi CMS
 */
export const StrapiMusicGenreSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  name: z.string().max(100),
  slug: z.string(),
  description: z.string().max(500).optional().nullable(),
  icon: z.any().optional().nullable(), // icons-field
  color: z.string().optional().nullable(), // color-picker
  coverImage: ImageElementSchema.nullable().optional(),
  sort: z.number().default(0),
  // Compositions relation handled via compositions.ts or z.lazy
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiMusicGenre = z.infer<typeof StrapiMusicGenreSchema>;
