import React from "react";
import { SlotDefinition } from "../../linkml-metamodel";

interface SchemaSlotHelpProps {
  slot: SlotDefinition;
}
const SchemaSlotHelp: React.FC<SchemaSlotHelpProps> = ({ slot }) => {
  const guidanceParagraphs: string[] = [];
  if (slot.comments && slot.comments.length) {
    guidanceParagraphs.concat(...slot.comments);
  }
  if (slot.pattern) {
    guidanceParagraphs.push("Pattern as regular expression: " + slot.pattern);
  }
  if (slot.structured_pattern) {
    guidanceParagraphs.push("Pattern hint: " + slot.structured_pattern.syntax);
  }
  const hasMinValue = slot.minimum_value != null;
  const hasMaxValue = slot.maximum_value != null;
  if (hasMinValue || hasMaxValue) {
    let paragraph = "Value should be ";
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
      "Each record must have a unique value for this field.",
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
    </>
  );
};

export default SchemaSlotHelp;