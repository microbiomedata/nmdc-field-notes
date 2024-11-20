import React, { useEffect, useMemo } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import RequiredMark from "../RequiredMark/RequiredMark";
import SlotSelector from "../SlotSelector/SlotSelector";
import { useSubmissionSchema } from "../../queries";
import { groupClassSlots } from "../../utils";
import { TEMPLATES } from "../../api";

import styles from "./SlotSelectorModal.module.css";

export interface SlotSelectorModalProps {
  defaultSelectedSlots?: string[];
  isOpen: boolean;
  onDismiss: () => void;
  onSave: (selectedSlots: string[]) => void;
  templateName?: string;
}
const SlotSelectorModal: React.FC<SlotSelectorModalProps> = ({
  defaultSelectedSlots,
  isOpen,
  onDismiss,
  onSave,
  templateName,
}) => {
  const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);
  const schema = useSubmissionSchema();

  const schemaClassName = templateName && TEMPLATES[templateName].schemaClass;
  const templateDisplayName =
    templateName && TEMPLATES[templateName].displayName;

  const slotGroups = useMemo(
    () =>
      schema.data && schemaClassName !== undefined
        ? groupClassSlots(schema.data.schema, schemaClassName)
        : [],
    [schema.data, schemaClassName],
  );

  // The isOpen state is used to reset the selected slots when the modal is closed (i.e. don't keep
  // changes if the user cancels out of the modal).
  useEffect(() => {
    if (isOpen) {
      if (defaultSelectedSlots === undefined) {
        setSelectedSlots([]);
      } else {
        setSelectedSlots(defaultSelectedSlots);
      }
    } else {
      setSelectedSlots([]);
    }
  }, [isOpen, defaultSelectedSlots]);

  // When the user taps the Save button, translate the selected slots back into a list of hidden
  // slots and save them to the store. Then close the modal.
  const handleSave = () => {
    onSave(selectedSlots);
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
              <IonIcon slot="icon-only" icon={closeOutline} />
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
            sample metadata for the <b>{templateDisplayName} template</b>. These
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
