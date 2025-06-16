import type { ApiExtensionContext, HookExtensionContext  } from "@directus/extensions";

import type * as Services from '@directus/api/dist/services';
import { CronExpression } from "cron-parser";

export type ExtensionCtx = Omit<ApiExtensionContext | HookExtensionContext, 'services'> & {
  services: (typeof Services) & {
    [k: string]: unknown;
  }
}

export type AnyObject = Record<string, unknown>;

export type FactoryFunction<R, A extends any[] = []> = (
  ctx: ExtensionCtx
) => ((...args: A) => R | Promise<R>);

export type GenericError = { status: string, message: string, code: number };

export interface CronObject extends CronExpression {
  schedule: string;
  trigger: boolean;
}