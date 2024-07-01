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
  const [visibleSlots, setVisibleSlots] = React.useState<string[]>([]);
  const schema = useSubmissionSchema();
  const { getVisibleSlotsForSchemaClass, setVisibleSlotsForSchemaClass } =
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

  useEffect(() => {
    if (isOpen) {
      const visibleSlotsFromStore =
        getVisibleSlotsForSchemaClass(schemaClassName);
      if (visibleSlotsFromStore === undefined) {
        setVisibleSlots(
          slotGroups.reduce(
            (acc, group) => acc.concat(group.slots.map((slot) => slot.name)),
            [] as string[],
          ),
        );
      } else {
        setVisibleSlots(visibleSlotsFromStore);
      }
    } else {
      setVisibleSlots([]);
    }
  }, [getVisibleSlotsForSchemaClass, isOpen, schemaClassName, slotGroups]);

  const handleSave = () => {
    if (schemaClassName !== undefined) {
      setVisibleSlotsForSchemaClass(schemaClassName, visibleSlots);
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
          alwaysVisibleSlots={["samp_name"]}
          visibleSlots={visibleSlots}
          onVisibleSlotsChange={setVisibleSlots}
        />
      </IonContent>
    </IonModal>
  );
};

export default SlotSelectorModal;
