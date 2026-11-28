import { describe, expect, it } from 'vitest';
import { StrapiAnalyticSchema } from './analytic';

const base = {
  id: 1,
  documentId: 'abc123',
  googleAnalyticsEnabled: false,
  vercelAnalyticsEnabled: true,
  vercelSpeedInsightsEnabled: true,
  sentryEnabled: true,
  createdAt: '2026-11-27T00:00:00.000Z',
  updatedAt: '2026-11-27T00:00:00.000Z',
};

describe('StrapiAnalyticSchema', () => {
  it('parses old CMS data that still carries plausible fields', () => {
    const result = StrapiAnalyticSchema.safeParse({
      ...base,
      plausibleEnabled: true,
      plausibleDomain: 'aazucena.com',
    });
    expect(result.success).toBe(true);
    expect(result.success && 'plausibleEnabled' in result.data).toBe(false);
  });

  it('has no plausible keys in its shape', () => {
    const keys = Object.keys(StrapiAnalyticSchema.shape);
    expect(keys).not.toContain('plausibleEnabled');
    expect(keys).not.toContain('plausibleDomain');
  });
});
