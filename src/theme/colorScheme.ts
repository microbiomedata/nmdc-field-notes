export enum ColorScheme {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}

/**
 * Returns `true` if the value is a valid color scheme.
 */
export const isValidColorScheme = (value: unknown) => {
  return Object.values(ColorScheme).includes(value as ColorScheme);
};

/**
 * Toggles the dark color scheme according to the flag passed in.
 *
 * Note: Activating/deactivating the dark color scheme is a matter of adding/removing
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
export const doesSystemPreferDarkColorScheme = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark;
};

/**
 * Activates the specified color scheme.
 *
 * @param colorScheme {ColorScheme} A value that influences which color scheme gets applied.
 */
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
      toggleDarkColorScheme(doesSystemPreferDarkColorScheme());
      break;
    }
    default: {
      throw new Error(`Invalid color scheme: ${colorScheme}`);
    }
  }
};
