import { useEffect } from "react";
import { useIsRestoring, useQueryClient } from "@tanstack/react-query";
import { prefetchSubmissionSchema } from "../../queries";

const DataPrefetcher = () => {
  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();

  useEffect(() => {
    // Since this prefetch relies on checking cached data, don't do it until the initial persisted
    // cache has been restored.
    if (!isRestoring) {
      void prefetchSubmissionSchema(queryClient);
    }
  }, [queryClient, isRestoring]);

  return null;
};

export default DataPrefetcher;
