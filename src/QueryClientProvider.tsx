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
import { RefreshTokenExchangeError } from "./api";

const GARBAGE_COLLECTION_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week

function shouldThrowError(error: Error) {
  return error instanceof RefreshTokenExchangeError;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20, // 20 seconds
      gcTime: GARBAGE_COLLECTION_TIME,
      retry: 0,
      throwOnError: shouldThrowError,
    },
    mutations: {
      throwOnError: shouldThrowError,
    },
  },
});
addDefaultMutationFns(queryClient);

const QueryClientProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { store, isLoggedIn } = useStore();
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
      // This is fired when the persisted queries are rehydrated. If the user is logged in, resume
      // any paused mutations that were restored. If the user is not logged in, do nothing since the
      // mutations would not succeed anyway. There is a similar call in TokenPage.tsx to handle
      // resuming paused mutations after a successful login.
      onSuccess={() => {
        if (isLoggedIn) {
          queryClient.resumePausedMutations().then(() => {
            void queryClient.invalidateQueries();
          });
        }
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};

export default QueryClientProvider;
