import { nmdcServerClient } from "./api";
import { initSubmission } from "./data";

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

test("createSubmission", async () => {
  const submissionCreate = initSubmission();
  submissionCreate.metadata_submission.studyForm.studyName = "New Study";
  submissionCreate.metadata_submission.studyForm.piEmail = "test@fake.edu";
  const submission = await nmdcServerClient.createSubmission(submissionCreate);
  expect(submission.metadata_submission.studyForm.studyName).toEqual(
    "New Study",
  );
  expect(submission.metadata_submission.studyForm.piEmail).toEqual(
    "test@fake.edu",
  );
});

test("deleteSubmission", async () => {
  const submissionId = "00000000-0000-0000-0000-000000000001";
  await nmdcServerClient.deleteSubmission(submissionId);
  // Nothing to explicitly test here, just that it doesn't throw an error
});

test("getSubmissionLock", async () => {
  const submissionId = "00000000-0000-0000-0000-000000000001";
  const lock = await nmdcServerClient.getSubmissionLock(submissionId);
  expect(lock.success).toBeTruthy();
});

test("releaseSubmissionLock", async () => {
  const submissionId = "00000000-0000-0000-0000-000000000001";
  const lock = await nmdcServerClient.releaseSubmissionLock(submissionId);
  expect(lock.success).toBeTruthy();
});

test("getCurrentUser", async () => {
  const user = await nmdcServerClient.getCurrentUser();
  expect(user.name).toEqual("Test Testerson");
});
