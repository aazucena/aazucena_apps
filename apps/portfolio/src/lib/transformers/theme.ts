import type { StrapiTheme } from "~/lib/validators/theme";

export interface ThemeData {
  mode: "system" | "light" | "dark" | "light:only" | "dark:only";
  colors: {
    light: {
      primary: string;
      secondary: string;
      accent: string;
    };
    dark: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  fonts: {
    sans: string;
    serif: string;
    heading: string;
    code: string;
  };
}

/**
 * Transform Strapi theme to frontend format
 */
export function transformTheme(strapiTheme: StrapiTheme): ThemeData {
  return {
    mode: strapiTheme.mode,
    colors: {
      light: {
        primary: strapiTheme.primaryColor ?? "#3b82f6",
        secondary: strapiTheme.secondaryColor ?? "#8b5cf6",
        accent: strapiTheme.accentColor ?? "#06b6d4",
      },
      dark: {
        primary: strapiTheme.primaryColorDark ?? "#60a5fa",
        secondary: strapiTheme.secondaryColorDark ?? "#a78bfa",
        accent: strapiTheme.accentColorDark ?? "#22d3ee",
      },
    },
    fonts: {
      sans: strapiTheme.fontSans ?? "Fira Sans",
      serif: strapiTheme.fontSerif ?? "Fira Sans",
      heading: strapiTheme.fontHeading ?? "Fira Sans",
      code: strapiTheme.fontCode ?? "Fira Code",
    },
  };
}

/**
 * Default fallback theme
 */
export const DEFAULT_THEME: ThemeData = {
  mode: "system",
  colors: {
    light: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
    },
    dark: {
      primary: "#60a5fa",
      secondary: "#a78bfa",
      accent: "#22d3ee",
    },
  },
  fonts: {
    sans: "Fira Sans",
    serif: "Fira Sans",
    heading: "Fira Sans",
    code: "Fira Code",
  },
};
