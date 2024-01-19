import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ExploreContainer from "./ExploreContainer";
import ionicContent from "../lib/stories/decorators/ionicContent";

// Export the component metadata as the default export.
export default {
  title: "Ionic/ExploreContainer",
  component: ExploreContainer,
  decorators: [ionicContent]
} as Meta<typeof ExploreContainer>;

// Export each story.
export const Default: StoryObj<typeof ExploreContainer> = {
  render: (props) => <ExploreContainer {...props} />,
};
