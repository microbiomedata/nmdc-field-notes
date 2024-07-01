import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SlotSelector from "./SlotSelector";
import { slotGroups } from "./fixtures";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

function renderSlotSelector(
  selectedSlots: string[],
  alwaysSelectedSlots: string[] = [],
) {
  const user = userEvent.setup();
  const handleSelectedSlotsChange = vi.fn();
  render(
    <SlotSelector
      slotGroups={slotGroups}
      selectedSlots={selectedSlots}
      alwaysSelectedSlots={alwaysSelectedSlots}
      onSelectedSlotsChange={handleSelectedSlotsChange}
    />,
  );

  const groupCheckboxes = slotGroups.map((group) => {
    return screen.getByRole("checkbox", { name: "Group/" + group.name });
  });
  const slotCheckboxes = slotGroups.flatMap((group) => {
    return group.slots.map((slot) => {
      return screen.getByRole("checkbox", { name: "Slot/" + slot.name });
    });
  });

  return { user, handleSelectedSlotsChange, groupCheckboxes, slotCheckboxes };
}

describe("SlotSelector", () => {
  it("renders the given slot groups", () => {
    const { groupCheckboxes, slotCheckboxes } = renderSlotSelector([]);

    // All groups should be rendered and unchecked
    expect(groupCheckboxes).toHaveLength(3);
    groupCheckboxes.forEach((groupCheckbox) => {
      expect(groupCheckbox).toBeInTheDocument();
      expect(groupCheckbox.getAttribute("checked")).toBe("false");
      expect(groupCheckbox.getAttribute("indeterminate")).toBe("false");
    });

    // All slots should be rendered and unchecked
    expect(slotCheckboxes).toHaveLength(9);
    slotCheckboxes.forEach((slotCheckbox) => {
      expect(slotCheckbox).toBeInTheDocument();
      expect(slotCheckbox.getAttribute("checked")).toBe("false");
    });
  });

  it("marks group as checked if all slots are selected", () => {
    const selectedSlots = ["slot1", "slot2", "slot3"];
    const { groupCheckboxes, slotCheckboxes } =
      renderSlotSelector(selectedSlots);

    // The first group should be checked
    expect(groupCheckboxes[0].getAttribute("checked")).toBe("true");
    expect(groupCheckboxes[0].getAttribute("indeterminate")).toBe("false");

    // The first three slots should be checked
    slotCheckboxes.slice(0, 3).forEach((slotCheckbox) => {
      expect(slotCheckbox.getAttribute("checked")).toBe("true");
    });
  });

  it("marks group as indeterminate if some slots are selected", () => {
    const { groupCheckboxes } = renderSlotSelector(["slot1", "slot3"]);

    // The first group should be indeterminate
    expect(groupCheckboxes[0].getAttribute("checked")).toBe("false");
    expect(groupCheckboxes[0].getAttribute("indeterminate")).toBe("true");
  });

  it("calls onSelectedSlotsChange when an unchecked slot is checked", async () => {
    const { user, handleSelectedSlotsChange, slotCheckboxes } =
      renderSlotSelector(["slot1", "slot3"]);

    // click the slot2 checkbox
    await user.click(slotCheckboxes[1]);

    await waitFor(() =>
      expect(handleSelectedSlotsChange).toHaveBeenCalledWith([
        "slot1",
        "slot3",
        "slot2",
      ]),
    );
  });

  it("calls onSelectedSlotsChange when a checked slot is unchecked", async () => {
    const { user, handleSelectedSlotsChange, slotCheckboxes } =
      renderSlotSelector(["slot1", "slot3"]);

    // check the slot1 checkbox
    await user.click(slotCheckboxes[0]);

    await waitFor(() =>
      expect(handleSelectedSlotsChange).toHaveBeenCalledWith(["slot3"]),
    );
  });

  it("calls onSelectedSlotsChange when an unchecked group is checked", async () => {
    const { user, handleSelectedSlotsChange, groupCheckboxes } =
      renderSlotSelector([]);

    // Check the first group
    await user.click(groupCheckboxes[0]);

    await waitFor(() =>
      expect(handleSelectedSlotsChange).toHaveBeenCalledWith([
        "slot1",
        "slot2",
        "slot3",
      ]),
    );
  });

  it("calls onSelectedSlotsChange when an checked group is unchecked", async () => {
    const { user, handleSelectedSlotsChange, groupCheckboxes } =
      renderSlotSelector(["slot1", "slot2", "slot3"]);

    // Uncheck the first group
    await user.click(groupCheckboxes[0]);

    await waitFor(() =>
      expect(handleSelectedSlotsChange).toHaveBeenCalledWith([]),
    );
  });

  it("calls onSelectedSlotsChange when an indeterminate group is checked", async () => {
    const { user, handleSelectedSlotsChange, groupCheckboxes } =
      renderSlotSelector(["slot1", "slot3"]);

    // Check the first group
    await user.click(groupCheckboxes[0]);

    await waitFor(() =>
      expect(handleSelectedSlotsChange).toHaveBeenCalledWith([
        "slot1",
        "slot3",
        "slot2",
      ]),
    );
  });

  it("marks always selected slots as disabled", () => {
    const { slotCheckboxes } = renderSlotSelector(
      ["slot1", "slot2"],
      ["slot1"],
    );

    // The first slot checkbox should be disabled
    expect(slotCheckboxes[0].getAttribute("checked")).toBe("true");
    expect(slotCheckboxes[0].getAttribute("disabled")).toBe("true");
  });

  it("includes always selected slots in onSelectedSlotsChange call when toggling group", async () => {
    const { user, handleSelectedSlotsChange, groupCheckboxes } =
      renderSlotSelector(["slot1", "slot2", "slot3"], ["slot1"]);

    expect(groupCheckboxes[0].getAttribute("checked")).toBe("true");

    // Uncheck the first group checkbox
    await user.click(groupCheckboxes[0]);

    await waitFor(() =>
      expect(handleSelectedSlotsChange).toHaveBeenCalledWith(["slot1"]),
    );
  });
});
