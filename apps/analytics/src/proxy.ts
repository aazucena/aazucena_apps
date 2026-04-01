import { NextRequest, NextResponse } from 'next/server';

const ALWAYS_PUBLIC = [
  '/_next',
  '/favicon.ico',
  '/api/auth',
  '/api/ingest',
  '/api/health',
  '/status',
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ALWAYS_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // API routes: enforce at the network level with a 401
  // Page routes: AuthGate in layout.tsx handles the overlay UI
  if (pathname.startsWith('/api/')) {
    const session = req.cookies.get('az_session')?.value;
    if (!process.env.ADMIN_SECRET || session !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
