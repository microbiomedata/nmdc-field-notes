import React from "react";
import { SampleData, SampleDataValue, TEMPLATES } from "../../api";
import { groupClassSlots } from "../../utils";
import SectionHeader from "../SectionHeader/SectionHeader";
import { IonButton, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";
import { warningOutline } from "ionicons/icons";
import { useStore } from "../../Store";
import SlotSelectorModal from "../SlotSelectorModal/SlotSelectorModal";

import styles from "./SampleView.module.css";

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
  const { getHiddenSlotsForSchemaClass, setHiddenSlotsForSchemaClass } =
    useStore();

  const schemaClass = TEMPLATES[packageName].schemaClass;
  const hiddenSlots = getHiddenSlotsForSchemaClass(schemaClass);
  const slotGroups = schemaClass ? groupClassSlots(schema, schemaClass) : [];

  const handleDismiss = () => {
    setHiddenSlotsForSchemaClass(schemaClass, []);
  };

  if (!sample) {
    return null;
  }

  return (
    <>
      {hiddenSlots === undefined && (
        <IonList className={styles.slotSelectorBanner}>
          <IonItem lines="none">
            <IonLabel>Too many fields?</IonLabel>
            <IonButton
              slot="end"
              fill="clear"
              onClick={() => setIsModalOpen(true)}
            >
              Customize List
            </IonButton>
            <IonButton slot="end" fill="clear" onClick={handleDismiss}>
              Dismiss
            </IonButton>
          </IonItem>
        </IonList>
      )}

      {slotGroups.map((group) => (
        <React.Fragment key={group.name}>
          <SectionHeader>{group.title}</SectionHeader>
          <IonList className="ion-padding-bottom">
            {group.slots.map(
              (slot) =>
                (hiddenSlots === undefined ||
                  !hiddenSlots.includes(slot.name)) && (
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

      {hiddenSlots !== undefined && hiddenSlots.length > 0 && (
        <IonList className="ion-padding-bottom">
          <IonItem
            lines="none"
            button
            detail={false}
            onClick={() => setIsModalOpen(true)}
          >
            <IonLabel class="ion-text-wrap">
              <p>
                Not seeing a field you were looking for? Tap here to update
                field visibility settings.
              </p>
            </IonLabel>
          </IonItem>
        </IonList>
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
