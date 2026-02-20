import { z } from "zod";
import { LoadingStepSchema, CTAButtonSchema } from "./components";
import {
  PreloaderThemeEnum,
  PreloaderVariantEnum,
  TransitionTypeEnum,
  AriaLiveEnum,
} from "./enums";

export type { LoadingStep } from "./components";

const StrapiThemeOverridesSchema = z
  .object({
    colors: z
      .object({
        primary: z.string().optional(),
        primaryForeground: z.string().optional(),
        secondary: z.string().optional(),
        secondaryForeground: z.string().optional(),
        success: z.string().optional(),
        successForeground: z.string().optional(),
        error: z.string().optional(),
        errorForeground: z.string().optional(),
        background: z.string().optional(),
        backgroundGradient: z.string().optional(),
        cardBackground: z.string().optional(),
        overlayBackground: z.string().optional(),
        foreground: z.string().optional(),
        mutedForeground: z.string().optional(),
        accent: z.string().optional(),
        accentForeground: z.string().optional(),
        border: z.string().optional(),
      })
      .optional(),
    effects: z
      .object({
        backdropBlur: z.string().optional(),
        cardBlur: z.string().optional(),
        shadow: z.string().optional(),
        glowColor: z.string().optional(),
        borderRadius: z
          .object({
            card: z.string().optional(),
            button: z.string().optional(),
            badge: z.string().optional(),
            progress: z.string().optional(),
          })
          .optional(),
        animationSpeed: z.number().min(0.5).max(2.0).optional(),
        animationEasing: z.string().optional(),
      })
      .optional(),
    typography: z
      .object({
        titleSize: z.string().optional(),
        titleWeight: z.string().optional(),
        subtitleSize: z.string().optional(),
        fontFamily: z.string().optional(),
      })
      .optional(),
    customClass: z.string().optional(),
  })
  .optional();

export const StrapiPreloaderConfigSchema = z
  .object({
    id: z.number().optional(),
    enabled: z.boolean(),
    variant: PreloaderVariantEnum,
    theme: PreloaderThemeEnum,

    title: z.string().max(100),
    subtitle: z.string().max(150).nullable().optional(),
    readyTitle: z.string().max(100),
    readySubtitle: z.string().max(150),
    readyFooterNote: z.string().max(150).nullable().optional(),

    continueButton: CTAButtonSchema,

    minDisplayTime: z.number().int().min(500).max(10000),
    maxDisplayTime: z.number().int().min(1000).max(30000),
    animationDuration: z.number().int().min(100).max(2000),

    autoStart: z.boolean(),
    enableSkip: z.boolean(),
    showOnce: z.boolean(),
    lazyLoad: z.boolean(),
    preloadAssets: z.boolean(),
    enableAnimations: z.boolean(),

    transitionType: TransitionTypeEnum,
    showCard: z.boolean(),

    loadingSteps: z.array(LoadingStepSchema).min(1).max(10),

    primaryColor: z.string().nullable().optional(),
    secondaryColor: z.string().nullable().optional(),
    themeOverrides: StrapiThemeOverridesSchema.nullable().optional(),

    ariaLabel: z.string().max(100),
    ariaLive: AriaLiveEnum,
    skipButtonAriaLabel: z.string().max(100),

    customClassName: z.string().max(200).nullable().optional(),
    overlayClassName: z.string().max(200).nullable().optional(),
    cardClassName: z.string().max(200).nullable().optional(),

    debug: z.boolean(),

    // Strapi metadata fields
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    publishedAt: z.string().optional(),
    locale: z.string().optional(),
  })
  .refine((data) => data.minDisplayTime < data.maxDisplayTime, {
    message: "minDisplayTime must be less than maxDisplayTime",
    path: ["minDisplayTime"],
  });

export type StrapiPreloaderConfigValidated = z.infer<
  typeof StrapiPreloaderConfigSchema
>;
