'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
const SocketContext = createContext<Socket | null>(null);
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const WS_SERVER = process.env.NEXT_PUBLIC_WS_SERVER;
    if (!WS_SERVER) return; // Skip connection if WS server is not configured
    const s = io(WS_SERVER, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    s.on('connect', () => console.log('[Socket] Connected to Live Terminal'));
    s.on('connect_error', (err) => console.warn('[Socket] Connection failed:', err.message));
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
