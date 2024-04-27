export enum ColorScheme {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}

/**
 * Toggles the dark color scheme according to the flag passed in.
 *
 * Note: Activate/deactivating the dark color scheme is a matter of adding/removing
 *       the `.ion-palette-dark` class from the `<html>` element.
 *
 * Reference: https://ionicframework.com/docs/theming/dark-mode#css-class
 *
 * @param wantsDarkColorScheme {boolean} Whether you want the dark color scheme to be enabled.
 */
export const toggleDarkColorScheme = (wantsDarkColorScheme: boolean) => {
  const htmlEl = document.documentElement;
  htmlEl.classList.toggle("ion-palette-dark", wantsDarkColorScheme);
};

/**
 * Checks whether the system prefers the dark color scheme.
 */
export const checkWhetherSystemPrefersDarkness = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/**
 * Set up an event listener that keeps the app's color scheme in sync with the system preference.
 */
export const watchSystemColorSchemePreference = () => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      const wantsDarkness = event.matches;

      // FIXME: Only do this if the user has selected the `System` color scheme.
      if (true) {
        toggleDarkColorScheme(wantsDarkness);
      }
    });
};

export const activateColorScheme = (colorScheme: ColorScheme) => {
  switch (colorScheme) {
    case ColorScheme.Light: {
      toggleDarkColorScheme(false);
      break;
    }
    case ColorScheme.Dark: {
      toggleDarkColorScheme(true);
      break;
    }
    case ColorScheme.System: {
      const systemPrefersDarkColorScheme = checkWhetherSystemPrefersDarkness();
      if (systemPrefersDarkColorScheme) {
        toggleDarkColorScheme(true);
      } else {
        toggleDarkColorScheme(false);
      }
      break;
    }
    default: {
      throw new Error(`Invalid color scheme: ${colorScheme}`);
    }
  }
};
