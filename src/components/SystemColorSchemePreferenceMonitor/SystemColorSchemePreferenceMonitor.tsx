import React, { useLayoutEffect } from "react";
import { useStore } from "../../Store";
import {
  ColorScheme,
  documentMQL,
  toggleDarkColorScheme,
} from "../../theme/colorScheme";

/**
 * This component attaches/detaches an event listener from the `MediaQueryList`.
 * The event listener changes the app's color scheme based upon the event.
 */
const SystemColorSchemePreferenceMonitor: React.FC = () => {
  const { colorScheme } = useStore();

  useLayoutEffect(() => {
    const onChangePreference = (event: MediaQueryListEvent) => {
      const prefersDark = event.matches;
      console.debug("Color scheme preference:", prefersDark ? "dark" : "light");
      toggleDarkColorScheme(event.matches);
    };

    // Attach the event listener if the color scheme is "System".
    if (colorScheme === ColorScheme.System) {
      documentMQL.addEventListener("change", onChangePreference);
      console.debug("👂 Listening for changes to color scheme preference.");
    }

    // Detach the event listener.
    return function cleanup() {
      documentMQL.removeEventListener("change", onChangePreference);
      console.debug("🙉 Not listening for changes to color scheme preference.");
    };
  }, [colorScheme]);

  return null;
};

export default SystemColorSchemePreferenceMonitor;
