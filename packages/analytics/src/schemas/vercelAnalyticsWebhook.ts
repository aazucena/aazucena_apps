import { z } from 'zod';

/**
 * Vercel Log Drain Schema
 * Schema for Vercel Log Drain webhook payloads
 * Matches the standard HTTP access log format provided by Vercel Log Drains
 */

// Schema for a single log entry from Vercel Log Drain
export const VercelLogEntrySchema = z.object({
  id: z.string().optional(),
  timestamp: z.number().optional(), // Unix timestamp in ms
  message: z.string().optional(),
  projectId: z.string().optional(),
  source: z.string().optional(),
  host: z.string().optional(),
  path: z.string().optional(), // route pattern (e.g. /[slug]) — use proxy.path for actual URL
  method: z.string().optional(),
  statusCode: z.number().optional(),
  environment: z.string().optional(),
  proxy: z
    .object({
      timestamp: z.number().optional(),
      method: z.string().optional(),
      host: z.string().optional(),
      path: z.string().optional(), // actual URL + query params (e.g. /about?ref=home)
      clientIp: z.string().optional(),
      userAgent: z.array(z.string()).optional(), // always an array per Vercel docs
      referer: z.string().optional(),
      region: z.string().optional(), // execution region (e.g. sfo1) — NOT client geo
      statusCode: z.number().optional(),
      scheme: z.string().optional(),
      vercelCache: z.string().optional(),
    })
    .optional(),
});

// The payload is typically an array of these entries
export const VercelLogDrainPayloadSchema = z.array(VercelLogEntrySchema);

export type VercelLogEntry = z.infer<typeof VercelLogEntrySchema>;
