// apps/analytics/src/app/api/prompts/route.ts
import { NextResponse } from 'next/server';
import { getPrompts } from '@/lib/api/prompts';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetch all prompts from Strapi
 */
export async function GET() {
  try {
    const prompts = await getPrompts();
    return NextResponse.json({ data: prompts });
  } catch (error) {
    console.error('[API Prompts GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}
