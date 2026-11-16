import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_EXP_COOKIE, writeSessionCookies } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_SECRET || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }

  // eslint-disable-next-line security/detect-possible-timing-attacks -- 400ms artificial delay below already covers brute-force; no secrets are returned on mismatch
  if (password !== process.env.ADMIN_PASSWORD) {
    // Constant-time-ish delay to blunt brute-force attempts
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: 'ACCESS_DENIED' }, { status: 401 });
  }

  const expiresAt = writeSessionCookies(await cookies(), process.env.ADMIN_SECRET);
  return NextResponse.json({ ok: true, expiresAt });
}

/** Renews a live session: only a request that still holds the valid cookie can extend it. */
export async function PATCH() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!process.env.ADMIN_SECRET || session !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const expiresAt = writeSessionCookies(cookieStore, process.env.ADMIN_SECRET);
  return NextResponse.json({ ok: true, expiresAt });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(SESSION_EXP_COOKIE);
  return NextResponse.json({ ok: true });
}
