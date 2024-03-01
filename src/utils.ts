import { SubmissionMetadata } from "./api";

export const getSubmissionSamples = (submission?: SubmissionMetadata) => {
  if (!submission) {
    return [];
  }
  const environmentalPackageName =
    submission.metadata_submission.templates[0].replaceAll("-", "_");
  const sampleDataField = `${environmentalPackageName}_data`;
  return submission.metadata_submission.sampleData[sampleDataField] || [];
};
