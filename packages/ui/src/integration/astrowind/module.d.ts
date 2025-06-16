import type { ConfigBuilder as Builder } from "./utils/configBuilder";
declare global {
  module 'astrowind:config' {
    export interface ConfigBuilder extends Builder {
    };
  }
}