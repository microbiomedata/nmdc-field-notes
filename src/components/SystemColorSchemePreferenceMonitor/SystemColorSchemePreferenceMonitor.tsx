import React, { useLayoutEffect } from "react";
import { useStore } from "../../Store";
import { documentMQL } from "../../theme/colorScheme"
import { ColorScheme, toggleDarkColorScheme } from "../../theme/colorScheme";

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

    // Add the event listener.
    documentMQL.addEventListener("change", onChangePreference);

    // Remove the event listener.
    return function cleanup() {
      documentMQL.removeEventListener("change", onChangePreference);
    };
  }, [colorScheme]);

  return null;
};

export default SystemColorSchemePreferenceMonitor;
