/// <reference types="vitest" />
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  define: {
    // This makes the `version` value from `package.json` available to the app
    // as `import.meta.env.FIELD_NOTES_VERSION_NUMBER`. This only works when
    // invoked by an NPM script (i.e. `npm run <script>`).
    "import.meta.env.FIELD_NOTES_VERSION_NUMBER": JSON.stringify(
      process.env.npm_package_version,
    ),
    // This makes the `config.buildNumber` value from `package.json` available to
    // the app as `import.meta.env.FIELD_NOTES_BUILD_NUMBER`. This only works when
    // invoked by an NPM script (i.e. `npm run <script>`).
    "import.meta.env.FIELD_NOTES_BUILD_NUMBER": JSON.stringify(
      process.env.npm_package_config_buildNumber,
    ),
  },
});
