# Integration Layer Reference

## OVERVIEW

The **Integration_Layer** acts as a specialized "adapter" system that translates the design system's internal tokens (OKLCH, TypeScript constants) into the specific data formats, proprietary schemas, or API-driven configurations required by **external third-party platforms** or **standalone software engines**.

---

## 🛠️ PLATFORM_ADAPTERS (35 Modules)

The following integrations are pre-configured and exported from `@aazucena/design-system/integrations`:

### [Core_Infrastructure]

| Module        | File_Path    | Description                                                |
| :------------ | :----------- | :--------------------------------------------------------- |
| **Strapi**    | `strapi/`    | Full theme schema mapping (Light/Dark) for CMS Admin.      |
| **GitHub**    | `github/`    | API Label colors and Readme Stats (Query-ready HEX).       |
| **Astro**     | `astro/`     | Dev Toolbar accent and background theme overrides.         |
| **Vercel_OG** | `vercel-og/` | Satori-safe styles for dynamic Social/OG image generation. |

### [AI_&_Intelligence]

| Module          | File_Path      | Description                                                           |
| :-------------- | :------------- | :-------------------------------------------------------------------- |
| **LangSmith**   | `langsmith/`   | Persona and Trace outcome mapping for prompt observability.           |
| **AI_Models**   | `ai/`          | Official brand identities for Claude, Gemini, OpenAI, Cohere, Voyage. |
| **TensorBoard** | `tensorboard/` | ML telemetry visualization palettes and UI mapping.                   |

### [Dev_Experience_&_Testing]

| Module             | File_Path         | Description                                                |
| :----------------- | :---------------- | :--------------------------------------------------------- |
| **Monaco**         | `monaco/`         | Interactive editor theme (VS-Dark) and syntax rules.       |
| **Shiki**          | `shiki/`          | Static syntax highlighting theme for Markdown/Astro.       |
| **Storybook**      | `storybook/`      | Storybook Manager UI theme (Sidebar/Toolbar/Panels).       |
| **Playwright**     | `playwright/`     | CSS overrides for branded E2E HTML test reports.           |
| **Vitest**         | `vitest/`         | Dashboard theme overrides for unit testing UI.             |
| **Query_Devtools** | `tanstack-query/` | Branded identity for TanStack Query devtools panels.       |
| **Scalar**         | `scalar/`         | CSS variables for OpenAPI/Scalar documentation portals.    |
| **Postman**        | `postman/`        | Branding manifest for public API documentation workspaces. |
| **CLI**            | `cli/`            | ANSI-safe HEX mapping for terminal output coloring.        |

### [Media_&_Visuals]

| Module         | File_Path       | Description                                                     |
| :------------- | :-------------- | :-------------------------------------------------------------- |
| **Cloudinary** | `cloudinary/`   | URL-safe HEX codes (no #) for dynamic transformations.          |
| **Mapbox**     | `mapbox/`       | Proprietary layer styles (Land, Water, Roads) for Mapbox GL JS. |
| **Wavesurfer** | `wavesurfer/`   | Waveform canvas renderer colors (Wave/Progress/Cursor).         |
| **D3.js**      | `d3/`           | Categorical and Sequential scales for telemetry charts.         |
| **YouTube**    | `youtube/`      | Player parameter defaults and modest branding overrides.        |
| **Spotify**    | `audio-embeds/` | Branded iframe parameter mapping for Spotify embeds.            |
| **SoundCloud** | `audio-embeds/` | HEX mapping (no #) for SoundCloud iframe players.               |
| **Phaser.js**  | `phaser/`       | HEX Integer (0x) conversion for game engine rendering.          |
| **Strudel.cc** | `strudel/`      | Live coding environment theme and visualizer accents.           |

### [Commerce_&_Engagement]

| Module        | File_Path    | Description                                            |
| :------------ | :----------- | :----------------------------------------------------- |
| **Stripe**    | `stripe/`    | Dashboard and Checkout branding API constants.         |
| **Cal.com**   | `cal-com/`   | Booking widget theme and CSS variable injection.       |
| **Ko-fi**     | `ko-fi/`     | Widget, button, and profile accent color mappings.     |
| **LinkedIn**  | `linkedin/`  | Social sharing widget and card branding.               |
| **Email**     | `email/`     | Inline-safe style objects for React Email / Resend.    |
| **WakaTime**  | `wakatime/`  | Badge and coding activity chart branding.              |
| **Plausible** | `plausible/` | Public analytics dashboard CSS overrides.              |
| **Sentry**    | `sentry/`    | Error observability project branding configuration.    |
| **Webhooks**  | `webhooks/`  | Slack (HEX) and Discord (Decimal) notification colors. |
| **reCAPTCHA** | `recaptcha/` | Security badge theme and positioning sync.             |
| **Weather**   | `weather/`   | Condition-based icon and UI color mappings.            |

---

## ⚡ USAGE_PATTERN

### Importing Integrations

Integrations are available through the main package entry point or the specific integration path.

```typescript
import { stripeBranding, monacoTheme } from '@aazucena/design-system';

// Or for cleaner imports
import { strapiTheme } from '@aazucena/design-system/integrations';
```

### Implementing in External Services

Each module provides the exact format required by the service (e.g., Integer, HEX, or CSS Variable).

```typescript
// Discord Webhook (Decimal)
const discordPayload = {
  embeds: [
    {
      title: 'Intelligence Update',
      color: webhookColors.SUCCESS.decimal,
    },
  ],
};

// Cloudinary URL (HEX without #)
const imageUrl = `https://res.cloudinary.com/demo/image/upload/co_rgb:${cloudinaryColors.primary}/post.jpg`;
```

---

**MAINTAINER:** aazucena_intelligence_engine
**STATUS:** Exhaustive_Release_v1.0.0
