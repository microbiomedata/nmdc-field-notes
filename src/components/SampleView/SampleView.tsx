import React from "react";
import { SampleData, SampleDataValue, TEMPLATES } from "../../api";
import { groupClassSlots, SlotGroup } from "../../utils";
import SectionHeader from "../SectionHeader/SectionHeader";
import SlotSelector from "../SlotSelector/SlotSelector";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";
import { warningOutline } from "ionicons/icons";
import { useStore } from "../../Store";

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

interface SlotSelectorModalProps {
  initialVisibleSlots?: string[];
  onCancel: () => void;
  onSave: (visibleSlots: string[]) => void;
  packageName: string;
  slotGroups: SlotGroup[];
}
const SlotSelectorModal: React.FC<SlotSelectorModalProps> = ({
  initialVisibleSlots,
  onCancel,
  onSave,
  packageName,
  slotGroups,
}) => {
  // If initialVisibleSlots is undefined, make the default selection all the slots
  const [visibleSlots, setVisibleSlots] = React.useState(
    initialVisibleSlots === undefined
      ? slotGroups.reduce(
          (acc, group) => acc.concat(group.slots.map((slot) => slot.name)),
          [] as string[],
        )
      : initialVisibleSlots,
  );
  const templateName = TEMPLATES[packageName].displayName;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={onCancel}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Select Fields</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onSave(visibleSlots)} strong={true}>
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
    </IonPage>
  );
};

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
  const { getVisibleSlotsForSchemaClass, setVisibleSlotsForSchemaClass } =
    useStore();

  const schemaClass = TEMPLATES[packageName].schemaClass;
  const visibleSlots = getVisibleSlotsForSchemaClass(schemaClass);
  const slotGroups = schemaClass ? groupClassSlots(schema, schemaClass) : [];

  const [_presentModal, dismissModal] = useIonModal(
    <SlotSelectorModal
      initialVisibleSlots={visibleSlots}
      onCancel={() => dismissModal()}
      onSave={(visibleSlots) => {
        if (schemaClass !== undefined) {
          setVisibleSlotsForSchemaClass(schemaClass, visibleSlots);
        }
        dismissModal();
      }}
      packageName={packageName}
      slotGroups={slotGroups}
    />,
  );
  const presentModal = () =>
    _presentModal({
      cssClass: styles.slotSelectorModal,
    });

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
          onClick={presentModal}
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
          onClick={presentModal}
        >
          Not seeing a field you were looking for?
          <br />
          Tap here to update field visibility settings.
        </IonButton>
      )}
    </>
  );
};

export default SampleView;
