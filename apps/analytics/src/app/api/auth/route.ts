import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'az_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_SECRET || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    // Constant-time-ish delay to blunt brute-force attempts
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: 'ACCESS_DENIED' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, process.env.ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
