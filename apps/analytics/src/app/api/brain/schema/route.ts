import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Call the Intel Engine service (internal Docker hostname or localhost if on host)
    // Using environment variable for flexibility
    const INTEL_ENGINE_URL = process.env.INTEL_ENGINE_URL || 'http://localhost:3003';

    const res = await fetch(`${INTEL_ENGINE_URL}/brain/schema`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      throw new Error(`Intel Engine returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    const isUnavailable =
      error instanceof TypeError ||
      (error instanceof DOMException && error.name === 'TimeoutError');
    if (isUnavailable) {
      console.warn('[Brain-Schema-API] Intel Engine unavailable — using fallback schema');
    } else {
      console.error('[Brain-Schema-API] Unexpected error:', error);
    }
    // Fallback to static schema if service is down
    return NextResponse.json({
      nodes: [
        { id: 'analyze_intent', label: 'Analyze Intent' },
        { id: 'retrieve_knowledge', label: 'Retrieve Knowledge' },
        { id: 'generate_response', label: 'Generate Response' },
      ],
      edges: [
        { from: 'analyze_intent', to: 'retrieve_knowledge' },
        { from: 'retrieve_knowledge', to: 'generate_response' },
      ],
    });
  }
}
