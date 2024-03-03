/**
 * Configure the app based upon environment variables.
 *
 * This module acts as the single interface between the `import.meta.env` object and the application code.
 * This module adds (a) type hints, (b) documentation, (c) default values, and (d) sanitization.
 *
 * Reference: https://vitejs.dev/guide/env-and-mode
 */

const env = import.meta.env;

interface Config {
  NMDC_SERVER_API_URL: string;
  NMDC_SERVER_LOGIN_URL: string;
}

const config: Config = {
  /**
   * URL of the endpoint the mobile app can use to access the NMDC data portal API.
   *
   * Default: The `/api` endpoint in the dev environment.
   */
  NMDC_SERVER_API_URL:
    env.VITE_NMDC_SERVER_API_URL || "https://data-dev.microbiomedata.org/api",

  /**
   * URL of the endpoint the mobile app can use to authenticate with the NMDC data portal API.
   *
   * Default: The `/login` endpoint in the dev environment.
   */
  NMDC_SERVER_LOGIN_URL:
    env.VITE_NMDC_SERVER_LOGIN_URL || "https://data-dev.microbiomedata.org/login",
};

export default config;
