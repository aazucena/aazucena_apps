'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Button,
} from '@aazucena/ui';
import { clearAllHistory } from '@/store';
import { SESSION_WARN_MS, formatRemaining, readClientExpiry } from '@/lib/session';

const btn =
  'h-(--control-md) rounded-(--radius-control) px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--signal) disabled:cursor-not-allowed';
const primaryBtn = `${btn} bg-(--signal) text-(--signal-foreground) hover:bg-(--signal)/90`;
const secondaryBtn = `${btn} border border-(--rule) bg-transparent text-(--foreground) hover:bg-(--state)`;

/** Screen-reader wording, read once when the dialog opens. */
function spokenRemaining(ms: number): string {
  const secs = Math.max(0, Math.round(ms / 1000));
  if (secs < 60) return `${secs} seconds`;
  const mins = Math.round(secs / 60);
  return `about ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
}

/**
 * Warns before the admin session cookie expires and lets the user renew it
 * (WCAG 2.2.1 Timing Adjustable). Expiry is re-read from the cookie every
 * second, so a renewal in another tab closes the warning here too.
 */
export function SessionExpiryDialog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [pending, setPending] = useState<'renew' | 'signout' | null>(null);
  const [renewFailed, setRenewFailed] = useState(false);
  const renewRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tick = () => {
      const expiresAt = readClientExpiry();
      if (expiresAt === null) {
        setRemaining(null);
        return;
      }
      const left = expiresAt - Date.now();
      if (left <= 0) {
        // The browser has dropped (or is about to drop) the cookie; re-running
        // AuthGate on the server shows the login overlay.
        setRemaining(null);
        router.refresh();
        return;
      }
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [router]);

  const open = remaining !== null && remaining <= SESSION_WARN_MS;

  const renew = useCallback(async () => {
    setPending('renew');
    setRenewFailed(false);
    try {
      const res = await fetch('/api/auth', { method: 'PATCH' });
      if (!res.ok) throw new Error(String(res.status));
      setRemaining(null);
    } catch {
      setRenewFailed(true);
    } finally {
      setPending(null);
    }
  }, []);

  const signOut = useCallback(async () => {
    setPending('signout');
    dispatch(clearAllHistory());
    await fetch('/api/auth', { method: 'DELETE' }).catch(() => undefined);
    setPending(null);
    router.refresh();
  }, [dispatch, router]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        size="sm"
        // Analytics does not load the ui Tailwind theme yet (Phase 4), so role
        // colours are read from the CSS variables directly.
        className="border-(--rule) bg-(--panel) text-(--foreground) rounded-(--radius-card)"
        // Focus the safe, expected action rather than the first button (Sign out).
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          renewRef.current?.focus();
        }}
      >
        <AlertDialogHeader>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-(--warning)">
            <span aria-hidden="true">◆ </span>Session {'//'} Expiring
          </p>
          <AlertDialogTitle className="text-(--foreground)">
            Session ends in{' '}
            <span className="font-mono tabular-nums" aria-hidden="true">
              {formatRemaining(remaining ?? 0)}
            </span>
            <span className="sr-only">{spokenRemaining(remaining ?? 0)}</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-(--muted-foreground)">
            Stay signed in to keep working, or sign out now. After it ends you need the auth key to
            sign in again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {renewFailed && (
          <p role="alert" className="text-(--alert) text-sm">
            <span aria-hidden="true">▲ </span>Could not renew the session. Try again, or sign in
            again after it ends.
          </p>
        )}

        <AlertDialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={signOut}
            disabled={pending !== null}
            className={secondaryBtn}
          >
            {pending === 'signout' ? 'Signing out…' : 'Sign out'}
          </Button>
          <Button ref={renewRef} onClick={renew} disabled={pending !== null} className={primaryBtn}>
            {pending === 'renew' ? 'Renewing…' : 'Stay signed in'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
