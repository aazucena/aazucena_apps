/**
 * API Response Wrappers
 */

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
    [key: string]: unknown;
  };
  error?: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export interface WebhookPayload<T> {
  event: string;
  created_at: string;
  model: string;
  entry: T;
}
