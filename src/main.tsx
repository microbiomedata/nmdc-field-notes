import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeFirebase } from "./analytics";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";

// TODO: Consider defining this somewhere within the `src/theme/` directory.
const STATUS_BAR_BACKGROUND_COLOR = "#000000";

async function initializeStatusBar() {
  if (Capacitor.getPlatform() === "android") {
    try {
      await EdgeToEdge.setBackgroundColor({
        color: STATUS_BAR_BACKGROUND_COLOR,
      });
      await StatusBar.setStyle({ style: Style.Dark });
    } catch (error) {
      console.error("Failed to set status bar style:", error);
    }
  }
}

initializeFirebase()
  .then(initializeStatusBar)
  .then(() => {
    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
