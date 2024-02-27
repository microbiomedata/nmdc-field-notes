import { Meta, StoryObj } from "@storybook/react";
import ionicContent from "../../lib/stories/decorators/ionicContent";
import SampleList from "./SampleList";
import { generateSubmission } from "../../mocks/fixtures";

export default {
  title: "Components/SampleList",
  component: SampleList,
  decorators: [ionicContent],
} as Meta<typeof SampleList>;

type Story = StoryObj<typeof SampleList>;

export const Default: Story = {
  args: {
    submission: generateSubmission(30),
  },
};

export const FewSamples: Story = {
  args: {
    submission: generateSubmission(3),
  },
};

export const NoSamples: Story = {
  args: {
    submission: generateSubmission(0),
  },
};
