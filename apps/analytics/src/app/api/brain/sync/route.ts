// apps/analytics/src/app/api/brain/sync/route.ts
import { NextResponse } from 'next/server';

/**
 * POST: Proxy sync request to the Intel Engine
 */
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';
    
    // The Intel Engine is accessible via Docker network or localhost:3003
    const INTEL_ENGINE_URL = process.env.INTEL_ENGINE_URL || 'http://localhost:3003';
    
    const syncUrl = `${INTEL_ENGINE_URL}/brain/sync${force ? '?force=true' : ''}`;
    console.log(`[Proxy] Forwarding sync request to: ${syncUrl}`);
    
    const res = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`INTEL_ENGINE_SYNC_FAILED: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Brain Sync Proxy] Error:', error);
    return NextResponse.json({ error: 'Failed to sync with Intel Engine' }, { status: 500 });
  }
}
