import {
  DefaultError,
  hashKey,
  InfiniteData,
  QueryClient,
  queryOptions,
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
  GoldEcosystemTreeNode,
} from "./api";
import { produce } from "immer";
import { SchemaDefinition } from "./linkml-metamodel";

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
};

export const schemaKeys = {
  all: () => ["schemas"],
  submissionSchema: () => [...schemaKeys.all(), "submission_schema"],
};

export function addDefaultMutationFns(queryClient: QueryClient) {
  queryClient.setMutationDefaults(submissionKeys.details(), {
    retry: 3,
    retryDelay: (attempt) => attempt * 1000 + 2000,
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
          ...created,
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

export interface UseSubmissionOptions {
  retryUpdates?: boolean;
}
export function useSubmission(id: string, options: UseSubmissionOptions = {}) {
  const queryClient = useQueryClient();
  options = {
    retryUpdates: true,
    ...options,
  };

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

  const mutationDefaults = queryClient.getMutationDefaults(
    submissionKeys.details(),
  );

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
    retry: options.retryUpdates ? mutationDefaults?.retry : 0,
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: submissionKeys.detail(id),
      });
      return await queryClient.invalidateQueries({
        queryKey: submissionKeys.list(),
      });
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
        const body = JSON.parse(error.responseBody) as LockOperationResult;
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
      return queryClient.invalidateQueries({ queryKey: submissionKeys.list() });
    },
  });
  return mutation;
}

export interface SubmissionSchema {
  schema: SchemaDefinition;
  goldEcosystemTree: GoldEcosystemTreeNode;
}
function submissionSchemaQueryOptions(queryClient: QueryClient) {
  // The `queryOptions` function is to help with type inference
  // https://tanstack.com/query/latest/docs/framework/react/typescript#typing-query-options
  return queryOptions({
    queryKey: schemaKeys.submissionSchema(),
    // These two files are used in conjunction with each other so make the two requests in parallel
    // and return an object bundling the results together.
    queryFn: async () => {
      const cachedData = queryClient.getQueryData<SubmissionSchema>(
        schemaKeys.submissionSchema(),
      );
      // If we have a cached schema and it's the same version as the server
      // would give us if we were to fetch it now, return that cached schema.
      if (cachedData !== undefined) {
        const versionInfo = await nmdcServerClient.getVersionInfo();
        if (cachedData.schema.version === versionInfo.nmdc_submission_schema) {
          return cachedData;
        }
      }
      // We don't have a cached schema or the cached schema is out of date. Fetch the latest schema.
      const result = await Promise.all([
        nmdcServerClient.getSubmissionSchema(),
        nmdcServerClient.getGoldEcosystemTree(),
      ]);
      return {
        schema: result[0],
        goldEcosystemTree: result[1],
      };
    },
    // Nearly all the time the queryFn will only result in a version info check. This is a pretty
    // inexpensive call, but we still don't need to do it that often. Let's try no more than once
    // every 30 minutes.
    staleTime: 1000 * 60 * 30,
  });
}
export function useSubmissionSchema() {
  const queryClient = useQueryClient();
  return useQuery(submissionSchemaQueryOptions(queryClient));
}
// NOTE: this is a plain function, not a hook!
// See:
// - https://tanstack.com/query/v5/docs/framework/react/guides/prefetching
// - https://tanstack.com/query/v5/docs/reference/QueryClient/#queryclientprefetchquery
export function prefetchSubmissionSchema(queryClient: QueryClient) {
  return queryClient.prefetchQuery(submissionSchemaQueryOptions(queryClient));
}
