import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';

// Lazy-load the overlay — only downloaded and compiled by the client
// when actually needed (unauthenticated). Authenticated sessions pay zero cost.
const LoginOverlay = dynamic(() =>
  import('./LoginOverlay').then((m) => ({ default: m.LoginOverlay })),
);

/**
 * Server component — reads the session cookie and renders the login overlay
 * when the user is not authenticated. Rendered at the layout level so the
 * app shell is always present behind it.
 */
export async function AuthGate() {
  const cookieStore = await cookies();
  const session = cookieStore.get('az_session')?.value;
  const isAuthenticated = !!process.env.ADMIN_SECRET && session === process.env.ADMIN_SECRET;

  if (isAuthenticated) return null;
  return <LoginOverlay />;
}
