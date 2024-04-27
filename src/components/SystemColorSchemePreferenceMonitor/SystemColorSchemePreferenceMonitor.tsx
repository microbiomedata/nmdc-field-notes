import React, { useLayoutEffect } from "react";
import { useStore } from "../../Store";
import { ColorScheme, toggleDarkColorScheme } from "../../theme/colorScheme";

// Get a reference to a `MediaQueryList` to which I can attach an event listener
// so that I can respond to `change` events.
//
// References:
// - https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
// - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
//
const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * This component monitors the "CSS media feature `prefers-color-scheme`,"
 * which I refer to as the system's color scheme preference.
 */
const SystemColorSchemePreferenceMonitor: React.FC = () => {
  const { colorScheme } = useStore();

  useLayoutEffect(() => {
    const onChangePreference = (event: MediaQueryListEvent) => {
      console.debug("System prefers dark color scheme: ", event.matches);
      if (colorScheme === ColorScheme.System) {
        toggleDarkColorScheme(event.matches);
      }
    };

    // Set up an event listener that listens for changes in the system's color scheme preference.
    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
    mediaQueryList.addEventListener("change", onChangePreference);

    // Remove the event listener.
    return function cleanup() {
      mediaQueryList.removeEventListener("change", onChangePreference);
    };
  }, [colorScheme]);

  return null;
};

export default SystemColorSchemePreferenceMonitor;
