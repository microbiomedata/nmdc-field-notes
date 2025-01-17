import { CapacitorConfig } from "@capacitor/cli";

const baseConfig: CapacitorConfig = {
  appId: "org.microbiomedata.fieldnotes",
  appName: "NMDC Field Notes",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      androidScaleType: "CENTER_CROP",
      splashImmersive: true,
    },
  },
};

let config: CapacitorConfig;

switch (process.env.NODE_ENV) {
  case "production":
  case "prod":
    // PRODUCTION CONFIGURATION
    config = {
      ...baseConfig,
      android: {
        ...baseConfig.android,
        flavor: "prod",
      },
      ios: {
        ...baseConfig.ios,
        scheme: "App_Prod",
      },
    };
    break;

  default:
    // DEVELOPMENT CONFIGURATION
    config = {
      ...baseConfig,
      appId: baseConfig.appId + ".dev",
      appName: baseConfig.appName + " DEV",
      android: {
        ...baseConfig.android,
        flavor: "dev",
      },
      ios: {
        ...baseConfig.ios,
        scheme: "App",
      },
      server: {
        ...baseConfig.server,
        cleartext: true,
      },
    };
    break;
}

export default config;
