import React, { useMemo, useRef, useState } from "react";
import {
  PermissibleValue,
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
  IonSpinner,
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
  const nonSelectableState = {
    isSelectable: false,
    permissibleValues: {} as Record<string, PermissibleValue>,
    warning: "",
  };
  // If the slot is null or the schema doesn't have any enums, don't render a select control.
  if (!slot || !schema.enums) {
    return nonSelectableState;
  }

  // If the slot has a range that is an enum, use that. Otherwise, if the slot has an `any_of`
  // iterate over those expressions and collect any with enum ranges.
  const slotRangeEnumNames: string[] = [];
  if (slot.range && slot.range in schema.enums) {
    slotRangeEnumNames.push(slot.range);
  } else if (slot.any_of !== undefined) {
    for (const anyOfExpression of slot.any_of) {
      if (anyOfExpression.range && anyOfExpression.range in schema.enums) {
        slotRangeEnumNames.push(anyOfExpression.range);
      }
    }
  }

  // If we didn't find any enum ranges, don't render a select control.
  if (slotRangeEnumNames.length === 0) {
    return nonSelectableState;
  }
  const schemaPermissibleValues: Record<string, PermissibleValue> = {};
  for (const enumName of slotRangeEnumNames) {
    Object.assign(
      schemaPermissibleValues,
      schema.enums[enumName].permissible_values,
    );
  }
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
  disabled?: boolean;
  errorBanner?: React.ReactNode;
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
  disabled,
  errorBanner,
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
  const modal = useRef<HTMLIonModalElement>(null);
  const [value, setValue] = useState<SampleDataValue>(defaultValue);

  // State tracking for values that can be populated automatically but in an async manner (e.g.
  // getting latitude and longitude coordinates from the device's GPS).
  const [autoValueLoading, setAutoValueLoading] = useState(false);
  const [autoValueError, setAutoValueError] = useState<string | null>(null);

  // Re-apply the default value when the slot changes.
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [previousSlot, setPreviousSlot] = useState<SlotDefinition | null>(slot);
  if (slot !== previousSlot) {
    setValue(defaultValue);
    setPreviousSlot(slot);
  }

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
    setAutoValueError(null);
    onSave(updates);
  };

  const handleModalDismiss = () => {
    setAutoValueError(null);
    onCancel();
  };

  return (
    <IonModal
      ref={modal}
      className={styles.sampleSlotEditModal}
      breakpoints={[0, 1]}
      initialBreakpoint={1}
      isOpen={slot !== null}
      onIonModalDidDismiss={handleModalDismiss}
    >
      {errorBanner}
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
          {autoValueError && (
            <IonItem className={styles.inputMessage} lines="none">
              <IonLabel color="danger">{autoValueError}</IonLabel>
            </IonItem>
          )}
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
              disabled={autoValueLoading}
              expand="block"
              onClick={async () => {
                setAutoValueError(null);
                setAutoValueLoading(true);
                try {
                  const position = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 20000,
                  });
                  // The submission schema allows up to 8 decimal places for lat/lon. The 8th decimal
                  // place is about 1 mm of precision. There's pretty much no chance that a user's
                  // device can provide that level of precision. The 6th decimal place is about 10 cm
                  // of precision. Even that is unlikely to be accurate, but it's at least plausible.
                  const decimalDigits = 6;
                  const lat = position.coords.latitude.toFixed(decimalDigits);
                  const lon = position.coords.longitude.toFixed(decimalDigits);
                  handleValueChange(lat + " " + lon);
                  setAutoValueError(null);
                } catch (e) {
                  setAutoValueError("Unable to get GPS location");
                } finally {
                  setAutoValueLoading(false);
                }
              }}
            >
              {autoValueLoading && <IonSpinner className="ion-margin-end" />}
              Use GPS location
            </IonButton>
          )}
          <SchemaSlotHelp slot={slot} containingObjectName="sample" />
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  fill="outline"
                  expand="block"
                  // Call `dismiss` here instead of `onCancel` directly so that the modal can animate
                  // out of view before the `onCancel` handler is called via the `IonModalDidDismiss`
                  // event.
                  onClick={() => modal.current?.dismiss()}
                >
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  color="primary"
                  expand="block"
                  onClick={handleSave}
                  disabled={disabled || saving}
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

export { getSelectState };
