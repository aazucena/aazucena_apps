/**
 * Admin session cookies.
 *
 * `az_session` holds the secret and is httpOnly, so client code cannot see
 * when it expires. `az_session_exp` carries only the expiry time (epoch ms)
 * and is readable by the client, which uses it to warn before the session
 * ends. Both are written and cleared together.
 */

export const SESSION_COOKIE = 'az_session';
export const SESSION_EXP_COOKIE = 'az_session_exp';
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days
/** How long before expiry the warning dialog opens. */
export const SESSION_WARN_MS = 5 * 60 * 1000;

interface CookieWriter {
  set(
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict';
      maxAge: number;
      path: string;
    },
  ): unknown;
}

/** Writes both session cookies with a fresh max age and returns the new expiry. */
export function writeSessionCookies(store: CookieWriter, secret: string): number {
  const expiresAt = Date.now() + SESSION_MAX_AGE_S * 1000;
  const base = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: SESSION_MAX_AGE_S,
    path: '/',
  };
  store.set(SESSION_COOKIE, secret, { ...base, httpOnly: true });
  store.set(SESSION_EXP_COOKIE, String(expiresAt), { ...base, httpOnly: false });
  return expiresAt;
}

/** Parses the expiry cookie value; returns null when missing or malformed. */
export function parseExpiry(value: string | undefined | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Reads the expiry cookie in the browser. */
export function readClientExpiry(): number | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_EXP_COOKIE}=([^;]*)`));
  return parseExpiry(match?.[1]);
}

/** Formats remaining milliseconds as mm:ss, floored at 00:00. */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
