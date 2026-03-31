'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Danger } from '@aazucena/icons';
import {
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@aazucena/ui';
import { cn } from '@/lib/utils';
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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState('');
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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

  // Last login — localStorage is client-only
  useEffect(() => {
    setLastLogin(localStorage.getItem(LAST_LOGIN_KEY));
  }, []);

  const handleCapsLock = (e: React.KeyboardEvent) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('ACCESS_DENIED — Invalid credentials');
        setPassword('');
        passwordRef.current?.focus();
        return;
      }

      localStorage.setItem(LAST_LOGIN_KEY, new Date().toISOString());
      // Re-render server component tree — AuthGate finds valid cookie → overlay unmounts
      router.refresh();
    } catch {
      setError('NETWORK_ERROR — Could not reach auth service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top bar: live clock + theme toggle */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-600 tabular-nums tracking-widest">
          {time}
        </span>
        <ThemeToggle size="sm" />
      </div>

      <Card className="relative w-full max-w-sm bg-zinc-100 dark:bg-zinc-950/50 shadow-2xl">
        {/* Header */}
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col justify-center items-center text-xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-[0.2em]">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-4">
              <Shield size={24} className="text-primary-500" />
            </span>
            AZUCENA_LYTICS
          </CardTitle>
          <CardDescription className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-[0.3em]">
            Restricted Access Terminal
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Form card */}
          <form onSubmit={handleSubmit} className="px-6 py-2 space-y-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                <Shield size={10} /> Auth Key
              </label>
              <div className="relative">
                <Input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleCapsLock}
                  onKeyUp={handleCapsLock}
                  autoComplete="current-password"
                  autoFocus
                  required
                  placeholder="••••••••••••"
                  className="px-4 py-3 pr-11 text-xs w-full bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-inner leading-relaxed transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Caps Lock warning */}
            {capsLock && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Danger size={12} className="text-amber-500 shrink-0" />
                <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Caps Lock is active
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <Shield size={12} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-mono text-rose-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className={cn(
                'w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all',
                'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
                isLoading && 'animate-pulse',
              )}
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-center">
          {/* System status */}
          <div className="flex items-center justify-center mt-5">
            <IntegrityBadge />
          </div>

          {/* Footer: version + last login */}
          <div className="flex items-center justify-between mt-4 px-1 w-full">
            <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
              v{process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0'}
            </span>
            {lastLogin ? (
              <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
                Last: {formatLastLogin(lastLogin)}
              </span>
            ) : (
              <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
                First session
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
