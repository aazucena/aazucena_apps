import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const INTEL_ENGINE_URL = process.env.INTEL_ENGINE_URL || 'http://localhost:3003';
    
    const res = await fetch(`${INTEL_ENGINE_URL}/brain/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `Backend returned ${res.status}: ${errorText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Brain-Summarize-API] Error:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
