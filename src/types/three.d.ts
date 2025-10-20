declare module 'three';

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
