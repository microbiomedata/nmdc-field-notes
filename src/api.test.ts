import { getSubmissionList, getSubmission, updateSubmission } from "./api";

test("getSubmissionList", async () => {
  const submissions = await getSubmissionList();
  expect(submissions.results.length).toBeGreaterThan(0);
});

test("getSubmission", async () => {
  const submissionId = "00000000-0000-0000-0000-000000000001";
  const submission = await getSubmission(submissionId);
  expect(submission.id).toEqual(submissionId);
});

test("updateSubmission", async () => {
  const submissionId = "00000000-0000-0000-0000-000000000001";
  const submission = await getSubmission(submissionId);
  submission.metadata_submission.studyForm.studyName = "UPDATED";
  const updatedSubmission = await updateSubmission(submissionId, submission);
  expect(updatedSubmission.metadata_submission.studyForm.studyName).toEqual(
    "UPDATED",
  );
});
