import {
  DefaultError,
  hashKey,
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Paginated,
  SubmissionMetadata,
  nmdcServerClient,
  SubmissionMetadataCreate,
  LockOperationResult,
  ApiError,
  SubmissionMetadataUpdate,
} from "./api";
import { produce } from "immer";

export const userKeys = {
  user: () => ["user"],
};

export const submissionKeys = {
  all: () => ["submissions"],
  list: () => [...submissionKeys.all(), "list"],
  create: () => [...submissionKeys.all(), "create"],
  details: () => [...submissionKeys.all(), "detail"],
  detail: (id: string) => [...submissionKeys.details(), id],
  deletes: () => [...submissionKeys.all(), "delete"],
  delete: (id: string) => [...submissionKeys.deletes(), id],
  locks: () => [...submissionKeys.all(), "lock"],
  lock: (id: string) => [...submissionKeys.locks(), id],
  unlocks: () => [...submissionKeys.all(), "unlock"],
  unlock: (id: string) => [...submissionKeys.unlocks(), id],
  schemas: () => ["schemas"],
  submissionSchema: () => [...submissionKeys.schemas(), "submission_schema"],
};

export function addDefaultMutationFns(queryClient: QueryClient) {
  queryClient.setMutationDefaults(submissionKeys.details(), {
    mutationFn: async (updated: SubmissionMetadataUpdate) => {
      await queryClient.cancelQueries({
        queryKey: submissionKeys.detail(updated.id),
      });
      // Keep the permissions updated with the PI ORCID as an owner
      const updatedWithPermissions: SubmissionMetadataUpdate = produce(
        updated,
        (draft) => {
          const { piOrcid } = draft.metadata_submission.studyForm;
          if (piOrcid) {
            draft.permissions = {
              [piOrcid]: "owner",
            };
          }
        },
      );
      return nmdcServerClient.updateSubmission(
        updated.id,
        updatedWithPermissions,
      );
    },
  });
  queryClient.setMutationDefaults(submissionKeys.create(), {
    mutationFn: async (newSubmission: SubmissionMetadataCreate) => {
      await queryClient.cancelQueries({
        queryKey: submissionKeys.create(),
      });
      const created = await nmdcServerClient.createSubmission(newSubmission);
      // If the submission has a PI ORCID, add the PI as an owner of the submission. This has to
      // be done as a separate request after the submission is created because the create submission
      // endpoint does not accept the `permissions` field, only the update one does.
      const { piOrcid } = created.metadata_submission.studyForm;
      if (piOrcid) {
        return nmdcServerClient.updateSubmission(created.id, {
          metadata_submission: created.metadata_submission,
          permissions: {
            [piOrcid]: "owner",
          },
        });
      } else {
        return created;
      }
    },
  });
  queryClient.setMutationDefaults(submissionKeys.deletes(), {
    mutationFn: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: submissionKeys.delete(id),
      });
      return nmdcServerClient.deleteSubmission(id);
    },
  });
  queryClient.setMutationDefaults(submissionKeys.locks(), {
    mutationFn: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: submissionKeys.lock(id),
      });
      return nmdcServerClient.acquireSubmissionLock(id);
    },
  });
  queryClient.setMutationDefaults(submissionKeys.unlocks(), {
    mutationFn: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: submissionKeys.unlock(id),
      });
      return nmdcServerClient.releaseSubmissionLock(id);
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.user(),
    queryFn: () => nmdcServerClient.getCurrentUser(),
  });
}

const PAGE_SIZE = 10;

export function useSubmissionList() {
  return useInfiniteQuery({
    queryKey: submissionKeys.list(),
    queryFn: ({ pageParam }) =>
      nmdcServerClient.getSubmissionList({
        limit: PAGE_SIZE,
        offset: pageParam * PAGE_SIZE,
      }),
    initialPageParam: 0,
    // In this context "last" means the last page fetched, not the last possible page
    // See: https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries#example
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if ((lastPageParam + 1) * PAGE_SIZE > lastPage.count) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
}

export function useSubmission(id: string) {
  const queryClient = useQueryClient();

  const updateSubmissionInQueryData = (data: SubmissionMetadata) => {
    // Update the individual submission entry
    queryClient.setQueryData(submissionKeys.detail(data.id), data);

    // Update the individual submission in the list of submissions
    queryClient.setQueryData(
      submissionKeys.list(),
      produce((draft: InfiniteData<Paginated<SubmissionMetadata>>) => {
        if (!draft) {
          return;
        }
        for (const page of draft.pages) {
          const index = page.results.findIndex((s) => s.id === data.id);
          if (index === -1) {
            continue;
          }
          page.results[index] = data;
        }
      }),
    );
  };

  const updateLockStatusForSubmission = (
    id: string,
    lock: Partial<LockOperationResult>,
  ) => {
    const submission = queryClient.getQueryData<SubmissionMetadata>(
      submissionKeys.detail(id),
    );
    if (!submission) {
      return;
    }
    const updated = produce(submission, (draft) => {
      draft.locked_by = lock.locked_by;
      draft.lock_updated = lock.lock_updated || undefined;
    });
    updateSubmissionInQueryData(updated);
  };

  const query = useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => nmdcServerClient.getSubmission(id),
    initialData: () => {
      const allSubmissions = queryClient.getQueryData<
        InfiniteData<Paginated<SubmissionMetadata>>
      >(submissionKeys.list());
      for (const page of allSubmissions?.pages || []) {
        const submission = page.results.find((s) => s.id === id);
        if (submission) {
          return submission;
        }
      }
      return undefined;
    },
  });

  type SubmissionMetadataMutationContext = {
    previousData?: SubmissionMetadata;
  };
  const updateMutation = useMutation<
    SubmissionMetadata,
    DefaultError,
    SubmissionMetadata,
    SubmissionMetadataMutationContext
  >({
    mutationKey: submissionKeys.detail(id),
    onMutate: async (updatedSubmission: SubmissionMetadata) => {
      // If there are previous mutations for this submission, remove them. The latest mutation should
      // contain the most up-to-date data.
      // Get all mutations from the cache, filter by pending and the same key as this mutation, sort
      // by submitted time descending, and remove all but the first (most recent) mutation.
      const mutationCache = queryClient.getMutationCache();
      mutationCache
        .getAll()
        .filter((mutation) => mutation.state.isPaused)
        .filter(
          (mutation) =>
            hashKey(mutation.options.mutationKey!) ===
            hashKey(submissionKeys.detail(id)),
        )
        .sort((a, b) => b.state.submittedAt! - a.state.submittedAt!)
        .slice(1)
        .forEach((mutation) => mutationCache.remove(mutation));

      const previousData = queryClient.getQueryData<SubmissionMetadata>(
        submissionKeys.detail(id),
      );

      // Optimistically update the cache entry for this specific submission and list data
      updateSubmissionInQueryData(updatedSubmission);

      return { previousData };
    },
    onError: (_, __, context) => {
      if (!context?.previousData) {
        return;
      }
      updateSubmissionInQueryData(context.previousData);
    },
  });

  const deleteMutation = useMutation<void, DefaultError, string>({
    mutationKey: submissionKeys.delete(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: submissionKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: submissionKeys.list() });
    },
  });

  // The lock mutation is used to acquire a lock on a submission. This should be done before
  // updates to a submission. If a lock is not acquired before updating, the subsequent updates
  // may fail.
  const lockMutation = useMutation<LockOperationResult, DefaultError, string>({
    mutationKey: submissionKeys.lock(id),
    onSuccess: (data) => {
      // If the lock operation was successful, update the submission data in the cache
      // with the new lock information.
      if (!data.success) {
        return;
      }
      updateLockStatusForSubmission(id, data);
    },
    onError: async (error) => {
      if (error instanceof ApiError && error.response.status === 409) {
        // If the lock operation failed due to a conflict, the submission is already locked.
        // The lock information is included in the error response, so update the submission
        // data in the cache with the lock information.
        const body = (await error.response.json()) as LockOperationResult;
        updateLockStatusForSubmission(id, body);
      }
    },
  });

  // The unlock mutation is used to release a lock on a submission.
  const unlockMutation = useMutation<LockOperationResult, DefaultError, string>(
    {
      mutationKey: submissionKeys.unlock(id),
      onSettled: () => {
        updateLockStatusForSubmission(id, {
          locked_by: null,
          lock_updated: null,
        });
      },
    },
  );

  return {
    query,
    updateMutation,
    deleteMutation,
    lockMutation,
    unlockMutation,
  };
}

export function useSubmissionCreate() {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    SubmissionMetadata,
    DefaultError,
    SubmissionMetadataCreate
  >({
    mutationKey: submissionKeys.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.list() });
    },
  });
  return mutation;
}

export function useSubmissionSchema() {
  return useQuery({
    queryKey: submissionKeys.submissionSchema(),
    // These two files are used in conjunction with each other so make the two requests in parallel
    // and return an object bundling the results together.
    queryFn: async () => {
      const result = await Promise.all([
        nmdcServerClient.getSubmissionSchema(),
        nmdcServerClient.getGoldEcosystemTree(),
      ]);
      return {
        schema: result[0],
        goldEcosystemTree: result[1],
      };
    },
    staleTime: 1000 * 60 * 60 * 72, // 72 hours; these files only change between releases
  });
}
