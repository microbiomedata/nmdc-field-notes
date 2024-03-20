import React from "react";
import { SampleData, SampleDataValue } from "../../api";
import { groupClassSlots } from "../../utils";
import SectionHeader from "../SectionHeader/SectionHeader";
import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";
import { warningOutline } from "ionicons/icons";

function formatSlotValue(value: SampleDataValue) {
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.join("; ");
  }
  return value;
}

interface SampleViewProps {
  onSlotClick: (slot: SlotDefinition) => void;
  sample?: SampleData;
  schema: SchemaDefinition;
  schemaClass?: string;
  validationResults?: Record<string, string>;
}
const SampleView: React.FC<SampleViewProps> = ({
  onSlotClick,
  sample,
  schema,
  schemaClass,
  validationResults,
}) => {
  const slotGroups = schemaClass ? groupClassSlots(schema, schemaClass) : [];

  if (!sample) {
    return null;
  }

  return (
    <>
      {slotGroups.map((group) => (
        <React.Fragment key={group.name}>
          <SectionHeader>{group.title}</SectionHeader>
          {group.slots.map((slot) => (
            <IonItem key={slot.name} onClick={() => onSlotClick(slot)}>
              {validationResults?.[slot.name] && (
                <IonIcon
                  aria-hidden="true"
                  icon={warningOutline}
                  color="warning"
                  slot="end"
                />
              )}
              <IonLabel>
                <h3>{slot.title || slot.name}</h3>
                <p>{formatSlotValue(sample?.[slot.name])}</p>
              </IonLabel>
            </IonItem>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default SampleView;
