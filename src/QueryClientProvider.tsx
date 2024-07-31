import React, { PropsWithChildren, useMemo } from "react";
import {
  Persister,
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { QueryClient } from "@tanstack/react-query";
import { addDefaultMutationFns } from "./queries";
import { useStore } from "./Store";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import config from "./config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20, // 20 seconds
      gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
      retry: 0,
    },
  },
});
addDefaultMutationFns(queryClient);

// See: https://tanstack.com/query/latest/docs/framework/react/devtools#devtools-in-production
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

const QueryClientProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { store } = useStore();
  const persister = useMemo<Persister | null>(() => {
    if (!store) {
      return null;
    }
    return createAsyncStoragePersister({
      storage: {
        getItem: async (key) => store.get(key),
        setItem: async (key, value) => store.set(key, value),
        removeItem: async (key) => store.remove(key),
      },
    });
  }, [store]);

  if (persister == null) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: persister, maxAge: Infinity }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      {config.SHOW_DEV_TOOLS_IN_PROD && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </PersistQueryClientProvider>
  );
};

export default QueryClientProvider;
