// apps/analytics/src/app/api/prompts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updatePrompt } from '@/lib/api/prompts';

/**
 * PATCH: Update a specific prompt in Strapi
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is async in Next.js 15
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Call our library function to update Strapi
    const updated = await updatePrompt(id, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'Prompt not found or update failed' }, { status: 404 });
    }
    
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(`[API Prompts PATCH ${params}] Error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
