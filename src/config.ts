/**
 * Configure the app based upon environment variables.
 *
 * This module acts as the single interface between the `import.meta.env` object and the application code.
 * This module adds (a) type hints, (b) documentation, (c) default values, and (d) sanitization.
 *
 * Note: Now that we have implemented https://vitejs.dev/guide/env-and-mode#intellisense-for-typescript,
 *       the "(a) type hints" added by this module are more redundant than before.
 *
 * Reference: https://vitejs.dev/guide/env-and-mode
 */

const env = import.meta.env;

interface Config {
  APP_VERSION: typeof env.PACKAGE_VERSION;
  NMDC_SERVER_API_URL: string;
  SUPPORT_EMAIL: string;
}

const config: Config = {
  /**
   * Version identifier of the app (e.g. "1.23.456").
   *
   * This is the value of the `version` property in the `package.json` file.
   */
  APP_VERSION: env.PACKAGE_VERSION,

  /**
   * URL of the endpoint the mobile app can use to access the NMDC data portal API.
   *
   * Default: The `/api` endpoint in the dev environment.
   */
  NMDC_SERVER_API_URL:
    env.VITE_NMDC_SERVER_API_URL || "https://data-dev.microbiomedata.org",

  /**
   * Support email address.
   */
  SUPPORT_EMAIL: env.VITE_SUPPORT_EMAIL || "support@microbiomedata.org",
};

export default config;
