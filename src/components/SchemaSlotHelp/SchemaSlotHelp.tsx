import React from "react";
import { SlotDefinition } from "../../linkml-metamodel";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from "@ionic/react";
import RegexPattern from "./RegexPattern";
import styles from "./SchemaSlotHelp.module.css";

interface SchemaSlotHelpProps {
  slot: SlotDefinition;
  containingObjectName?: string;
}
const SchemaSlotHelp: React.FC<SchemaSlotHelpProps> = ({
  slot,
  containingObjectName = "record",
}) => {
  // Get any pattern information present in this slot definition.
  const pattern = slot.pattern;

  // Process other types of guidance present on this slot's specification.
  const guidanceParagraphs: string[] = [];
  if (slot.comments && slot.comments.length) {
    guidanceParagraphs.concat(...slot.comments);
  }
  const hasMinValue = slot.minimum_value != null;
  const hasMaxValue = slot.maximum_value != null;
  if (hasMinValue || hasMaxValue) {
    let paragraph = "Value must be ";
    if (hasMinValue && hasMaxValue) {
      paragraph += `between ${slot.minimum_value} and ${slot.maximum_value} (inclusive).`;
    } else if (hasMinValue) {
      paragraph += `greater than or equal to ${slot.minimum_value}.`;
    } else if (hasMaxValue) {
      paragraph += `less than or equal to ${slot.maximum_value}.`;
    }
    guidanceParagraphs.push(paragraph);
  }
  if (slot.identifier) {
    guidanceParagraphs.push(
      `Each ${containingObjectName} must have a unique value in this field.`,
    );
  }
  if (slot.multivalued) {
    guidanceParagraphs.push("More than one selection is allowed.");
  }

  return (
    <>
      {slot.description && (
        <>
          <h4>Description</h4>
          <p>{slot.description}</p>
        </>
      )}

      {guidanceParagraphs.length > 0 && (
        <>
          <h4>Guidance</h4>
          {guidanceParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </>
      )}

      {slot.examples && slot.examples.length > 0 && (
        <>
          <h4>Examples</h4>
          <ul>
            {slot.examples.map((example, i) => (
              <li key={i}>
                {example.description && <>{example.description}: </>}
                {example.value}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* If we have any pattern information, display it in this section. */}
      {typeof pattern === "string" ? (
        <IonAccordionGroup>
          <IonAccordion>
            <IonItem
              className={`ion-no-padding ${styles.accordionItem}`}
              slot={"header"}
            >
              <IonLabel>Technical format requirements</IonLabel>
            </IonItem>
            <div
              className={"ion-padding-start ion-padding-end ion-padding-bottom"}
              slot={"content"}
            >
              <p>The value must conform to this regular expression pattern:</p>
              <RegexPattern pattern={pattern} />
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      ) : null}
    </>
  );
};

export default SchemaSlotHelp;
