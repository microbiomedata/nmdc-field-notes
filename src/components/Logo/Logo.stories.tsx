import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Logo from "./Logo";
import ionicContent from "../../lib/stories/decorators/ionicContent";

// Export the component metadata as the default export.
export default {
  title: "Images/Logo",
  component: Logo,
  decorators: [ionicContent]
} as Meta<typeof Logo>;

// Export each story.
export const Default: StoryObj<typeof Logo> = {
  render: (props) => <Logo {...props} />,
};
