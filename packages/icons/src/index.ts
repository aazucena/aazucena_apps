// ─── 1. Myna UI — stroke-style UI/system icons ───────────────────────────────
export * from '@mynaui/icons-react';
export { 
  Dots, 
  Microchip, 
  Smile, 
  Globe, 
  Shield, 
  Zap, 
  Activity, 
  Database,
  Code,
  Terminal,
  User,
  Calendar,
  CreditCard,
  Cog,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Search,
  ArrowRight,
  Play,
  Pause,
  Refresh,
  File,
  CloudUpload,
  TypeBold,
  TypeItalic,
  TypeUnderline
} from '@mynaui/icons-react';

// ─── 2. SimpleIcons (Si* prefix) — pixel-perfect brand logos ─────────────────
// e.g. SiGithub, SiGithubHex, SiVercel, SiVercelHex, SiTypescript
export * from '@icons-pack/react-simple-icons';

// ─── 3. Registry utilities ────────────────────────────────────────────────────
export * from './registry.js';

// ─── 4. Clean-named aliases & custom icons ───────────────────────────────────
// Better casing over SimpleIcons' lowercase convention, plus icons that have
// no SimpleIcons equivalent at all.
export {
  // Better casing aliases ─────────────────────────────────────────────────────
  GitHub, GitHubHex,          // SiGithub  → GitHub
  Astro, AstroHex,            // SiAstro   → Astro
  React, ReactHex,            // SiReact   → React
  Vite, ViteHex,              // SiVite    → Vite
  TypeScript, TypeScriptHex,  // SiTypescript → TypeScript
  JavaScript, JavaScriptHex,  // SiJavascript → JavaScript
  ClickHouse, ClickHouseHex,  // SiClickhouse → ClickHouse
  GraphQL, GraphQLHex,        // SiGraphql    → GraphQL
  LangChain, LangChainHex,    // SiLangchain  → LangChain
  FastAPI, FastAPIHex,        // SiFastapi    → FastAPI
  ShadcnUI, ShadcnUIHex,      // SiShadcnui   → ShadcnUI
  Tailwind, TailwindHex,      // SiTailwindcss  → Tailwind
  Nextjs, NextjsHex,          // SiNextdotjs    → Nextjs
  Nodejs, NodejsHex,          // SiNodedotjs    → Nodejs
  Threejs, ThreejsHex,        // SiThreedotjs   → Threejs
  Plausible, PlausibleHex,    // SiPlausibleanalytics → Plausible
  Twitter, TwitterHex,        // SiX (rebranded) → Twitter

  // Custom icons — no SimpleIcons equivalent ──────────────────────────────────
  LinkedIn,                   // not in SimpleIcons (trademark)
  Brand,                      // personal brand logo
  ScrollDown,                 // UI scroll indicator (div wrapper)
  Empty,                      // empty state icon
  AwardBadge,                 // custom award icon
  Vector,                     // custom vector icon
  Viewports,                  // custom viewports (12×12 coordinate space)
  Email,                      // generic email icon (not a brand)
  Download,                   // generic download icon
  Image,                      // generic image placeholder

  // Socials & Others ──────────────────────────────────────────────────────────
  Rss, RssHex,
  Youtube, YoutubeHex,
  Instagram, InstagramHex,
  Facebook, FacebookHex,
  Tiktok, TiktokHex,
  Discord, DiscordHex,
  Twitch, TwitchHex,
  Mastodon, MastodonHex,
  Docker, DockerHex,
  Strapi, StrapiHex,
  Vercel, VercelHex,
  Railway, RailwayHex,
  Figma, FigmaHex,
  Redis, RedisHex,
  Anthropic, AnthropicHex,
  D3, D3Hex,
  Storybook, StorybookHex,
  Turborepo, TurborepoHex,
  Turbo, TurboHex,
  Sentry, SentryHex,
  Stripe, StripeHex,
  Kofi, KofiHex,

  // Live coding & creative ────────────────────────────────────────────────────
  Strudel,                    // strudel.cc (not in SimpleIcons)
  Tidalcycles,                // TidalCycles (not in SimpleIcons)
  Phaser,                     // Phaser.io game framework (not in SimpleIcons)
  Catppuccin,                 // Catppuccin theme (not in SimpleIcons)
} from './custom/index.js';
