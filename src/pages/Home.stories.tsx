import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ionicApp from "../lib/stories/decorators/ionicApp";
import Home from "./Home";

// Export the component metadata as the default export.
export default {
  title: "Pages/Home",
  component: Home,
  decorators: [ionicApp],
} as Meta<typeof Home>;

// Export each story.
export const Default: StoryObj<typeof Home> = {
  render: (props) => <Home {...props} />,
};
