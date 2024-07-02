import React from "react";
import SlotSelector from "./SlotSelector";
import { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import ionicContent from "../../lib/stories/decorators/ionicContent";
import { slotGroups } from "./fixtures";

export default {
  title: "Components/SlotSelector",
  component: SlotSelector,
  decorators: [ionicContent],
} as Meta<typeof SlotSelector>;

type Story = StoryObj<typeof SlotSelector>;

export const Default: Story = {
  args: {
    slotGroups,
    selectedSlots: ["slot1", "slot3", "slot7", "slot8", "slot9"],
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <SlotSelector
        {...args}
        onSelectedSlotsChange={(selectedSlots) => {
          updateArgs({ selectedSlots });
        }}
      />
    );
  },
};

export const WithDisabledSlots: Story = {
  args: {
    slotGroups,
    disabledSlots: ["slot1", "slot4"],
    selectedSlots: ["slot1", "slot3", "slot7", "slot8", "slot9"],
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <SlotSelector
        {...args}
        onSelectedSlotsChange={(selectedSlots) => {
          updateArgs({ selectedSlots });
        }}
      />
    );
  },
};
