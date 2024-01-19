import type { Preview } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

const preview: Preview = {
  parameters: {
    // Note: This `actions` object was generated automatically during Storybook initialization.
    // Reference: https://storybook.js.org/docs/essentials/actions
    actions: { argTypesRegex: "^on[A-Z].*" },
    // Note: This `controls` object was generated automatically during Storybook initialization.
    // Reference: https://storybook.js.org/docs/essentials/controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Configure Storybook's "viewports" add-on, included with Storybook.
    // Reference: https://storybook.js.org/docs/essentials/viewport
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: "iphone13",
    },
  },
};

export default preview;
