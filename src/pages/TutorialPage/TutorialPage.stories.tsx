import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TutorialPage from "./TutorialPage";
import ionicApp from "../../lib/stories/decorators/ionicApp";

// Export the component metadata as the default export.
export default {
  title: "Pages/TutorialPage",
  component: TutorialPage,
  decorators: [ionicApp]
} as Meta<typeof TutorialPage>;

// Export each story.
export const Default: StoryObj<typeof TutorialPage> = {
  render: (props) => <TutorialPage {...props} />,
};
