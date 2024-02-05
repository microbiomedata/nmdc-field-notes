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
  useSubmissionList,
} from "./queries";
import { produce } from "immer";
import { patchMetadataSubmissionError, server, delay } from "./mocks/server";

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

test("useSubmissionList should return data from the query", async () => {
  const wrapper = createWrapper();
  const { result } = renderHook(() => useSubmissionList({}), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.results.length).toBeGreaterThan(0);
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
  // TODO: fix hardcoded pagination options
  const { result: listResult } = renderHook(
    () => useSubmissionList({ limit: 10, offset: 0 }),
    { wrapper },
  );
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
  // TODO: fix hardcoded pagination options
  const { result: listResult, rerender: listRerender } = renderHook(
    () => useSubmissionList({ limit: 10, offset: 0 }),
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
    result.current.mutation.mutate(updatedSubmission);
    return delay(10);
  });
  // Verify that the mutation has optimistically updated the data
  expect(
    result.current.mutation.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");

  // Once the mutation completes, ensure that both the mutation, query, and list query still return
  // the updated data
  await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
  expect(result.current.mutation.data).toBeDefined();
  expect(
    result.current.mutation.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");

  // When the list rerenders it should also have the updated data
  listRerender();
  const submissionFromList = listResult.current.data?.results.find(
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
    result.current.mutation.mutate(update1);
    return delay(10);
  });

  const update2 = produce(update1, (draft) => {
    draft.metadata_submission.studyForm.studyName = "UPDATE 2";
  });
  await act(() => {
    result.current.mutation.mutate(update2);
    return delay(10);
  });

  // Go back online, ensure that the mutation successfully completes, that only one PATCH
  // request was sent, and that the final data is correct.
  onlineManager.setOnline(true);
  await waitFor(() => expect(result.current.mutation.isSuccess).toBe(true));
  expect(patchCount).toBe(1);
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATE 2");
});

test("useSubmission should rollback optimistic updates if a mutation fails", async () => {
  server.use(patchMetadataSubmissionError);

  const wrapper = createWrapper();

  // First fetch data from the submission list query
  // TODO: fix hardcoded pagination options
  const { result: listResult } = renderHook(
    () => useSubmissionList({ limit: 10, offset: 0 }),
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
    result.current.mutation.mutate(updatedSubmission);
    return delay(10);
  });
  // Verify that the mutation has optimistically updated the data
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("UPDATED");

  // Once the mutation completes (as failed), ensure that both the mutation, query, and list query
  // now return the rolled back data
  await waitFor(() => expect(result.current.mutation.isError).toBe(true));
  expect(
    result.current.query.data?.metadata_submission.studyForm.studyName,
  ).toBe("TEST 1");

  // The list should also have the rolled-back data
  const submissionFromList = listResult.current.data?.results.find(
    (submission) => submission.id === TEST_ID_1,
  );
  expect(submissionFromList?.metadata_submission.studyForm.studyName).toBe(
    "TEST 1",
  );
});
