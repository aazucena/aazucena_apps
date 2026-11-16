/// <reference types="vite/client" />

// STORYBOOK_-prefixed env vars are exposed to stories through import.meta.env
interface ImportMetaEnv {
  /** URL of Rin's .riv file (same file as the portfolio's PUBLIC_RIN_CHARACTER_SRC) */
  readonly STORYBOOK_RIN_CHARACTER_SRC?: string;
}

// Where the apps use each library component; built by the plugin in main.ts
declare module 'virtual:component-usage' {
  const usage: import('./usage/scan').ComponentUsage;
  export default usage;
}
