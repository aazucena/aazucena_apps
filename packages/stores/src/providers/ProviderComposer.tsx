import { type ReactNode, type ComponentType } from 'react';

/**
 * Provider component with props
 */
export interface ProviderConfig {
  provider: ComponentType<any>;
  props?: Record<string, any>;
}

export interface ProviderComposerProps {
  children: ReactNode;
  providers: ProviderConfig[];
}

/**
 * ProviderComposer
 * Utility to compose multiple providers without deep nesting
 *
 * @example
 * ```tsx
 * <ProviderComposer
 *   providers={[
 *     { provider: StoreProvider, props: { config: storeConfig } },
 *     { provider: QueryProvider, props: { config: queryConfig } },
 *     { provider: WebSocketProvider, props: { config: wsConfig } },
 *   ]}
 * >
 *   <App />
 * </ProviderComposer>
 * ```
 */
export function ProviderComposer({ children, providers }: ProviderComposerProps) {
  return providers.reduceRight(
    (acc, { provider: Provider, props = {} }) => <Provider {...props}>{acc}</Provider>,
    children,
  );
}
