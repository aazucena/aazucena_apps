/**
 * @aazucena/forms — Schema barrel
 *
 * All Zod schemas and TypeScript types are re-exported from this single entry
 * point. Template files import from '../../schemas/index' — this path is
 * preserved so no template needs to change.
 *
 * Internal structure:
 *   base.ts        → baseFormSchema
 *   auth.ts        → 14 auth schemas
 *   portfolio.ts   → 15 portfolio schemas + anyFormSchema union
 *   account.ts     → 5 account schemas
 *   onboarding.ts  → 7 onboarding schemas
 *   commerce.ts    → 9 commerce schemas
 *   support.ts     → 6 support schemas
 *   hr.ts          → 4 HR/events schemas
 *   research.ts    → 8 research schemas
 *   scheduling.ts  → 6 scheduling schemas
 *   opensource.ts  → 6 open source schemas
 *   legal.ts       → 5 legal schemas
 *   analytics.ts   → 4 analytics schemas
 *   platform.ts    → 7 platform/devops schemas
 */

export * from './base';
export * from './auth';
export * from './portfolio';
export * from './account';
export * from './onboarding';
export * from './commerce';
export * from './support';
export * from './hr';
export * from './research';
export * from './scheduling';
export * from './opensource';
export * from './legal';
export * from './analytics';
export * from './platform';
