import React from "react";
import { SlotGroup } from "../../utils";
import SectionHeader from "../SectionHeader/SectionHeader";
import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/react";
import { produce } from "immer";

import styles from "./SlotSelector.module.css";

export interface SlotSelectorProps {
  slotGroups: SlotGroup[];
  disabledSlots?: string[];
  selectedSlots: string[];
  onSelectedSlotsChange?: (selectedSlots: string[]) => void;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({
  slotGroups,
  disabledSlots,
  selectedSlots,
  onSelectedSlotsChange,
}) => {
  const handleSlotChange = (slotName: string, checked: boolean) => {
    if (typeof onSelectedSlotsChange !== "function") {
      return;
    }
    // When an individual slot is toggled, produce a new list of selected slots by either adding
    // or removing the slot name from the existing list and call the onSelectedSlotsChange callback
    onSelectedSlotsChange(
      produce(selectedSlots, (draft) => {
        if (checked) {
          draft.push(slotName);
        } else {
          draft.splice(draft.indexOf(slotName), 1);
        }
      }),
    );
  };

  const handleGroupChange = (group: SlotGroup, checked: boolean) => {
    if (typeof onSelectedSlotsChange !== "function") {
      return;
    }
    // When a group is toggled, produce a new list of selected slots by either adding or removing
    // all slots in the group from the existing list. Only slots that are not already included in
    // the list are added, and only slots that are included are removed. Disabled slots are never
    // added or removed. Call the onSelectedSlotsChange callback with the new list of selected
    // slots.
    onSelectedSlotsChange(
      produce(selectedSlots, (draft) => {
        if (checked) {
          group.slots.forEach((slot) => {
            const disabled = disabledSlots?.includes(slot.name);
            if (!draft.includes(slot.name) && !disabled) {
              draft.push(slot.name);
            }
          });
        } else {
          group.slots.forEach((slot) => {
            const index = draft.indexOf(slot.name);
            const disabled = disabledSlots?.includes(slot.name);
            if (index >= 0 && !disabled) {
              draft.splice(index, 1);
            }
          });
        }
      }),
    );
  };

  const groupState = (slotGroup: SlotGroup) => {
    // The group is checked if all the non-disabled slots are selected
    const checked = slotGroup.slots.every(
      (slot) =>
        selectedSlots.includes(slot.name) || disabledSlots?.includes(slot.name),
    );
    // These are the slots that are selected, whether they are disabled or not
    const selectedInGroup = slotGroup.slots.filter((slot) =>
      selectedSlots.includes(slot.name),
    );
    // The group is indeterminate if some but not all slots are selected, regardless
    // of disabled status
    const indeterminate =
      selectedInGroup.length > 0 &&
      selectedInGroup.length < slotGroup.slots.length;

    return {
      checked,
      indeterminate,
    };
  };

  return slotGroups.map((group) => (
    <React.Fragment key={group.name}>
      <SectionHeader>
        <IonCheckbox
          labelPlacement="end"
          justify="start"
          role="checkbox"
          aria-label={`Group/${group.name}`}
          {...groupState(group)}
          onIonChange={(e) => handleGroupChange(group, e.detail.checked)}
        >
          {group.title}
        </IonCheckbox>
      </SectionHeader>
      <IonList className="ion-padding-bottom">
        {group.description && (
          <div className="ion-padding-horizontal ion-padding-bottom nmdc-text-sm">
            {group.description}
          </div>
        )}
        {group.slots.map((slot) => (
          <IonItem key={slot.name}>
            <IonCheckbox
              className={styles.slotCheckbox}
              labelPlacement="end"
              justify="start"
              role="checkbox"
              aria-label={`Slot/${slot.name}`}
              checked={selectedSlots.includes(slot.name)}
              onIonChange={(e) => handleSlotChange(slot.name, e.detail.checked)}
              disabled={disabledSlots?.includes(slot.name)}
            >
              <IonLabel>
                <h3>{slot.title || slot.name}</h3>
                <p>{slot.description}</p>
              </IonLabel>
            </IonCheckbox>
          </IonItem>
        ))}
      </IonList>
    </React.Fragment>
  ));
};

export default SlotSelector;
