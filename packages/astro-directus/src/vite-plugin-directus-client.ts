import type { ClientConfig } from './types';
import { initVite } from './utils';

const virtualModuleId = 'directus:client'
const resolvedVirtualModuleId = '\0' + virtualModuleId


export function vitePluginDirectusClient(config: ClientConfig) {
  const { buildPluginScript } = initVite(config);
  return {
    name: 'directus:client',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return buildPluginScript();
      }
    },
  }
}