import React, { useMemo } from "react";
import { SampleData, SampleDataValue, TEMPLATES } from "../../api";
import { sortSlots } from "../../utils";
import { IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";
import { warningOutline } from "ionicons/icons";

function formatSlotValue(value: SampleDataValue) {
  if (value == null) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.join("; ");
  }
  return value;
}

interface SampleViewProps {
  onSlotClick: (slot: SlotDefinition) => void;
  packageName: string;
  sample?: SampleData;
  schema: SchemaDefinition;
  validationResults?: Record<string, string>;
  visibleSlots?: string[];
}
const SampleView: React.FC<SampleViewProps> = ({
  onSlotClick,
  packageName,
  sample,
  schema,
  validationResults,
  visibleSlots,
}) => {
  const schemaClass = TEMPLATES[packageName].schemaClass;
  const slots: SlotDefinition[] = useMemo(() => {
    const allSlots = Object.values(
      schema.classes?.[schemaClass]?.attributes || {},
    );
    const visibleSlotsSet = allSlots.filter(
      (slot) => !visibleSlots || visibleSlots.includes(slot.name),
    );
    return sortSlots(visibleSlotsSet);
  }, [schema.classes, schemaClass, visibleSlots]);

  if (!sample) {
    return null;
  }

  return (
    <>
      <IonList className="ion-padding-bottom">
        {slots.map((slot) => (
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
      </IonList>
    </>
  );
};

export default SampleView;
