import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.microbiomedata.fieldnotes",
  appName: "NMDC Field Notes",
  webDir: "dist",
  server: {
    androidScheme: "https",
    // TODO: Don't use this in production!
    // https://capacitorjs.com/docs/guides/environment-specific-configurations
    cleartext: true,
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

export default config;
