import type { AstroConfig, AstroIntegration } from "astro";
import { vitePluginDirectusClient } from "./vite-plugin-directus-client";
import type { ClientConfig, DeepPartial } from "./types";
import { initVite } from "./utils";
type IntegrationOptions = ClientConfig & {
  
}

const defaultClientConfig: Partial<ClientConfig> = {
  authentication: {
    enabled: true
  }
}

export default function directusIntegration(integrationConfig: IntegrationOptions): AstroIntegration {
  const clientConfig = { ...defaultClientConfig, ...integrationConfig };
  const { buildIntegrationScript } = initVite(clientConfig);
  const { proxy } = clientConfig;
  return {
    name: '@astro/directus',
    hooks: {
      'astro:config:setup': ({injectScript, injectRoute, updateConfig, logger}) => {
        const buildLogger = logger.fork('astro-directus');
        const config: DeepPartial<AstroConfig> = {
          vite: {
            plugins: [
              vitePluginDirectusClient(clientConfig),
            ],
          },
        }

        if (proxy && proxy.enabled) {
          const { endpoint = "/api", options = {} } = proxy;
          config.vite = {
            ...config.vite,
            server: {
              proxy: {
                [endpoint]: {
                  target: clientConfig.url,
                  changeOrigin: true,
                  secure: false,
                  ...options ?? {},
                }
              }
            },
          }
          buildLogger.info(`Proxy ${endpoint} to ${clientConfig.url}`);
        }
        
        updateConfig(config)
        injectScript(
          'page-ssr',
          buildIntegrationScript(),
        )
        buildLogger.info('Directus integration initialized');
      },
      'astro:build:done': async ({ logger }) => {
        const buildLogger = logger.fork('astro-directus');
        buildLogger.info('Directus integration has been built');
      },  
    },
  }
}