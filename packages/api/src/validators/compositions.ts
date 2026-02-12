import { z } from 'zod';
import { AudioMetadataSchema, StrapiMediaSchema, StreamingLinkSchema } from './components.js';
import { StrapiMusicGenreSchema } from './music-genre.js';

/**
 * Zod validation schema for Strapi Composition content type
 */
export const StrapiCompositionSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  title: z.string().max(200),
  slug: z.string(),
  description: z.any().nullable().optional(), // Richtext
  audioFile: StrapiMediaSchema,
  coverArt: StrapiMediaSchema.nullable().optional(),
  audioMetadata: AudioMetadataSchema,
  genres: z.array(z.lazy(() => StrapiMusicGenreSchema)).optional(),
  releaseDate: z.string(), // ISO date string
  featured: z.boolean().default(false),
  isFreeDownload: z.boolean().default(false),
  collaborators: z.array(z.string()).optional(), // sortable-list custom field
  lyrics: z.any().nullable().optional(), // Richtext
  streamingLinks: z.array(StreamingLinkSchema).optional(),
  playCount: z.number().default(0),
  downloadCount: z.number().default(0),

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export const StrapiCompositionsResponseSchema = z.object({
  data: z.array(StrapiCompositionSchema),
  meta: z
    .object({
      pagination: z
        .object({
          page: z.number(),
          pageSize: z.number(),
          pageCount: z.number(),
          total: z.number(),
        })
        .optional(),
    })
    .optional(),
});

export type StrapiComposition = z.infer<typeof StrapiCompositionSchema>;
export type StrapiCompositionsResponse = z.infer<typeof StrapiCompositionsResponseSchema>;
