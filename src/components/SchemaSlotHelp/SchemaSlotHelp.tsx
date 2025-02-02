import React from "react";
import { SlotDefinition } from "../../linkml-metamodel";
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from "@ionic/react";
import Pluralize from "../Pluralize/Pluralize";

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
  const hasPattern = typeof pattern === "string";
  const structuredPatternSyntax = slot.structured_pattern?.syntax;
  const hasStructuredPatternSyntax = typeof structuredPatternSyntax === "string";

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

      {/* If we have any patterns information, display it in this section. */}
      {hasPattern || hasStructuredPatternSyntax ? (
        <>
          <h4>Format</h4>
          <IonAccordionGroup>
            <IonAccordion>
              <IonItem slot={"header"}>
                <IonLabel>Requirements</IonLabel>
              </IonItem>
              <div className={"ion-padding"} slot={"content"}>
                <p>
                  {/* TODO: Check what this looks like when both types of patterns are present (is that allowed?). */}
                  <Pluralize
                    count={hasPattern && hasStructuredPatternSyntax ? 2 : 1}
                    singular={
                      "The value must conform to this regular expression pattern:"
                    }
                    plural={
                      "The value must conform to these regular expression patterns:"
                    }
                  />
                </p>
                {hasPattern && <p>{pattern}</p>}
                {hasStructuredPatternSyntax && <p>{structuredPatternSyntax}</p>}
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </>
      ) : null}
    </>
  );
};

export default SchemaSlotHelp;
