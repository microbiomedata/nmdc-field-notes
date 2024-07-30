import React, { ReactNode } from "react";
import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  addDefaultMutationFns,
  useSubmission,
  useSubmissionCreate,
  useSubmissionList,
} from "./queries";
import { produce } from "immer";
import {
  patchMetadataSubmissionError,
  server,
  delay,
  acquireLockConflict,
} from "./mocks/server";
import { initSubmission } from "./data";
import { SubmissionMetadataUpdate } from "./api";

interface TestWrapperProps {
  children: ReactNode;
}
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
      },
    },
  });
  addDefaultMutationFns(queryClient);
  const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  return TestWrapper;
};

const TEST_ID_1 = "00000000-0000-0000-0000-000000000001";
const TEST_ID_2 = "00000000-0000-0000-0000-000000000002";

test("useSubmissionList should return data from the query", async () => {
  const wrapper = createWrapper();
  const { result } = renderHook(() => useSubmissionList(), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.pages[0].results.length).toBeGreaterThan(0);
});

test("useSubmission should return data from the query", async () => {
  const wrapper = createWrapper();
  const { result } = renderHook(() => useSubmission(TEST_ID_1), { wrapper });
  await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
  expect(result.current.query.data?.id).toBe(TEST_ID_1);
});

test("useSubmission should return initial data from the list query", async () => {
  const wrapper = createWrapper();

  // First fetch data from the submission list query
  const { result: listResult } = renderHook(() => useSubmissionList(), {
    wrapper,
  });
  await waitFor(() => expect(listResult.current.isSuccess).toBe(true));

  // Second fetch data from the individual submission query. Data should be provided before waiting
  // for the query to succeed, but a background fetch should be in progress
  const { result: submissionResult } = renderHook(
    () => useSubmission(TEST_ID_1),
    { wrapper },
  );
  expect(submissionResult.current.query.isFetching).toBe(true);
  expect(submissionResult.current.query.data?.id).toBe(TEST_ID_1);

  // Data should still be provided after the background fetch completes
  await waitFor(() => expect(listResult.current.isFetching).toBe(false));
  expect(submissionResult.current.query.data?.id).toBe(TEST_ID_1);
});

test("useSubmission should mutate data", async () => {
  const wrapper = createWrapper();

  // First fetch data from the submission list query
  const { result: listResult, rerender: listRerender } = renderHook(
    () => useSubmissionList(),
    { wrapper },
  );
  await waitFor(() => expect(listResult.current.isSuccess).toBe(true));

  // Second fetch data from the individual submission query. Wait for the background fetch to
  // complete before proceeding.
  const { result } = renderHook(() => useSubmission(TEST_ID_1), { wrapper });
  await waitFor(() => expect(result.current.query.isFetching).toBe(false));

  // Update the submission data. There doesn't seem to be a good way to ensure that the onMutate()
  // function is called without waiting for the entire mutation to complete. To verify that the
  // data was updated optimistically, we initiate the mutation and then introduce a very short delay
  const submissionData = result.current.query.data!;
  const updatedSubmission = produce(submissionData, (draft) => {
    draft.metadata_submission.studyForm.studyName = "UPDATED";
  });
  await act(() => {
    result.current.updateMutation.mutate(updatedSubmission);
    return delay(10);
  });
  // Verify that the mutation has optimistically updated the data
  expect(
    result.current.updateMutation.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");

  // Once the mutation completes, ensure that both the mutation, query, and list query still return
  // the updated data
  await waitFor(() =>
    expect(result.current.updateMutation.isSuccess).toBe(true),
  );
  expect(result.current.updateMutation.data).toBeDefined();
  expect(
    result.current.updateMutation.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");

  // When the list rerenders it should also have the updated data
  listRerender();
  const submissionFromList = listResult.current.data?.pages[0].results.find(
    (submission) => submission.id === TEST_ID_1,
  );
  expect(submissionFromList?.metadata_submission.studyForm.studyName).toBe(
    "UPDATED",
  );
});

test("useSubmission should replace paused mutations when offline", async () => {
  // Listen to requests to the mock server to count the number of PATCH requests made
  let patchCount = 0;
  server.events.on("request:start", ({ request }) => {
    if (request.method === "PATCH") {
      patchCount++;
    }
  });

  // First fetch data from the individual submission query and wait for it to successfully complete
  const wrapper = createWrapper();
  const { result } = renderHook(() => useSubmission(TEST_ID_1), { wrapper });
  await waitFor(() => expect(result.current.query.isSuccess).toBe(true));

  const submissionData = result.current.query.data!;

  // Go offline and make two mutations
  onlineManager.setOnline(false);

  const update1 = produce(submissionData, (draft) => {
    draft.metadata_submission.studyForm.studyName = "UPDATE 1";
  });
  // There doesn't seem to be an obvious way to make the test poll for the mutation's onMutate()
  // function (where the offline request deduplication happens) to complete. Using await/mutateAsync
  // waits for the entire request to go through successfully which won't happen here because we're
  // offline. So instead just pause for a very short duration.
  await act(() => {
    result.current.updateMutation.mutate(update1);
    return delay(10);
  });

  const update2 = produce(update1, (draft) => {
    draft.metadata_submission.studyForm.studyName = "UPDATE 2";
  });
  await act(() => {
    result.current.updateMutation.mutate(update2);
    return delay(10);
  });

  // Go back online, ensure that the mutation successfully completes, that only one PATCH
  // request was sent, and that the final data is correct.
  onlineManager.setOnline(true);
  await waitFor(() =>
    expect(result.current.updateMutation.isSuccess).toBe(true),
  );
  expect(patchCount).toBe(1);
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATE 2");
});

test("useSubmission should rollback optimistic updates if a mutation fails", async () => {
  server.use(patchMetadataSubmissionError);

  const wrapper = createWrapper();

  // First fetch data from the submission list query
  const { result: listResult } = renderHook(() => useSubmissionList(), {
    wrapper,
  });
  await waitFor(() => expect(listResult.current.isSuccess).toBe(true));

  // Second fetch data from the individual submission query. Wait for the background fetch to
  // complete before proceeding.
  const { result } = renderHook(() => useSubmission(TEST_ID_1), { wrapper });
  await waitFor(() => expect(result.current.query.isFetching).toBe(false));

  // Update the submission data. There doesn't seem to be a good way to ensure that the onMutate()
  // function is called without waiting for the entire mutation to complete. To verify that the
  // data was updated optimistically, we initiate the mutation and then introduce a very short delay
  const submissionData = result.current.query.data!;
  const updatedSubmission = produce(submissionData, (draft) => {
    draft.metadata_submission.studyForm.studyName = "UPDATED";
  });
  await act(() => {
    result.current.updateMutation.mutate(updatedSubmission);
    return delay(10);
  });
  // Verify that the mutation has optimistically updated the data
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");

  // Once the mutation completes (as failed), ensure that both the mutation, query, and list query
  // now return the rolled back data
  await waitFor(() => expect(result.current.updateMutation.isError).toBe(true));
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("TEST 1");

  // The list should also have the rolled-back data
  const submissionFromList = listResult.current.data?.pages[0].results.find(
    (submission) => submission.id === TEST_ID_1,
  );
  expect(submissionFromList?.metadata_submission.studyForm.studyName).toBe(
    "TEST 1",
  );
});

test("useSubmission should delete submission", async () => {
  const wrapper = createWrapper();

  // First fetch data from the submission list query
  const { result: listResult, rerender: listRerender } = renderHook(
    () => useSubmissionList(),
    {
      wrapper,
    },
  );
  await waitFor(() => expect(listResult.current.isSuccess).toBe(true));

  // Second fetch data from the individual submission query. Wait for the background fetch to
  // complete before proceeding.
  const { result } = renderHook(() => useSubmission(TEST_ID_1), { wrapper });
  await waitFor(() => expect(result.current.query.isFetching).toBe(false));

  // Delete the submission
  await act(() => {
    return result.current.deleteMutation.mutateAsync(TEST_ID_1);
  });

  // Ensure that the mutation completes successfully and that the submission is no longer in the
  // list
  await waitFor(() =>
    expect(result.current.deleteMutation.isSuccess).toBe(true),
  );
  listRerender();
  expect(
    listResult.current.data?.pages[0].results.find(
      (submission) => submission.id === TEST_ID_1,
    ),
  ).toBeUndefined();
});

test("useSubmission should update lock status on successful lock acquisition", async () => {
  const wrapper = createWrapper();

  const { result } = renderHook(() => useSubmission(TEST_ID_1), { wrapper });
  await waitFor(() => expect(result.current.query.isFetching).toBe(false));

  // Ensure that the submission is not already locked
  expect(result.current.query.data?.locked_by).toBeNull();

  // Attempt to acquire a lock on the submission
  act(() => result.current.lockMutation.mutate(TEST_ID_1));

  // Verify that the mutation completes successfully and that the lock information is updated
  await waitFor(() => expect(result.current.lockMutation.isSuccess).toBe(true));
  expect(result.current.query.data?.locked_by).toBeDefined();
  expect(result.current.query.data?.locked_by?.name).toBe("Test Testerson");
});

test("useSubmission should update lock status on lock conflict", async () => {
  server.use(acquireLockConflict);

  const wrapper = createWrapper();

  const { result } = renderHook(() => useSubmission(TEST_ID_1), { wrapper });
  await waitFor(() => expect(result.current.query.isFetching).toBe(false));

  // Ensure that the submission is not already locked
  expect(result.current.query.data?.locked_by).toBeNull();

  // Attempt to acquire a lock on the submission
  act(() => result.current.lockMutation.mutate(TEST_ID_1));

  // Verify that the request failed due to a lock conflict and that the lock information is updated
  await waitFor(() => expect(result.current.lockMutation.isError).toBe(true));
  expect(result.current.query.data?.locked_by).toBeDefined();
  expect(result.current.query.data?.locked_by?.name).toBe("Lock Lockerson");
});

test("useSubmission should release a lock", async () => {
  const wrapper = createWrapper();

  const { result } = renderHook(() => useSubmission(TEST_ID_2), { wrapper });
  await waitFor(() => expect(result.current.query.isFetching).toBe(false));

  // Ensure that the submission is already locked
  expect(result.current.query.data?.locked_by).toBeDefined();

  // Attempt to release the lock on the submission
  act(() => result.current.unlockMutation.mutate(TEST_ID_2));

  // Verify that the mutation completes successfully and that the lock information is updated
  await waitFor(() =>
    expect(result.current.unlockMutation.isSuccess).toBe(true),
  );
  expect(result.current.query.data?.locked_by).toBeNull();
});

test("useSubmissionCreate should create submission", async () => {
  // When SubmissionMetadata objects are returned, they do not contain a full list of people who
  // have permission roles on the submission. So, to verify that the PI (not the same as the logged
  // in user) was added as an owner, we listen for PATCH requests to the submission and check that
  // the correct `permissions` field was sent.
  let piOwnerUpdated = false;
  const piOrcid = "0000-0000-0000-1234";
  server.events.on("request:start", async ({ request }) => {
    if (
      request.method === "PATCH" &&
      request.url.includes("/metadata_submission")
    ) {
      // Must clone first so that the original body can be read again later
      const body = (await request.clone().json()) as SubmissionMetadataUpdate;
      piOwnerUpdated =
        body.permissions != null && body.permissions[piOrcid] === "owner";
    }
  });

  const wrapper = createWrapper();

  // First fetch data from the submission list query
  const { result: listResult, rerender: listRerender } = renderHook(
    () => useSubmissionList(),
    {
      wrapper,
    },
  );
  await waitFor(() => expect(listResult.current.isSuccess).toBe(true));

  const { result } = renderHook(() => useSubmissionCreate(), { wrapper });

  // Create a new submission
  const newSubmission = initSubmission();
  newSubmission.metadata_submission.studyForm.studyName = "New Study";
  newSubmission.metadata_submission.studyForm.piEmail = "test@fake.org";
  newSubmission.metadata_submission.studyForm.piOrcid = piOrcid;
  await act(() => {
    return result.current.mutateAsync(newSubmission);
  });

  // Ensure that the mutation completes successfully and that the submission is in the list
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  listRerender();
  expect(
    listResult.current.data?.pages[0].results.find(
      (submission) =>
        submission.metadata_submission.studyForm.studyName === "New Study",
    ),
  ).toBeDefined();
  expect(piOwnerUpdated).toBe(true);
});
