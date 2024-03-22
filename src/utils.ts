import { SubmissionMetadata, TEMPLATES } from "./api";
import { SchemaDefinition, SlotDefinition } from "./linkml-metamodel";

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
  const sampleDataField = TEMPLATES[environmentalPackageName]?.sampleDataSlot;
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

function compareByRank(a: { rank?: number }, b: { rank?: number }): number {
  if (a.rank === undefined) {
    return -1;
  }
  if (b.rank === undefined) {
    return 1;
  }
  return a.rank - b.rank;
}

export interface SlotGroup {
  name: string;
  title?: string;
  rank?: number;
  slots: SlotDefinition[];
}
export function groupClassSlots(
  schemaDefinition: SchemaDefinition,
  className: string,
): SlotGroup[] {
  const classDefinition = schemaDefinition.classes?.[className];
  if (!classDefinition) {
    throw new Error(`Class ${className} not found in schema`);
  }
  const groupedSlots: SlotGroup[] = [];
  if (!classDefinition.attributes) {
    return groupedSlots;
  }
  Object.values(classDefinition.attributes).forEach((slot) => {
    let slotGroup = groupedSlots.find((g) => g.name === slot.slot_group);
    if (!slotGroup) {
      // We need to add a new slot group to groupedSlots
      const slotGroupSlot = slot.slot_group
        ? (schemaDefinition.slots as Record<string, SlotDefinition>)[
            slot.slot_group
          ]
        : undefined;
      if (!slotGroupSlot) {
        // The root-level grouping slot couldn't be found, put it in an "other" group
        slotGroup = groupedSlots.find((g) => g.name === "other");
        if (!slotGroup) {
          slotGroup = {
            name: "other",
            title: "Other",
            rank: 9999,
            slots: [],
          };
          groupedSlots.push(slotGroup);
        }
      } else {
        slotGroup = {
          name: slotGroupSlot.name,
          title: slotGroupSlot.title,
          rank: slotGroupSlot.rank,
          slots: [],
        };
        groupedSlots.push(slotGroup);
      }
    }
    slotGroup.slots.push(slot);
  });
  groupedSlots.sort(compareByRank);
  groupedSlots.forEach((group) => {
    group.slots.sort(compareByRank);
  });
  return groupedSlots;
}
