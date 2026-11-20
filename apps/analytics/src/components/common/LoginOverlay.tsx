'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from '@aazucena/icons';
import { Button, Input, Panel, PanelBody, PanelHeader } from '@aazucena/ui';
import { useInertOutside } from '@/hooks/useInertOutside';
import { ThemeToggle } from './ThemeToggle';
import { IntegrityBadge } from './IntegrityBadge';

const LAST_LOGIN_KEY = 'az_last_login';

function formatLastLogin(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function LoginOverlay() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState('');
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  // false on the server and during hydration, true afterwards
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const passwordRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Portal to body only on the client; then everything else on the page goes inert
  useInertOutside(rootRef, mounted);

  // Live clock — start after mount to avoid hydration mismatch
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Focus the key field on open
  useEffect(() => {
    if (mounted) passwordRef.current?.focus();
  }, [mounted]);

  // Last login — localStorage is client-only
  useEffect(() => {
    setLastLogin(localStorage.getItem(LAST_LOGIN_KEY));
  }, []);

  const handleCapsLock = (e: React.KeyboardEvent) => {
    const isOn = e.getModifierState('CapsLock');
    // Only setState when the value actually changes — avoids a re-render on every key
    if (isOn !== capsLock) setCapsLock(isOn);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const password = passwordRef.current?.value ?? '';

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError({
          code: 'ACCESS_DENIED',
          message: 'Invalid credentials. The key field was cleared.',
        });
        if (passwordRef.current) passwordRef.current.value = '';
        passwordRef.current?.focus();
        return;
      }

      localStorage.setItem(LAST_LOGIN_KEY, new Date().toISOString());
      // Re-render server component tree — AuthGate finds valid cookie → overlay unmounts
      router.refresh();
    } catch {
      setError({ code: 'NETWORK_ERROR', message: 'Could not reach the auth service.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={rootRef}
      data-login-overlay
      className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Top bar: live clock + theme toggle */}
      <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
        <span className="text-muted-foreground font-mono text-[11px] tracking-widest tabular-nums">
          {time}
        </span>
        <ThemeToggle size="sm" />
      </div>

      <Panel
        role="dialog"
        aria-modal="true"
        aria-label="Authentication required"
        className="border-rule relative w-full max-w-sm border"
      >
        <PanelHeader label="AUTH // REQUIRED">
          <span className="micro-label text-signal">RESTRICTED</span>
        </PanelHeader>

        <PanelBody className="gap-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="border-signal bg-signal-faint text-signal mb-2 inline-flex size-11 items-center justify-center rounded-control border">
              <Shield size={20} />
            </span>
            <h1 className="text-lg font-medium tracking-tight">AZUCENA_LYTICS</h1>
            <p className="micro-label text-muted-foreground">Restricted Access Terminal</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-key" className="micro-label text-muted-foreground">
                Auth Key
              </label>
              <div className="relative">
                <Input
                  id="auth-key"
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  onKeyDown={handleCapsLock}
                  onKeyUp={handleCapsLock}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  className="h-control w-full pr-11 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground focus-visible:outline-signal absolute top-1/2 right-3 -translate-y-1/2 focus-visible:outline-1 focus-visible:outline-offset-2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {capsLock && (
              <div className="border-warning flex flex-col gap-1 border-l-2 px-3 py-2">
                <span className="micro-label text-warning">◆ CAPS LOCK</span>
                <p className="text-sm">Caps Lock is active.</p>
              </div>
            )}

            <div role="alert" aria-live="assertive" className="empty:hidden">
              {error && (
                <div className="border-alert flex flex-col gap-1 border-l-2 px-3 py-2">
                  <span className="micro-label text-alert">▲ {error.code}</span>
                  <p className="text-sm">{error.message}</p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isLoading} aria-busy={isLoading} className="w-full">
              {isLoading ? 'Authenticating…' : 'Authenticate'}
            </Button>
            <span className="sr-only" role="status">
              {isLoading ? 'Authenticating' : ''}
            </span>
          </form>
        </PanelBody>

        <div className="border-rule flex flex-col items-center gap-3 border-t p-panel">
          <IntegrityBadge />
          <div className="micro-label text-muted-foreground flex w-full items-center justify-between">
            <span>v{process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0'}</span>
            <span>{lastLogin ? `Last: ${formatLastLogin(lastLogin)}` : 'First session'}</span>
          </div>
        </div>
      </Panel>
    </div>,
    document.body,
  );
}
