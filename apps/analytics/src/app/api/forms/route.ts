import { NextRequest, NextResponse } from 'next/server';
import { fetchStrapi } from '@/lib/services/strapi';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') ?? '1';
  const pageSize = searchParams.get('pageSize') ?? '20';
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    const filters: Record<string, unknown> = {};
    if (status && status !== 'all') filters['status'] = { $eq: status };
    if (search)
      filters['$or'] = [
        { submitterName: { $containsi: search } },
        { submitterEmail: { $containsi: search } },
        { rawMessage: { $containsi: search } },
      ];

    const data = await fetchStrapi('form-submissions', {
      query: {
        filters,
        sort: ['submittedAt:desc'],
        pagination: { page: parseInt(page), pageSize: parseInt(pageSize) },
        fields: [
          'documentId',
          'formType',
          'submitterName',
          'submitterEmail',
          'status',
          'submittedAt',
          'aiIntent',
          'aiSentiment',
          'aiSummary',
          'aiTags',
        ],
      },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error('[Forms API] List failed:', err);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
