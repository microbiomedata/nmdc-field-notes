import React from "react";
import { SlotGroup } from "../../utils";
import SectionHeader from "../SectionHeader/SectionHeader";
import { IonCheckbox, IonItem, IonLabel, IonList } from "@ionic/react";
import { produce } from "immer";

import styles from "./SlotSelector.module.css";

export interface SlotSelectorProps {
  slotGroups: SlotGroup[];
  alwaysVisibleSlots?: string[];
  visibleSlots: string[];
  onVisibleSlotsChange?: (visibleSlots: string[]) => void;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({
  slotGroups,
  alwaysVisibleSlots,
  visibleSlots,
  onVisibleSlotsChange,
}) => {
  const handleSlotChange = (slotName: string, include: boolean) => {
    if (typeof onVisibleSlotsChange !== "function") {
      return;
    }
    onVisibleSlotsChange(
      produce(visibleSlots, (draft) => {
        if (include) {
          draft.push(slotName);
        } else {
          draft.splice(draft.indexOf(slotName), 1);
        }
      }),
    );
  };

  const handleGroupChange = (group: SlotGroup, include: boolean) => {
    if (typeof onVisibleSlotsChange !== "function") {
      return;
    }
    onVisibleSlotsChange(
      produce(visibleSlots, (draft) => {
        if (include) {
          group.slots.forEach((slot) => {
            if (!draft.includes(slot.name)) {
              draft.push(slot.name);
            }
          });
        } else {
          group.slots.forEach((slot) => {
            const index = draft.indexOf(slot.name);
            const alwaysVisible = alwaysVisibleSlots?.includes(slot.name);
            if (index >= 0 && !alwaysVisible) {
              draft.splice(index, 1);
            }
          });
        }
      }),
    );
  };

  const groupState = (slotGroup: SlotGroup) => {
    const state = { checked: false, indeterminate: false };
    if (slotGroup.slots.every((slot) => visibleSlots.includes(slot.name))) {
      state.checked = true;
    } else if (
      slotGroup.slots.every((slot) => !visibleSlots.includes(slot.name))
    ) {
      state.checked = false;
    } else {
      state.indeterminate = true;
    }
    return state;
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
        {group.slots.map((slot) => (
          <IonItem key={slot.name}>
            <IonCheckbox
              className={styles.slotCheckbox}
              labelPlacement="end"
              justify="start"
              role="checkbox"
              aria-label={`Slot/${slot.name}`}
              checked={visibleSlots.includes(slot.name)}
              onIonChange={(e) => handleSlotChange(slot.name, e.detail.checked)}
              disabled={alwaysVisibleSlots?.includes(slot.name)}
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
