import { Capacitor } from "@capacitor/core";
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import config from "./config";

const firebaseConfig = {
  apiKey: "AIzaSyBbDrRDc3SV9W7ISMUl4vCzcYEh5rTXYFg",
  authDomain: "nmdc-field-notes.firebaseapp.com",
  projectId: "nmdc-field-notes",
  storageBucket: "nmdc-field-notes.firebasestorage.app",
  messagingSenderId: "619629267623",
  appId: "1:619629267623:web:6a89e4b6f2082c9ffa2982",
  measurementId: "G-2GJ02HE6L2",
};

/**
 * Initialize Firebase and set the collection enabled status based on the app's configuration.
 */
export async function initializeFirebase() {
  // This step is only necessary for web platforms. Initialization is automatic on native platforms.
  if (Capacitor.getPlatform() === "web") {
    await FirebaseAnalytics.initializeFirebase(firebaseConfig);
  }

  await FirebaseAnalytics.setCollectionEnabled({
    enabled: config.ENABLE_FIREBASE_ANALYTICS,
  });
}

/**
 * Log a screen view event with the specified path.
 *
 * The native Firebase SDKs can automatically log screen view events for Android and iOS. However,
 * the web version does not have this capability. Moreover, the native SDKs will only see our app
 * as a single screen because it doesn't know anything about what the Ionic router is doing. So, we
 * have disabled the automatic screen view logging via native configuration files and are instead
 * logging screen views manually based on the current route.
 *
 * See also:
 * - https://firebase.google.com/docs/analytics/screenviews
 * - https://firebase.blog/posts/2020/08/google-analytics-manual-screen-view
 * - src/AnalyticsScreenViewListener.tsx
 *
 * @param path
 */
export async function logScreenViewEvent(path: string) {
  await FirebaseAnalytics.logEvent({
    name: "screen_view",
    params: {
      firebase_screen: path,
    },
  });
}
