import { streamText, convertToModelMessages } from 'ai';
import { gateway } from '@/lib/services/ai/gateway';

export async function POST(req: Request) {
  try {
    const { messages, modelId = 'openai/gpt-4o' } = await req.json();
    const startTime = Date.now();
    const traceId = `trace_${crypto.randomUUID().slice(0, 8)}`;

    const result = streamText({
      model: gateway(modelId),
      messages: await convertToModelMessages(messages),
      // Native Gateway features for Vercel's observability
      providerOptions: {
        gateway: {
          tags: ['analytics-dashboard', 'ai-terminal'],
          user: 'admin-terminal',
        },
      },
      // AZUCENA_LYTICS: Custom telemetry for monorepo-wide correlation
      onFinish: async ({ usage }) => {
        const latency = Date.now() - startTime;

        // Push telemetry to our internal ingestion API
        const INGEST_URL = process.env.INTERNAL_INGEST_URL || 'http://10.0.0.97:8080/api/ingest';

        fetch(INGEST_URL, {
          method: 'POST',
          headers: {
            'x-secret-key': process.env.INGESTION_SECRET_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'ai_event',
            trace_id: traceId,
            agent_name: 'AI_TERMINAL',
            model: modelId,
            input_tokens: usage.inputTokens || 0,
            output_tokens: usage.outputTokens || 0,
            latency_ms: latency,
            form_type: 'chat_interaction',
          }),
        }).catch((err) => console.error('[AI-Telemetry] Failed to pulse metrics:', err.message));
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[AI-API] Chat Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process AI request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
