
declare global {
  module 'directus:client' {
    export const directusClient: import('@directus/sdk').DirectusClient
    export const directusAuthClient: import('@directus/sdk').AuthenticationClient
    export const directusRealtimeClient: import('@directus/sdk').WebSocketClient
  }
}