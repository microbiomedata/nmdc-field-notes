import React from "react";
import { SampleData } from "../../api";
import { groupClassSlots } from "../../utils";
import SectionHeader from "../SectionHeader/SectionHeader";
import { IonItem, IonLabel } from "@ionic/react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";

interface SampleViewProps {
  onSlotClick: (slot: SlotDefinition) => void;
  sample?: SampleData;
  schema: SchemaDefinition;
  schemaClass?: string;
}
const SampleView: React.FC<SampleViewProps> = ({
  onSlotClick,
  sample,
  schema,
  schemaClass,
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
              <IonLabel>
                <h3>{slot.title || slot.name}</h3>
                <p>{sample?.[slot.name]}</p>
              </IonLabel>
            </IonItem>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default SampleView;
