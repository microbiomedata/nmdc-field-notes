import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeFirebase } from "./analytics";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { EdgeToEdge } from "@capawesome/capacitor-android-edge-to-edge-support";

async function initializeStatusBar() {
  if (Capacitor.getPlatform() === "android") {
    await EdgeToEdge.setBackgroundColor({ color: "#000000" });
    await StatusBar.setStyle({ style: Style.Dark });
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
