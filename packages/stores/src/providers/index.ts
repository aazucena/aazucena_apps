/**
 * [@aazucena/stores/providers] : Framework-Agnostic_State_Providers
 * Decoupled, standardized providers for state management, queries, and real-time sync
 */

// Providers
export * from './WebSocketProvider';
export * from './StoreProvider';
export * from './QueryProvider';
export * from './RealtimeSync';
export * from './ProviderComposer';

// Re-export commonly used types for convenience
export type { QueryClient } from '@tanstack/react-query';
