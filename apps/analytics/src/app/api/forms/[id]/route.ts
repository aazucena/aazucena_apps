import { NextRequest, NextResponse } from 'next/server';
import { fetchStrapi } from '@/lib/services/strapi';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const data = await fetchStrapi(`form-submissions/${id}`, {
      query: { populate: ['formData', 'structuredData', 'aiTags'] },
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Forms API] Get failed:', err);
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const allowed = ['New', 'Read', 'Replied', 'Archived'];
  if (!status || !allowed.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${allowed.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const data = await fetchStrapi(`form-submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { status } }),
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Forms API] Update failed:', err);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await fetchStrapi(`form-submissions/${id}`, { method: 'DELETE' });
    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error('[Forms API] Delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
