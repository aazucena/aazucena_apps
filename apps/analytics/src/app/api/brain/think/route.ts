import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const INTEL_ENGINE_URL = process.env.INTEL_ENGINE_URL || 'http://localhost:3003';

    console.log(`📡 Proxying Brain Query to: ${INTEL_ENGINE_URL}`);

    const res = await fetch(`${INTEL_ENGINE_URL}/brain/think`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Backend returned ${res.status}: ${errorText}` },
        { status: res.status },
      );
    }

    // Use a TransformStream to ensure chunks are pushed immediately
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const reader = res.body?.getReader();

    if (reader) {
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await writer.write(value);
          }
        } finally {
          writer.close();
        }
      })();
    }

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable Nginx buffering
      },
    });
  } catch (error: any) {
    console.error('[Brain-Think-API] Proxy Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to connect to Intel Engine' },
      { status: 500 },
    );
  }
}
