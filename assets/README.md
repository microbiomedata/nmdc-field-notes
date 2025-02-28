# Icon and splash screen assets

This directory contains files used to generate the native app icon and splash screen assets.

* `NMDC_logo.svg` is an Inkscape SVG file. It contains layers for light and dark logo variations, as well as a layer with the Android icon keylines (https://developer.android.com/distribute/google-play/resources/icon-design-specifications#attributes).
* `logo.png` and `logo-dark.png` are PNG exports of the light and dark logo variations, respectively, at 1024x1024 pixels. These files were exported from the `NMDC_logo.svg` file. These files, in turn, are used to generate the app icon assets via the `@capacitor/assets` package.

To regenerate the icon and splash assets for native projects:

1. Make any necessary changes to the `NMDC_logo.svg` file in Inkscape.
2. Export the `logo.png` and `logo-dark.png` files from the SVG file at 1024x1024 pixels. Use layer visibility to export the appropriate variation.
3. Run the following command to generate the assets:

```bash
npm run build.assets
```