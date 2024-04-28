import React, { useEffect } from "react";
import { useStore } from "../../Store";
import {
  ColorScheme,
  documentMQL,
  toggleDarkColorScheme,
} from "../../theme/colorScheme";

/**
 * This component attaches/detaches an event listener to/from the `MediaQueryList`
 * that indicates whether the user prefers a dark color scheme. The event listener
 * listens for the "change" event and updates the app's color palette accordingly.
 */
const ColorSchemePreferenceMonitor: React.FC = () => {
  const { colorScheme } = useStore();

  useEffect(() => {
    const onChangePreference = (event: MediaQueryListEvent) => {
      const isPreferenceDark = event.matches;
      console.debug(
        "Color scheme preference:",
        isPreferenceDark ? "dark" : "light",
      );
      toggleDarkColorScheme(event.matches);
    };

    // Attach the event listener if the color scheme is "System".
    if (colorScheme === ColorScheme.System) {
      documentMQL.addEventListener("change", onChangePreference);
      console.debug("👂 Listening for changes to color scheme preference.");
    }

    // Note: This "cleanup" function detaches the event listener.
    // Reference: https://react.dev/reference/react/useEffect#usage
    return function cleanup() {
      documentMQL.removeEventListener("change", onChangePreference);
      console.debug("🙉 Not listening for changes to color scheme preference.");
    };
  }, [colorScheme]);

  return null;
};

export default ColorSchemePreferenceMonitor;
