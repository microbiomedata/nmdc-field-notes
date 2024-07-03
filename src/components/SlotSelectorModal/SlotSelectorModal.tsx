import React, { useEffect, useMemo } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import RequiredMark from "../RequiredMark/RequiredMark";
import SlotSelector from "../SlotSelector/SlotSelector";
import { useSubmissionSchema } from "../../queries";
import { groupClassSlots } from "../../utils";
import { TEMPLATES } from "../../api";
import { useStore } from "../../Store";

import styles from "./SlotSelectorModal.module.css";

export interface SlotSelectorModalProps {
  onDismiss: () => void;
  isOpen: boolean;
  packageName?: string;
}
const SlotSelectorModal: React.FC<SlotSelectorModalProps> = ({
  onDismiss,
  isOpen,
  packageName,
}) => {
  const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);
  const schema = useSubmissionSchema();
  const { getHiddenSlotsForSchemaClass, setHiddenSlotsForSchemaClass } =
    useStore();

  const schemaClassName = packageName && TEMPLATES[packageName].schemaClass;
  const templateName = packageName && TEMPLATES[packageName].displayName;

  const slotGroups = useMemo(
    () =>
      schema.data && schemaClassName !== undefined
        ? groupClassSlots(schema.data.schema, schemaClassName)
        : [],
    [schema.data, schemaClassName],
  );
  const allSlotNames = useMemo(
    () => slotGroups.flatMap((group) => group.slots.map((s) => s.name)),
    [slotGroups],
  );

  // This translates a list of hidden slots from the store into a list of selected slots for the
  // SlotSelector component. If there are no hidden slots, all slots are selected by default. The
  // isOpen state is used to reset the selected slots when the modal is closed (i.e. don't keep
  // changes if the user cancels out of the modal).
  useEffect(() => {
    if (isOpen && schemaClassName !== undefined) {
      const hiddenSlotsFromStore =
        getHiddenSlotsForSchemaClass(schemaClassName);
      if (hiddenSlotsFromStore === undefined) {
        setSelectedSlots(allSlotNames);
      } else {
        setSelectedSlots(
          allSlotNames.filter((s) => !hiddenSlotsFromStore.includes(s)),
        );
      }
    } else {
      setSelectedSlots([]);
    }
  }, [getHiddenSlotsForSchemaClass, isOpen, schemaClassName, allSlotNames]);

  // When the user taps the Save button, translate the selected slots back into a list of hidden
  // slots and save them to the store. Then close the modal.
  const handleSave = () => {
    if (schemaClassName !== undefined) {
      const hiddenSlots = allSlotNames.filter(
        (s) => !selectedSlots.includes(s),
      );
      setHiddenSlotsForSchemaClass(schemaClassName, hiddenSlots);
    }
    onDismiss();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onIonModalWillDismiss={onDismiss}
      className={styles.slotSelectorModal}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={onDismiss}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Select Fields</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} strong={true}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <p>
            Select the fields you would like to see when viewing and editing
            sample metadata for the <b>{templateName} template</b>. These
            choices can be updated any time in Settings.
          </p>
          <p>
            <RequiredMark /> fields are required before finalizing a submission
            with NMDC. Be careful about hiding them here.
          </p>
        </div>
        <SlotSelector
          slotGroups={slotGroups}
          disabledSlots={["samp_name"]}
          selectedSlots={selectedSlots}
          onSelectedSlotsChange={setSelectedSlots}
        />
      </IonContent>
    </IonModal>
  );
};

export default SlotSelectorModal;
