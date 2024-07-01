import React, { useEffect, useMemo } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import SlotSelector from "../SlotSelector/SlotSelector";
import { useSubmissionSchema } from "../../queries";
import { groupClassSlots } from "../../utils";
import { TEMPLATES } from "../../api";
import { useStore } from "../../Store";

import style from "./SlotSelectorModal.module.css";

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

  useEffect(() => {
    if (isOpen) {
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
      className={style.slotSelectorModal}
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
        <p className="ion-padding">
          <IonText>
            Select the fields you would like to see by default when entering
            metadata in the <b>{templateName} template</b>. These choices can be
            updated any time in Settings.
          </IonText>
        </p>
        <SlotSelector
          slotGroups={slotGroups}
          alwaysSelectedSlots={["samp_name"]}
          selectedSlots={selectedSlots}
          onSelectedSlotsChange={setSelectedSlots}
        />
      </IonContent>
    </IonModal>
  );
};

export default SlotSelectorModal;
