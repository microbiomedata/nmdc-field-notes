import { Capacitor } from "@capacitor/core";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";
import { initializeApp } from "firebase/app";
import config from "./config";
import { SampleDataValue } from "./api";

// This is the config of the `nmdc-field-notes-dev` Firebase project. The production project config
// is intentionally not included here. Traffic to any web version should be considered dev usage.
const firebaseConfig = {
  apiKey: "AIzaSyBWBqL0HTO2kthzkIY9Cb29WBuZtiGagmU",
  authDomain: "nmdc-field-notes-dev.firebaseapp.com",
  projectId: "nmdc-field-notes-dev",
  storageBucket: "nmdc-field-notes-dev.firebasestorage.app",
  messagingSenderId: "1064768027275",
  appId: "1:1064768027275:web:29b1100febfbaf3c85b28e",
  measurementId: "G-1GV5DB2T8Y",
};

let initialized = false;

/**
 * Initialize Firebase and set the collection enabled status based on the app's configuration.
 */
export async function initializeFirebase() {
  // This step is only necessary for the web platform. Initialization happens automatically on
  // native platforms.
  if (!initialized && Capacitor.getPlatform() === "web") {
    initializeApp(firebaseConfig);
  }
  initialized = true;

  await FirebaseAnalytics.setEnabled({
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
export async function setAnalyticsCurrentScreen(path: string) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.setCurrentScreen({ screenName: path });
}

/**
 * Set or clear the user ID associated with future analytics events.
 *
 * Note that when viewing events in the Firebase DebugView, you will see the user ID being set on,
 * for example, logging in. However, you will not see the user ID being cleared when logging out.
 * This seems to be a bug with the DebugView itself and not how the event data is recorded, according
 * to these issues:
 * - https://github.com/firebase/firebase-android-sdk/issues/3602
 * - https://github.com/firebase/firebase-ios-sdk/issues/4856
 *
 * @param userId
 */
export async function setAnalyticsUserId(userId: string | null) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.setUserId({ userId });
}

/**
 * Log an event indicating that a study was created.
 *
 * @param submissionId
 * @param templates
 */
export async function logStudyCreatedEvent(
  submissionId: string,
  templates: string[],
) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.logEvent({
    name: "study_created",
    params: {
      submission_id: submissionId,
      templates: templates.toString(), // Arrays are not supported as event parameter values
    },
  });
}

/**
 * Log an event indicating that a study was updated via the study form. This is not logged when
 * samples are added or removed from the study.
 *
 * @param submissionId
 */
export async function logStudyUpdatedEvent(submissionId: string) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.logEvent({
    name: "study_updated",
    params: {
      submission_id: submissionId,
    },
  });
}

/**
 * Log an event indicating that a study was deleted.
 *
 * @param submissionId
 */
export async function logStudyDeletedEvent(submissionId: string) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.logEvent({
    name: "study_deleted",
    params: {
      submission_id: submissionId,
    },
  });
}

/**
 * Log an event indicating that a sample was created.
 *
 * @param submissionId
 * @param template
 */
export async function logSampleCreatedEvent(
  submissionId: string,
  template: string,
) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.logEvent({
    name: "sample_created",
    params: {
      submission_id: submissionId,
      template,
    },
  });
}

/**
 * Log an event indicating that a sample was updated.
 *
 * @param submissionId
 * @param template
 * @param slotName
 * @param previousValue
 * @param value
 */
export async function logSampleUpdatedEvent(
  submissionId: string,
  template: string,
  slotName: string,
  previousValue: SampleDataValue,
  value: SampleDataValue,
) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.logEvent({
    name: "sample_updated",
    params: {
      submission_id: submissionId,
      template,
      slot_name: slotName,
      previous_value: previousValue == null ? null : previousValue.toString(),
      value: value == null ? null : value.toString(),
    },
  });
}

/**
 * Log an event indicating that a sample was deleted.
 *
 * @param submissionId
 * @param template
 */
export async function logSampleDeletedEvent(
  submissionId: string,
  template: string,
) {
  if (!initialized) {
    return;
  }
  await FirebaseAnalytics.logEvent({
    name: "sample_deleted",
    params: {
      submission_id: submissionId,
      template,
    },
  });
}
