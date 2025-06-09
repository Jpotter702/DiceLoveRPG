/**
 * Example configuration file
 * Copy this file to config.ts and update the values as needed
 */

export const config = {
  // Application Settings
  app: {
    name: 'Love & Dice RPG',
    version: '0.1.0',
  },

  // Server Configuration
  api: {
    baseUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8000',
  },

  // Development Settings
  development: {
    port: 3000,
    enableMockApi: true,
  },

  // Feature Flags
  features: {
    darkMode: true,
    animations: true,
  },

  // Analytics and Monitoring (for future use)
  analytics: {
    id: '',
    errorReportingDsn: '',
  },

  // Authentication (for future use)
  auth: {
    domain: '',
    clientId: '',
  },
} as const

// Type for the config object
export type Config = typeof config

/**
 * Instructions:
 * 1. Copy this file to config.ts
 * 2. Update the values as needed
 * 3. Add config.ts to .gitignore
 * 
 * Note: When using Vite with environment variables:
 * - All env variables must be prefixed with VITE_
 * - Create a .env file based on these settings
 * Example .env entries:
 * VITE_APP_NAME="Love & Dice RPG"
 * VITE_API_URL="http://localhost:8000"
 */ 