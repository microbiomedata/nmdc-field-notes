import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {Storage} from "@ionic/storage";
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import TutorialPage from "./pages/TutorialPage/TutorialPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import {QueryClient} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {createAsyncStoragePersister} from "@tanstack/query-async-storage-persister";
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client";

import Home from './pages/Home';
import {addDefaultMutationFns} from "./queries";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

export const PATHS = {
  HOME_PAGE: "/home",
  TUTORIAL_PAGE: "/tutorial",
  WELCOME_PAGE: "/welcome",
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      networkMode: 'online',
    },
    queries: {
      networkMode: 'online',
      staleTime: 1000 * 20, // 20 seconds
      gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
      retry: 0,
    }
  }
});
addDefaultMutationFns(queryClient);

const store = new Storage();
await store.create();

const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => store.get(key),
    setItem: async (key, value) => store.set(key, value),
    removeItem: async (key) => store.remove(key),
  },
});

const App: React.FC = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: persister, maxAge: Infinity }}
    onSuccess={() => {
      queryClient.resumePausedMutations().then(() => {
        queryClient.invalidateQueries()
      })
    }}
  >
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path={PATHS.WELCOME_PAGE}>
            <WelcomePage />
          </Route>
          <Route exact path={PATHS.TUTORIAL_PAGE}>
            <TutorialPage />
          </Route>
          <Route exact path={PATHS.HOME_PAGE}>
            <Home />
          </Route>
          <Route exact path="/">
            <Redirect to={PATHS.WELCOME_PAGE} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    <ReactQueryDevtools initialIsOpen={false} />
  </PersistQueryClientProvider>
);

export default App;
