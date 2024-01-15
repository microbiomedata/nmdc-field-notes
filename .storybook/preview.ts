import type {Preview} from "@storybook/react";

const preview: Preview = {
  // Note: This `parameters` object was generated automatically during Storybook initialization.
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // Specify decorators we want Storybook to automatically apply to each story.
  // Reference: https://storybook.js.org/docs/writing-stories/decorators#global-decorators
  decorators: [],
};

export default preview;