/// <reference types="vite/client" />

/**
 * Specify TypeScript type information for the properties of `import.meta.env`,
 * so IDEs can display their types as something other than `any`.
 *
 * Reference: https://vitejs.dev/guide/env-and-mode#intellisense-for-typescript
 */
interface ImportMetaEnv {
  readonly VITE_NMDC_SERVER_API_URL?: string;
  readonly VITE_NMDC_SERVER_LOGIN_URL?: string;
  readonly PACKAGE_VERSION: string;
}

/**
 * Augment the `ImportMeta` interface defined in the Vite package, with the
 * `ImportMetaEnv` interface defined above.
 *
 * Note: Without this `ImportMeta` interface here, PyCharm tells me the
 *       above `ImportMetaEnv` interface is unused.
 *
 * See: node_modules/vite/types/importMeta.d.ts
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
