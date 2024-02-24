import NoneOr from "./NoneOr";
import { Meta, StoryObj } from "@storybook/react";
import ionicContent from "../../lib/stories/decorators/ionicContent";

export default {
  title: "Components/NoneOr",
  component: NoneOr,
  decorators: [ionicContent],
} as Meta<typeof NoneOr>;

type Story = StoryObj<typeof NoneOr>;

export const Default: Story = {
  args: {
    children: "Hello, world!",
  },
};

export const ShowPlaceholderOverride: Story = {
  args: {
    ...Default.args,
    showPlaceholder: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    children: undefined,
    placeholder: "Nothing to see here",
  },
};
