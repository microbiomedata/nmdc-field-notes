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
import { SlotGroup } from "../../utils";
import { TEMPLATES } from "../../api";
import { SchemaDefinition } from "../../linkml-metamodel";

/**
 * This JSON file encodes which slots are commonly, uncommonly, or rarely measured in the field.
 * This was the output of a manual curation process. At some point we might consider encoding this
 * directly in the submission schema somehow. But for now, this is a simple way to get the job done.
 * The structure of the JSON file is:
 * {
 *   <slot_name>: {
 *     _default?: "common" | "uncommon",
 *     <template_class_name>?: "common" | "uncommon",
 *     ...
 *   },
 *   ...
 * }
 * Each key in the top-level object is a slot name. The value is an object that can contain a
 * "_default" key and/or keys for specific template class names (e.g. SoilInterface). The value of
 * these keys is either "common" or "uncommon". The setting in the "_default" key is used if there
 * is no specific setting for a given template class.
 */
import slotVisibility from "./slotVisibility.json";

import styles from "./SlotSelectorModal.module.css";

const FIXED_ORDER_SLOTS = ["samp_name", "collection_date", "lat_lon"];

function groupClassSlots(
  schemaDefinition: SchemaDefinition,
  className: string,
): SlotGroup[] {
  const classDefinition = schemaDefinition.classes?.[className];
  if (!classDefinition) {
    throw new Error(`Class ${className} not found in schema`);
  }
  const commonGroup: SlotGroup = {
    name: "common",
    description:
      "These fields will commonly be measured or collected in the field.",
    title: "Common",
    slots: [],
  };
  const uncommonGroup: SlotGroup = {
    name: "uncommon",
    description:
      "These fields may sometimes be measured or collected in the field.",
    title: "Uncommon",
    slots: [],
  };
  const otherGroup: SlotGroup = {
    name: "other",
    description: "These fields are rarely measured or collected in the field.",
    title: "Other",
    slots: [],
  };
  if (!classDefinition.attributes) {
    return [];
  }
  Object.values(classDefinition.attributes).forEach((slot) => {
    // @ts-expect-error next-lint
    const visibility = slotVisibility[slot.name] || {};
    const group = visibility[className] || visibility["_default"];
    if (group === "common") {
      commonGroup.slots.push(slot);
    } else if (group === "uncommon") {
      uncommonGroup.slots.push(slot);
    } else {
      otherGroup.slots.push(slot);
    }
  });
  const groupedSlots: SlotGroup[] = [commonGroup, uncommonGroup, otherGroup];
  groupedSlots.forEach((group) => {
    group.slots.sort((a, b) => {
      // First sort the fixed slots to the top
      const aFixedOrder = FIXED_ORDER_SLOTS.indexOf(a.name);
      const bFixedOrder = FIXED_ORDER_SLOTS.indexOf(b.name);
      if (aFixedOrder !== -1 && bFixedOrder !== -1) {
        return aFixedOrder - bFixedOrder;
      } else if (aFixedOrder !== -1) {
        return -1;
      } else if (bFixedOrder !== -1) {
        return 1;
      }

      // Then sort alphabetically by title
      const titleCompare = (a.title || "").localeCompare(b.title || "");
      if (titleCompare !== 0) {
        return titleCompare;
      }

      // Finally sort by name (since some oddball slots may not have a title)
      return a.name.localeCompare(b.name);
    });
  });
  return groupedSlots;
}

export interface SlotSelectorModalProps {
  allowDismiss?: boolean;
  defaultSelectedSlots?: string[];
  isOpen: boolean;
  onDismiss: () => void;
  onSave: (selectedSlots: string[]) => void;
  templateName?: string;
}
const SlotSelectorModal: React.FC<SlotSelectorModalProps> = ({
  allowDismiss = true,
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
