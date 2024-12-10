import React from "react";
import { SampleData, SubmissionMetadata, TemplateName, TEMPLATES } from "./api";
import { SlotDefinition } from "./linkml-metamodel";

/**
 * Get the templates associated with a submission.
 *
 * This function is mainly useful to ease the transition between the old format where the
 * `packageName` field was a string and the new format where it is an array of strings.
 * This function always returns an array of strings.
 *
 * @param submission
 */
export function getSubmissionTemplates(
  submission?: SubmissionMetadata,
): TemplateName[] {
  if (!submission) {
    return [];
  }
  const { packageName } = submission.metadata_submission;
  if (typeof packageName === "string") {
    if (packageName === "") {
      return [];
    } else {
      return [packageName];
    }
  }
  return packageName;
}

export interface GetSubmissionSamplesOptions {
  createSampleDataFieldIfMissing?: boolean;
}

/**
 * Get the samples associated with a submission.
 *
 * Returns an object where the keys are the templates and the values are arrays of sample data
 * objects for that template. If the `createSampleDataFieldIfMissing` option is set to true, it
 * will modify the submission object to add missing template fields, defaulting to an empty array.
 *
 * @param submission
 * @param options
 */
export function getSubmissionSamples(
  submission?: SubmissionMetadata,
  options: GetSubmissionSamplesOptions = {},
): Partial<Record<TemplateName, SampleData[]>> {
  if (!submission) {
    return {};
  }
  const samples: Partial<Record<TemplateName, SampleData[]>> = {};
  const templates = getSubmissionTemplates(submission);
  templates.forEach((template) => {
    const sampleDataSlot = TEMPLATES[template]?.sampleDataSlot;
    if (!sampleDataSlot) {
      return;
    }
    if (
      !(sampleDataSlot in submission.metadata_submission.sampleData) &&
      options.createSampleDataFieldIfMissing
    ) {
      submission.metadata_submission.sampleData[sampleDataSlot] = [];
    }
    samples[template] =
      submission.metadata_submission.sampleData[sampleDataSlot] || [];
  });
  return samples;
}

/**
 * Get the total number of samples associated with a submission across all templates.
 *
 * @param submission
 */
export function getSubmissionSamplesCount(
  submission?: SubmissionMetadata,
): number {
  if (submission === undefined) {
    return 0;
  }
  let count = 0;
  const templates = getSubmissionTemplates(submission);
  templates.forEach((template) => {
    const sampleDataSlot = TEMPLATES[template]?.sampleDataSlot;
    if (!sampleDataSlot) {
      return;
    }
    const samples =
      submission.metadata_submission.sampleData[sampleDataSlot] || [];
    count += samples.length;
  });
  return count;
}

/**
 * Get the samples associated with a specific template in a submission.
 *
 * @param submission
 * @param template
 */
export function getSubmissionSamplesForTemplate(
  submission?: SubmissionMetadata,
  template?: TemplateName,
): SampleData[] {
  if (!submission || template === undefined) {
    return [];
  }
  const samplesByTemplate = getSubmissionSamples(submission);
  const templateSamples = samplesByTemplate[template];
  if (templateSamples === undefined) {
    return [];
  }
  return templateSamples;
}

/**
 * Get a specific sample associated with a submission.
 *
 * The sample is identified by the template and the index within that template's sample array.
 *
 * @param submission
 * @param template
 * @param index
 */
export function getSubmissionSample(
  submission?: SubmissionMetadata,
  template?: TemplateName,
  index?: number,
) {
  if (!submission || template === undefined || index === undefined) {
    return undefined;
  }
  const samplesForTemplate = getSubmissionSamples(submission)[template];
  if (samplesForTemplate === undefined) {
    return undefined;
  }
  return samplesForTemplate[index];
}

export interface SlotGroup {
  name: string;
  description?: React.ReactNode;
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
