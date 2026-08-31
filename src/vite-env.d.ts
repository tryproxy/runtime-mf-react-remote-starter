/// <reference types="vite/client" />

declare module '*.css?standalone';

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
