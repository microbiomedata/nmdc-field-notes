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

export async function initializeFirebase() {
  // This step is only necessary for web platforms. Initialization is automatic on native platforms.
  if (Capacitor.getPlatform() === "web") {
    await FirebaseAnalytics.initializeFirebase(firebaseConfig);
  }

  await FirebaseAnalytics.setCollectionEnabled({
    enabled: config.ENABLE_FIREBASE_ANALYTICS,
  });
}
