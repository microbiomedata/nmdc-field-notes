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

test("createSubmission", async () => {
  const submission = await nmdcServerClient.createSubmission({
    metadata_submission: {
      studyForm: {
        studyName: "New Study",
        piEmail: "test@fake.edu",
      },
    },
  });
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

test("getCurrentUser", async () => {
  const user = await nmdcServerClient.getCurrentUser();
  expect(user).toEqual("Test Testerson");
});
