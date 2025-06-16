import type { ClientConfig } from './types';
import { initVite } from './utils';

const virtualModuleId = 'directus:types'
const resolvedVirtualModuleId = '\0' + virtualModuleId


export function vitePluginDirectusClient(config: ClientConfig) {
  // const { buildPluginScript } = initVite(config);
  return {
    name: 'directus:types',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `
          export * from '@directus/sdk';
          export * from '@directus/types';
        `
      }
    },
  }
}