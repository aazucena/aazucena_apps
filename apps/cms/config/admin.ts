import { ConfigContext } from '../types/strapi';

export default ({ env }: ConfigContext) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  url: env('ADMIN_PATH', '/admin'),
  // Vite dev server configuration for Docker
  vite: {
    server: {
      host: '0.0.0.0', // Bind to all network interfaces
      port: 5173,
      strictPort: true, // Fail if port is already in use
      hmr: {
        clientPort: 5173, // HMR client port
        host: 'localhost', // HMR host (use 'localhost' for browser)
      },
    },
  },
  watchIgnoreFiles: [
    '**/logs/**', // Ignores any 'logs' folder at any level
    './temp/**',   // Ignores a 'temp' folder in the project root
    '**/tests/**', // Ignores test folders
    '**/services/**', // Ignores clickhouse folders
  ],
});
