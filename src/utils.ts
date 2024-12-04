import { SubmissionMetadata, TEMPLATES } from "./api";
import { SlotDefinition } from "./linkml-metamodel";

export interface GetSubmissionSamplesOptions {
  createSampleDataFieldIfMissing?: boolean;
}
export function getSubmissionSamples(
  submission?: SubmissionMetadata,
  options: GetSubmissionSamplesOptions = {},
) {
  if (!submission) {
    return [];
  }
  const environmentalPackageName = submission.metadata_submission.packageName;
  const sampleDataField = environmentalPackageName
    ? TEMPLATES[environmentalPackageName].sampleDataSlot
    : undefined;
  if (!sampleDataField) {
    return [];
  }
  if (
    !(sampleDataField in submission.metadata_submission.sampleData) &&
    options.createSampleDataFieldIfMissing
  ) {
    submission.metadata_submission.sampleData[sampleDataField] = [];
  }
  return submission.metadata_submission.sampleData[sampleDataField] || [];
}

export function getSubmissionSample(
  submission?: SubmissionMetadata,
  index?: number,
) {
  if (!submission || index === undefined) {
    return undefined;
  }
  return getSubmissionSamples(submission)[index];
}

export interface SlotGroup {
  name: string;
  description?: string;
  title?: string;
  rank?: number;
  slots: SlotDefinition[];
}

const FIXED_ORDER_SLOTS = ["samp_name", "collection_date", "lat_lon"];

/**
 * Sort a list of slots according to our custom rules.
 *
 * This function sorts a list of slots for presentation in the app. First, it sorts the slots that
 * are in the FIXED_ORDER_SLOTS array to the top. Then it sorts the remaining slots alphabetically.
 *
 * This ordering specifically ignores the ordering hints (`slot_group` and `rank`) that are present
 * in the schema definition. That order was defined with the Submission Portal interface in mind. In
 * the future, we can consider adding the Field Notes ordering hints to the schema definition, but
 * it isn't immediately obvious what LinkML mechanism would be appropriate for that.
 *
 * @param slots
 */
export function sortSlots(slots: SlotDefinition[]): SlotDefinition[] {
  return slots.sort((a, b) => {
    // First sort the fixed slots to the top
    const aFixedOrder = FIXED_ORDER_SLOTS.indexOf(a.name);
    const bFixedOrder = FIXED_ORDER_SLOTS.indexOf(b.name);
    if (aFixedOrder !== -1 && bFixedOrder !== -1) {
      return aFixedOrder - bFixedOrder;
    } else if (aFixedOrder !== -1) {
      return -1;
    } else if (bFixedOrder !== -1) {
      return 1;
    }

    // Then sort alphabetically by title (if present) or name (some oddball slots may not have a
    // title)
    const aTitle = a.title || a.name;
    const bTitle = b.title || b.name;
    return aTitle.localeCompare(bTitle);
  });
}
