import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ChecklistPage from "./ChecklistPage";
import ionicApp from "../../lib/stories/decorators/ionicApp";

// Export the component metadata as the default export.
export default {
  title: "Pages/ChecklistPage",
  component: ChecklistPage,
  decorators: [ionicApp],
} as Meta<typeof ChecklistPage>;

// Export each story.
export const Default: StoryObj<typeof ChecklistPage> = {
  render: (props) => <ChecklistPage {...props} />,
};
