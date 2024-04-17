import React, { useEffect, useMemo } from "react";
import {
  SchemaDefinition,
  SlotDefinition,
  SlotDefinitionName,
} from "../../linkml-metamodel";
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
  IonText,
  IonTextarea,
} from "@ionic/react";
import SchemaSlotHelp from "../SchemaSlotHelp/SchemaSlotHelp";
import { closeCircle, warningOutline } from "ionicons/icons";
import { GoldEcosystemTreeNode, SampleData, SampleDataValue } from "../../api";
import { format } from "date-fns";

import styles from "./SampleSlotEditModal.module.css";

// These slots require extra handling that isn't captured in the schema. The presence of a slot
// name in this list triggers that handling. Additionally, **the order of the slots in this list
// is important**. Specifically:
//   - The permissible values for the slot at index N (the "target" slot) is dependent on the values
//     of the slots in indices 0 through N-1 (the "upstream" slots). If one or more of the values
//     for the upstream slots is not set, the permissible values cannot be determined and the user
//     should not be allowed to set a value for the target slot. For example, the permissible values
//     for ecosystem_type depends on what you chose for ecosystem_category and ecosystem. If you
//     haven't chosen a value for ecosystem_category yet, we don't know what values are valid for
//     ecosystem_type, therefore we shouldn't allow you to set a value for ecosystem_type.
//   - If the value of a slot at index N is changed, all values for slots at indices N+1 and higher
//     (the "downstream" slots) must be cleared. For example, if you change the value of
//     ecosystem_type, the values for ecosystem_subtype and specific_ecosystem must be cleared
//     because their permissible values will now depend on the new value of ecosystem_type.
const GOLD_ECOSYSTEM_SLOTS = [
  "ecosystem",
  "ecosystem_category",
  "ecosystem_type",
  "ecosystem_subtype",
  "specific_ecosystem",
];

// This function takes a slot and first determines based on the schema whether to render a select
// control (`isSelectable`), and if so what the permissible values are. If the slot is in the
// GOLD_ECOSYSTEM_SLOTS list, it will also filter the permissible values based on the GOLD Ecosystem
// Tree and the values of upstream slots. This process may also produce a warning message that
// should disable the select control if the user hasn't set values for the upstream slots.
function getSelectState(
  schema: SchemaDefinition,
  slot: SlotDefinition | null,
  getSlotValue: (slot: SlotDefinitionName) => SampleDataValue,
  goldEcosystemTree: GoldEcosystemTreeNode,
) {
  if (
    !schema ||
    !slot ||
    !(schema.enums && slot.range && slot.range in schema.enums)
  ) {
    return {
      isSelectable: false,
      permissibleValues: {},
      warning: "",
    };
  }
  const schemaPermissibleValues = schema.enums[slot.range].permissible_values;
  let permissibleValues = schemaPermissibleValues || {};
  let warning = "";
  const goldIndex = GOLD_ECOSYSTEM_SLOTS.indexOf(slot.name);
  if (goldIndex > -1) {
    const upstreamSlots = GOLD_ECOSYSTEM_SLOTS.slice(0, goldIndex);
    const upstreamValues = upstreamSlots.map((slotName) =>
      getSlotValue(slotName),
    );
    let validPathCompletions = goldEcosystemTree.children;
    for (let i = 0; i < upstreamValues.length; i++) {
      const upstreamSlot = upstreamSlots[i];
      const upstreamValue = upstreamValues[i];
      if (!upstreamValue) {
        warning = `Select a value for ${upstreamSlot} first.`;
        validPathCompletions = [];
        break;
      }
      const upstreamValueTreeNode = validPathCompletions.find(
        (node) => node.name === upstreamValue,
      );
      if (!upstreamValueTreeNode) {
        warning = `Unable to determine permissible values. Try changing ${upstreamSlot}.`;
        validPathCompletions = [];
        break;
      }
      validPathCompletions = upstreamValueTreeNode.children;
    }
    permissibleValues = Object.fromEntries(
      Object.entries(permissibleValues).filter(([key]) =>
        validPathCompletions.some((node) => node.name === key),
      ),
    );
  }
  return {
    isSelectable: true,
    permissibleValues,
    warning,
  };
}

interface SampleSlotEditModalProps {
  defaultValue: SampleDataValue;
  getSlotValue: (slot: SlotDefinitionName) => SampleDataValue;
  goldEcosystemTree: GoldEcosystemTreeNode;
  onCancel: () => void;
  onChange: (value: SampleDataValue) => void;
  onSave: (values: SampleData) => void;
  saving: boolean;
  schema: SchemaDefinition;
  slot: SlotDefinition | null;
  validationResult?: string;
}
const SampleSlotEditModal: React.FC<SampleSlotEditModalProps> = ({
  defaultValue,
  getSlotValue,
  goldEcosystemTree,
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
  }, [schema.types, slot]);

  const selectState = useMemo(() => {
    return getSelectState(schema, slot, getSlotValue, goldEcosystemTree);
  }, [getSlotValue, goldEcosystemTree, schema, slot]);

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

  const handleSave = () => {
    if (!slot) {
      return;
    }
    // Always update the value of the target slot
    const updates: SampleData = { [slot.name]: value };

    // If the target slot is in the GOLD_ECOSYSTEM_SLOTS list, clear downstream slots
    const goldIndex = GOLD_ECOSYSTEM_SLOTS.indexOf(slot.name);
    if (goldIndex > -1) {
      const downstream = GOLD_ECOSYSTEM_SLOTS.slice(goldIndex + 1);
      for (const field of downstream) {
        updates[field] = null;
      }
    }
    onSave(updates);
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
              {selectState.isSelectable ? (
                <IonSelect
                  placeholder="Not set"
                  aria-label={slot.title || slot.name}
                  value={value}
                  multiple={slot.multivalued}
                  onIonChange={(e) => handleValueChange(e.detail.value)}
                  disabled={selectState.warning !== ""}
                >
                  {Object.entries(selectState.permissibleValues).map(
                    ([key, val]) => (
                      <IonSelectOption key={key} value={val.text}>
                        {val.text}
                      </IonSelectOption>
                    ),
                  )}
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
          {selectState.warning && (
            <IonItem className={styles.inputMessage} lines="none">
              <IonText color="medium">{selectState.warning}</IonText>
            </IonItem>
          )}
          {validationResult && (
            <IonItem className={styles.inputMessage} lines="none">
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
                  onClick={handleSave}
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
