import type { AggregationTypes, AuthenticationConfig, AuthenticationMode, ClientOptions, GraphqlConfig, GroupByFields, Query, RestConfig, WebSocketConfig } from '@directus/sdk'
import type { Options } from 'http-proxy-middleware';

export interface ClientConfig extends ClientOptions {
  url: string;
  config?: RestConfig;
  authentication?: {
    enabled: boolean;
    mode?: AuthenticationMode;
    config?: Partial<AuthenticationConfig>;
  };
  websocket?: {
    enabled: boolean;
    config?: Partial<WebSocketConfig>
  };
  graphql?: {
    enabled: boolean;
    config?: Partial<GraphqlConfig>
  };
  accessToken?: string;
  accessTokens?: Record<string, string> & {
    websocket?: string;
    authentication?: string;
  };
  proxy?: {
    enabled: boolean;
    endpoint?: string;
    options?: Options;
  };
};

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object | undefined ? DeepPartial<T[P]> : T[P];
};

export type ExtendedQuery<Schema, Item> = Query<Schema, Item> & {
    aggregate?: Record<keyof AggregationTypes, string>;
    groupBy?: (string | GroupByFields<Schema, Item>)[];
};