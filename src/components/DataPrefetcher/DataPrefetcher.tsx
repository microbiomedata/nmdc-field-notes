import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { prefetchSubmissionSchema } from "../../queries";

const DataPrefetcher = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    void prefetchSubmissionSchema(queryClient);
  }, [queryClient]);

  return null;
};

export default DataPrefetcher;
