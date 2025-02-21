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
import { nmdcServerClient, RefreshTokenExchangeError } from "./api";

const GARBAGE_COLLECTION_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week

function shouldThrowError(error: Error) {
  return error instanceof RefreshTokenExchangeError;
}

/**
 * A subclass of QueryClient where we can customize the behavior by overriding methods.
 */
class NmdcQueryClient extends QueryClient {
  /**
   * When the QueryClient is mounted, it sets up listeners to the focused and online states. When
   * the app becomes focused or goes online, resumePausedMutations is called. However, for our
   * purposes it is possible that the user gets logged out while there are paused mutation. This
   * would happen if the user made edits while offline (producing paused mutations) and then was
   * logged out because their refresh token expired. If the app goes back online at that point, we
   * do not want to resume the paused mutations because they are guaranteed to fail. Therefore, we
   * override this method to check if we have a refresh token (i.e. the user hasn't been logged out)
   * before resuming paused mutations by calling the superclass method.
   *
   * While resumePausedMutations is a public method, its usage in the listeners set up during mount
   * is not exactly documented. We should be careful about this when upgrading react-query.
   * https://github.com/TanStack/query/blob/v5.66.8/packages/query-core/src/queryClient.ts#L84-L95
   */
  async resumePausedMutations() {
    if (nmdcServerClient.hasRefreshToken()) {
      return super.resumePausedMutations();
    }
    return Promise.resolve();
  }
}

const queryClient = new NmdcQueryClient({
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
