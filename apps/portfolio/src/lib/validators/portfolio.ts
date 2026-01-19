import { z } from 'zod';

export const StrapiPortfolioSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),

  // Core fields
  fullName: z.string().max(100),
  occupation: z.string().max(200),
  profileImage: z
    .object({
      src: z.any(),
      altText: z.string(),
    })
    .nullable()
    .optional(),
  resumeFile: z.any().optional(),
  bio: z.any().nullable().optional(), // Richtext field

  // Contact information (NEW)
  email: z.string().email(), // Required
  emailDescription: z.string().max(200).nullable().optional(), // Custom description for email link
  phone: z.string().nullable().optional(), // Custom field (plugin::strapi-phone-validator-5.phone)
  preferredContactMethod: z.array(z.string()).optional(), // Custom checkbox field (plugin::advanced-fields.checkbox)

  // Social & Online Presence (matches shared.social-links component)
  socialLinks: z
    .array(
      z.object({
        id: z.number().optional(), // Strapi auto-ID
        platform: z.enum([
          'GitHub',
          'LinkedIn',
          'Twitter',
          'YouTube',
          'Instagram',
          'Facebook',
          'TikTok',
          'Discord',
          'Twitch',
          'Mastodon',
        ]),
        url: z.string().max(500),
        icon: z.string().nullable().optional(), // icons-field plugin (Strapi returns null if empty)
        text: z.string().max(100).nullable().optional(), // Strapi returns null if empty
        description: z.string().max(200).nullable().optional(), // Custom description (Strapi returns null if empty)
        openInNewTab: z.boolean().nullable().optional(), // Strapi returns null if empty
      })
    )
    .optional(),

  // Professional Information
  yearsOfExperience: z.number().nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        field: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string().optional(),
        grade: z.string().optional(),
      })
    )
    .optional(),

  // AI/ML fields (for pgVector embeddings)
  bioEmbedding: z.any().optional(),
  bioEmbeddingModel: z.string().max(50).nullable().optional(),
  bioEmbeddingGeneratedAt: z.string().nullable().optional(),

  // Strapi metadata
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiPortfolio = z.infer<typeof StrapiPortfolioSchema>;
