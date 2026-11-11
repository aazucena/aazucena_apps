/**
 * What Sentry may collect, shared by the browser and server configs.
 *
 * Sentry 11 collects every category when this is unset. The portfolio's Rin chat
 * and contact form put visitor messages, names, and emails in request bodies and
 * AI prompts, so those stay out of Sentry; headers and query params are kept
 * (Sentry always filters auth, token, and cookie values from them).
 */
export const sentryDataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: true,
  httpBodies: [],
  urlQueryParams: true,
  graphQL: { document: true, variables: false },
  genAI: { inputs: false, outputs: false },
  mcp: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  stackFrameVariables: false,
};
