/// <reference types="vitest" />
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import packageVersion from "vite-plugin-package-version";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    /**
     * Note: The `packageVersion()` plugin reads the `version` value from `package.json`
     *       and makes it available to the app via `import.meta.env.PACKAGE_VERSION`.
     *       Reference: https://www.npmjs.com/package/vite-plugin-package-version
     */
    packageVersion(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
