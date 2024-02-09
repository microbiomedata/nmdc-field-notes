import { nmdcServerClient } from "./api";

test("getSubmissionList", async () => {
  const submissions = await nmdcServerClient.getSubmissionList();
  expect(submissions.results.length).toBeGreaterThan(0);
});

test("getSubmission", async () => {
  const submissionId = "00000000-0000-0000-0000-000000000001";
  const submission = await nmdcServerClient.getSubmission(submissionId);
  expect(submission.id).toEqual(submissionId);
});

test("updateSubmission", async () => {
  const submissionId = "00000000-0000-0000-0000-000000000001";
  const submission = await nmdcServerClient.getSubmission(submissionId);
  submission.metadata_submission.studyForm.studyName = "UPDATED";
  const updatedSubmission = await nmdcServerClient.updateSubmission(
    submissionId,
    submission,
  );
  expect(updatedSubmission.metadata_submission.studyForm.studyName).toEqual(
    "UPDATED",
  );
});

test("getCurrentUser", async () => {
  const user = await nmdcServerClient.getCurrentUser();
  expect(user).toEqual("Test Testerson");
});
