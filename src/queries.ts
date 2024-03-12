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
import { Paginated, SubmissionMetadata, nmdcServerClient } from "./api";
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
  deletes: () => [...submissionKeys.details(), "delete"],
  delete: (id: string) => [...submissionKeys.deletes(), id],
};

export function addDefaultMutationFns(queryClient: QueryClient) {
  queryClient.setMutationDefaults(submissionKeys.details(), {
    mutationFn: async (updated: SubmissionMetadata) => {
      await queryClient.cancelQueries({
        queryKey: submissionKeys.detail(updated.id),
      });
      return nmdcServerClient.updateSubmission(updated.id, updated);
    },
  });
  queryClient.setMutationDefaults(submissionKeys.create(), {
    mutationFn: async (newSubmission: DeepPartial<SubmissionMetadata>) => {
      await queryClient.cancelQueries({
        queryKey: submissionKeys.create(),
      });
      return nmdcServerClient.createSubmission(newSubmission);
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
      queryClient.invalidateQueries({ queryKey: submissionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: submissionKeys.list() });
    },
  });

  return {
    query,
    update: updateMutation,
    delete: deleteMutation,
  };
}

export function useSubmissionCreate() {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    SubmissionMetadata,
    DefaultError,
    DeepPartial<SubmissionMetadata>
  >({
    mutationKey: submissionKeys.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.list() });
    },
  });
  return mutation;
}
