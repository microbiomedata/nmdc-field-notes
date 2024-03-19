import React, { useEffect } from "react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";
import SchemaSlotHelp from "../SchemaSlotHelp/SchemaSlotHelp";

import styles from "./SampleSlotEditModal.module.css";
import { closeCircle } from "ionicons/icons";

interface SampleSlotEditModalProps {
  defaultValue: Nullable<string | number>;
  onCancel: () => void;
  onSave: (value: Nullable<string>) => void;
  saving: boolean;
  schema: SchemaDefinition;
  slot: SlotDefinition | null;
}
const SampleSlotEditModal: React.FC<SampleSlotEditModalProps> = ({
  defaultValue,
  onCancel,
  onSave,
  saving,
  schema,
  slot,
}) => {
  const [value, setValue] = React.useState<Nullable<string>>(
    defaultValue as string,
  );
  useEffect(() => {
    console.log("defaultValue", defaultValue);
    setValue(defaultValue as string);
  }, [defaultValue]);
  return (
    <IonModal
      breakpoints={[0, 0.8]}
      initialBreakpoint={0.8}
      isOpen={slot !== null}
      onIonModalDidDismiss={onCancel}
    >
      {slot && (
        <IonContent className="ion-padding">
          <h2>{slot.title || slot.name}</h2>
          <div className={styles.inputAndClearContainer}>
            <div className={styles.inputWrapper}>
              {schema.enums && slot.range && slot.range in schema.enums ? (
                <IonSelect
                  placeholder="Not set"
                  aria-label={slot.title || slot.name}
                  value={value}
                  multiple={slot.multivalued}
                  onIonChange={(e) => setValue(e.detail.value)}
                >
                  {Object.entries(
                    schema.enums[slot.range].permissible_values || {},
                  ).map(([key, val]) => (
                    <IonSelectOption key={key}>{val.text}</IonSelectOption>
                  ))}
                </IonSelect>
              ) : (
                <IonTextarea
                  autoGrow
                  rows={1}
                  aria-label={slot.title || slot.name}
                  value={value}
                  onIonInput={(e) => setValue(e.detail.value)}
                />
              )}
            </div>
            <div className={styles.clearWrapper}>
              {value && (
                <button
                  aria-label="Clear"
                  className={styles.clearButton}
                  type="button"
                  onClick={() => setValue(null)}
                >
                  <IonIcon icon={closeCircle} />
                </button>
              )}
            </div>
          </div>
          <SchemaSlotHelp slot={slot} />
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton fill="outline" expand="block" onClick={onCancel}>
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  color="primary"
                  expand="block"
                  onClick={() => onSave(value)}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      )}
    </IonModal>
  );
};

export default SampleSlotEditModal;
