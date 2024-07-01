import React from "react";
import { SampleData, SampleDataValue, TEMPLATES } from "../../api";
import { groupClassSlots } from "../../utils";
import SectionHeader from "../SectionHeader/SectionHeader";
import { IonButton, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";
import { warningOutline } from "ionicons/icons";
import { useStore } from "../../Store";
import SlotSelectorModal from "../SlotSelectorModal/SlotSelectorModal";

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
}
const SampleView: React.FC<SampleViewProps> = ({
  onSlotClick,
  packageName,
  sample,
  schema,
  validationResults,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { getVisibleSlotsForSchemaClass } = useStore();
  const schemaClass = TEMPLATES[packageName].schemaClass;
  const visibleSlots = getVisibleSlotsForSchemaClass(schemaClass);
  const slotGroups = schemaClass ? groupClassSlots(schema, schemaClass) : [];

  if (!sample) {
    return null;
  }

  return (
    <>
      {visibleSlots === undefined && (
        <IonButton
          expand="full"
          size="small"
          color="primary"
          className="ion-no-margin"
          onClick={() => setIsModalOpen(true)}
        >
          Too many fields? Tap to customize list.
        </IonButton>
      )}

      {slotGroups.map((group) => (
        <React.Fragment key={group.name}>
          <SectionHeader>{group.title}</SectionHeader>
          <IonList className="ion-padding-bottom">
            {group.slots.map(
              (slot) =>
                (visibleSlots === undefined ||
                  visibleSlots.includes(slot.name)) && (
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
                ),
            )}
          </IonList>
        </React.Fragment>
      ))}

      {visibleSlots !== undefined && (
        <IonButton
          expand="full"
          size="small"
          fill="clear"
          className="ion-margin-vertical"
          color="medium"
          onClick={() => setIsModalOpen(true)}
        >
          Not seeing a field you were looking for?
          <br />
          Tap here to update field visibility settings.
        </IonButton>
      )}

      <SlotSelectorModal
        onDismiss={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        packageName={packageName}
      />
    </>
  );
};

export default SampleView;
