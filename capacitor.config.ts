import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.microbiomedata.fieldnotes",
  appName: "NMDC Field Notes",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: process.env.NODE_ENV !== "production",
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
