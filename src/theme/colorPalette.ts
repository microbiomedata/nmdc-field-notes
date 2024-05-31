// These are the options that the app will present to the user.
export enum ColorPaletteMode {
  Dark = "Dark",
  Light = "Light",
  System = "System",
}

// Get a single reference to the `<html>` element within which the app exists.
const htmlEl = document.documentElement;

// Get a single reference to a `MediaQueryList` that the app can use to both:
// (a) determine whether the user currently prefers dark color schemes and
// (b) react to changes in that preference over time.
//
// References:
// - https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
// - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
//
export const documentMQL: MediaQueryList = window.matchMedia(
  "(prefers-color-scheme: dark)",
);

/**
 * Returns `true` if the value is a valid color palette mode.
 */
export const isValidColorPaletteMode = (value: unknown) => {
  return Object.values(ColorPaletteMode).includes(value as ColorPaletteMode);
};

/**
 * Toggles the dark color palette according to the flag passed in.
 *
 * Note: Activating/deactivating the dark color palette involves adding/removing
 *       the `.ion-palette-dark` class to/from the `<html>` element.
 *
 * Reference: https://ionicframework.com/docs/theming/dark-mode#css-class
 *
 * @param wantsDarkColorPalette {boolean} Whether you want the dark color palette to be enabled
 */
export const toggleDarkColorPalette = (wantsDarkColorPalette: boolean) => {
  htmlEl.classList.toggle("ion-palette-dark", wantsDarkColorPalette);
};

/**
 * Checks whether the user prefers dark color schemes.
 */
export const checkWhetherUserPrefersDarkColorSchemes = (): boolean => {
  return documentMQL.matches;
};

/**
 * Applies a color palette based upon the specified color palette mode.
 *
 * @param colorPaletteMode {ColorPaletteMode} A color palette mode
 */
export const applyColorPalette = (colorPaletteMode: ColorPaletteMode) => {
  switch (colorPaletteMode) {
    case ColorPaletteMode.Light: {
      toggleDarkColorPalette(false);
      break;
    }
    case ColorPaletteMode.Dark: {
      toggleDarkColorPalette(true);
      break;
    }
    case ColorPaletteMode.System: {
      const userPrefersDarkColorSchemes =
        checkWhetherUserPrefersDarkColorSchemes();
      toggleDarkColorPalette(userPrefersDarkColorSchemes);
      break;
    }
    default: {
      throw new Error(`Invalid color palette mode: ${colorPaletteMode}`);
    }
  }
};
