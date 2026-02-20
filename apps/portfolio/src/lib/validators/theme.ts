import { z } from "zod";
import { ThemeModeEnum } from "./enums";

/**
 * Validator for color-picker custom field
 */
const ColorPickerSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

/**
 * Zod schema for Theme & Branding from Strapi CMS
 */
export const StrapiThemeSchema = z.object({
  id: z.number(),
  documentId: z.string().optional(),
  mode: ThemeModeEnum,
  primaryColor: ColorPickerSchema,
  primaryColorDark: ColorPickerSchema,
  secondaryColor: ColorPickerSchema,
  secondaryColorDark: ColorPickerSchema,
  accentColor: ColorPickerSchema,
  accentColorDark: ColorPickerSchema,
  fontSans: z.string().max(100).default("Fira Sans"),
  fontSerif: z.string().max(100).default("Fira Sans"),
  fontHeading: z.string().max(100).default("Fira Sans"),
  fontCode: z.string().max(100).default("Fira Code"),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  locale: z.string().optional(),
});

export type StrapiTheme = z.infer<typeof StrapiThemeSchema>;
