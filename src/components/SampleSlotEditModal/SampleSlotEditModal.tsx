import React, { useEffect, useMemo } from "react";
import { SchemaDefinition, SlotDefinition } from "../../linkml-metamodel";
import { Geolocation } from "@capacitor/geolocation";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";
import SchemaSlotHelp from "../SchemaSlotHelp/SchemaSlotHelp";
import { closeCircle, warningOutline } from "ionicons/icons";
import { SampleDataValue } from "../../api";
import { format } from "date-fns";

import styles from "./SampleSlotEditModal.module.css";

interface SampleSlotEditModalProps {
  defaultValue: SampleDataValue;
  onCancel: () => void;
  onChange: (value: SampleDataValue) => void;
  onSave: (value: SampleDataValue) => void;
  saving: boolean;
  schema: SchemaDefinition;
  slot: SlotDefinition | null;
  validationResult?: string;
}
const SampleSlotEditModal: React.FC<SampleSlotEditModalProps> = ({
  defaultValue,
  onCancel,
  onChange,
  onSave,
  saving,
  schema,
  slot,
  validationResult,
}) => {
  const [value, setValue] = React.useState<SampleDataValue>(defaultValue);
  const slotIsNumeric: boolean = useMemo(() => {
    if (!slot) {
      return false;
    }
    if (slot.range && schema.types && slot.range in schema.types) {
      const slotTypeUri = schema.types[slot.range].uri;
      return (
        slotTypeUri === "xsd:integer" ||
        slotTypeUri === "xsd:decimal" ||
        slotTypeUri === "xsd:float" ||
        slotTypeUri === "xsd:double"
      );
    } else {
      return false;
    }
  }, [slot]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleValueChange = (value: Nullable<string>) => {
    let parsed: SampleDataValue = value;
    if (slotIsNumeric && value != null) {
      parsed = Number.parseFloat(value);
      if (Number.isNaN(parsed)) {
        // that wasn't a number, fall back to the original value
        parsed = value;
      }
    }
    if (onChange) {
      onChange(parsed);
    }
    setValue(parsed);
  };

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
                  onIonChange={(e) => handleValueChange(e.detail.value)}
                >
                  {Object.entries(
                    schema.enums[slot.range].permissible_values || {},
                  ).map(([key, val]) => (
                    <IonSelectOption key={key} value={val.text}>
                      {val.text}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              ) : (
                <IonTextarea
                  autoGrow
                  rows={1}
                  aria-label={slot.title || slot.name}
                  value={value != null ? String(value) : undefined}
                  onIonInput={(e) => handleValueChange(e.target.value)}
                />
              )}
            </div>
            <div className={styles.clearWrapper}>
              {value != null && (
                <button
                  aria-label="Clear"
                  className={styles.clearButton}
                  type="button"
                  onClick={() => handleValueChange(null)}
                >
                  <IonIcon icon={closeCircle} />
                </button>
              )}
            </div>
          </div>
          {validationResult && (
            <IonItem lines="none">
              <IonIcon
                aria-hidden="true"
                icon={warningOutline}
                slot="start"
                color="warning"
              />
              <IonLabel color="warning">{validationResult}</IonLabel>
            </IonItem>
          )}

          {slot.name === "collection_date" && (
            <IonButton
              className="ion-padding-vertical"
              expand="block"
              onClick={() =>
                handleValueChange(format(new Date(), "yyyy-MM-dd"))
              }
            >
              Set to today
            </IonButton>
          )}

          {slot.name === "lat_lon" && (
            <IonButton
              className="ion-padding-vertical"
              expand="block"
              onClick={async () => {
                const position = await Geolocation.getCurrentPosition();
                handleValueChange(
                  position.coords.latitude + " " + position.coords.longitude,
                );
              }}
            >
              Use GPS location
            </IonButton>
          )}
          <SchemaSlotHelp slot={slot} containingObjectName="sample" />
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
