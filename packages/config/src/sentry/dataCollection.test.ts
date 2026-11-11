import { describe, expect, it } from 'vitest';
import { getBaseClientConfig } from './client';
import { getBaseServerConfig } from './server';

const configs = {
  client: getBaseClientConfig({
    dsn: 'https://x@o0.ingest.sentry.io/0',
    environment: 'production',
  }),
  server: getBaseServerConfig({
    dsn: 'https://x@o0.ingest.sentry.io/0',
    environment: 'production',
  }),
};

describe.each(Object.entries(configs))('%s Sentry data collection', (_name, config) => {
  it('never sends HTTP bodies (Rin chat and contact-form payloads)', () => {
    expect(config.dataCollection?.httpBodies).toEqual([]);
  });

  it('never records gen-AI prompts or responses', () => {
    expect(config.dataCollection?.genAI).toEqual({ inputs: false, outputs: false });
  });

  it('does not attach visitor identity or cookies', () => {
    expect(config.dataCollection?.userInfo).toBe(false);
    expect(config.dataCollection?.cookies).toBe(false);
  });
});
