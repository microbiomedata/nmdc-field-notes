import {
  DefaultError,
  hashKey,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import {
  getSubmission,
  getSubmissionList,
  Paginated,
  PaginationOptions,
  SubmissionMetadata, updateSubmission,
} from "./api";
import {produce} from "immer";

export const submissionKeys = {
  all: () => ['submissions'],
  lists: () => [...submissionKeys.all(), 'list'],
  list: (options: PaginationOptions) => [...submissionKeys.lists(), options],
  details: () => [...submissionKeys.all(), 'detail'],
  detail: (id: string) => [...submissionKeys.details(), id],
}

export function addDefaultMutationFns(queryClient: QueryClient) {
  queryClient.setMutationDefaults(submissionKeys.details(), {
    mutationFn: async (updated: SubmissionMetadata) => {
      await queryClient.cancelQueries({ queryKey: submissionKeys.detail(updated.id) })
      return updateSubmission(updated.id, updated)
    },
  })
}

export function useSubmissionList(options: PaginationOptions) {
  return useQuery({
    queryKey: submissionKeys.list(options),
    queryFn: () => getSubmissionList(options)
  })
}

export function useSubmission(id: string) {
  const queryClient = useQueryClient()

  const updateSubmissionInQueryData = (data: SubmissionMetadata) => {
    // Update the individual submission entry
    queryClient.setQueryData(submissionKeys.detail(data.id), data);

    // Update the individual submission in the list of submissions
    const options: PaginationOptions = { limit: 10, offset: 0 } // TODO: can't hardcode this, should come from some state
    queryClient.setQueryData(
      submissionKeys.list(options),
      produce((draft: Paginated<SubmissionMetadata>) => {
        if (!draft) {
          return;
        }
        const index = draft.results.findIndex(s => s.id === data.id)
        if (index === -1) {
          return
        }
        draft.results[index] = data
      })
    )
  }

  const query = useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => getSubmission(id),
    initialData: () => {
      const options: PaginationOptions = { limit: 10, offset: 0 } // TODO: can't hardcode this, should come from some state
      const allSubmissions = queryClient.getQueryData<Paginated<SubmissionMetadata>>(['submissions', 'list', options])
      return allSubmissions?.results.find(s => s.id === id)
    }
  })

  type SubmissionMetadataMutationContext = {
    previousData?: SubmissionMetadata
  }
  const mutation = useMutation<
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
      const mutationCache = queryClient.getMutationCache()
      mutationCache.getAll()
        .filter(mutation => mutation.state.isPaused)
        .filter(mutation => hashKey(mutation.options.mutationKey!) === hashKey(submissionKeys.detail(id)))
        .sort((a, b) => b.state.submittedAt! - a.state.submittedAt!)
        .slice(1)
        .forEach(mutation => mutationCache.remove(mutation))

      const previousData = queryClient.getQueryData<SubmissionMetadata>(submissionKeys.detail(id))

      // Optimistically update the cache entry for this specific submission and list data
      updateSubmissionInQueryData(updatedSubmission)

      return { previousData }
    },
    onError: (_, __, context) => {
      if (!context?.previousData) {
        return
      }
      updateSubmissionInQueryData(context.previousData)
    },
  })

  return {
    query,
    mutation,
  }
}
