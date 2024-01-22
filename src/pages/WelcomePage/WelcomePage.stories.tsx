import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import WelcomePage from "./WelcomePage";
import ionicApp from "../../lib/stories/decorators/ionicApp";

// Export the component metadata as the default export.
export default {
  title: "WelcomePage",
  component: WelcomePage,
  decorators: [ionicApp]
} as Meta<typeof WelcomePage>;

// Export each story.
export const Default: StoryObj<typeof WelcomePage> = {
  render: (props) => <WelcomePage {...props} />,
};
