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
import SlotSelector from "../SlotSelector/SlotSelector";
import { useSubmissionSchema } from "../../queries";
import { SlotGroup, sortSlots } from "../../utils";
import { SlotName, TemplateName, TEMPLATES } from "../../api";
import { SlotDefinition } from "../../linkml-metamodel";
import slotVisibilities from "./slotVisibilities";

import styles from "./SlotSelectorModal.module.css";

function groupTemplateSlots(
  slotDefinitions: SlotDefinition[],
  templateName: TemplateName,
): SlotGroup[] {
  const commonGroup: SlotGroup = {
    name: "common",
    description:
      "The values for these fields are commonly measured at the time of sample collection. These " +
      "fields will be selected automatically when setting up a new study.",
    title: "Common",
    slots: [],
  };
  const occasionalGroup: SlotGroup = {
    name: "occasional",
    description:
      "These fields may sometimes be measured at the time of sample collection. Review this list " +
      "and select any fields that are relevant to your study.",
    title: "Occasional",
    slots: [],
  };
  const uncommonGroup: SlotGroup = {
    name: "uncommon",
    description: (
      <>
        These fields are rarely measured at the time of sample collection. They
        are more often entered after sampling via the{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://nmdc-documentation.readthedocs.io/en/latest/tutorials/submission_portal.html"
        >
          NMDC Submission Portal
        </a>
        .
      </>
    ),
    title: "Uncommon",
    slots: [],
  };

  slotDefinitions.forEach((slot) => {
    const visibility = slotVisibilities[slot.name] || {};
    const group = visibility[templateName] || visibility["_default"];
    if (group === "common") {
      commonGroup.slots.push(slot);
    } else if (group === "occasional") {
      occasionalGroup.slots.push(slot);
    } else {
      uncommonGroup.slots.push(slot);
    }
  });
  const groupedSlots: SlotGroup[] = [
    commonGroup,
    occasionalGroup,
    uncommonGroup,
  ];
  groupedSlots.forEach((group) => {
    sortSlots(group.slots);
  });
  return groupedSlots;
}

export interface SlotSelectorModalProps {
  allowDismiss?: boolean;
  defaultSelectedSlots?: SlotName[];
  isOpen: boolean;
  onDismiss: () => void;
  onSave: (selectedSlots: SlotName[]) => void;
  templateName?: TemplateName;
}
const SlotSelectorModal: React.FC<SlotSelectorModalProps> = ({
  allowDismiss = true,
  defaultSelectedSlots,
  isOpen,
  onDismiss,
  onSave,
  templateName,
}) => {
  const [selectedSlots, setSelectedSlots] = React.useState<SlotName[]>([]);
  const schema = useSubmissionSchema();

  const schemaClassName = templateName && TEMPLATES[templateName].schemaClass;
  const templateDisplayName =
    templateName && TEMPLATES[templateName].displayName;

  const slotGroups = useMemo(() => {
    if (
      schema.data === undefined ||
      schemaClassName === undefined ||
      templateName === undefined
    ) {
      return [];
    }
    const classDefinition = schema.data.schema.classes?.[schemaClassName];
    if (!classDefinition) {
      throw new Error(`Class ${schemaClassName} not found in schema`);
    }
    if (!classDefinition.attributes) {
      return [];
    }
    return groupTemplateSlots(
      Object.values(classDefinition.attributes),
      templateName,
    );
  }, [schema.data, schemaClassName, templateName]);

  // The isOpen state is used to reset the selected slots when the modal is closed (i.e. don't keep
  // changes if the user cancels out of the modal).
  useEffect(() => {
    if (isOpen) {
      // If the modal is open and no defaultSelectedSlots were provided, preselect the first group
      // (the "common" group) by default. Otherwise, use the provided defaultSelectedSlots.
      if (defaultSelectedSlots === undefined) {
        setSelectedSlots(slotGroups[0]?.slots.map((slot) => slot.name) || []);
      } else {
        setSelectedSlots(defaultSelectedSlots);
      }
    } else {
      // If the modal is closed, reset the selected slots to an empty list.
      setSelectedSlots([]);
    }
  }, [isOpen, defaultSelectedSlots, slotGroups]);

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
          {allowDismiss && (
            <IonButtons slot="start">
              <IonButton color="medium" onClick={onDismiss}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>Select Fields</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} strong={true}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding nmdc-text-sm">
          Select the fields you would like to see when viewing and editing
          sample metadata for the <b>{templateDisplayName} template</b>.
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
