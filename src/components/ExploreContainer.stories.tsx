import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ExploreContainer from "./ExploreContainer";
import ionicStoryDecorator from "../../.storybook/decorators/ionic-story-decorator";

// Export the component metadata as the default export.
export default {
  title: "Ionic/ExploreContainer",
  component: ExploreContainer,
  decorators: [ionicStoryDecorator]
} as Meta<typeof ExploreContainer>;

// Export each story.
export const Default: StoryObj<typeof ExploreContainer> = {
  render: (props) => <ExploreContainer {...props} />,
};
