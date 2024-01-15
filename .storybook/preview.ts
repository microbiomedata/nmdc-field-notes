import React from 'react';
import type {Preview} from "@storybook/react";
import ionicStoryDecorator from "./decorators/ionic-story-decorator";

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
  // Note: The inclusion of the ionic decorator may break the sample Storybook stories.
  // Reference: https://storybook.js.org/docs/writing-stories/decorators#global-decorators
  decorators: [ionicStoryDecorator],
};

export default preview;